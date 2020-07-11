const { MessageEmbed } = require('discord.js');
const { defaultEmbed } = require('../embeds');

module.exports = {
  name: 'userInfo',
  description: 'Displays info about a guild member.',
  args: true,
  usage: '<@user>',
  guildOnly: true,
  cooldown: 0,
  requiredPermissions: ['MANAGE_NICKNAMES'],
  devOnly: false,
  execute(msg, args) {
    const dClient = msg.client;

    const timeToString = timestamp => {
      const time = new Date(timestamp);
      const hours = time.getUTCHours();
      const minutes = time.getUTCMinutes();
      const seconds = time.getUTCSeconds();

      console.log(minutes);
      console.log(seconds);

      const timeOutput = `${hours}:${minutes}:${seconds}`;
      return timeOutput;
    };
    const dateToString = timestamp => {
      const date = new Date(timestamp);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();

      const dateOutput = `${year}/${month}/${day}`;
      return dateOutput;
    };

    const match = args[0].match(/<@!?(\d{17,19})>/);

    if (match) {
      const member = msg.guild.members.cache.get(match[1]);
      const created = member.user.createdTimestamp;
      const joined = member.joinedTimestamp;

      // Status
      let statusTitle = new String;
      let statusValue = new String;
      switch (member.user.presence.status) {
      case 'online':
        statusTitle = '<:online:660753049219760140> Status:';
        statusValue = 'Online';
        break;
      case 'idle':
        statusTitle = '<:away:660753049417154561> Status:';
        statusValue = 'Away';
        break;
      case 'dnd':
        statusTitle = '<:dnd:660753049610092565> Status:';
        statusValue = 'Do Not Disturb';
        break;
      case 'offline':
        statusTitle = '<:offline:660753049488195596> Status:';
        statusValue = 'Offline';
        break;
      }

      msg.channel.send(
        new MessageEmbed()
          .setTitle(`UserInfo:`)
          .setColor(member.displayColor)
          .setFooter(`Look-up by ${msg.author.tag}`, msg.author.displayAvatarURL({ format:'png', dynamic:true }))
          .setThumbnail(member.user.displayAvatarURL({ format: 'png', dymamic: true }))
          .setAuthor(dClient.user.username, dClient.user.displayAvatarURL({ format:'png', dynamic:true }))
          .addFields(
            [
              {
                name: `📜 Username:`,
                value: member.user.username,
                inline: true,
              },
              {
                name: `🏷️ Discrim:`,
                value: `\`#${member.user.discriminator}\``,
                inline: true,
              },
              {
                name: `🧬 ID:`,
                value: `\`${member.id}\``,
                inline: true,
              },
              {
                name: `🃏 Nickname`,
                value: member.nickname || `\`N/A\``,
                inline: true,
              },
              {
                name: `<:boost:660759462658965514> Booster:`,
                value: (member.premiumSince != null) ? `Boosing!` : `Not boosting`,
                inline: true,
              },
              {
                name: statusTitle,
                value: statusValue,
                inline: true,
              },
              {
                name: `🔶 Account Creation Date:`,
                value: `📆${dateToString(created)}\n🕑${timeToString(created)}`,
                inline: true,
              },
              {
                name: `🔸 Joined Guild:`,
                value: `📆${dateToString(joined)}\n🕑${timeToString(joined)}`,
                inline: true,
              },
            ],
          ),
      );
    } else {
      msg.reply(
        new MessageEmbed(defaultEmbed(msg))
          .setTitle(`${this.name} error:`)
          .setDescription(`Couldn't find guild member. You can only look up members from this guild.`),
      );
    }
  },
};