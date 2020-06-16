module.exports = {
    name: 'ping',
    description: 'Pings the bot!',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 5,
    requiredPermissions: ['SEND_MESSAGES'],
    execute(msg, args){
        const dClient = msg.client;
        
        msg.channel.send("test");
        console.log(`${msg.author.tag} pinged the bot`);
    }
}