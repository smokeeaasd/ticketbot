const { Events } = require("discord.js");
const { Model } = require("../database/model/dbModel");

module.exports = {
	name: Events.GuildRoleDelete,
	isAsync: true,
	async execute(role) {
		const server = Model.getServer(role.guild.id);

		if (server.role_id === role.id) {
			Model.resetConfig(role.guild.id);
		}
	}
}