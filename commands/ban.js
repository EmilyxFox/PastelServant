module.exports = {
  name: 'ban',
  description: 'Bans a guild member!',
  args: true,
  usage: '<@user> [reason]',
  guildOnly: true,
  cooldown: 0,
  requiredPermissions: ['BAN_MEMBERS'],
  execute(msg, args) {
    const dClient = msg.client;

    let allowedRoles = [];
    allowedRoles.push('Emote Empress', 'Staff Team');

    if (msg.channel.type === "text") {

      //Check if commander is in allowedRoles
      if (msg.member.roles.cache.find(r => allowedRoles.indexOf(r.name) !== -1)) {
        //Get the mentioned member in args space 0
        let mentionedMember = args[0];
        //Remove mentioned member from args
        args.shift();
        //Join rest of args into "reason"
        reason = args.join(` `);
        //Turn mention into userID, and find guildMember. Save in bannedUser
        let bannedUser = msg.guild.members.cache.find(m => m.id === mentionedMember.replace(/<@!|>/g, ""));
        if (bannedUser != null) {
          //Bans bannedUser
          bannedUser.ban(
            {
              reason: `Banned by ${msg.author.tag} with reason: "${reason}"`
            })
            //If success then
            .then(() => {
              //Console log ban confirmation
              console.log(`[Ban] ${msg.author.tag} banned ${bannedUser.user.tag} with reason: "${reason}"`);
              //Create chat embed with ban information
              let embed = {
                "title": "Banned user:",
                "description": `${bannedUser.user.tag} \n with reason: \`\`\`${reason}\`\`\``,
                "color": 13632027,
                "timestamp": new Date(),
                "footer": {
                  "icon_url": msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                  "text": `Banned by ${msg.author.tag}`
                },
                "thumbnail": {
                  "url": bannedUser.user.displayAvatarURL({ format: 'png', dymamic: true })
                },
                "author": {
                  "name": dClient.user.username,
                  "icon_url": dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                }
              };
              //Send chat embed
              msg.channel.send({ embed });
            })
            //If error then log error
            .catch(err => {
              console.log(err)
            });
          //If commander not in allowedRoles then send message
        } else {
          msg.channel.send("Please mention a user.");
        }
      } else {
        msg.channel.send("Insufficient Permissions");
      }
    } else {
      msg.channel.send("You can't use this command in DMs. Please try again in a server chat.");
    }
  }
}