const { MessageEmbed } = require('discord.js');
module.exports = {
  unknownErrorEmbed(msg, errorLocation) {
    const dClient = msg.client;
    const unknownErrorTemplate = {
      'title': 'unknown error',
      'description': 'Unknown error. Please report bug ❤',
      'color': msg.guild.me.displayColor || '#e91e5e',
      'timestamp': new Date(),
      'footer': {
        'icon_url': msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
        'text': msg.author.tag,
      },
      'author': {
        'name': dClient.user.username,
        'icon_url': dClient.user.displayAvatarURL({ format: 'png', dymamic: true }),
      },
    };

    const unknownOutput = new MessageEmbed(unknownErrorTemplate)
      .setTitle(`${errorLocation} error:`);

    return unknownOutput;
  },
  errorEmbed(msg, errorLocation, errorDescription) {
    const dClient = msg.client;
    const errorTemplate = {
      'title': 'unknown error',
      'color': msg.guild.me.displayColor || '#e91e5e',
      'timestamp': new Date(),
      'footer': {
        'icon_url': msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
        'text': msg.author.tag,
      },
      'author': {
        'name': dClient.user.username,
        'icon_url': dClient.user.displayAvatarURL({ format: 'png', dymamic: true }),
      },
    };

    const output = new MessageEmbed(errorTemplate)
      .setTitle(`${errorLocation} error:`)
      .setDescription(`${errorDescription}`);

    return output;
  },
  defaultEmbed(msg) {
    const dClient = msg.client;
    const defaultTemplate = {
      'title': 'defaultEmbed',
      'color': msg.guild.me.displayColor || '#e91e5e',
      'timestamp': new Date(),
      'footer': {
        'icon_url': msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
        'text': msg.author.tag,
      },
      'author': {
        'name': dClient.user.username,
        'icon_url': dClient.user.displayAvatarURL({ format: 'png', dymamic: true }),
      },
    };
    return defaultTemplate;
  },
};