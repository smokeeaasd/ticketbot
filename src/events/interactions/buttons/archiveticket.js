const { TextChannel, OverwriteType, PermissionsBitField, GuildMemberRoleManager } = require("discord.js");
const { Model } = require("../../../database/model/dbModel.js");

module.exports = {
	customId: "archiveticket",

	/**
	 * 
	 * @param {import("discord.js").Interaction} interaction 
	 */
	async execute(interaction) {
		const server = Model.getServer(interaction.guild.id);

		let userroles = interaction.member.roles;
		if (!userroles.cache.has(server.role_id))
		{
			return await interaction.reply({
				content: `:x: | Apenas pessoas com o cargo <@&${server.role_id}> podem arquivar um atendimento.`,
				ephemeral: true
			});
		}

		await interaction.reply({
			content: `Arquivando ticket :smile:`,
		});

		let channel = interaction.channel;

		let perms = channel.permissionOverwrites.cache.find(perms => {
			return (perms.id != server.role_id) && (perms.id != interaction.guild.roles.everyone.id);
		});

		setTimeout(async () => {
			await channel.edit({
				permissionOverwrites: [
					{
						id: perms.id,
						type: OverwriteType.Member,		
						deny: [PermissionsBitField.Flags.ViewChannel]
					},
					{
						id: interaction.guild.roles.everyone.id,
						type: OverwriteType.Role,
						deny: [PermissionsBitField.Flags.ViewChannel]
					},
					{
						id: server.role_id,
						type: OverwriteType.Role,
						allow: [PermissionsBitField.Flags.ViewChannel]
					}
				]
			});
		}, 1000);
	}
}