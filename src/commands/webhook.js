const { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, CommandInteractionOptionResolver, EmbedBuilder, Webhook, isJSONEncodable, PermissionFlagsBits } = require("discord.js");

Object.defineProperty(JSON, "TryParse", {
	value: (str) => {
		try {
			JSON.parse(str);
			return true;
		} catch {
			return false;
		}
	}
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName("webhook")
		.setDescription("Gerenciar webhooks")
		.addSubcommand(subcmd => {
			subcmd.setName("criar");
			subcmd.setDescription("Criar um webhook");

			subcmd.addAttachmentOption(file => {
				file.setName("foto");
				file.setDescription("Foto do webhook");
				file.setRequired(true);

				return file;
			});

			subcmd.addStringOption(name => {
				name.setName("nome");
				name.setDescription("Nome do webhook");
				name.setRequired(true);
				name.setMinLength(3);
				name.setMaxLength(32);

				return name;
			});

			return subcmd;
		})
		.addSubcommand(subcmd => {
			subcmd.setName("enviar");
			subcmd.setDescription("Envia uma embed");

			subcmd.addStringOption(url => {
				url.setName("url");
				url.setDescription("URL do Webhook");
				url.setRequired(true);

				return url;
			})

			subcmd.addStringOption(json => {
				json.setName("json");
				json.setDescription("Embed no formato JSON");
				json.setRequired(true);

				return json;
			})
			return subcmd;
		}),
	/**
	 * 
	 * @param {import("discord.js").Interaction} interaction 
	 */
	async execute(interaction) {
		if (!interaction.memberPermissions.has('Administrator')) {
			return await interaction.reply({
				content: ":x: | Você não tem permissão de **Administrador** para utilizar esse comando.",
				ephemeral: true
			});
		}

		const subCommand = interaction.options.getSubcommand();

		if (subCommand === "criar") {

			const foto = interaction.options.getAttachment("foto");
			const nome = interaction.options.getString("nome");

			if (foto.contentType != "image/png") {
				await interaction.reply({
					content: ":x: | A foto está no formato **errado**. A foto do webhook precisa ser no formato **PNG**.",
					ephemeral: true
				});
			} else {
				await interaction.reply({
					content: "Criando webhook para este chat...",
					ephemeral: true
				});
				/**
				 * @type {Webhook}
				 */
				const webhook = await interaction.channel.createWebhook({
					name: nome,
					avatar: foto.url,
					channel: interaction.channel.id
				});

				await interaction.followUp({
					content: `Webhook criada!\n\n${webhook.url}`,
					ephemeral: true
				});
			}
		} else if (subCommand === "enviar") {
			const url = interaction.options.getString("url");

			/** @type {String} */
			const jsonString = interaction.options.getString("json");

			const webhooks = await interaction.guild.fetchWebhooks();

			const webhook = webhooks.find(wh => wh.url === url);

			let json;
			if (!JSON.TryParse(jsonString)) {
				return await interaction.reply({
					content: ":x: | JSON no formato inválido",
					ephemeral: true
				});
			} else {
				json = JSON.parse(jsonString);
			}
			if (webhook) {
				let err = false;
				await webhook.send({
					embeds: [new EmbedBuilder(json)]
				}).catch(async (e) => {
					err = true;
					return await interaction.reply({
						content: ":x: | Embed no formato inválido",
						ephemeral: true
					});
				});

				if (!err) {
					return await interaction.reply({
						content: `:white_check_mark: | Mensagem enviada em <#${webhook.channelId}>`,
						ephemeral: true
					});
				}
			} else {
				return await interaction.reply({
					content: ":x: | Webhook inexistente",
					ephemeral: true
				});
			}
		}
	}
}