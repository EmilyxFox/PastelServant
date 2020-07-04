const { MessageEmbed } = require('discord.js');
const { defaultEmbed } = require('../embeds');
const { DefaultRoleModel } = require('../database/dbConfig.js');
const chalk = require('chalk');
const { prefix } = require('../discordConfig.json');

module.exports = {
  name: 'setDefaultRole',
  description: 'Sets a default role for the server.',
  args: true,
  usage: '<role ID>',
  guildOnly: true,
  cooldown: 10,
  requiredPermissions: ['ADMINISTRATOR'],
  devOnly: false,
  async execute(msg, args) {
    // eslint-disable-next-line no-unused-vars
    const dClient = msg.client;

    let guideMessage;

    const role = msg.guild.roles.cache.get(args[0]);
    if (!role) {
      return msg.reply(
        new MessageEmbed(defaultEmbed(msg))
          .setTitle(`${this.name} error:`)
          .setDescription(`That doesn't seem to be a role. Make sure you're using a role ID`),
      );
    }
    const checkDB = await DefaultRoleModel.findOne({ serverID: msg.guild.id });
    if(checkDB) {
      return msg.reply(
        new MessageEmbed(defaultEmbed(msg))
          .setTitle(`${this.name} error:`)
          .setDescription(`This server already has a default role.
          You can remove it with ${prefix}delDefaultRole`),
      );
    }

    msg.channel.send(
      new MessageEmbed(defaultEmbed(msg))
        .setTitle(`DefaultRole:`)
        .setDescription(`Are you sure you want to set **${role.name}** as the default role for this server?
        Everyone who joins the server from now on will automatically be given this role.`),
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
                  .setDescription(`⛔ DefaultRole timed out. Please complete setup within 2 minutes.\nError: \`\`\`TIMEOUT\`\`\``),
              ).then(editedM => {
                editedM.delete({ timeout: 3000 });
              })
                .catch(e => console.log(e));
            }
            if (reason === '⛔') {
              guideMessage.edit(
                new MessageEmbed(defaultEmbed(msg))
                  .setTitle(`DefaultRole:`)
                  .setDescription(`⛔ DefaultRole setup has been discarded ⛔`),
              ).then(editedM => {
                editedM.delete({ timeout: 3000 });
              })
                .catch(e => console.log(e));
            }
            if (reason === '✅') {
              await guideMessage.edit(
                new MessageEmbed(defaultEmbed(msg))
                  .setTitle(`DefaultRole:`)
                  .setDescription(`✅ DefaultRole set!`),
              ).then(newM => {
                newM.delete({ timeout: 3000 });
              })
                .catch(e => console.log(e));
              const dbRoleModel = new DefaultRoleModel({
                serverID: msg.guild.id,
                defaultRole: role.id,
              });
              dbRoleModel.save()
                .then(() => {
                  console.log(chalk`{yellow ${role.name}} has been set as the default role for {blue ${msg.guild.name}}`);
                })
                .catch(e => {
                  console.log(e);
                });
            }
          });
      });


  },
};