const { EmbedBuilder, Colors } = require("discord.js");
const { Model } = require("../../database/model/dbModel")

module.exports = {
	async run(interaction) {
		const server = Model.getServer(interaction.guild.id);

		if (server.ticket_category == null)
		{
			return await interaction.reply(`❌ | <@${interaction.user.id}> Parece que o sistema de tickets não está configurado :(`);
		}

		Model.resetConfig(interaction.guild.id);

		const removedCategory = new EmbedBuilder({
			color: Colors.Aqua,
			title: "Configuração de tickets redefinida",
			description: "Você pode definir a categoria de tickets com **/ticket definir**"
		});

		await interaction.reply({
			embeds: [removedCategory]
		});
	}
}