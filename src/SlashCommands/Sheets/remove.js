module.exports = {
	name: "remove",
	description: "Removes a user from the sheet!",
	userPerms: ["ADMINISTRATOR"],
	options: [
		{
			name: "user",
			description: "Removes a user form the sheet!",
			type: "USER",
			required: true
		}
	],
	run: async(client, interaction, args) => {
		const user = await interaction.options.getUser("user");
		const username = user.username;

		const rows = await client.googleSheets.values.get({
			auth: client.auth,
			spreadsheetId: client.sheetId,
			range: "Sheet1!A:A"
		});

		const data = rows.data.values.find(row => row[0] === username);

		if (!data) {
			return interaction.reply("User is not in the list!")
		} 

		let toDeleteRow;

		for (let i = 0; i < rows.data.values.length; i++) {
			const row = rows.data.values[i];
			if (row[0] === username) {
				toDeleteRow = i;
			}
		}

		await client.googleSheets.batchUpdate({
			auth: client.auth,
			spreadsheetId: client.sheetId,
			resource: {
					"requests": [
					{
						"deleteDimension": {
							"range": {
								"sheetId": 0,
								"dimension": "ROWS",
								"startIndex": toDeleteRow,
								"endIndex": toDeleteRow + 1,
							},
						}
					}
				]
			}
		}).catch(console.error)

		return interaction.reply("User has been removed from the list!")
	}
}