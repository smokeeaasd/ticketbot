const { Events, ActivityType, Colors } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	isAsync: true,

	/**
	 * @param {import("discord.js").Client} client 
	 */
	async execute(client) {
		console.log("Pochita iniciado.");

		client.user.setStatus("idle");

		client.user.setPresence({
			activities: [
				{
					name: "RANDANDANDANDAN",
					type: ActivityType.Watching
				}
			]
		});
	}
}