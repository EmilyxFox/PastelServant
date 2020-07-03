module.exports = {
  name: 'pingRole',
  description: 'Pings an unmentionable role!',
  args: true,
  usage: '<role name>',
  guildOnly: true,
  cooldown: 0,
  requiredPermissions: ['MANAGE_ROLES'],
  devOnly: false,
  execute(msg, args, joinedArgs) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    const rawRole = joinedArgs;
    if (msg.guild.roles.cache.find(r => r.name === rawRole)) {
      const role = msg.guild.roles.cache.find(r => r.name === rawRole);

      let wasMentionable;
      if (role.mentionable) {
        wasMentionable = true;
      } else {
        wasMentionable = false;
      }
      role.setMentionable(true, 'Pinging role')
        .then(updated => {
          msg.delete();
          console.log(`[pingRole] isMentionable on ${updated.name} has been set to ${updated.mentionable}`);
          msg.channel.send(`${updated}`);
          console.log(`[pingRole] Message pinging ${updated.name} sent!`);
        })
        .then(() => {
          if (wasMentionable === false) {
            role.setMentionable(false, 'Finished pinging role');
          }
          console.log(`[pingRole] reverting isMentionable`);
        })
        .catch(err => {
          console.log(`[pingRole] Error pinging role. ` + err);
          msg.channel.send(`Error pinging role.`);
        });
    } else {
      msg.channel.send(`Found no role with name ` + rawRole);
      console.log(`[pingRole] Requested ping ` + rawRole + ` not found`);
    }
  },
};