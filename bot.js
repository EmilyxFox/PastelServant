//Load in filesystem
const fs = require('fs');
//Load in Discord authentication token
const { token, prefix, ownerID } = require('./discordConfig.json');

//Load in Discord module
const Discord = require('discord.js');
const dClient = new Discord.Client();

//Config
var debuggingMode = false;
//Load command collection
dClient.commands = new Discord.Collection();
//Cooldown collection
const cooldowns = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    dClient.commands.set(command.name.toLowerCase(), command);
}


dClient.on('ready', () => {
    console.log(`Logged in as ${dClient.user.tag} on ${dClient.guilds.cache.size} servers!`);
});

dClient.on('message', msg => {
    if (msg.content.indexOf(prefix) == 0) {
        let args = msg.content.substring(prefix.length).split(" ");
        let commandName = args.shift().toLowerCase();
        let joinedArgs = args.join(` `);


        if (!dClient.commands.has(commandName)) return;

        const command = dClient.commands.get(commandName);

        if (command.guildOnly && msg.channel.type !== 'text') {
            let embed = {
                "title": `${command.name} error:`,
                "description": `This command is only available in guild chats.`,
                "color": 16112271,
                "timestamp": new Date(),
                "footer": {
                  "icon_url": msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                  "text": msg.author.tag
                },
                "author": {
                  "name": dClient.user.username,
                  "icon_url": dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                }
            };
            return msg.reply({ embed: embed })
        }

        if (command.requiredPermissions.includes("OWNER") && msg.author.id != ownerID) {
            let embed = {
                "title": `${command.name} error:`,
                "description": `This command is only accessible by the developer.`,
                "color": 16112271,
                "timestamp": new Date(),
                "footer": {
                  "icon_url": msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                  "text": msg.author.tag
                },
                "author": {
                  "name": dClient.user.username,
                  "icon_url": dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                }
            };
            return msg.reply({ embed: embed });
        };

        if (!msg.member.hasPermission(command.requiredPermissions)) {
            let embed = {
                "title": `${command.name} error:`,
                "description": `You are missing required permissions: \n\`\`\`${command.requiredPermissions}\`\`\``,
                "color": 16112271,
                "timestamp": new Date(),
                "footer": {
                  "icon_url": msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                  "text": msg.author.tag
                },
                "author": {
                  "name": dClient.user.username,
                  "icon_url": dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                }
            };
            return msg.reply({ embed: embed });
        };

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments.`;

            if (command.usage) {
                reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``
            }
            let embed = {
                "title": `${command.name} error:`,
                "description": reply,
                "color": 16112271,
                "timestamp": new Date(),
                "footer": {
                  "icon_url": msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                  "text": msg.author.tag
                },
                "author": {
                  "name": dClient.user.username,
                  "icon_url": dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                }
            };

            return msg.channel.send({ embed: embed });
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 0) * 1000;

        if (timestamps.has(msg.author.id)) {
            const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                let embed = {
                    "title": `${command.name} error:`,
                    "description": `Please wait \`${timeLeft.toFixed(1)} second(s)\` before using \`${prefix}${command.name}\`.`,
                    "color": 16112271,
                    "timestamp": new Date(),
                    "footer": {
                      "icon_url": msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                      "text": msg.author.tag
                    },
                    "author": {
                      "name": dClient.user.username,
                      "icon_url": dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                    }
                };
                return msg.reply({ embed: embed });
            }
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

        try {
            command.execute(msg, args, joinedArgs, ownerID);
        } catch (error) {
            console.error(error);
            msg.reply('There was an error trying to execute that command.');
        }
    }
});



dClient.on('guildMemberAdd', joiner => {

    const emoteServers = ["552159216966828044", "552291314235080735",
        "552291437476315186", "552291522075164686",
        "552291581823287327"];

    if (emoteServers.indexOf(joiner.guild.id) !== -1) {

        let role = joiner.guild.roles.cache.find(r => r.name === "Subjects of Emotopia");

        if (role === undefined) {
            console.log("User joined guild listed as emoteServer, but guild doesn't have Subjects of Emotopia role. Check your code c:");
        } else {
            joiner.roles.add(role, "Added default role for new member :)");
            console.log(`${joiner.user.tag} joined ${joiner.guild.name}. Put them in "${role.name}" role c:`)
        }
    };
});


dClient.login(token);