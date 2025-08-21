const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const { getDb } = require('./lib/db');
const { authMiddleware, getUserFromToken } = require('./lib/jwt');

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static files for uploaded assets
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname) || '';
		const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
		cb(null, `${Date.now()}-${base}${ext}`);
	},
});
const upload = multer({ storage });

// Initialize database and tables
const db = getDb(path.join(__dirname, 'data.sqlite'));
db.exec(`
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	owner_id INTEGER NOT NULL,
	title TEXT NOT NULL,
	frequency TEXT NOT NULL, -- 'daily' | 'weekly' | 'monthly'
	weekly_days TEXT, -- JSON array of numbers 0-6 if weekly
	created_at TEXT NOT NULL,
	FOREIGN KEY(owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS task_shares (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	task_id INTEGER NOT NULL,
	shared_with_user_id INTEGER NOT NULL,
	shared_by_user_id INTEGER NOT NULL,
	created_at TEXT NOT NULL,
	UNIQUE(task_id, shared_with_user_id),
	FOREIGN KEY(task_id) REFERENCES tasks(id),
	FOREIGN KEY(shared_with_user_id) REFERENCES users(id),
	FOREIGN KEY(shared_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS submissions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	task_id INTEGER NOT NULL,
	submitter_user_id INTEGER NOT NULL,
	date TEXT NOT NULL, -- YYYY-MM-DD
	detail_text TEXT,
	link_url TEXT,
	image_path TEXT,
	created_at TEXT NOT NULL,
	FOREIGN KEY(task_id) REFERENCES tasks(id),
	FOREIGN KEY(submitter_user_id) REFERENCES users(id)
);
`);

function signToken(user) {
	return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
}

function userBasic(userRow) {
	return { id: userRow.id, username: userRow.username, email: userRow.email };
}

// Auth routes
app.post('/api/auth/register', (req, res) => {
	const { username, email, password } = req.body || {};
	if (!username || !email || !password) {
		return res.status(400).json({ error: '用户名、邮箱、密码必填' });
	}
	const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
	if (existing) {
		return res.status(409).json({ error: '该邮箱已注册' });
	}
	const passwordHash = bcrypt.hashSync(password, 10);
	const createdAt = dayjs().toISOString();
	const info = db
		.prepare('INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
		.run(username, email, passwordHash, createdAt);
	const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
	const token = signToken(user);
	return res.json({ token, user: userBasic(user) });
});

app.post('/api/auth/login', (req, res) => {
	const { email, password } = req.body || {};
	if (!email || !password) {
		return res.status(400).json({ error: '邮箱、密码必填' });
	}
	const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
	if (!user) {
		return res.status(401).json({ error: '邮箱或密码错误' });
	}
	const ok = bcrypt.compareSync(password, user.password_hash);
	if (!ok) {
		return res.status(401).json({ error: '邮箱或密码错误' });
	}
	const token = signToken(user);
	return res.json({ token, user: userBasic(user) });
});

app.get('/api/me', (req, res) => {
	const token = (req.headers.authorization || '').replace('Bearer ', '');
	if (!token) return res.status(401).json({ error: '未登录' });
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId);
		if (!user) return res.status(401).json({ error: '无效用户' });
		return res.json({ user: userBasic(user) });
	} catch (e) {
		return res.status(401).json({ error: '无效令牌' });
	}
});

// Task helpers
function isTaskDueOnDate(task, ymd) {
	const date = dayjs(ymd);
	if (task.frequency === 'daily') return true;
	if (task.frequency === 'weekly') {
		if (!task.weekly_days) return false;
		try {
			const arr = JSON.parse(task.weekly_days || '[]');
			const dow = date.day(); // 0-6
			return Array.isArray(arr) && arr.includes(dow);
		} catch (e) {
			return false;
		}
	}
	if (task.frequency === 'monthly') {
		// Due on the same day-of-month as creation
		const createdDay = dayjs(task.created_at).date();
		return date.date() === createdDay;
	}
	return false;
}

function getAccessibleTasksForUser(userId) {
	const owned = db.prepare('SELECT * FROM tasks WHERE owner_id = ?').all(userId);
	const shared = db
		.prepare(
			`SELECT t.* FROM task_shares s JOIN tasks t ON s.task_id = t.id WHERE s.shared_with_user_id = ?`
		)
		.all(userId);
	return [...owned, ...shared];
}

// Tasks
app.post('/api/tasks', authMiddleware(JWT_SECRET), (req, res) => {
	const userId = req.userId;
	const { title, frequency, weeklyDays } = req.body || {};
	if (!title || !frequency) {
		return res.status(400).json({ error: '标题与频率必填' });
	}
	if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
		return res.status(400).json({ error: '频率必须是 daily/weekly/monthly' });
	}
	let weeklyDaysJson = null;
	if (frequency === 'weekly') {
		if (!Array.isArray(weeklyDays) || weeklyDays.some((d) => d < 0 || d > 6)) {
			return res.status(400).json({ error: 'weeklyDays 必须是 0-6 的数组' });
		}
		weeklyDaysJson = JSON.stringify(weeklyDays);
	}
	const createdAt = dayjs().toISOString();
	const info = db
		.prepare(
			'INSERT INTO tasks (owner_id, title, frequency, weekly_days, created_at) VALUES (?, ?, ?, ?, ?)'
		)
		.run(userId, title, frequency, weeklyDaysJson, createdAt);
	const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
	return res.json({ task });
});

app.get('/api/tasks', authMiddleware(JWT_SECRET), (req, res) => {
	const userId = req.userId;
	const date = req.query.date || dayjs().format('YYYY-MM-DD');
	const tasks = getAccessibleTasksForUser(userId).filter((t) => isTaskDueOnDate(t, date));
	const submissions = db
		.prepare(
			`SELECT * FROM submissions WHERE date = ? AND task_id IN (${tasks.map(() => '?').join(',') || 'NULL'})`
		)
		.all(date, ...tasks.map((t) => t.id));
	return res.json({ date, tasks, submissions });
});

app.get('/api/tasks/:id', authMiddleware(JWT_SECRET), (req, res) => {
	const userId = req.userId;
	const id = Number(req.params.id);
	const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
	if (!task) return res.status(404).json({ error: '任务不存在' });
	const accessible = task.owner_id === userId || !!db
		.prepare('SELECT 1 FROM task_shares WHERE task_id = ? AND shared_with_user_id = ?')
		.get(id, userId);
	if (!accessible) return res.status(403).json({ error: '无权限' });
	const history = db
		.prepare('SELECT * FROM submissions WHERE task_id = ? ORDER BY date DESC, created_at DESC')
		.all(id);
	return res.json({ task, submissions: history });
});

app.post('/api/tasks/:id/share', authMiddleware(JWT_SECRET), (req, res) => {
	const userId = req.userId;
	const id = Number(req.params.id);
	const { email } = req.body || {};
	if (!email) return res.status(400).json({ error: '请输入要分享给的账号（邮箱）' });
	const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
	if (!task) return res.status(404).json({ error: '任务不存在' });
	if (task.owner_id !== userId) return res.status(403).json({ error: '只有创建者可以分享任务' });
	const targetUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
	if (!targetUser) return res.status(404).json({ error: '目标用户不存在' });
	const createdAt = dayjs().toISOString();
	try {
		db.prepare(
			'INSERT INTO task_shares (task_id, shared_with_user_id, shared_by_user_id, created_at) VALUES (?, ?, ?, ?)'
		).run(id, targetUser.id, userId, createdAt);
	} catch (e) {
		// unique violation -> already shared
	}
	return res.json({ ok: true });
});

// Submissions
app.post(
	'/api/tasks/:id/submit',
	authMiddleware(JWT_SECRET),
	upload.single('image'),
	(req, res) => {
		const userId = req.userId;
		const id = Number(req.params.id);
		const { date, detailText, linkUrl } = req.body || {};
		const ymd = (date && String(date)) || dayjs().format('YYYY-MM-DD');
		const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
		if (!task) return res.status(404).json({ error: '任务不存在' });
		const accessible = task.owner_id === userId || !!db
			.prepare('SELECT 1 FROM task_shares WHERE task_id = ? AND shared_with_user_id = ?')
			.get(id, userId);
		if (!accessible) return res.status(403).json({ error: '无权限' });
		const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
		const createdAt = dayjs().toISOString();
		const info = db
			.prepare(
				'INSERT INTO submissions (task_id, submitter_user_id, date, detail_text, link_url, image_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
			)
			.run(id, userId, ymd, detailText || null, linkUrl || null, imagePath, createdAt);
		const sub = db.prepare('SELECT * FROM submissions WHERE id = ?').get(info.lastInsertRowid);
		return res.json({ submission: sub });
	}
);

app.get('/api/submissions', authMiddleware(JWT_SECRET), (req, res) => {
	const userId = req.userId;
	const date = req.query.date || dayjs().format('YYYY-MM-DD');
	const tasks = getAccessibleTasksForUser(userId);
	const submissions = db
		.prepare(
			`SELECT s.*, u.username AS submitter_name, t.title AS task_title FROM submissions s \n            JOIN users u ON s.submitter_user_id = u.id \n            JOIN tasks t ON s.task_id = t.id \n            WHERE s.date = ? AND s.task_id IN (${tasks.map(() => '?').join(',') || 'NULL'}) \n            ORDER BY s.created_at DESC`
		)
		.all(date, ...tasks.map((t) => t.id));
	return res.json({ date, submissions });
});

// Health
app.get('/api/health', (req, res) => {
	res.json({ ok: true });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

