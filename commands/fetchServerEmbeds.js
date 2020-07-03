module.exports = {
  name: 'fetchServerEmbeds',
  description: 'Gets the server invite embeds from the main server.',
  args: false,
  usage: '',
  guildOnly: false,
  cooldown: 0,
  requiredPermissions: [],
  devOnly: true,
  execute(msg) {
    const dClient = msg.client;

    const fs = require('fs');


    fs.readFile('./servers.json', { encoding: 'utf8', flag: 'r' }, (err) => {
      if (err) {
        console.log(err);
      }
    });

    dClient.guilds.cache.get('552159216966828044').channels.cache.get('552408040033353749').messages.fetch({
      limit: 10,
    })
      .then(messages => {
        console.log(`Recieved ${messages.size} messages`);
        const collectedServers = [];
        messages.forEach(message => {
          // console.log(message.embeds[0]);
          const embed = message.embed[0];
          const embedObj = {
            title: embed.title,
            description: embed.description,
            url: embed.url,
            color: embed.color,
            thumbnail: {
              url: embed.thumbnail.url,
            },
            author: {
              name: embed.author.name,
              url: embed.author.url,
              iconURL: embed.author.iconURL,
            },
            footer: {
              text: embed.footer.text,
              iconURL: embed.footer.iconURL,
            },
          };
          collectedServers.push(embedObj);
        });
        collectedServers.reverse();
        console.log(JSON.stringify(collectedServers, null, 3));
        fs.writeFile('servers.json', JSON.stringify(collectedServers, null, 3), (err) => {
          if (err) throw err;
          console.log('File saved!');
        });
      })
      .catch(console.error);
  },
};
