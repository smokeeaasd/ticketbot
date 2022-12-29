const { ActionRowBuilder, ModalBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, Message, ComponentType, StringSelectMenuBuilder } = require("discord.js");
const { Model } = require("../../database/model/dbModel");

module.exports = {
	/**
	 * 
	 * @param {import("discord.js").Interaction} interaction 
	 */
	async run(interaction) {
		const server = Model.getServer(interaction.guild.id);

		if (server.ticket_category == null) {
			return await interaction.reply(`❌ | <@${interaction.user.id}> Parece que o sistema de tickets não está configurado. :(`);
		}

		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("createticket")
					.setPlaceholder("Escolha uma opção")
					.setOptions(
						{
							label: "Fazer uma denúncia",
							description: "Denunciar um usuário.",
							emoji: "🚨",
							value: "denuncia"
						},
						{
							label: "Realizar compra de VIP ou relacionados",
							description: "Comprar algum item do servidor e receber vantagens!",
							emoji: "💸",
							value: "purchase"
						},
						{
							label: "Resgatar uma recompensa",
							description: "Resgatar premiações de eventos ou sorteios",
							emoji: "🎉",
							value: "redeem"
						},
						{
							label: "Outros",
							description: "Socorro, me ajuda!",
							emoji: "🆘",
							value: "other"
						},
					)
			)

		const ticketMsg = new EmbedBuilder({
			color: Colors.DarkPurple,
			title: "Atendimento",
			description: "Selecione uma das opções para iniciar o atendimento."
		});

		await interaction.reply({
			content: `:white_check_mark: | Prontinho, A mensagem de ticket foi enviada.`,
			ephemeral: true
		});

		/**
		 * @type {Message}
		 */
		return await interaction.channel.send({
			embeds: [ticketMsg],
			components: [row]
		});
	}
}