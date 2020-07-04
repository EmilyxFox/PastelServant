const { MessageEmbed } = require('discord.js');
const { errorEmbed, unknownErrorEmbed, defaultEmbed } = require('../embeds');
const { ReactionRolesModel } = require('../database/dbConfig.js');
const chalk = require('chalk');

module.exports = {
  name: 'delReactionRoles',
  description: 'Deletes a reaction role collector.',
  args: true,
  usage: '<message ID>',
  guildOnly: true,
  cooldown: 10,
  requiredPermissions: ['MANAGE_ROLES'],
  devOnly: false,
  async execute(msg, args) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;
    let guideMessage;

    try {
      msg.delete({ timeout: 300 });
      const reactionRoleMessage = await msg.channel.messages.fetch(args[0]);

      const checkDB = await ReactionRolesModel.findOne({ messageID: reactionRoleMessage.id });
      if (checkDB) {
        msg.channel.send(
          new MessageEmbed(defaultEmbed(msg))
            .setTitle(`ReactionRole deletion:`)
            .setDescription(`Are you sure you want to delete this ReactionRole?\n✅ to confirm, or ⛔ to cancel.`),
        ).then(async m => {
          guideMessage = m;
          await m.react('✅');
          await m.react('⛔');

          const awaitFilter = (r, u) => {
            const emojis = ['✅', '⛔'];
            if (u.id !== msg.author.id) return false;
            if (emojis.indexOf(r.emoji.name) === -1) return false;
            return true;
          };
          m.awaitReactions(awaitFilter, { max: 1, time: 120000 })
            .then(async c => {
              const reason = c.first() ? c.first()._emoji.name : 'TIMEOUT';

              const confirmReason = '✅';
              const cancelReason = '⛔';

              if(reason === 'TIMEOUT') {
                await guideMessage.edit(
                  new MessageEmbed(defaultEmbed(msg))
                    .setTitle(`ReactionRole deletion:`)
                    .setDescription(`⛔ Timed out. Please conform deletion within 2 minutes.\nError: \`\`\`TIMEOUT\`\`\``),
                ).then(newM => {
                  newM.delete({ timeout: 3000 });
                })
                  .catch(e => console.log(e));
              }
              if(reason === confirmReason) {
                await guideMessage.edit(
                  new MessageEmbed(defaultEmbed(msg))
                    .setTitle(`ReactionRole setup:`)
                    .setDescription(`<a:loading:663222673563844608> deleting ReactionRole`),
                ).then()
                  .catch(e => console.log(e));

                ReactionRolesModel.findOneAndDelete({ messageID: reactionRoleMessage.id })
                  .then(async () => {
                    console.log(chalk`Deleted ReactinRole setup on message {gray ${reactionRoleMessage.id}}.`);
                    await guideMessage.edit(
                      new MessageEmbed(defaultEmbed(msg))
                        .setTitle(`ReactionRole setup:`)
                        .setDescription(`✅ ReactionRole deleted!`),
                    ).then(newM => {
                      newM.delete({ timeout: 3000 });
                    })
                      .catch(e => console.log(e));
                  })
                  .catch(e => console.log(e));

              } else if (reason === cancelReason) {
                guideMessage.edit(
                  new MessageEmbed(defaultEmbed(msg))
                    .setTitle(`Reaction role setup:`)
                    .setDescription(`⛔ ReactionRole deletion cancelled ⛔`),
                ).then(newM => {
                  newM.delete({ timeout: 3000 });
                })
                  .catch(e => console.log(e));
              }
            });
        })
          .catch(e => console.log(e));


      } else {
        return msg.reply(
          errorEmbed(msg, this.name,
            `\`\`\`ReactionRoles doesn't exist on this message.\`\`\``,
          ));
      }
    } catch (e) {
      // if error is Invalid form body. Likely because non-id was provided.
      if (e.code == 50035) {
        return msg.reply(
          errorEmbed(msg, this.name,
            `Couldn't find message. Make sure you're providing a message ID.
            \nInput: \`${args[0]}\`
            \nError code:
            \`\`\`${e.message}\`\`\``,
          ));
      } else {
        console.log(e);
        return msg.reply(unknownErrorEmbed(msg, this.name));
      }
    }
  },
};