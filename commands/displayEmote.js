module.exports = {
  name: 'displayEmote',
  description: 'Display an emote with an embed.',
  args: true,
  usage: '<emote> [colour]',
  guildOnly: false,
  cooldown: 0,
  requiredPermissions: ['MANAGE_EMOJIS'],
  devOnly: false,
  execute(msg, args) {
    const dClient = msg.client;

    const colorThief = require('colorthief');


    const suspectedEmote = args[0];
    let suspectedID = suspectedEmote.replace(/[<>]/g, '').replace(':', '');
    suspectedID = suspectedID.slice(suspectedID.indexOf(':')).replace(':', '');
    const emote = dClient.emojis.cache.get(suspectedID);
    if (!emote) return console.log('Couldn\'t find that emote');

    const emoteURL = `https://cdn.discordapp.com/emojis/${suspectedID}.${emote.animated ? 'gif' : 'png'}`;
    console.log(emoteURL);


    colorThief.getColor(emoteURL)
      .then(color => {
        msg.channel.send({
          embed: {
            description: `**:${emote.name}:**`,
            thumbnail: {
              url: `https://cdn.discordapp.com/emojis/${suspectedID}.${emote.animated ? 'gif' : 'png'}`,
            },
            fields: [{
              name: 'Miniature:',
              value: suspectedEmote,
              inline: true,
            }],
            color: args[1] ? parseInt(args[1].replace('#', ''), 16) : color,
            // color: parseInt(args[1] ? args[1].replace("#", "") : "777777", 16)
          },
        });
      })
      .catch(err => {
        console.log(err);
        const embed = {
          'title': `${this.name} error:`,
          'description': `Problem fetching colour.\n\`\`\`${err}\`\`\``,
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
        msg.channel.send({
          embed: embed,
        });

      });
  },
};