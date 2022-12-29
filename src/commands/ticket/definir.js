const { EmbedBuilder, Colors } = require("discord.js");
const { Model } = require("../../database/model/dbModel");

module.exports = {
	/**
	 * 
	 * @param {import("discord.js").Interaction} interaction 
	 */
	async run(interaction) {
		const category = interaction.options.getChannel("categoria");
		const role = interaction.options.getRole("cargo");

		Model.configServer(interaction.guild.id, category.id, role.id);

		const updatedCategory = new EmbedBuilder({
			color: Colors.Aqua,
			title: "Categoria de Tickets Atualizada!",
			description: "Você pode configurar o sistema a qualquer momento com **/ticket configurar**",
			fields: [
				{
					name: "Categoria de Tickets",
					value: category.name
				},
				{
					name: "Quem poderá ver os tickets?",
					value: `Usuários com o cargo <@&${role.id}>`
				}
			],
			footer: {
				text: interaction.user.username,
				iconURL: interaction.user.avatarURL()
			}
		});

		await interaction.reply({
			embeds: [updatedCategory],
			ephemeral: true
		});
	}
}