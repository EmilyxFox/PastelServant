module.exports = {
    name: 'pingRole',
    description: 'Pings an unmentionable role!',
    args: true,
    usage: '<role name>',
    guildOnly: true,
    cooldown: 0,
    requiredPermissions: ['MANAGE_ROLES'],
    execute(msg, args, joinedArgs) {
        const dClient = msg.client;

        let allowedRoles = [];
        allowedRoles.push('Emote Empress', 'Staff Team', 'Mod')

        if (msg.channel.type === "text") {


            if (msg.member.roles.cache.find(r => allowedRoles.indexOf(r.name) !== -1)) {
                let rawRole = joinedArgs;
                if (msg.guild.roles.cache.find(r => r.name === rawRole)) {
                    let role = msg.guild.roles.cache.find(r => r.name === rawRole);
                    role.setMentionable(true, 'Pinging role')
                        .then(updated => {
                            msg.delete();
                            console.log(`[pingRole] isMentionable on ${updated.name} has been set to ${updated.mentionable}`);
                            msg.channel.send(`${updated}`);
                            console.log(`Message pinging ${updated.name} sent!`)
                        })
                        .then(() => {
                            role.setMentionable(false, 'Finished pinging role');
                            console.log(`[pingRole] reverting isMentionable`);
                        })
                        .catch(err => {
                            console.log(`[pingRole] Error pinging role. ` + err)
                            msg.channel.send(`Error pinging role.`)
                        })
                } else {
                    msg.channel.send(`Found no role with name ` + rawRole);
                    console.log(`[pingRole] Requested ping ` + rawRole + ` not found`);
                }
            } else {
                msg.channel.send(`Insufficient permissions.`);
            }
        } else {
            msg.channel.send("You can't use this command in DMs. Please try again in a server chat.")
        }
    }
}