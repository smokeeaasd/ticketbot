const { SlashCommandBuilder, ChannelType, GuildMemberRoleManager, PermissionsBitField, PermissionFlagsBits, EmbedBuilder, Colors } = require("discord.js");
const { Model } = require("../database/model/dbModel");
const definir = require("./ticket/definir");
const setmenu = require("./ticket/setmenu");
const redefinir = require("./ticket/redefinir");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ticket")
		.setDescription("(Apenas Administrador) Configurar sistema de ticket")
		.addSubcommand(subcmd => {
			subcmd.setName("configurar");
			subcmd.setDescription("Configurar o sistema de tickets.");

			subcmd.addChannelOption(channel => {
				channel.setName("categoria");
				channel.setDescription("Selecione a categoria");
				channel.addChannelTypes(ChannelType.GuildCategory);
				channel.setRequired(true);

				return channel;
			});

			subcmd.addRoleOption(role => {
				role.setName("cargo");
				role.setDescription("Cargo que poderá ver os tickets de suporte");
				role.setRequired(true);
				
				return role;
			});

			return subcmd;
		})
		.addSubcommand(subcmd => {
			subcmd.setName("setmenu");
			subcmd.setDescription("Enviar o menu de tickets no chat");

			return subcmd;
		})
		.addSubcommand(subcmd => {
			subcmd.setName("redefinir");
			subcmd.setDescription("Deixar de utilizar a categoria de tickets");

			return subcmd;
		}),
	/**
	 * 
	 * @param {import("discord.js").Interaction} interaction 
	 */
	async execute(interaction) {
		/**
		 * @type {Readonly<PermissionsBitField>}
		 */
		let permissions = interaction.member.permissions;

		if (!permissions.has("Administrator")) {
			const notPermissions = new EmbedBuilder({
				color: Colors.DarkRed,
				title: "Você não pode configurar tickets!",
				description: "Somente os administradores têm permissão pra isso, que honra!"
			});

			return await interaction.reply({
				embeds: [notPermissions],
				ephemeral: true
			});
		}

		switch (interaction.options.getSubcommand())
		{
			case "configurar":
				await definir.run(interaction);
			break;

			case "setmenu":
				await setmenu.run(interaction);
			break;

			case "redefinir":
				await redefinir.run(interaction);
			break;
		}
	}
}