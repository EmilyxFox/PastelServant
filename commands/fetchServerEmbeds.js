module.exports = {
    name: 'fetchServerEmbeds',
    description: 'Gets the server invite embeds from the main server.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 0,
    requiredPermissions: ['OWNER'],
    execute(msg, args) {
        const dClient = msg.client;
        
        const fs = require('fs');

        let allowedRoles = [];
        allowedRoles.push('Emote Empress', 'Staff');

        let nitroRole = [];
        nitroRole.push("Nitro Booster");

        if (msg.channel.type === "text") {
            //Check if commander is in allowedRoles
            if (msg.member.roles.cache.find(r => allowedRoles.indexOf(r.name) !== -1)) {
                
                fs.readFile('./servers.json',
                        {encoding:'utf8', flag:'r'},
                         function(err, data) {
                    if(err){
                        console.log(err)
                    }else{
                        // console.log(data);
                    }
                    
                })

                dClient.guilds.cache.get('552159216966828044').channels.cache.get('552408040033353749').messages.fetch({ limit: 10 })
                .then(messages => {
                    console.log(`Recieved ${messages.size} messages`);
                    let collectedServers = [];
                    messages.forEach(message => {
                        // console.log(message.embeds[0]);
                        let embedObj = {
                            title: message.embeds[0].title,
                            description: message.embeds[0].description,
                            url: message.embeds[0].url,
                            color: message.embeds[0].color,
                            thumbnail: {url: message.embeds[0].thumbnail.url},
                            author: {
                                 name: message.embeds[0].author.name,
                                 url: message.embeds[0].author.url,
                                 iconURL: message.embeds[0].author.iconURL,
                            },
                            footer: {
                                 text: message.embeds[0].footer.text,
                                 iconURL: message.embeds[0].footer.iconURL,
                            }
                       }
                        collectedServers.push(embedObj);
                    });
                    collectedServers.reverse();
                    console.log(JSON.stringify(collectedServers, null, 3));
                    fs.writeFile('servers.json', JSON.stringify(collectedServers, null, 3), (err) => {
                        if (err) throw err;
                        console.log('File saved!');
                    })
                })
                .catch(console.error);
            } else {
                msg.channel.send("Insufficient Permissions");
            }
        }else{
            msg.channel.send("You can't use this command in DMs. Please try again in a server chat.")
        }
    }
}

