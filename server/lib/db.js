const Database = require('better-sqlite3');

let cachedDb = null;

function getDb(filePath) {
	if (cachedDb) return cachedDb;
	cachedDb = new Database(filePath);
	cachedDb.pragma('journal_mode = WAL');
	return cachedDb;
}

module.exports = { getDb };

