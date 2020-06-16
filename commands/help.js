const { prefix } = require('../discordConfig.json');

module.exports = {
    name: 'help',
    description: 'List all commands or info about a specific command.',
    args: false,
    usage: '[command]',
    guildOnly: false,
    cooldown: 5,
    execute(msg, args) {
        const dClient = msg.client;

        const data = [];
        const { commands } = msg.client;


        if (!args.length) {

            const embed = {
                title: "Commands:",
                description: "You can send `!help [command name]` to get info on a specific command!",
                color: 16112271,
                timestamp: new Date(),
                footer: {
                    icon_url: msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                    text: "Called by " + msg.author.tag
                },
                thumbnail: {
                    url: dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                },
                author: {
                    name: dClient.user.username,
                    icon_url: dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                },
                fields: [

                ]
            }


            commands.forEach(command => {
                embed.fields.push(
                    {
                        name: prefix + command.name,
                        value: command.description,
                        inline: true
                    }
                )
            })

            return msg.author.send({ embed: embed, split: true })
                .then(() => {
                    if (msg.channel.type === 'dm') return;
                    msg.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
                    msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }


        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return msg.reply('that\'s not a valid command!');
        }

        const embed = {
            title: prefix + command.name,
            description: command.description,
            color: 16112271,
            timestamp: new Date(),
            footer: {
                icon_url: msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                text: "Called by " + msg.author.tag
            },
            thumbnail: {
                url: dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
            },
            author: {
                name: dClient.user.username,
                icon_url: dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
            },
            fields: [

            ]
        }

        if (command.usage) embed.fields.push(                   
            {
            name: `Usage:`,
            value: `${prefix}${command.name} ${command.usage}`,
            inline: true
        });
        if (command.aliases) embed.fields.push(                   
            {
            name: `Aliases:`,
            value: command.aliases,
            inline: true
        });
        if (command.aliases) embed.fields.push(                   
            {
            name: `Cooldown:`,
            value: `${command.cooldown || 3} second(s)`,
            inline: true
        });

        msg.channel.send({ embed: embed, split: true });
    }
}