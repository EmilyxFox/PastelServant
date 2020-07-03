const { MessageEmbed } = require('discord.js');
const { prefix } = require('../discordConfig.json');
module.exports = {
  name: 'poll',
  description: 'Start a poll',
  args: true,
  usage: '[channel] <question> [option1] [option2] ... [option10]',
  guildOnly: true,
  cooldown: 10,
  requiredPermissions: ['SEND_MESSAGES'],
  devOnly: false,
  execute(msg, args, joinedArgs) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    const options = [
      '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮',
      '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷',
      '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿',
    ];

    args = joinedArgs.match(/"(.+?)"/g);

    const pollChannel = msg.mentions.channels.first() || msg.channel;

    msg.delete();
    if (args) {
      if (args.length === 1) {
        const question = args[0].replace(/"/g, '');
        const pollEmbed = new MessageEmbed()
          .setColor(msg.guild.me.displayColor || '#e91e5e')
          .setTitle(question)
          .setTimestamp()
          .setFooter(`Poll by ${msg.author.tag}`, msg.author.displayAvatarURL({
            format: 'png',
            dymamic: true,
          }));
        return pollChannel.send(pollEmbed)
          .then(async m => {
            await m.react('👍');
            await m.react('👎');
          });
      } else {
        args = args.map(a => a.replace(/"/g, ''));
        const question = args[0];
        const questionOptions = [...new Set(args.slice(1))];
        if (questionOptions.length > 20) {
          return msg.channel.send(`more than 20 error`);
        } else {
          const pollEmbed = new MessageEmbed()
            .setColor(msg.guild.me.displayColor || '#e91e5e')
            .setTitle(question)
            .setDescription(`${questionOptions.map((option, i) => `${options[i]} - ${option}`).join('\n')}`)
            .setTimestamp()
            .setFooter(`Poll by ${msg.author.tag}`, msg.author.displayAvatarURL({
              format: 'png',
              dymamic: true,
            }));
          return msg.channel.send(pollEmbed)
            .then(async m => {
              for (let i = 0; i < questionOptions.length; i++) {
                await m.react(options[i]);
              }
            });
        }
      }
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle(`${this.name} error:`)
        .setDescription(`Invalid Poll! Question and options should be wrapped in double quotes.\nExample: \`${prefix}poll "question" "option 1" "option 2\`"`)
        .setColor(msg.guild.me.displayColor || '#e91e5e')
        .setTimestamp()
        .setFooter(msg.author.tag, msg.author.displayAvatarURL({
          format: 'png',
          dymamic: true,
        }))
        .setAuthor(dClient.user.username, dClient.user.displayAvatarURL({
          format: 'png',
          dymamic: true,
        }));
      return msg.reply(errorEmbed);
    }
  },
};