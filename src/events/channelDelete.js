const { Events, ChannelType } = require("discord.js");
const { Model } = require("../database/model/dbModel.js");
module.exports = {
	name: Events.ChannelDelete,
	isAsync: true,
	/**
	 * @param {import("discord.js").Channel} channel 
	 */
	async execute(channel) {
		if (channel.type == ChannelType.GuildCategory) {
			const server = Model.getServer(channel.guild.id);

			if (server.ticket_category == channel.id) {
				Model.resetConfig(channel.guild.id);
			}
		}
	}
}