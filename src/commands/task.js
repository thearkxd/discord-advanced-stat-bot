const { SlashCommandBuilder } = require("@discordjs/builders");
const { Role } = require("discord.js");
const task = require("../schemas/task");
const conf = require("../configs/config.json");
const ms = require("ms");

module.exports = {
	conf: {
		aliases: ["task"],
		name: "görev",
		help: "görev [ver] [kullanıcı] [invite/ses/mesaj/taglı/kayıt] [görev süresi] [miktar (eğer görev ses ise dakika cinsinden miktar)] [ödül miktarı] [isterseniz görevin geçerli olacağı kanal(lar)] / [sil] [görev ID] / al [görev tipi]? / şema [ekle/sil/liste/bilgi]",
		enabled: conf.coinSystem,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("görev")
		.setDescription("Görev işlemleri.")
		.addSubcommand((command) =>
			command
				.setName("ver")
				.setDescription("Belirtilen kullanıcıya görev verir.")
				.addMentionableOption((option) => option.setName("hedef").setDescription("Görev vereceğiniz kullanıcı ya da rol.").setRequired(true))
				.addStringOption((option) =>
					option
						.setName("tip")
						.setDescription("Vereceğiniz görevin tipi.")
						.addChoice("invite", "invite")
						.addChoice("ses", "ses")
						.addChoice("mesaj", "mesaj")
						.addChoice("taglı", "taglı")
						.addChoice("kayıt", "kayıt")
						.setRequired(true)
				)
				.addStringOption((option) => option.setName("süre").setDescription("Vereceğiniz görevin süresi.").setRequired(true))
				.addIntegerOption((option) => option.setName("miktar").setDescription("Görevin tamamlanması için uygulanması gereken miktar.").setRequired(true))
				.addIntegerOption((option) => option.setName("ödül").setDescription("Görev tamamlanınca verilecek ödül coin miktarı.").setRequired(true))
				.addChannelOption((option) => option.setName("kanal").setDescription("Görevin geçerli olacağı kanal.").setRequired(false))
		)
		.addSubcommand((command) =>
			command
				.setName("sil")
				.setDescription("Belirtilen görevi siler.")
				.addIntegerOption((option) => option.setName("id").setDescription("Silinecek görev ID'si.").setRequired(true))
		)
		.addSubcommand((command) =>
			command
				.setName("al")
				.setDescription("Görev alırsınız.")
				.addStringOption((option) =>
					option
						.setName("tip")
						.setDescription("Almak istediğiniz görev tipi.")
						.addChoice("ses", "ses")
						.addChoice("mesaj", "mesaj")
						.addChoice("taglı", "taglı")
						.addChoice("kayıt", "kayıt")
						.setRequired(false)
				)
		)
		.addSubcommandGroup((group) =>
			group
				.setName("şema")
				.setDescription("Görev şeması işlemleri.")
				.addSubcommand((command) =>
					command
						.setName("ekle")
						.setDescription("Görev şeması ekler.")
						.addStringOption((option) =>
							option
								.setName("tip")
								.setDescription("Vereceğiniz görevin tipi.")
								.addChoice("invite", "invite")
								.addChoice("ses", "ses")
								.addChoice("mesaj", "mesaj")
								.addChoice("taglı", "taglı")
								.addChoice("kayıt", "kayıt")
								.setRequired(true)
						)
						.addStringOption((option) => option.setName("süre").setDescription("Vereceğiniz görevin süresi.").setRequired(true))
						.addIntegerOption((option) => option.setName("miktar").setDescription("Görevin tamamlanması için uygulanması gereken miktar.").setRequired(true))
						.addIntegerOption((option) => option.setName("ödül").setDescription("Görev tamamlanınca verilecek ödül coin miktarı.").setRequired(true))
						.addChannelOption((option) => option.setName("kanal").setDescription("Görevin geçerli olacağı kanal.").setRequired(false))
				)
				.addSubcommand((command) =>
					command
						.setName("ver")
						.setDescription("Belirtilen kullanıcıya ya da role belirtilen şemada bulunan görevi verir.")
						.addMentionableOption((option) => option.setName("hedef").setDescription("Görev verilecek kullanıcı ya da rol.").setRequired(true))
						.addIntegerOption((option) => option.setName("id").setDescription("Görev olarak verilecek şema ID'si.").setRequired(true))
				)
				.addSubcommand((command) =>
					command
						.setName("sil")
						.setDescription("Belirtilen şemayı siler.")
						.addIntegerOption((option) => option.setName("id").setDescription("Silinecek şema ID'si.").setRequired(true))
				)
				.addSubcommand((command) =>
					command
						.setName("bilgi")
						.setDescription("Belirtilen şema hakkında bilgi verir.")
						.addIntegerOption((option) => option.setName("id").setDescription("Bilgileri gösterilecek olan şema ID'si.").setRequired(true))
				)
				.addSubcommand((command) => command.setName("liste").setDescription("Görev şemalarını listeler."))
		),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ client, message, args, embed, reply, interaction }) => {
		if (!conf.coinSystem) return reply({ embeds: [embed.setDescription("Coin sistemi kapalı olduğu için bu komutu kullanamazsınız!")] });
		const type = interaction ? interaction.options.getString("tip") : args[2];
		const duration = ms(interaction ? interaction.options.getString("süre") || 1 : args[3]);
		let count = interaction ? interaction.options.getInteger("miktar") : args[4];
		const prizeCount = interaction ? interaction.options.getInteger("ödül") : args[5];
		const channels = interaction ? [interaction.options.getChannel("kanal")].filter(Boolean) : [...message.mentions.channels.values()];
		const msgMember = interaction ? interaction.member : msgMember;
		embed.setThumbnail("https://img.itch.zone/aW1nLzIzNzE5MzEuZ2lm/original/GcEpW9.gif");
		if ((interaction && interaction.options.getSubcommand() === "ver") || ["ver", "give"].includes(args[0])) {
			if (!msgMember.permissions.has(8)) return reply({ embeds: [embed.setDescription("Yeterli yetkin bulunmuyor!")] });
			const member = interaction ? interaction.options.getMentionable("hedef") : message.mentions.members.first() || message.guild.members.cache.get(args[1]);
			const target = interaction ? interaction.options.getMentionable("hedef") : message.mentions.roles.first() || member;
			if (!target) return reply({ embeds: [embed.setDescription("Bir üye ya da rol belirtmelisin!")] });
			if (member && !conf.staffs.some((x) => member.roles.cache.has(x))) return reply({ embeds: [embed.setDescription("Bu üye bir yetkili değil!")] });
			if (!type || !["invite", "ses", "mesaj", "taglı", "kayıt", "şema", "schema"].includes(type)) return reply({ embeds: [embed.setDescription("Verilecek görev tipini belirtmelisin!")] });
			if (type === "ses") count = 1000 * 60 * count;
			if (!duration) return reply({ embeds: [embed.setDescription("Görev süresini belirtmelisin!")] });
			if (!count || isNaN(count)) return reply({ embeds: [embed.setDescription("Bir miktar belirtmelisin!")] });
			if (!prizeCount || isNaN(prizeCount)) return reply({ embeds: [embed.setDescription("Bir ödül miktarı belirtmelisin!")] });
			let taskMessage;
			switch (type) {
				case "invite":
					taskMessage = `**Sunucumuza ${count} kişi davet et!**`;
					break;
				case "mesaj":
					taskMessage = channels.length
						? `**${channels.map((x) => `<#${x}>`).join(", ")} ${channels.length > 1 ? "kanallarında" : "kanalında"} ${count} mesaj at!**`
						: `**Metin kanallarında ${count} mesaj at!**`;
					break;
				case "ses":
					taskMessage = channels.length
						? `**${channels.map((x) => `<#${x}>`).join(", ")} ${channels.length > 1 ? "kanallarında" : "kanalında"} ${count / 1000 / 60} dakika vakit geçir!`
						: `**Seste ${count / 1000 / 60} dakika vakit geçir!**`;
					break;
				case "taglı":
					taskMessage = `**${count} kişiye tag aldır!**`;
					break;
				case "kayıt":
					taskMessage = `**Sunucumuzda ${count} kişi kayıt et!**`;
					break;
			}
			if (target instanceof Role) {
				const members = target.members.filter((x) => conf.staffs.some((r) => x.roles.cache.has(r)));
				if (!members.size) return reply({ embeds: [embed.setDescription(`${target.toString()} rolü olan kimse yetkili değil!`)] });
				members.forEach(async (x) => await x.giveTask(x.guild.id, type, count, prizeCount, true, duration, channels.length ? channels.map((x) => x.id) : null, taskMessage));
				reply({
					embeds: [embed.setDescription(`${target.toString()} rolüne sahip olan tüm üyelere başarıyla ${type} görevi verildi! \nGörev verilen üyeler: ${members.map((x) => x.toString()).join(", ")}`)]
				});
			} else {
				await member.giveTask(member.guild.id, type, count, prizeCount, true, duration, channels.length ? channels.map((x) => x.id) : null, taskMessage);
				reply({ embeds: [embed.setDescription(`${member.toString()} üyesine başarıyla ${type} görevi verildi!`)] });
			}
		} else if ((interaction && interaction.options.getSubcommand() === "sil") || ["sil", "delete"].includes(args[0])) {
			if (!msgMember.permissions.has(8)) return reply({ embeds: [embed.setDescription("Yeterli yetkin bulunmuyor!")] });
			const id = interaction ? interaction.options.getInteger("id") : args[1];
			if (!id || isNaN(id)) return reply({ embeds: [embed.setDescription("Bir görev ID'si belirtmelisin!")] });
			await task.deleteOne({ guildID: msgMember.guild.id, id });
			reply({ embeds: [embed.setDescription(`${id} ID'li görev başarıyla silindi!`)] });
		} else if ((interaction && interaction.options.getSubcommand() === "al") || ["al", "take"].includes(args[0])) {
			if (!conf.staffs.some((x) => msgMember.roles.cache.has(x))) return reply({ embeds: [embed.setDescription("Bu komutu kullanabilmek için yetkili olmalısın!")] });
			if (!client.tasks.length) return reply({ embeds: [embed.setDescription("Sunucuda herhangi bir görev şeması oluşturulmamış!")] });
			const task = client.tasks.random();
			await msgMember.giveTask(msgMember.guild.id, task.type, task.count, task.prizeCount, true, task.duration);
			embed.setDescription(`
      Başarıyla bir görev aldın!
      
      Görev Tipi: \`${task.type}\`
      Görev Süresi: \`${ms(task.duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye")}\`
      Görev Tamamlama Sayısı: \`${task.type === "ses" ? task.count / 1000 / 60 + " dakika" : task.count}\`
      Görev Ödülü: \`${task.prizeCount} coin\`
      `);
			reply({ embeds: [embed] });
		} else if ((interaction && interaction.options.getSubcommandGroup() === "şema") || ["şema", "schema"].includes(args[0])) {
			if (!msgMember.permissions.has(8)) return reply({ embeds: [embed.setDescription("Yeterli yetkin bulunmuyor!")] });
			if ((interaction && interaction.options.getSubcommandGroup() === "şema" && interaction.options.getSubcommand() === "ekle") || ["ekle", "add"].includes(args[1])) {
				if (!type || !["invite", "ses", "mesaj", "taglı", "kayıt", "şema", "schema"].includes(type)) return reply({ embeds: [embed.setDescription("Görev tipini belirtmelisin!")] });
				if (type === "ses") count = 1000 * 60 * count;
				if (!duration) return reply({ embeds: [embed.setDescription("Görev süresini belirtmelisin!")] });
				if (!count || isNaN(count)) return reply({ embeds: [embed.setDescription("Bir miktar belirtmelisin!")] });
				if (!prizeCount || isNaN(prizeCount)) return reply({ embeds: [embed.setDescription("Bir ödül miktarı belirtmelisin!")] });
				client.tasks = global.rankdb.push("tasks", { id: client.tasks.length + 1, type, duration, count, prizeCount, channels: channels.length && channels.map((x) => x.id) });
				embed.setDescription(`
        Başarıyla yeni bir görev şeması eklendi!
        
        Şema ID: \`${client.tasks.length}\`
        Görev Tipi: \`${type}\`
        Görev Süresi: \`${ms(duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye")}\`
        Görev Tamamlama Sayısı: \`${task.type === "ses" ? count / 1000 / 60 + " dakika" : count}\`
        Görev Ödülü: \`${prizeCount} coin\`
        `);
				reply({ embeds: [embed] });
			} else if ((interaction && interaction.options.getSubcommandGroup() === "şema" && interaction.options.getSubcommand() === "ver") || ["ver", "give"].includes(args[1])) {
				const member = interaction ? interaction.options.getMentionable("hedef") : message.mentions.members.first() || message.guild.members.cache.get(args[1]);
				const target = interaction ? interaction.options.getMentionable("hedef") : message.mentions.roles.first() || member;
				if (!target) return reply({ embeds: [embed.setDescription("Bir üye ya da rol belirtmelisin!")] });
				const id = interaction ? interaction.options.getInteger("id") : args[3];
				if (!id || isNaN(id)) return reply({ embeds: [embed.setDescription("Bir şema ID'si belirtmelisin!")] });
				const schema = client.tasks.find((x) => x.id === parseInt(id));
				if (!schema) return reply({ embeds: [embed.setDescription(`${id} ID'li bir görev şeması bulunamadı!`)] });
				if (target instanceof Role) {
					const members = target.members.filter((x) => conf.staffs.some((r) => x.roles.cache.has(r)));
					members.forEach(async (x) => await x.giveTask(x.guild.id, schema.type, schema.count, schema.prizeCount, true, schema.duration, schema.channels.length ? channels.map((x) => x.id) : null));
					reply({
						embeds: [
							embed.setDescription(
								`${target.toString()} rolüne sahip olan tüm üyelere başarıyla ${id} ID'li şemadan görevi verildi! \nGörev verilen üyeler: ${members.map((x) => x.toString()).join(", ")}`
							)
						]
					});
				} else {
					await member.giveTask(member.guild.id, schema.type, schema.count, schema.prizeCount, true, schema.duration, schema.channels ? channels.map((x) => x.id) : null);
					reply({ embeds: [embed.setDescription(`${member.toString()} üyesine başarıyla ${id} ID'li şemadan görevi verildi!`)] });
				}
			} else if ((interaction && interaction.options.getSubcommandGroup() === "şema" && interaction.options.getSubcommand() === "sil") || ["sil", "delete"].includes(args[1])) {
				const id = interaction ? interaction.options.getInteger("id") : args[2];
				if (client.tasks.filter((x) => x.id !== id).length !== 0) return reply({ embeds: [embed.setDescription(`${id} ID'li bir görev şeması bulunamadı!`)] });
				client.tasks = global.rankdb.set(
					"tasks",
					client.tasks.filter((x) => x.id !== id)
				);
				reply({ embeds: [embed.setDescription(`${id} ID'li görev şeması başarıyla silindi!`)] });
			} else if ((interaction && interaction.options.getSubcommandGroup() === "şema" && interaction.options.getSubcommand() === "liste") || ["liste", "list"].includes(args[1]))
				reply({
					embeds: [
						embed.setDescription(
							client.tasks.length ? client.tasks.map((x) => `\`#${x.id}\` ${x.type} ${x.count} ${x.prizeCount} ${x.channels ? x.channels.map((x) => `<#${x}>`) : ""}`).join("\n") : "Veri bulunamadı!"
						)
					]
				});
			else if ((interaction && interaction.options.getSubcommandGroup() === "şema" && interaction.options.getSubcommand() === "bilgi") || ["bilgi", "info"].includes(args[1])) {
				const id = interaction ? interaction.options.getInteger("id") : args[2];
				if (!id) return reply({ embeds: [embed.setDescription("Bir şema ID'si belirtmelisin!")] });
				const schema = client.tasks.find((x) => x.id === parseInt(id));
				if (!schema) return reply({ embeds: [embed.setDescription(`${id} ID'li bir görev şeması bulunamadı!`)] });
				embed.setDescription(`
        ${id} ID'li görev şemasının bilgileri;
        
        Görev Tipi: \`${schema.type}\`
        Görev Süresi: \`${ms(schema.duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye")}\`
        Görev Tamamlama Sayısı: \`${type === "ses" ? schema.count / 1000 / 60 + " dakika" : schema.count}\`
        Görev Ödülü: \`${schema.prizeCount} coin\`
        `);
				reply({ embeds: [embed] });
			}
		}
	}
};
