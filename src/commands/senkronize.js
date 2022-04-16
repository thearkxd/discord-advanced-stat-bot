const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember, Role } = require("discord.js");
const coin = require("../schemas/coin");
const conf = require("../configs/config.json");

module.exports = {
	conf: {
		aliases: ["senkron", "sync"],
		name: "senkronize",
		help: "senkronize [kullanıcı/rol]",
		enabled: conf.coinSystem,
		slash: true,
	},

	slashOptions: new SlashCommandBuilder()
		.setName("senkronize")
		.setDescription("Bir rolü veya kullanıcıyı senkronize eder.")
		.addMentionableOption((option) => option.setName("hedef").setDescription("Senkronize etmek istediğiniz kişi ya da rol.").setRequired(true)),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ client, message, args, embed, reply, interaction }) => {
		if (!conf.coinSystem) return reply({ embeds: [embed.setDescription("Coin sistemi kapalı olduğu için bu komutu kullanamazsınız!")] });
		if ((interaction && !interaction.member.permissions.has(8)) || (message && !message.permissions.has(8))) return;
		const target = interaction?.options.getMentionable("hedef");
		const member = interaction ? interaction.guild.members.cache.get(target.id) : message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		const role = interaction ? interaction.guild.roles.cache.get(target.id) : message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
		if (member) {
			if (client.ranks.some((x) => member.hasRole(x.role))) {
				let rank = client.ranks.filter((x) => member.hasRole(x.role));
				rank = rank[rank.length - 1];
				await coin.updateOne({ guildID: member.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
				reply({
					embeds: [
						embed.setDescription(
							`${member.toString()} üyesinde ${Array.isArray(rank.role) ? rank.role.map((x) => `<@&${x}>`).join(", ") : `<@&${rank.role}>`} rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`
						)
					]
				});
			} else return reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)] });
		} else if (role) {
			if (role.members.length === 0) return reply({ embeds: [embed.setDescription("Bu rolde üye bulunmuyor!")] });
			role.members.forEach(async (member) => {
				if (member.user.bot) return;
				if (client.ranks.some((x) => member.hasRole(x.role))) {
					let rank = client.ranks.filter((x) => member.hasRole(x.role));
					rank = rank[rank.length - 1];
					await coin.updateOne({ guildID: role.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
					reply({
						embeds: [
							embed.setDescription(
								`${member.toString()} üyesinde ${Array.isArray(rank.role) ? rank.role.map((x) => `<@&${x}>`).join(", ") : `<@&${rank.role}>`} rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`
							)
						]
					});
				} else return reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)] });
			});
		} else return reply({ embeds: [embed.setDescription("Geçerli bir argüman belirtmelisin!")] });
	}
};
