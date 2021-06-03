const task = require("../schemas/task");
const conf = require("../configs/config.json");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  conf: {
    aliases: ["görevler"],
    name: "tasks",
    help: "görevler [kullanıcı]?",
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
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const tasks = await task.find({ guildID: message.guild.id, userID: member.user.id });
    let taskMessage;
    embed.setThumbnail("https://img.itch.zone/aW1nLzIzNzE5MzEuZ2lm/original/GcEpW9.gif");
    message.channel.sendEmbed(embed.setDescription(`
    Toplam Görev Sayısı: \`${tasks.length}\`
    Tamamlanmış Görev Sayısı: \`${tasks.filter((x) => x.completed).length}\`
    Tamamlanmamış Görev Sayısı: \`${tasks.filter((x) => !x.completed).length}\`
    Aktif Görev Sayısı: \`${tasks.filter((x) => x.active).length}\`
    
    ${tasks.filter((x) => x.active).map((x) => {
      switch (x.type) {
        case "invite":
          taskMessage = `**Sunucumuza ${x.count} kişi davet et!**`;
          break;
        case "mesaj":
          taskMessage = x.channels ? `**${x.channels.map((x) => `<#${x}>`).join(", ")} ${x.channels.length > 1 ? "kanallarında" : "kanalında"} ${x.count} mesaj at!**` : `**Metin kanallarında ${x.count} mesaj at!**`;
          break;
        case "ses":
          taskMessage = x.channels ? `**${x.channels.map((x) => `<#${x}>`).join(", ")} ${x.channels.length > 1 ? "kanallarında" : "kanalında"} ${x.count/1000/60} dakika vakit geçir!` : `**Seste ${x.count/1000/60} dakika vakit geçir!**`;
          break;
        case "taglı":
          taskMessage = `**${x.count} kişiye tag aldır!**`;
          break;
        case "kayıt":
          taskMessage = `**Sunucumuzda ${x.count} kişi kayıt et!**`;
          break;
      }
      return `\`#${x.id}\` ${taskMessage} \n${x.completedCount >= x.count ? conf.emojis.coin + " **Tamamlandı!**" : `${client.progressBar(x.completedCount, x.count, 8)} \`${x.type === "ses" ? `${moment.duration(x.completedCount).format("H [saat], m [dk], s [sn]")} / ${moment.duration(x.count).format("H [saat], m [dk], s [sn]")}` : `${x.completedCount} / ${x.count}`}\` \nKalan Süre: \`${moment.duration(x.finishDate - Date.now()).format("H [saat], m [dakika] s [saniye]")}\` \nÖdül: ${conf.emojis.coin} \`${x.prizeCount} coin\``}`;}).join("\n\n")}`));
  }
};
