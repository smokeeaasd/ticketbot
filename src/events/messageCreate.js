const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	isAsync: true,

	/**
	 * @param {import("discord.js").Message} msg
	 */
	async execute(msg) {
		if (msg.author.bot) return;

		const messagesPath = path.join(__dirname, 'messages')
		const messageFiles = fs.readdirSync(messagesPath).filter(file => file.endsWith('.js'));

		for (const messageFile of messageFiles) {
			const message = require(path.join(messagesPath, messageFile));

			await message.run(msg);
		}
	}
}