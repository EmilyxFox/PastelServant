const { MessageEmbed } = require('discord.js');
const { defaultEmbed } = require('../embeds');
const { DefaultRoleModel } = require('../database/dbConfig.js');
const chalk = require('chalk');

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

    const role = msg.guild.roles.cache.get(args[0]);
    if (!role) {
      return msg.reply(
        new MessageEmbed(defaultEmbed(msg))
          .setTitle(`${this.name} error:`)
          .setDescription(`That doesn't seem to be a role. Make sure you're using a role ID`),
      );
    }

    // eslint-disable-next-line no-async-promise-executor
    const alreadyAssignedCheck = new Promise(async (resolve, reject) => {
      const checkDB = await DefaultRoleModel.findOne({ serverID: msg.guild.id });
      try {
        if(checkDB) {
          const oldRole = msg.guild.roles.cache.get(checkDB.defaultRole);
          msg.channel.send(
            new MessageEmbed(defaultEmbed(msg))
              .setTitle(`DefaultRole:`)
              .setDescription(`This server already has ${oldRole.name} as its default role.
              Are you sure you want to overwrite it with ${role.name}?`),
          ).then(_m => {resolve(_m);});
        } else {
          msg.channel.send(
            new MessageEmbed(defaultEmbed(msg))
              .setTitle(`DefaultRole:`)
              .setDescription(`Are you sure you want to set **${role.name}** as the default role for this server?
              Everyone who joins the server from now on will automatically be given this role.`),
          ).then(_m => {resolve(_m);});
        }
      } catch (e) {
        reject(e);
      }
    });

    alreadyAssignedCheck.then(async m => {
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
            await m.edit(
              new MessageEmbed(defaultEmbed(msg))
                .setTitle(`DefaultRole:`)
                .setDescription(`⛔ DefaultRole timed out. Please complete setup within 2 minutes.\nError: \`\`\`TIMEOUT\`\`\``),
            ).then(_m => {
              _m.delete({ timeout: 3000 });
            })
              .catch(e => console.log(e));
          }
          if (reason === '⛔') {
            m.edit(
              new MessageEmbed(defaultEmbed(msg))
                .setTitle(`DefaultRole:`)
                .setDescription(`⛔ DefaultRole setup has been discarded ⛔`),
            ).then(_m => {
              _m.delete({ timeout: 3000 });
            })
              .catch(e => console.log(e));
          }
          if (reason === '✅') {
            await m.edit(
              new MessageEmbed(defaultEmbed(msg))
                .setTitle(`DefaultRole:`)
                .setDescription(`✅ DefaultRole set!`),
            ).then(newM => {
              newM.delete({ timeout: 3000 });
            })
              .catch(e => console.log(e));

            DefaultRoleModel.deleteMany({ serverID: msg.guild.id }, (error, deleted) => {
              if (error) {
                console.log(error);
              }
              if (deleted.deletedCount > 0) {
                console.log(chalk`Deleted ${deleted.deletedCount} document(s) from database for {blue ${msg.guild.name}}. ${deleted.deletedCount > 1 ? `If this number is more than 1 an error is likely to have occured.` : ''}`);
              }
            });
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