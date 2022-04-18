/**
 *
 *-------- USER SCHEMA -----------
 *
 * Defines the user name, email, username, and passport
 * name: defines user's names
 * email: defines user's email
 * username: defines user's usernmae
 * hash and salt: used by passport
 * otp: otp for auth
 * otpExpiration: for auth
 * timestamp: defines created and updated time
 */
var thinky = require("../config/database");
var Message = require("./message");
var {r, type}= thinky;
var User = thinky.createModel("User", {
    id: type.string(),
    name: type.string(),
    email: type.string(),
    username: type.string(),
    hash: type.string(),
    salt: type.string(),
    otp: type.string(),
    otpExpirationTime: type.date(),
    createdAt: type.date().default(r.now()),
});
// User.hasAndBelongsToMany(Message, "messages", "id", "user")

module.exports = User;
