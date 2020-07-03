const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  messageID : { type: String, required: true },
  emojiRoleMappings : { type: mongoose.Schema.Types.Mixed },
});
module.exports = {
  dbName: 'CozyBot',
  MessageModel: mongoose.model('messages', MessageSchema),
};