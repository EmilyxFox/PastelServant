module.exports = {
    name: 'updateServers',
    description: 'Updates the server invite embeds.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 0,
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

                msg.channel.messages.fetch({ limit: 10 })
                    .then(messages => {
                        msg.channel.bulkDelete(messages)
                            .then()
                            .catch()

                        fs.readFile('./servers.json',
                            { encoding: 'utf8', flag: 'r' },
                            function (err, data) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    let parsedData = JSON.parse(data);
                                    console.log(parsedData);

                                    parsedData.forEach(server => {
                                        msg.channel.send({ embed: server });
                                    })
                                }
                            })
                    })
                    .catch(console.error);
            } else {
                msg.channel.send("Insufficient Permissions");
            }
        } else {
            msg.channel.send("You can't use this command in DMs. Please try again in a server chat.")
        }
    }
}