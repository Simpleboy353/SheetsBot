const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "check",
	description: "Checks if a user is in the list!",
	userPerms: ["ADMINISTRATOR"],
	options: [
		{
			name: "user",
			description: "The user to check",
			type: "USER",
			required: true,
		}
	],
	run: async(client, interaction, args) => {
		const user = await interaction.options.getUser("user");
		const username = await user.username;
		
		const rows = await client.googleSheets.values.get({
			auth: client.auth,
			spreadsheetId: client.sheetId,
			range: "Sheet1!A:B"
		});

		const data = rows.data.values.find(row => row[0] === username);

		if (data) {

			if (rows.data.values.length > 0) {

				const embed = new MessageEmbed()
				.setColor("GREEN")

				for(let i = 0; i < rows.data.values.length; i++) {
					const row = rows.data.values[i];
					if (row[0] === username) {
						embed.setDescription(`Username: ${row[0]}\nReason: ${row[1]}`);
					}
				}

				await interaction.reply({ embeds: [embed] })
			}

		} else if (!data) {
			return interaction.reply("User is not in the list!")
		}
	}
}