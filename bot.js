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
            return msg.reply('This command only works in servers.')
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${msg.author}`;

            if (command.usage) {
                reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``
            }

            return msg.channel.send(reply);
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
                return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before using \`${prefix}${command.name}\`.`);
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