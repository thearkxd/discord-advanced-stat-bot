const { SlashCommandBuilder } = require("@discordjs/builders");
const coin = require("../schemas/coin");
const conf = require("../configs/config.json");

module.exports = {
	conf: {
		aliases: [],
		name: "coin",
		help: "coin [ekle/sil/gönder] [kullanıcı] [sayı]",
		enabled: conf.coinSystem,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("coin")
		.setDescription("Belirtilen kullanıcıya coin ekler, siler ya da gönderir.")
		.addStringOption((option) =>
			option.setName("işlem").setDescription("Kullanıcıya uygulamak istediğiniz işlem.").setRequired(true).addChoice("ekle", "ekle").addChoice("sil", "sil").addChoice("gönder", "gönder")
		)
		.addUserOption((option) => option.setName("kullanıcı").setDescription("İşlemi uygulamak istediğiniz kullanıcı.").setRequired(true))
		.addIntegerOption((option) => option.setName("sayı").setDescription("İşlem sayısı.").setRequired(true)),

	run: async ({ client, message, args, embed, reply, interaction }) => {
		if (!conf.coinSystem) return reply({ embeds: [embed.setDescription("Coin sistemi kapalı olduğu için bu komutu kullanamazsınız!")] });
		const msgMember = interaction ? interaction.member : message.member;
		const guild = interaction ? interaction.guild : message.guild;
		const member = interaction ? interaction.options.getMember("kullanıcı") : message.mentions.members.first() || message.guild.members.cache.get(args[1]);
		if (!member) return reply({ embeds: [embed.setDescription("Bir kullanıcı belirtmelisin!")] });

		if (args[0] === "ekle" || args[0] === "add") {
			if (!msgMember.permissions.has(8)) return;
			const count = parseInt(args[2]);
			if (!count) return reply({ embeds: [embed.setDescription("Eklemek için bir sayı belirtmelisin!")] });
			if (!count < 0) return reply({ embeds: [embed.setDescription("Eklenecek sayı 0'dan küçük olamaz!")] });

			await coin.updateOne({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: count } }, { upsert: true });
			const coinData = await coin.findOne({ guildID: member.guild.id, userID: member.user.id });
			let addedRoles = "";
			if (coinData && client.ranks.some((x) => coinData.coin >= x.coin && !member.hasRole(x.role))) {
				const roles = client.ranks.filter((x) => coinData.coin >= x.coin && !member.hasRole(x.role));
				addedRoles = roles;
				member.roles.add(roles[roles.length - 1].role);
				embed.setColor("GREEN");
				member.guild.channels.cache.get(conf.rankLog)?.send({
					embeds: [
						embed.setDescription(
							`${member.toString()} üyesine ${msgMember.toString()} tarafından **${count}** adet coin eklendi ve kişiye ${roles
								.filter((x) => roles.indexOf(x) === roles.length - 1)
								.map((x) => (Array.isArray(x.role) ? x.role.listRoles() : `<@&${x.role}>`))
								.join("\n")} rolleri verildi!`
						)
					]
				});
			}
			reply({
				embeds: [
					embed.setDescription(
						`Başarıyla ${member.toString()} kullanıcısına **${count}** adet coin eklendi! \n\n${
							addedRoles.length > 0
								? `Verilen roller: \n${addedRoles
										.filter((x) => addedRoles.indexOf(x) === addedRoles.length - 1)
										.map((x) => (Array.isArray(x.role) ? x.role.listRoles() : `<@&${x.role}>`))
										.join("\n")}`
								: ""
						}`
					)
				]
			});
		} else if (args[0] === "sil" || args[0] === "remove") {
			if (!msgMember.permissions.has(8)) return;
			const count = parseInt(args[2]);
			if (!count) return reply({ embeds: [embed.setDescription("Çıkarılacak için bir sayı belirtmelisin!")] });
			if (!count < 0) return reply({ embeds: [embed.setDescription("Çıkarılacak sayı 0'dan küçük olamaz!")] });
			let coinData = await coin.findOne({ guildID: member.guild.id, userID: member.user.id });
			if (!coinData || (coinData && count > coinData.coin)) return reply({ embeds: [embed.setDescription("Çıkarmak istediğiniz sayı, kişinin mevcut coininden büyük olamaz!")] });

			await coin.updateOne({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -count } }, { upsert: true });
			coinData = await coin.findOne({ guildID: member.guild.id, userID: member.user.id });
			let removedRoles = "";
			if (coinData && client.ranks.some((x) => coinData.coin < x.coin && member.hasRole(x.role))) {
				const roles = client.ranks.filter((x) => coinData.coin < x.coin && member.hasRole(x.role));
				removedRoles = roles;
				roles.forEach((x) => {
					member.roles.remove(x.role);
				});
				embed.setColor("RED");
				guild.channels.cache.get(conf.rankLog).send({
					embeds: [
						embed.setDescription(
							`${member.toString()} üyesinden ${msgMember.toString()} tarafından **${count}** adet coin çıkarıldı ve kişiden ${
								Array.isArray(roles) ? roles.role.listRoles() : `<@&${roles.role}}>`
							} rolleri alındı!`
						)
					]
				});
			}
			reply({
				embeds: [
					embed.setDescription(
						`Başarıyla ${member.toString()} kullanıcısından **${count}** adet coin çıkarıldı! \n\n${
							removedRoles.length > 0 ? `Alınan roller: \n${removedRoles.role.listRoles()}` : ""
						}`
					)
				]
			});
		} else if (args[0] === "ver" || args[0] === "give" || args[0] === "gönder") {
			const count = parseInt(args[2]);
			if (!count) return reply({ embeds: [embed.setDescription("Coin vermek için bir sayı belirtmelisin!")] });
			if (!count < 0) return reply({ embeds: [embed.setDescription("Verilecek sayı 0'dan küçük olamaz!")] });
			let coinData = await coin.findOne({ guildID: member.guild.id, userID: msgMember.user.id });
			if (!coinData || (coinData && count > coinData.coin)) return reply({ embeds: [embed.setDescription("Göndereceğin sayı kendi coininden yüksek olamaz!")] });

			await coin.updateOne({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: count } }, { upsert: true });
			await coin.updateOne({ guildID: member.guild.id, userID: msgMember.user.id }, { $inc: { coin: -count } }, { upsert: true });
			coinData = await coin.findOne({ guildID: member.guild.id, userID: msgMember.user.id });
			if (coinData && client.ranks.some((x) => coinData.coin < x.coin && msgMember.hasRole(x.role))) {
				const roles = client.ranks.filter((x) => coinData.coin < x.coin && msgMember.hasRole(x.role));
				roles.forEach((x) => msgMember.roles.remove(x.role));
			}
			const coinData2 = await coin.findOne({ guildID: member.guild.id, userID: member.user.id });
			if (coinData2 && client.ranks.some((x) => coinData2.coin >= x.coin && !member.hasRole(x.role))) {
				const roles = client.ranks.filter((x) => coinData2.coin >= x.coin && !member.hasRole(x.role));
				member.roles.add(roles[roles.length - 1].role);
			}

			reply({ embeds: [embed.setDescription(`${member.toString()} kişisine başarıyla **${count}** coin gönderildi!`)] });
		}
	}
};