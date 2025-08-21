const jwt = require('jsonwebtoken');

function authMiddleware(secret) {
	return function (req, res, next) {
		const header = req.headers.authorization || '';
		if (!header.startsWith('Bearer ')) return res.status(401).json({ error: '未登录' });
		const token = header.slice(7);
		try {
			const payload = jwt.verify(token, secret);
			req.userId = payload.userId;
			next();
		} catch (e) {
			return res.status(401).json({ error: '无效令牌' });
		}
	};
}

function getUserFromToken(token, secret) {
	try {
		const payload = jwt.verify(token, secret);
		return payload.userId;
	} catch (e) {
		return null;
	}
}

module.exports = { authMiddleware, getUserFromToken };

