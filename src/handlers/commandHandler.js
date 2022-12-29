const { Collection } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    async run(client) {
        client.commands = new Collection();

        const guildCommandsPath = path.join(__dirname, '../commands');

        const guildCommandFiles = fs.readdirSync(guildCommandsPath).filter(file => file.endsWith('.js'));

		const commandFiles = [
			{
				path: guildCommandsPath,
				files: guildCommandFiles
			}
		];

		console.log("Carregando arquivos de comandos")
		for (const commandFile of commandFiles)
		{
			for (const file of commandFile.files)
			{
				const filePath = path.join(commandFile.path, file);
				const command = require(filePath);
				client.commands.set(command.data.name, command);
			}
		}
		console.log("Arquivos de comandos foram carregados");
    }
}
