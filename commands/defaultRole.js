const { MessageEmbed } = require('discord.js');
const { defaultEmbed } = require('../embeds');
const { DefaultRoleModel } = require('../database/dbConfig.js');
const { prefix } = require('../discordConfig.json');

module.exports = {
  name: 'setDefaultRole',
  description: 'Sets a default role for the server.',
  args: true,
  usage: '<role ID>',
  guildOnly: true,
  cooldown: 10,
  requiredPermissions: ['ADMINISTRATOR'],
  devOnly: false,
  async execute(msg, args) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    try {
      msg.delete({ timeout: 300 });
      const reactionRoleMessage = await msg.channel.messages.fetch(args[0]);

      const checkDB = await DefaultRoleModel.findOne({ messageID: reactionRoleMessage.id });
      if(!checkDB) {
        return msg.reply(
          new MessageEmbed(defaultEmbed(msg))
            .setTitle(`${this.name} error:`)
            .setDescription(`This server doesn't have a default role.
            You can set one with \`${prefix}setDefaultRole\``),
        );
      }

      const role = msg.guild.roles.cache.get(checkDB.defaultRole);

      msg.channel.send(
        new MessageEmbed(defaultEmbed(msg))
          .setTitle(`DefaultRole:`)
          .setDescription(`This server has **${role.name}** as its default role.
          You can remove the defauly role with \`${prefix}delDefaultRole\``),
      );
    } catch(e) {
      console.log(e);
    }
  },
};