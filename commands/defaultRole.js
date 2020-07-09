const { MessageEmbed } = require('discord.js');
const { defaultEmbed } = require('../embeds');
const { DefaultRoleModel } = require('../database/dbConfig.js');
const { prefix } = require('../discordConfig.json');

module.exports = {
  name: 'defaultRole',
  description: 'Get information about default role in the server',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 10,
  requiredPermissions: ['ADMINISTRATOR'],
  devOnly: false,
  async execute(msg) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    try {
      msg.delete({ timeout: 300 });

      const checkDB = await DefaultRoleModel.findOne({ serverID: msg.guild.id });
      console.log(checkDB);
      if(!checkDB) {
        return msg.reply(
          new MessageEmbed(defaultEmbed(msg))
            .setTitle(`⛔ DefaultRole:`)
            .setDescription(`This server doesn't have a default role.
            You can set one with \`${prefix}setDefaultRole\``),
        );
      }

      const role = msg.guild.roles.cache.get(checkDB.defaultRole);


      msg.channel.send(
        new MessageEmbed(defaultEmbed(msg))
          .setTitle(`✅ DefaultRole:`)
          .setDescription(`This server has **${role.name}** as its default role.
          You can remove the default role with \`${prefix}delDefaultRole\``),
      );
    } catch(e) {
      console.log(e);
    }
  },
};