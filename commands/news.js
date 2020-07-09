const { defaultEmbed } = require('../embeds');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
  name: 'news',
  description: 'Show current news from all around the world.',
  args: false,
  usage: '',
  guildOnly: false,
  cooldown: 5,
  requiredPermissions: ['SEND_MESSAGES'],
  devOnly: false,
  async execute(msg) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    function dateString() {
      const date = new Date();

      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      let dayString;

      const j = day % 10,
        k = day % 100;
      if (j == 1 && k != 11) {
        dayString = day + 'st';
      } else if (j == 2 && k != 12) {
        dayString = day + 'nd';
      } else if (j == 3 && k != 13) {
        dayString = day + 'rd';
      } else {
        dayString = day + 'th';
      }
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      return `${dayString} of ${monthNames[month]}, ${year}`;
    }
    console.log(dateString());

    const newsEmbed = new MessageEmbed(defaultEmbed(msg))
      .setTitle('Headlines')
      .setDescription(`*for the ${dateString()}*`);

    const url = 'http://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'pageSize=5&' +
          'apiKey=97af16def5194222a43ea6ac06444719';
    await fetch(url)
      .then(async response => {
        const data = await response.json();
        console.log(data.articles);

        data.articles.forEach(article => {
          if (article.source.name === 'Daily Mail') return;
          if (article.description === null) return;
          newsEmbed.addField(article.title, `[*link*](${article.url})\n${article.description}`);
        });
      });

    msg.channel.send(newsEmbed);
    console.log(`${msg.author.tag} pinged the bot`);
  },
};