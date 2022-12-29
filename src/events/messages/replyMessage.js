const { Message, Colors, EmbedBuilder } = require("discord.js");

module.exports = {
	/**
	 * 
	 * @param {Message} msg 
	 */
	async run(msg) {
		if (!msg.content.startsWith(`<@${msg.client.user.id}>`)) return;

		let commandArgs = msg.content.split(' ').slice(1);
		let command = commandArgs.join(' ').toLowerCase();

		let messages = [
			{
				base: "bom dia",
				replies: ["opa, bom dia!", "bom dia", "bom dia :smile:"],
			},
			{
				base: "boa tarde",
				replies: ["opa, boa tarde!", "boa tarde", "boa tarde! :smile:"],
			},
			{
				base: "boa noite",
				replies: ["opa, boa noite!", "boa noite", "boa noite! :smile:"]
			}
		];

		let matchMsg = messages.find(m => m.base === command) ?? false;

		if (matchMsg) {
			let replyMsg = matchMsg.replies[Math.floor(Math.random() * matchMsg.replies.length)];

			setTimeout(async () => {
				await msg.reply(replyMsg).catch(() => { });
			}, 2000);
		}
	}
}