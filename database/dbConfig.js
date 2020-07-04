const { botName } = require('../discordConfig.json');

const mongoose = require('mongoose');
const reactionRolesSchema = new mongoose.Schema({
  messageID : { type: String, required: true },
  emojiRoleMappings : { type: mongoose.Schema.Types.Mixed },
});
const defaultRoleSchema = new mongoose.Schema({
  serverID: { type: String, required: true },
  defaultRole: { type: String },
});
module.exports = {
  dbName: botName,
  ReactionRolesModel: mongoose.model('reactionRoles', reactionRolesSchema),
  DefaultRoleModel: mongoose.model('defaultRoles', defaultRoleSchema),
};