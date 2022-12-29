const SQLite = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '../easyticket.sqlite')
const db = new SQLite(dbPath);

const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');

class dbHelper {
	/**
	 * Rodar uma transação sqlite
	 * @param  {...any} args
	 */
	static runTransaction(...args) {
		args.forEach(argument => {
			begin.run();
			argument[0].run(argument[1]);
			commit.run();
		});
	}

	static getServerByID(id) {
		return db.prepare("SELECT * FROM Servidor WHERE id = ?").get(id);
	}

	static configureTicket(server_id, category_id, role_id) {
		this.runTransaction(
			[
				db.prepare(
					`UPDATE Servidor
					SET ticket_category = @category_id, role_id = @role_id
					WHERE id = @server_id`),
				{
					category_id: category_id,
					server_id: server_id,
					role_id: role_id
				}
			]
		);
	}

	static resetConfig(server_id) {
		this.runTransaction(
			[
				db.prepare(
					`UPDATE Servidor
					SET ticket_category = null, role_id = null
					WHERE id = @server_id`),
				{ server_id: server_id }
			]
		);
	}
}

module.exports = {
	dbHelper
}