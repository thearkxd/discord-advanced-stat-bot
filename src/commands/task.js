const task = require("../schemas/task");
const conf = require("../configs/config.json");
const ms = require("ms");

module.exports = {
  conf: {
    aliases: ["görev"],
    name: "task",
    help: "görev [ver] [kullanıcı] [invite/ses/mesaj/taglı/kayıt] [saatlik/günlük/haftalık/dakika cinsinden görev süresi] [miktar (eğer görev ses ise dakika cinsinden miktar)] [ödül miktarı] [isterseniz görevin geçerli olacağı kanal(lar)] / [sil] [görev ID] / al [görev tipi]? / şema [ekle/sil/liste/bilgi]",
    enabled: conf.coinSystem
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @param {MessageEmbed} embed
   * @returns {Promise<void>}
   */
  run: async (client, message, args, embed) => {
    const type = args[2];
    const duration = 1000 * 60 * (["hourly", "saatlik"].includes(args[3]) ? 60 : ["daily", "günlük"].includes(args[3]) ? 60 * 24 : ["weekly", "haftalık"].includes(args[3]) ? 60 * 24 * 7 : args[3]);
    let count = args[4];
    const prizeCount = args[5];
    const channels = [...message.mentions.channels.values()];
    embed.setThumbnail("https://img.itch.zone/aW1nLzIzNzE5MzEuZ2lm/original/GcEpW9.gif");
    if (["ver", "give"].includes(args[0])) {
      if (!message.member.permissions.has(8)) return message.channel.error(message, "Yeterli yetkin bulunmuyor!");
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
      let role = null;
      if (!member && message.mentions.roles.first()) role = message.mentions.roles.first();
      else if (!member) return message.channel.error(message, "Bir üye belirtmelisin!");
      if (!role && !conf.staffs.some((x) => member.roles.cache.has(x))) return message.channel.error(message, "Bu üye bir yetkili değil!");
      if (!type || !["invite", "ses", "mesaj", "taglı", "kayıt", "şema", "schema"].includes(type)) return message.channel.error(message, "Verilecek görev tipini belirtmelisin!");
      if (["şema", "schema"].includes(args[2])) {
        const id = args[3];
        if (!id) return message.channel.error(message, "Bir şema ID'si belirtmelisin!");
        const schema = client.tasks.find((x) => x.id === parseInt(id));
        if (!schema) return message.channel.error(message, `${id} ID'li bir görev şeması bulunamadı!`);
        if (role) {
          const members = role.members.filter((x) => conf.staffs.some((r) => x.roles.cache.has(r)));
          members.forEach(async (x) => await x.giveTask(message.guild.id, schema.type, schema.count, schema.prizeCount, true, schema.duration, schema.channels.length ? channels.map((x) => x.id) : null));
          message.channel.send({ embeds: [embed.setDescription(`${message.mentions.roles.first().toString()} rolüne sahip olan tüm üyelere başarıyla ${id} ID'li şemadan görevi verildi! \nGörev verilen üyeler: ${members.map((x) => x.toString()).join(", ")}`)] });
        } else {
          await member.giveTask(message.guild.id, schema.type, schema.count, schema.prizeCount, true, schema.duration, schema.channels ? channels.map((x) => x.id) : null);
          message.channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesine başarıyla ${id} ID'li şemadan verildi!`)] });
        }
      }
      if (type === "ses") count = 1000 * 60 * count;
      if (!args[3]) return message.channel.error(message, "Bir süre belirtmelisin!");
      if (!count || isNaN(count)) return message.channel.error(message, "Bir miktar belirtmelisin!");
      if (!prizeCount || isNaN(prizeCount)) return message.channel.error(message, "Bir ödül miktarı belirtmelisin!");
      let taskMessage;
      switch (type) {
        case "invite":
          taskMessage = `**Sunucumuza ${count} kişi davet et!**`;
          break;
        case "mesaj":
          taskMessage = channels.length ? `**${channels.map((x) => `<#${x}>`).join(", ")} ${channels.length > 1 ? "kanallarında" : "kanalında"} ${count} mesaj at!**` : `**Metin kanallarında ${count} mesaj at!**`;
          break;
        case "ses":
          taskMessage = channels.length ? `**${channels.map((x) => `<#${x}>`).join(", ")} ${channels.length > 1 ? "kanallarında" : "kanalında"} ${count/1000/60} dakika vakit geçir!` : `**Seste ${count/1000/60} dakika vakit geçir!**`;
          break;
        case "taglı":
          taskMessage = `**${count} kişiye tag aldır!**`;
          break;
        case "kayıt":
          taskMessage = `**Sunucumuzda ${count} kişi kayıt et!**`;
          break;
      }
      if (role) {
        const members = role.members.filter((x) => conf.staffs.some((r) => x.roles.cache.has(r)));
        if (!members.size) return message.channel.error(message, `${role.toString()} rolü olan kimse yetkili değil!`);
        members.forEach(async (x) => await x.giveTask(message.guild.id, type, count, prizeCount, true, duration, channels.length ? channels.map((x) => x.id) : null, taskMessage));
        message.channel.send({ embeds: [embed.setDescription(`${message.mentions.roles.first().toString()} rolüne sahip olan tüm üyelere başarıyla ${type} görevi verildi! \nGörev verilen üyeler: ${members.map((x) => x.toString()).join(", ")}`)] });
      } else {
        await member.giveTask(message.guild.id, type, count, prizeCount, true, duration, channels.length ? channels.map((x) => x.id) : null, taskMessage);
        message.channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesine başarıyla ${type} görevi verildi!`)] });
      }
    } else if (["sil", "delete"].includes(args[0])) {
      if (!message.member.permissions.has(8)) return message.channel.error(message, "Yeterli yetkin bulunmuyor!");
      const id = args[1];
      if (!id || isNaN(id)) return message.channel.error(message, "Bir görev ID'si belirtmelisin!");
      await task.deleteOne({ guildID: message.guild.id, id });
      message.channel.send({ embeds: [embed.setDescription(`${id} ID'li görev başarıyla silindi!`)] });
    } else if (["al", "take"].includes(args[0])) {
      if (!conf.staffs.some((x) => message.member.roles.cache.has(x))) return message.channel.error(message, "Yeterli yetkin bulunmuyor!");
      if (!client.tasks.length) return message.channel.error(message, "Sunucuda herhangi bir görev şeması oluşturulmamış!");
      const task = client.tasks.random();
      await message.member.giveTask(message.guild.id, task.type, task.count, task.prizeCount, true, task.duration);
      embed.setDescription(`
      Başarıyla bir görev aldın!
      
      Görev Tipi: \`${task.type}\`
      Görev Süresi: \`${ms(task.duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye")}\`
      Görev Tamamlama Sayısı: \`${task.count}\`
      Görev Ödülü: \`${task.prizeCount} coin\`
      `);
      message.channel.send({ embeds: [embed] });
    } else if (["şema", "schema"].includes(args[0])) {
      if (!message.member.permissions.has(8)) return message.channel.error(message, "Yeterli yetkin bulunmuyor!");
      if (["ekle", "add"].includes(args[1])) {
        if (!type || !["invite", "ses", "mesaj", "taglı", "kayıt"].includes(type)) return message.channel.error(message, "Verilecek görev tipini belirtmelisin!");
        if (type === "ses") count = 1000 * 60 * count;
        if (!args[3]) return message.channel.error(message, "Bir süre belirtmelisin!");
        if (!count || isNaN(count)) return message.channel.error(message, "Bir miktar belirtmelisin!");
        if (!prizeCount || isNaN(prizeCount)) return message.channel.error(message, "Bir ödül miktarı belirtmelisin!");
        const channels = [...message.mentions.channels.values()];
        client.tasks = global.rankdb.push("tasks", { id: client.tasks.length + 1, type, duration, count, prizeCount, channels: channels.length ? channels.map((x) => x.id) : null });
        embed.setDescription(`
        Başarıyla yeni bir görev şeması eklendi!
        
        Şema ID: \`${client.tasks.length}\`
        Görev Tipi: \`${type}\`
        Görev Süresi: \`${ms(duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye")}\`
        Görev Tamamlama Sayısı: \`${type === "ses" ? count/1000/60 + "dakika" : count}\`
        Görev Ödülü: \`${prizeCount} coin\`
        `);
        message.channel.send({ embeds: [embed] });
      } else if (["sil", "delete"].includes(args[1])) {
        const id = args[2];
        if (!client.tasks.some((x) => x.id !== id)) return message.channel.error(message, `${id} ID'li bir görev şeması bulunamadı!`);
        client.tasks = global.rankdb.set("tasks", client.tasks.filter((x) => x.id !== id));
        message.channel.send({ embeds: [embed.setDescription(`${id} ID'li görev şeması başarıyla silindi!`)] });
      } else if (["liste", "list"].includes(args[1])) message.channel.sendEmbed(embed.setDescription(client.tasks.map((x) => `\`#${x.id}\` ${x.type} ${x.count} ${x.prizeCount} ${x.channels ? x.channels.map((x) => `<#${x}>`) : ""}`).join("\n")));
      else if (["bilgi", "info"].includes(args[1])) {
        const id = args[2];
        if (!id) return message.channel.error(message, "Bir şema ID'si belirtmelisin!");
        const schema = client.tasks.find((x) => x.id === parseInt(id));
        if (!schema) return message.channel.error(message, `${id} ID'li bir görev şeması bulunamadı!`);
        embed.setDescription(`
        ${id} ID'li görev şemasının bilgileri;
        
        Görev Tipi: \`${schema.type}\`
        Görev Süresi: \`${ms(schema.duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye")}\`
        Görev Tamamlama Sayısı: \`${schema.count}\`
        Görev Ödülü: \`${schema.prizeCount} coin\`
        `);
        message.channel.send({ embeds: [embed] });
      }
    } else return message.channel.error(message, "Geçerli bir argüman belirtmelisin! `(ver, sil)`");
  }
};
