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

    // Time Calculation function
    function calculateTime(timestamp) {
      const time = new Date(timestamp);
      const hours = time.getUTCHours();
      const minutes = '0' + time.getUTCMinutes();
      const seconds = '0' + time.getUTCSeconds();

      const timeOutput = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return timeOutput;
    }
    // Date Calculation function
    function calculateDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();

      const dateOutput = year + '/' + month + '/' + day;
      return dateOutput;
    }

    // Get the mentioned member in args space 0
    const match = args[0].match(/<@!?(\d{17,19})>/);
    // Remove mentioned member from args
    args.shift();
    if (match) {
      // Turn mention into userID, and find guildMember. Save in bannedUser
      const mentionedMember = msg.guild.members.cache.get(match[1]);
      const created = '📆' + calculateDate(mentionedMember.user.createdTimestamp) + '\n🕑' + calculateTime(mentionedMember.user.createdTimestamp) + ' UTC';
      const joined = '📆' + calculateDate(mentionedMember.joinedTimestamp) + '\n🕑' + calculateTime(mentionedMember.joinedTimestamp) + ' UTC';

      // Status
      let statusTitle = '';
      let statusValue = '';
      switch (mentionedMember.user.presence.status) {
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

      // Create userInfo embed
      const embed = {
        'title': 'User Info',
        'color': mentionedMember.displayColor,
        'timestamp': new Date(),
        'footer': {
          'icon_url': msg.author.displayAvatarURL({
            format: 'png',
            dymamic: true,
          }),
          'text': `Look-up by ${msg.author.tag}`,
        },
        'thumbnail': {
          'url': mentionedMember.user.displayAvatarURL({
            format: 'png',
            dymamic: true,
          }),
        },
        'author': {
          'name': dClient.user.username,
          'icon_url': dClient.user.displayAvatarURL({
            format: 'png',
            dymamic: true,
          }),
        },
        'fields': [
          {
            'name': '📜 Username:',
            'value': mentionedMember.user.username,
            'inline': true,
          },
          {
            'name': '🏷️ Discrim:',
            'value': `\`#${mentionedMember.user.discriminator}\``,
            'inline': true,
          },
          {
            'name': '🧬 ID:',
            'value': `\`${mentionedMember.id}\``,
            'inline': true,
          },
          {
            'name': '🃏 Nickname',
            'value': mentionedMember.nickname || '`N/A`',
            'inline': true,
          },
          {
            'name': '<:boost:660759462658965514> Booster:',
            'value': (mentionedMember.premiumSince != null) ? 'Boosing!' : 'Not boosting',
            'inline': true,
          },
          {
            'name': statusTitle,
            'value': statusValue,
            'inline': true,
          },
          {
            'name': '🔶 Account Creation Date:',
            'value': created,
            'inline': true,
          },
          {
            'name': '🔸 Joined Guild:',
            'value': joined,
            'inline': true,
          },
        ],
      };
      msg.channel.send({
        embed,
      });

      // If commander not in allowedRoles then send message
    } else {
      msg.channel.send('Please mention a user.');
    }
  },
};
