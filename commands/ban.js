const { MessageEmbed } = require('discord.js');
const { defaultEmbed, errorEmbed } = require('../embeds');
const chalk = require('chalk');

module.exports = {
  name: 'ban',
  description: 'Bans a guild member!',
  args: true,
  usage: '<@user> [reason]',
  guildOnly: true,
  cooldown: 0,
  requiredPermissions: ['BAN_MEMBERS'],
  devOnly: false,
  execute(msg, args) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;


    // Get the mentioned member in args space 0
    const mentionedMember = args[0];
    // Remove mentioned member from args
    args.shift();
    // Join rest of args into "reason"
    const reason = args.join(` `);
    // Turn mention into userID, and find guildMember. Save in bannedUser
    const bannedUser = msg.guild.members.cache.find(m => m.id === mentionedMember.replace(/<[@&!]*|>/g, ''));
    if (bannedUser != null) {
      // Bans bannedUser
      bannedUser.ban({
        reason: `Banned by ${msg.author.tag} with reason: "${reason}"`,
      })
        // If success then
        .then(() => {
          // Console log ban confirmation
          console.log(chalk`{green ${msg.author.tag}} ${chalk.red('banned')} ${bannedUser.user.tag} with reason: ${chalk.italic('"' + reason + '"')}`);
          // Send chat embed
          msg.channel.send(
            new MessageEmbed(defaultEmbed)
              .setTitle(`Banned user:`)
              .setDescription(`${bannedUser.user.tag} \n with reason: \`\`\`${reason}\`\`\``)
              .setFooter(`Banned by ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
              .setThumbnail(bannedUser.user.displayAvatarURL({ format: 'png', dynamic: true })),
          );
        })
        // If error then log error
        .catch(err => {
          console.log(err);
        });
      // If commander not in allowedRoles then send message
    } else {
      msg.channel.send(errorEmbed(msg, this.name, `User not found. Make sure you're mentioning a user.`));
    }
  },
};