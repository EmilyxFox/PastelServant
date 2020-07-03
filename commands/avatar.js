const { MessageEmbed } = require('discord.js');
const { errorEmbed, defaultEmbed } = require('../embeds');
module.exports = {
  name: 'avatar',
  description: 'Displays user\'s avatar',
  args: true,
  usage: '<@user>',
  guildOnly: true,
  cooldown: 5,
  requiredPermissions: ['MANAGE_MESSAGES'],
  devOnly: false,
  execute(msg, args) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    // Turn mention into userID, and find guildMember.
    const avatarUser = msg.guild.members.cache.find(m => m.id === args[0].replace(/<[@&!]*|>/g, ''));

    if (!avatarUser) {
      return msg.reply(errorEmbed(msg, this.name,
        `Error finding user. Are you sure you mentioned a user, and not for example a role?`));
    }
    const avatarEmbed = new MessageEmbed(defaultEmbed)
      .setTitle(`${avatarUser.user.username}'s avatar`)
      .setURL(avatarUser.user.displayAvatarURL({
        format: 'png',
        dymamic: true,
      }))
      .setImage(avatarUser.user.displayAvatarURL({
        format: 'png',
        dymamic: true,
        size: 2048,
      }))
      .setFooter(`Look-up by: ${msg.author.tag}`, msg.author.displayAvatarURL({
        format: 'png',
        dymamic: true,
      }));
    msg.channel.send({ embed: avatarEmbed });
  },
};