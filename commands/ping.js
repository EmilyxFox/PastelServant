module.exports = {
    name: 'ping',
    description: 'Pings the bot!',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 5,
    execute(msg, args){
        const dClient = msg.client;
        
        msg.channel.send("test");
        console.log(dClient.user.tag + 'pinged the bot');
    }
}