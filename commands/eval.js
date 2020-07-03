const { MessageEmbed } = require('discord.js');
const { defaultEmbed } = require('../embeds');

module.exports = {
  name: 'eval',
  description: 'Evals input. DEBUGGING.',
  args: true,
  usage: '<js input>',
  guildOnly: false,
  cooldown: 0,
  requiredPermissions: [],
  devOnly: true,
  execute(msg, args, joinedArgs, ownerID) {
    const { inspect } = require('util');
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;


    // This shouldn't be required, but until I'm 100% confident in the permissions check in bot.js I'll leave it
    if (msg.author.id === ownerID) {
      const toEval = joinedArgs;
      try {
        if(toEval) {
          const evaluated = inspect(eval(toEval, { depth: 0 }));
          const hrStart = process.hrtime();
          const hrDiff = process.hrtime(hrStart);

          const embed = new MessageEmbed(defaultEmbed(msg))
            .setTitle(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*`)
            .setDescription(`\`\`\`js\n${evaluated}\n\`\`\``);

          return msg.channel.send(embed)
            .then()
            .catch(e => {
              if (e.message.includes('content: Must be 2000 or fewer in length.')) {
                msg.channel.send(
                  new MessageEmbed(defaultEmbed(msg))
                    .setTitle(`${this.name} error:`)
                    .setDescription(`Code was executed, but output was > 2000 characters. Try logging to console instead. \`\`\`${e.message}\`\`\``),
                );
              }
            });


        } else {
          msg.channel.send(
            new MessageEmbed(defaultEmbed(msg))
              .setTitle('Error evaluating:')
              .setDescription('```\nNo input given```'),
          );
        }
      } catch (err) {

        msg.channel.send(
          new MessageEmbed(defaultEmbed(msg))
            .setTitle('Error evaluating:')
            .setDescription(`\`\`\`js\n${err.message}\`\`\``),
        );
      }
    } else {
      msg.channel.send(
        new MessageEmbed(defaultEmbed(msg))
          .setTitle(`${this.name} error:`)
          .setDescription(`You are missing required permissions: \n\`\`\`'DEV'\`\`\``),
      );
    }
  },
};