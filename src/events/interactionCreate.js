const { MessageEmbed } = require("discord.js");
const client = global.client;
const settings = require("../configs/settings.json");

/**
 * @param interaction {interaction}
 */
module.exports = async (interaction) => {
	if (interaction.type !== "APPLICATION_COMMAND" && !interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	const args = [];
	if (!command || (command.conf.owner && !settings.owners.includes(message.author.id)) || !command.conf.enabled) return;

	const theark = await client.users.fetch("350976460313329665");
	const embed = new MessageEmbed()
		.setColor(interaction.member.displayHexColor)
		.setAuthor({ name: interaction.member.displayName, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
		.setFooter({ text: `Made by ${theark.username} with ❤️ `, iconURL: theark.displayAvatarURL({ dyanmic: true }) });

	interaction.options.data.forEach((x) => x.value && args.push(x.value));
	command.run({ client, interaction, args, embed, prefix: "/", reply: (options) => interaction.reply(options) });
};

module.exports.conf = {
	name: "interactionCreate"
};
