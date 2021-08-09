const conf = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: ["yetki"],
    name: "rank",
    help: "rank [ekle] [coin] [rol(ler)] / [sil] [coin] / [temizle] / [liste]",
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
    if (!message.member.permissions.has(8)) return;
    const coin = args[1];
    if (["ekle", "add"].includes(args[0])) {
      if (!coin || isNaN(coin)) return message.channel.error(message, "Eklenecek yetkinin coinini belirtmelisin!");
      if (client.ranks.some((x) => x.coin === coin)) return message.channel.error(message, `${coin} coine ulaşıldığında verilecek roller zaten ayarlanmış!`);
      const roles = [...message.mentions.roles.values()];
      if (!roles || !roles.length) return message.channel.error(message, "Eklenecek yetkinin rol(leri) belirtmelisin!");
      client.ranks = global.rankdb.push("ranks", { role: roles.map((x) => x.id), coin: parseInt(coin) }).sort((a, b) => a.coin - b.coin);
      message.channel.send({ embeds: [embed.setDescription(`${coin} coine ulaşıldığında verilecek roller ayarlandı! \nVerilecek Roller: ${roles.map((x) => `<@&${x.id}>`).join(", ")}`)] });
    } else if (["sil", "delete", "remove"].includes(args[0])) {
      if (!coin|| isNaN(coin)) return message.channel.error(message, "Silinecek yetkinin coinini belirtmelisin!");
      if (!client.ranks.some((x) => x.coin === coin)) return message.channel.error(message, `${coin} coine ulaşıldığında verilecek roller ayarlanmamış!`);
      client.ranks = global.rankdb.set("ranks", client.ranks.filter((x) => x.coin !== coin)).sort((a, b) => a.coin - b.coin);
      message.channel.send({ embeds: [embed.setDescription(`${coin} coine ulaşıldığında verilecek roller silindi!`)] });
    } else if (["temizle", "clear"].includes(args[0])) {
      global.rankdb.set("ranks", []);
      message.channel.send({ embeds: [embed.setDescription("Tüm yetkiler başarıyla temizlendi!")] });
    } else if (["liste", "list"].includes(args[0])) message.channel.send({ embeds: [embed.setDescription(global.rankdb.get("ranks").sort((a, b) => a.coin - b.coin).map((x) => `${Array.isArray(x.role) ? x.role.map(x => `<@&${x}>`).join(", ") : `<@&${x.role}>`}: ${x.coin}`))] });
  }
};
