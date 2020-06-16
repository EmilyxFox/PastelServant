module.exports = {
	name: 'reload',
	description: 'Reloads a command.',
    args: true,
    usage: '<command>',
    guildOnly: false,
	cooldown: 5,
	requiredPermissions: ['OWNER'],
	execute(msg, args) {
        const dClient = msg.client;

		const commandName = args[0].toLowerCase();
		const command = dClient.commands.get(commandName)
			|| dClient.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return msg.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			let embed = {
                "title": "Reload:",
                "description": `Command \`${command.name}\` was reloaded!`,
                "color": 16112271,
                "timestamp": new Date(),
                "footer": {
                  "icon_url": msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                  "text": `Reload by ${msg.author.tag}`
                },
                "author": {
                  "name": dClient.user.username,
                  "icon_url": dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                }
			};
			  
			const newCommand = require(`./${command.name}.js`);
			dClient.commands.set(newCommand.name.toLowerCase(), newCommand);
			msg.channel.send({ embed: embed });
		} catch (error) {
			console.log(error);
			msg.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	}
};