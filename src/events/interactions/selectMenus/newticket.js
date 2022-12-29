const { ActionRowBuilder, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle, Collection, InteractionCollector, InteractionResponse, OverwriteType, PermissionsBitField } = require("discord.js");
const { Model } = require("../../../database/model/dbModel");

module.exports = {
	customId: "createticket",
	/**
	 * @param {import("discord.js").Interaction} interaction
	 */
	async execute(interaction) {
		let title;
		switch (interaction.values[0]) {
			case "denuncia":
				title = "Fazer uma denúncia";
				break;

			case "purchase":
				title = "Realizar compra de VIP ou relacionados";
				break;

			case "redeem":
				title = "Resgatar recompensa de Evento ou Sorteio";
				break;

			case "other":
				title = `${interaction.user.tag} não sabe muito bem o porquê de ter chamado o atendimento, ele(a) só quer ajuda!`;
				break;
		}

		const ticketEmbed = new EmbedBuilder({
			title: title,
			color: Colors.DarkPurple,
			description: "Clique no botão abaixo para abrir um ticket."
		});

		const buttonRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId("abrirticket")
					.setLabel("Abrir Ticket")
					.setStyle(ButtonStyle.Success)
			)

		const reply = await interaction.reply({
			embeds: [ticketEmbed],
			components: [buttonRow],
			ephemeral: true
		});

		const collector = reply.createMessageComponentCollector({
			max: 1,
			time: 15000
		});

		collector.on("collect", async (i) => {
			const server = await Model.getServer(i.guild.id);

			if (server.ticket_category == null) {
				return await interaction.reply(`❌ | <@${interaction.user.id}> Parece que o sistema de tickets não está configurado. :(`);
			}

			const newChannel = await i.guild.channels.create({
				parent: server.ticket_category,
				name: `ticket-${i.user.id}`,
				permissionOverwrites: [
					{
						id: i.guild.roles.everyone.id,
						type: OverwriteType.Role,
						deny: [PermissionsBitField.Flags.ViewChannel]
					},
					{
						id: i.user.id,
						type: OverwriteType.Member,
						allow: [PermissionsBitField.Flags.ViewChannel]
					},
					{
						id: server.role_id,
						type: OverwriteType.Role,
						allow: [PermissionsBitField.Flags.ViewChannel]
					}
				]
			});

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel("Acessar")
						.setStyle(ButtonStyle.Link)
						.setURL(newChannel.url)
				);

			await i.reply({
				content: `Um atendimento foi aberto em <#${newChannel.id}>. Clique no botão abaixo para acessar.`,
				components: [row],
				ephemeral: true
			});

			setTimeout(() => {
				i.deleteReply();
			}, 5000);

			const createdTicket = new EmbedBuilder({
				color: Colors.DarkPurple,
				title: `${i.user.tag} chamou o atendimento`,
				description: title,
			});

			const archiveRow = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId("archiveticket")
						.setStyle(ButtonStyle.Secondary)
						.setLabel("Arquivar")
				)

			const closeRow = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId("closeticket")
						.setStyle(ButtonStyle.Danger)
						.setLabel("Encerrar")
				)

			await newChannel.send({
				content: `<@${i.user.id}>`,
				embeds: [createdTicket],
				components: [archiveRow, closeRow]
			});
		});

		collector.on("end", async () => {
			await interaction.deleteReply().catch(() => { });
		});
	}
}