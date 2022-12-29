const { dbHelper } = require("../helper/dbHelper.js");

class Model {
	static getServer(id) {
		return dbHelper.getServerByID(id);
	}

	static configServer(server_id, category_id, role_id)
	{
		dbHelper.configureTicket(server_id, category_id, role_id);
	}

	static resetConfig(server_id) {
		dbHelper.resetConfig(server_id)
	}
}

module.exports = { Model }