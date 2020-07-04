// Load in filesystem
const fs = require('fs');
const mongoose = require('mongoose');
const db = mongoose.connection;
const { MessageModel, dbName } = require('./database/dbConfig.js');
// Load in Discord authentication token
const { token, prefix, ownerID } = require('./discordConfig.json');

// Load Chalk
const chalk = require('chalk');

// Load in Discord module
const Discord = require('discord.js');
const { defaultEmbed } = require('./embeds.js');
const dClient = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] });

// Config
// Load command collection
dClient.commands = new Discord.Collection();
// Cooldown collection
const cooldowns = new Discord.Collection();

mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  dClient.commands.set(command.name.toLowerCase(), command);
}


dClient.on('ready', () => {
  console.log(chalk`Logged in as {green ${dClient.user.tag}} on {yellow ${dClient.guilds.cache.size} servers}!`);
});

dClient.on('message', msg => {
  if (msg.content.toLowerCase().indexOf(prefix) == 0) {
    const args = msg.content.substring(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();
    const joinedArgs = args.join(` `);


    if (!dClient.commands.has(commandName)) return;

    const command = dClient.commands.get(commandName);

    if (command.guildOnly && msg.channel.type !== 'text') {
      return msg.reply(
        new Discord.MessageEmbed(defaultEmbed(msg))
          .setTitle(`${command.name} error:`)
          .setDescription(`This command is only available in guild chats.`),
      );
    }

    if (command.devOnly && msg.author.id != ownerID) {
      return msg.reply(
        new Discord.MessageEmbed(defaultEmbed(msg))
          .setTitle(`${command.name} error:`)
          .setDescription(`This command is only accessible by the developer.`),
      );
    }

    if (msg.channel.type === 'text') {
      if (!msg.member.hasPermission(command.requiredPermissions)) {
        return msg.reply(
          new Discord.MessageEmbed(defaultEmbed(msg))
            .setTitle(`${command.name} error:`)
            .setDescription(`You are missing one of the required permissions: \n\`\`\`${command.requiredPermissions}\`\`\``),
        );
      }
    }

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments.`;

      if (command.usage) {
        reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
      }
      return msg.reply(
        new Discord.MessageEmbed(defaultEmbed(msg))
          .setTitle(`${command.name} error:`)
          .setDescription(reply),
      );
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

        return msg.reply(
          new Discord.MessageEmbed(defaultEmbed(msg))
            .setTitle(`${command.name} error:`)
            .setDescription(`Please wait \`${timeLeft.toFixed(1)} second(s)\` before using \`${prefix}${command.name}\`.`),
        );
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

dClient.on('messageReactionAdd', async (reaction, user) => {
  // console.log(reaction, user);
  if (user.id === dClient.user.id) return;
  if (reaction.message.partial) await reaction.message.fetch();

  const { id } = reaction.message;
  try {
    const reactionRoleInformation = await MessageModel.findOne({ messageID: id });
    if (reactionRoleInformation) {
      // eslint-disable-next-line no-prototype-builtins
      if(reactionRoleInformation.emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
        const roleID = reactionRoleInformation.emojiRoleMappings[reaction.emoji.id];
        const role = reaction.message.guild.roles.cache.get(roleID);
        const member = reaction.message.guild.members.cache.get(user.id);

        if(role && member) {
          member.roles.add(role);
          console.log(chalk`Gave {blue ${role.name}} to {green ${member.user.tag}} on {yellow ${reaction.message.guild.name}}`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

dClient.on('messageReactionRemove', async (reaction, user) =>{
  // console.log(reaction, user);
  if (user.id === dClient.user.id) return;
  if (reaction.message.partial) await reaction.message.fetch();

  const { id } = reaction.message;
  try {
    const reactionRoleInformation = await MessageModel.findOne({ messageID: id });
    if (reactionRoleInformation) {
      // eslint-disable-next-line no-prototype-builtins
      if(reactionRoleInformation.emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
        const roleID = reactionRoleInformation.emojiRoleMappings[reaction.emoji.id];
        const role = reaction.message.guild.roles.cache.get(roleID);
        const member = reaction.message.guild.members.cache.get(user.id);

        if(role && member) {
          member.roles.remove(role);
          console.log(chalk`Took {blue ${role.name}} from {green ${member.user.tag}} on {yellow ${reaction.message.guild.name}}`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

db.once('open', () => {
  console.log(chalk`{bgCyan Connected to MongoDB}`);
});

db.on('error', e => {
  console.log(chalk`{bgRed Trouble connecting to MongoDB}`);
  console.log(e);
});


dClient.login(token);