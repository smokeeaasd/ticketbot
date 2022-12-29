const { Events } = require("discord.js");
const path = require("path");
const fs = require("fs");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	isAsync: true,

	/**
	 * @param {import("discord.js").Interaction} interaction 
	 */
	async execute(interaction) {
		if (interaction.isStringSelectMenu()) {
			const selectMenusPath = path.join(__dirname, 'interactions\\selectMenus');
			const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));

			for (const selectMenuFile of selectMenuFiles) {
				const selectMenu = require(path.join(selectMenusPath, selectMenuFile));

				if (selectMenu.customId === interaction.customId) {
					return await selectMenu.execute(interaction);
				}
			}

			return;
		}
		if (interaction.isButton()) {
			const buttonsPath = path.join(__dirname, 'interactions\\buttons');
			const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

			for (const buttonFile of buttonFiles) {
				const button = require(path.join(buttonsPath, buttonFile));

				if (button.customId === interaction.customId) {
					return await button.execute(interaction);
				}
			}

			return;
		}

		if (!interaction.isChatInputCommand())
			return

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Ocorreu um erro na execução do comando.', ephemeral: true });
		}
	}
}