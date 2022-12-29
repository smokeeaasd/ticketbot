module.exports = {
	customId: "closeticket",
	async execute(interaction) {
		await interaction.reply({
			content: `Encerrando ticket :smile:`
		});

		setTimeout(async () => {
			await interaction.channel.delete().catch(() => {});
		}, 2000);
	}
}