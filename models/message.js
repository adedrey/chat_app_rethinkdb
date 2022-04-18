/**
 *
 *-------- MESSAGE SCHEMA -----------
 *
 * Defines the message, initiator, userId, chatId and timestamp
 *
 *
 * message: contains the content of the message, whether string, image or anything
 * userId: contains the user object
 * chat: contains the chat object
 * timestamp: shows created and updated time
 */

var thinky = require("../config/database");
var User = require("./users");
var {r, type}= thinky;

var Message = thinky.createModel('Message', {
  id: type.string(),
  message: type.string(),
  user: type.string(),
  createdAt: type.date().default(r.now()),
});


// Message.ensureIndex("user");
// Message.belongsTo(User, "user", "user", "id");

module.exports = Message;
