const { MessageCollector, MessageEmbed } = require('discord.js');
const { errorEmbed, unknownErrorEmbed, defaultEmbed } = require('../embeds');
const MessageModel = require('../database/models/message');
const chalk = require('chalk');

module.exports = {
  name: 'addReactionRoles',
  description: 'Add a new reaction role collector.',
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
    // eslint-disable-next-line prefer-const
    let emojiRoleMappings = new Map();
    let progress = new String;

    try {
      msg.delete({ timeout: 300 });
      const reactionRoleMessage = await msg.channel.messages.fetch(args[0]);

      const checkDB = await MessageModel.findOne({ messageID: reactionRoleMessage.id });
      if (!checkDB) {
        msg.channel.send(
          new MessageEmbed(defaultEmbed(msg))
            .setTitle(`Reaction role setup:`)
            .setDescription(`Type out each emote and role like shown below. When you are done click ✅ to confirm, or ⛔ to discard.
          \nSyntax: \`<emote> <Role ID>\` Example: \`😀 661631192407212037\``),
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
            .then(c => {
              const reason = c.first() ? c.first()._emoji.name : 'TIMEOUT';
              collector.stop(reason);
            });
        })
          .catch(e => console.log(e));

        const collectorFilter = m => m.author.id === msg.author.id;
        const collector = new MessageCollector(msg.channel, collectorFilter, { max: 20 });

        collector.on('collect', collectedMsg => {
          const collectedArgs = collectedMsg.content.split(/\s+/);

          console.log(`Collected: ${collectedMsg.content}`);

          const suspectedEmote = collectedArgs[0];
          let suspectedEmoteID = suspectedEmote.replace(/[<>]/g, '').replace(':', '');
          suspectedEmoteID = suspectedEmoteID.slice(suspectedEmoteID.indexOf(':')).replace(':', '');

          const emote = dClient.emojis.cache.get(suspectedEmoteID);

          const suspectedRole = collectedArgs[1];
          const role = msg.guild.roles.cache.get(suspectedRole);

          collectedMsg.delete({ timeout: 300 });

          if (!emote) {
            return msg.reply(
              errorEmbed(msg, 'addReactionRoles',
                `Couldn't find emote. Make sure you're using an emote which this bot has access to.
                   \nInput: \`${collectedArgs[0]}\``,
              ))
              .then(m => m.delete({ timeout: 5000 }))
              .catch(e => console.log(e));
          }
          if (!role) {
            return msg.reply(
              errorEmbed(msg, 'addReactionRoles',
                `Couldn't find that role. Make sure you're providing a role ID.
                \nInput: \`${collectedArgs[1]}\``,
              ))
              .then(m => m.delete({ timeout: 5000 }))
              .catch(e => console.log(e));
          }
          if (emote && role) {
            emojiRoleMappings.set(emote.id, role.id);

            progress += `\n${emote} - ${role.name}`;

            guideMessage.edit(
              new MessageEmbed(defaultEmbed(msg))
                .setTitle(`Reaction role setup:`)
                .setDescription(`Type out each emote and role like shown below. When you are done please click ✅ to confirm, or ⛔ to discard.${progress}
              \nSyntax: \`<emote> <Role ID>\` Example: \`😀 661631192407212037\``),
            );
          }


        });

        collector.on('end', async (collected, reason) => {
          // console.log(emojiRoleMappings);
          const saveReason = '✅';
          const discardReason = '⛔';

          if(reason === 'TIMEOUT') {
            await guideMessage.edit(
              new MessageEmbed(defaultEmbed(msg))
                .setTitle(`Reaction role setup:`)
                .setDescription(`⛔ ReactionRole timed out. Please complete setup within 2 minutes.\nError: \`\`\`TIMEOUT\`\`\``),
            ).then(m => {
              m.delete({ timeout: 3000 });
            })
              .catch(e => console.log(e));
          }
          if(reason === saveReason) {
            if (emojiRoleMappings.size < 1) {
              await guideMessage.edit(
                new MessageEmbed(defaultEmbed(msg))
                  .setTitle(`Reaction role setup:`)
                  .setDescription(`⛔ Please specify the reaction roles before saving.\nIs this error unexpected? Please report bug ❤`),
              ).then(m => {
                m.delete({ timeout: 3000 });
              })
                .catch(e => console.log(e));
            } else {
              console.log(chalk`Saved ReactinRole setup on message {gray ${reactionRoleMessage.id}} in {yellow ${reactionRoleMessage.guild.name}} with ${emojiRoleMappings.size} roles.`);

              await guideMessage.edit(
                new MessageEmbed(defaultEmbed(msg))
                  .setTitle(`Reaction role setup:`)
                  .setDescription(`<a:loading:663222673563844608> Saving ReactionRole`),
              ).then()
                .catch(e => console.log(e));

              emojiRoleMappings.forEach((role, emoji) => {
                reactionRoleMessage.react(dClient.emojis.cache.get(emoji))
                  .then(r => {
                    console.log(chalk`Reacted on {grey ${r.message.id}} with ${r.emoji.name}`);
                  })
                  .catch(e => console.log(e));
              });

              const dbMsgModel = new MessageModel({
                messageID : reactionRoleMessage.id,
                emojiRoleMappings : emojiRoleMappings,
              });
              dbMsgModel.save()
                // eslint-disable-next-line no-unused-vars
                .then(async dbRes => {
                  // console.log(dbRes);
                  await guideMessage.edit(
                    new MessageEmbed(defaultEmbed(msg))
                      .setTitle(`Reaction role setup:`)
                      .setDescription(`✅ ReactionRole saved!`),
                  ).then(m => {
                    m.delete({ timeout: 3000 });
                  })
                    .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
            }
          } else if (reason === discardReason) {
            guideMessage.edit(
              new MessageEmbed(defaultEmbed(msg))
                .setTitle(`Reaction role setup:`)
                .setDescription(`⛔ ReactionRole setup has been discarded ⛔`),
            ).then(m => {
              m.delete({ timeout: 3000 });
            })
              .catch(e => console.log(e));
          }
        });
      } else {
        return msg.reply(
          errorEmbed(msg, this.name,
            `\`\`\`ReactionRoles already exist on this message.\`\`\``,
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