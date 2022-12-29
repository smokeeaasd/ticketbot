const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");
const config = require("./config.json");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
	],
	partials: [
		Partials.GuildMember
	]
});

const handlersPath = path.join(__dirname, "handlers");

const handlers = fs.readdirSync(handlersPath).filter(file => file.endsWith(".js"));

for (const handlerFile of handlers) {
	const handler = require(`./handlers/${handlerFile}`);

	(async () => {
		handler.run(client);
	})();
}

client.login(config.token);