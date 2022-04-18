// Import Models
const Message = require('../models/message');
// Import Library
const isBase64 = require('is-base64');
// Import Socket
const io = require('../socket');

// Cloudinary for processing images
const { cloudinary } = require('../config/cloudinary');


// POST for General Users
exports.postGeneralChat = async(req, res, next) => {
    try {
        let { message } = req.body;
        // Check if message is an Image
        console.log("message");
        const base64Checker = isBase64(message, {allowMime: true})
        console.log(base64Checker)
        if (base64Checker) {
            // Store image in cloudinary
            console.log("cloudinary")
            const uploadResponse = await cloudinary.uploader.upload(message, {
                upload_preset: 'chat_img'
            });
            // convert image into an Object. Remember message ca take any type
            message = {url: uploadResponse.url, id: uploadResponse.public_id}
        }
        // Save message

        const new_message = await new Message({
            message: message,
            user: req.user.id
        })
        
        const saveMessageToDB = await new_message.save()
        console.log("savedImg",saveMessageToDB);
        // Update Client of a POST Action with saved Message using SOCKET.IO
        // The Client can then push to the object into the list of messages
        io.getIO().emit('general_message', {
            action: 'post_message',
            message: saveMessageToDB
        })

        res.status(200).json({
            message: saveMessageToDB
        });
        
    } catch (err) {
        console.log(err)
        // return error message to the client
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }

}

// GET ALL PUBLIC CHAT

exports.getGeneralChat = async(req, res, next) => {
    try {
        // Get all messages
        const messages = await Message;
        // Send response to the clients
        res.status(200).json({
            messages: messages
        })
    } catch (err) {
        console.log(err)
        // return error message to the client
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Delete message

exports.deleteGeneralChat = async(req, res, next) => {
    try {
        // Get message ID
        const { messageId } = req.params;
        console.log(messageId)
        const delete_message = await Message.filter({
            id: messageId
        }).delete()
        console.log(delete_message);
        // return error message to the client if not found
        if (!delete_message) {
            return res.status(401).json({
                message: "Unable to delete"
            })
        }
        // Update Client of a delete action
        // Sends Message ID so that the client developer can pop the object 
        // from the list using messageId
        io.getIO().emit('general_message', {
            action: 'delete',
            messageId: messageId
        });
        // Send response to the clients
        res.status(200).json({
            message: 'Deleted Successfully'
        })
    } catch (err) {
        console.log(err)
        // return error message to the client
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}