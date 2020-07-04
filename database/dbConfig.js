const mongoose = require('mongoose');
const { botName } = require('../discordConfig.json');
const MessageSchema = new mongoose.Schema({
  messageID : { type: String, required: true },
  emojiRoleMappings : { type: mongoose.Schema.Types.Mixed },
});
module.exports = {
  dbName: botName,
  MessageModel: mongoose.model('messages', MessageSchema),
};