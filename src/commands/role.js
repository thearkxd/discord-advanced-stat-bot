const moment = require("moment");
require("moment-duration-format");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const coin = require("../schemas/coin");

module.exports = {
  conf: {
    aliases: ["rol"],
    name: "role",
    help: "rol [rol]"
  },

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8)) return;
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) return message.channel.send(embed.setDescription("Bir rol belirtmelisin!"));
    else if (role.members.size === 0) return message.channel.send(embed.setDescription("Bu rol kimsede bulunmuyor!"));

    const messageData = async (type) => {
      let data = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
      data = data.filter(x => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
      return data.length > 0 ? data.splice(0, 5).map((x, index) => `\`${index + 1}.\` <@${x.userID}> : \`${Number(x[type]).toLocaleString()} mesaj\``).join(`\n`) : "Veri bulunmuyor!";
    };

    const voiceData = async (type) => {
      let data = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
      data = data.filter(x => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
      return data.length > 0 ? data.splice(0, 5).map((x, index) => `\`${index + 1}.\` <@${x.userID}> : \`${moment.duration(x[type]).format("H [saat], m [dakika] s [saniye]")}\``).join(`\n`) : "Veri bulunmuyor!";
    };

    const coinData = async () => {
      let data = await coin.find({ guildID: message.guild.id }).sort({ coin: -1 });
      data = data.filter(x => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
      return data.length > 0 ? data.splice(0, 5).map((x, index) => `\`${index+1}.\` <@${x.userID}>: \`${Number(x.coin).toLocaleString()} coin\``).join(`\n`) : "Veri bulunmuyor!";
    };

    embed.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
    embed.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
    message.channel.send(embed.setDescription(`
    ${role.toString()} rolüne sahip üyelerin verileri
    **───────────────**
    
    **➥ Toplam Ses Bilgileri:**
    ${await voiceData("topStat")}

    **➥ Haftalık Ses Bilgileri:**
    ${await voiceData("weeklyStat")}

    **➥ Günlük Ses Bilgileri:**
    ${await voiceData("dailyStat")}
    
    **───────────────**
    
    **➥ Toplam Mesaj Bilgileri:**
    ${await messageData("topStat")}

    **➥ Haftalık Mesaj Bilgileri:**
    ${await messageData("weeklyStat")}

    **➥ Günlük Mesaj Bilgileri:**
    ${await messageData("dailyStat")}

    **───────────────**

    **➥ Toplam Coin Bilgileri:**
    ${await coinData()}
    `));
  }
};