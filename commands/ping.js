const { defaultEmbed } = require('../embeds');
const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'ping',
  description: 'Pings the bot!',
  args: false,
  usage: '',
  guildOnly: false,
  cooldown: 5,
  requiredPermissions: ['SEND_MESSAGES'],
  devOnly: false,
  execute(msg) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    msg.channel.send(
      new MessageEmbed(defaultEmbed(msg))
        .setTitle('test')
        .setDescription('test2'),
    );
    console.log(`${msg.author.tag} pinged the bot`);
  },
};