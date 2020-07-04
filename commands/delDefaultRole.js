const { MessageEmbed } = require('discord.js');
const { defaultEmbed } = require('../embeds');
const { DefaultRoleModel } = require('../database/dbConfig.js');
const chalk = require('chalk');

module.exports = {
  name: 'delDefaultRole',
  description: 'deletes the default role for the server.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 10,
  requiredPermissions: ['ADMINISTRATOR'],
  devOnly: false,
  async execute(msg) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    let guideMessage;

    const checkDB = await DefaultRoleModel.findOne({ serverID: msg.guild.id });
    if(!checkDB) {
      return msg.reply(
        new MessageEmbed(defaultEmbed(msg))
          .setTitle(`${this.name} error:`)
          .setDescription(`This server doesn't have a default role`),
      );
    }

    const role = msg.guild.roles.cache.get(checkDB.defaultRole);

    msg.channel.send(
      new MessageEmbed(defaultEmbed(msg))
        .setTitle(`DefaultRole:`)
        .setDescription(`Are you sure you want to delete **${role.name}** as the default role for this server?
        Everyone who joins the server from now on **will not have any roles set automatically**.`),
    )
      .then(async m => {
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

            if (reason === 'TIMEOUT') {
              await guideMessage.edit(
                new MessageEmbed(defaultEmbed(msg))
                  .setTitle(`DefaultRole:`)
                  .setDescription(`⛔ DefaultRole timed out. Please complete deletion within 2 minutes.\nError: \`\`\`TIMEOUT\`\`\``),
              ).then(editedM => {
                editedM.delete({ timeout: 3000 });
              })
                .catch(e => console.log(e));
            }
            if (reason === '⛔') {
              guideMessage.edit(
                new MessageEmbed(defaultEmbed(msg))
                  .setTitle(`DefaultRole:`)
                  .setDescription(`⛔ DefaultRole deletion cancelled ⛔`),
              ).then(editedM => {
                editedM.delete({ timeout: 3000 });
              })
                .catch(e => console.log(e));
            }
            if (reason === '✅') {
              DefaultRoleModel.findOneAndDelete({ serverID: msg.guild.id })
                .then(async () => {
                  console.log(chalk`Deleted DefaultRole setup in {yellow ${msg.guild.name}}.`);
                  await guideMessage.edit(
                    new MessageEmbed(defaultEmbed(msg))
                      .setTitle(`DefaultRole:`)
                      .setDescription(`✅ DefaultRole deleted!`),
                  ).then(newM => {
                    newM.delete({ timeout: 3000 });
                  })
                    .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
            }
          });
      });


  },
};