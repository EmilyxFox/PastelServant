module.exports = {
    name: 'updateServers',
    description: 'Updates the server invite embeds.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 0,
    requiredPermissions: ['OWNER'],
    execute(msg, args) {
        const dClient = msg.client;

        const fs = require('fs');

        msg.channel.messages.fetch({
                limit: 10
            })
            .then(messages => {
                msg.channel.bulkDelete(messages)
                    .then()
                    .catch()

                fs.readFile('./servers.json', {
                        encoding: 'utf8',
                        flag: 'r'
                    },
                    function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            let parsedData = JSON.parse(data);
                            console.log(parsedData);

                            parsedData.forEach(server => {
                                msg.channel.send({
                                    embed: server
                                });
                            })
                        }
                    })
            })
            .catch(console.error);
    }
}