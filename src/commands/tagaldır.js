const { SlashCommandBuilder } = require("@discordjs/builders");
const coin = require("../schemas/coin");
const taggeds = require("../schemas/taggeds");
const conf = require("../configs/config.json");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	conf: {
		aliases: ["tag-aldır"],
		name: "tagaldır",
		help: "tagaldır [kullanıcı]",
		enabled: conf.coinSystem,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("tagaldır")
		.setDescription("Bir kullanıcıya tag aldırırsınız.")
		.addUserOption((option) => option.setName("kullanıcı").setDescription("Tag aldırdığınız kullanıcı.").setRequired(true)),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ message, args, embed, reply, interaction }) => {
		if (!conf.coinSystem) return reply({ embeds: [embed.setDescription("Coin sistemi kapalı olduğu için bu komutu kullanamazsınız!")] });
		const msgMember = interaction ? interaction.member : message.member;
		if (!conf.staffs.some((x) => msgMember.roles.cache.has(x))) return;
		const member = interaction ? interaction.options.getMember("kullanıcı") : message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!member) return reply({ embeds: [embed.setDescription("Bir üye belirtmelisin!")] });
		if (!member.user.username.includes(conf.tag)) return reply({ embeds: [embed.setDescription("Bu üye taglı değil!")] });
		const taggedData = await taggeds.findOne({ guildID: member.guild.id, userID: msgMember.user.id });
		if (taggedData && taggedData.taggeds.includes(member.user.id)) return reply({ embeds: [embed.setDescription("Bu üyeye zaten daha önce tag aldırmışsın!")] });

		const buttons = new MessageActionRow().addComponents(
			new MessageButton().setCustomId("confirm").setLabel("Onayla").setStyle("SUCCESS"),
			new MessageButton().setCustomId("deny").setLabel("Reddet").setStyle("DANGER")
		);
		await reply({ content: member.toString(), components: [buttons], embeds: [embed.setDescription(`${msgMember.toString()} üyesi sana tag aldırmak istiyor. Kabul ediyor musun?`)] });

		const collector = (interaction ? interaction : message).channel.createMessageComponentCollector({ filter: (i) => i.user.id === member.user.id, time: 15000 });

		collector.on("collect", async (i) => {
			if (i.customId === "confirm") {
				await coin.updateOne({ guildID: member.guild.id, userID: msgMember.user.id }, { $inc: { coin: conf.points.taggedCoin } }, { upsert: true });
				embed.setColor("GREEN").setDescription(`${member.toString()} üyesine başarıyla tag aldırıldı!`);
				i.update({ embeds: [embed], components: [] });
				await taggeds.updateOne({ guildID: member.guild.id, userID: msgMember.user.id }, { $push: { taggeds: member.user.id } }, { upsert: true });
				msgMember.updateTask(member.guild.id, "taglı", 1, interaction ? interaction.channel : message.channel);
			} else {
				embed.setColor("RED").setDescription(`${member.toString()} üyesi, tag aldırma teklifini reddetti!`);
				i.update({ embeds: [embed], components: [] });
			}
		});
	}
};
