module.exports = {
    name: 'eval',
    description: 'Evals input. DEBUGGING.',
    args: true,
    usage: '<js input>',
    guildOnly: false,
    cooldown: 0,
    requiredPermissions: ['OWNER'],
    execute(msg, args, joinedArgs, ownerID) {
        const { inspect } = require("util");
        const dClient = msg.client;



            //This shouldn't be required, but until I'm 100% confident in the permissions check in bot.js I'll leave it
            if (msg.author.id === ownerID) {
                let toEval = joinedArgs;
                try {
                    if(toEval) {
                        let evaluated = inspect(eval(toEval, { depth: 0 } ));
                        let hrStart = process.hrtime()
                        let hrDiff;
                        hrDiff = process.hrtime(hrStart)
                        return msg.channel.send(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*\`\`\`js\n${evaluated}\n\`\`\``, { maxLength: 1900 })
                        
                                
                    } else {
                        msg.channel.send("Error evaluating: ```\nNo input given```")
                    }
                } catch (err) {
                    msg.channel.send(`Error evaluating: \`\`\`js\n${err.message}\`\`\``)
                }
            } else {
                msg.channel.send("Insufficient Permissions");
            }
    }
}

