const { MessageEmbed, Interaction } = require("discord.js");

module.exports = {
	name: "list",
	description: "Shows all the users added to the list!",
	userPerms: ["ADMINISTRATOR"],
	options: null,
	run: async(client, interaction, args) => {
		const embed = new MessageEmbed()
		.setColor("GREEN")
		.setDescription("List of Users")

		const rows = await client.googleSheets.values.get({
			auth: client.auth,
			spreadsheetId: client.sheetId,
			range: "Sheet1!A:B"
		})

		if(rows.data.values.length > 0) {
			for(let i = 0; i < rows.data.values.length; i++) {
				const row = rows.data.values[i];
				embed.addField(`Username: ${row[0]}`, `Reason: ${row[1]}`);
			}
		} else {
			embed.setDescription("No users added to the list!");
		}

		await interaction.reply({ embeds: [embed] })
	}
}