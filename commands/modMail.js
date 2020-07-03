module.exports = {
  name: 'modMail',
  description: 'Sends a private message to staff',
  args: true,
  usage: '<message>',
  guildOnly: false,
  cooldown: 10,
  requiredPermissions: [],
  devOnly: false,
  execute(msg, args, joinedArgs) {
    const dClient = msg.client;
    const { modMail } = require('../discordConfig.json');

    if (msg.channel.type === 'text') {
      const errorEmbed = {
        'title': `modMail error:`,
        'description': `This command is only available in dm chats.`,
        'color': 16112271,
        'timestamp': new Date(),
        'footer': {
          'icon_url': msg.author.displayAvatarURL({
            format: 'png',
            dymamic: true,
          }),
          'text': msg.author.tag,
        },
        'author': {
          'name': dClient.user.username,
          'icon_url': dClient.user.displayAvatarURL({
            format: 'png',
            dymamic: true,
          }),
        },
      };
      msg.delete();
      return msg.reply({
        embed: errorEmbed,
      });
    }

    const mailEmbed = {
      'title': `${msg.author.tag}`,
      'description': `${joinedArgs}`,
      'thumbnail': {
        'url': msg.author.displayAvatarURL({
          format: 'png',
          dymamic: true,
        }),
      },
      'color': 16112271,
      'timestamp': new Date(),
      'footer': {
        'icon_url': msg.author.displayAvatarURL({
          format: 'png',
          dymamic: true,
        }),
        'text': msg.author.tag,
      },
      'author': {
        'name': dClient.user.username,
        'icon_url': dClient.user.displayAvatarURL({
          format: 'png',
          dymamic: true,
        }),
      },
    };

    const attachment = [];

    if (msg.attachments.size > 0) {
      attachment.push(msg.attachments.first().proxyURL);
    }
    // REAL ONE, PINGS STAFF
    dClient.channels.cache.get(modMail).send(`<@&513470792323825667>`, { embed: mailEmbed, files: attachment })
    // TEST ONE, DOESN'T PING STAFF
    // dClient.channels.cache.get(modMail).send({ embed: mailEmbed, files: attachment })
      .then(() => {
        const responseEmbed = {
          'title': `ModMail recieved!`,
          'description': `Thanks!`,
          'color': 16112271,
          'timestamp': new Date(),
          'footer': {
            'icon_url': msg.author.displayAvatarURL({
              format: 'png',
              dymamic: true,
            }),
            'text': msg.author.tag,
          },
          'author': {
            'name': dClient.user.username,
            'icon_url': dClient.user.displayAvatarURL({
              format: 'png',
              dymamic: true,
            }),
          },
        };
        msg.reply({ embed: responseEmbed });
      })
      .catch((e) => {
        const errorEmbed = {
          'title': `modMail error:`,
          'description': `\`\`\`${e}\`\`\``,
          'color': 16112271,
          'timestamp': new Date(),
          'footer': {
            'icon_url': msg.author.displayAvatarURL({
              format: 'png',
              dymamic: true,
            }),
            'text': msg.author.tag,
          },
          'author': {
            'name': dClient.user.username,
            'icon_url': dClient.user.displayAvatarURL({
              format: 'png',
              dymamic: true,
            }),
          },
        };
        msg.reply({ embed: errorEmbed });
      });
  },
};