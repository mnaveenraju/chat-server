const mongoose = require('mongoose');
const chatMdl = mongoose.models.chat;
const userMdl = mongoose.models.user;
const groupMdl = mongoose.models.group;

let chat = {
    sendMsg: async (req, response) => {
        try {
            const body = req.body;

            let addMsgData = {
                message: body.message,
                fromId: req.user.userId,
                sentOn: new Date().toUTCString(),
                isRead: false
            };

            if(body.userId) {
                addMsgData.toUser = body.userId;
            }

            else if(body.groupId) {
                addMsgData.toGroup = body.groupId;
            }

            const msg = new chatMdl(addMsgData)
            let addMsgRes = await msg.save();

            if(body.userId) {
                await userMdl.update({_id: body.userId}, {$push: {messages: addMsgRes._id}});
            }

            else if(body.groupId) {
                await groupMdl.update({_id: body.groupId}, {$push: {messages: addMsgRes._id}});
            }

            response.send({status: 200, message: 'Message sent succesfully', res: addMsgRes})
        } catch (err) {
            response.status(500).send('Message sending failed');
        }
    },

    getMsgs: async (req, response) => {
        try {
            let userId = req.user.userId;
            let user = await userMdl.findById(userId).select({password: 0})
            .populate('messages')
            .populate({
                path: 'groups',
                select: {'groupMembers': 0},
                populate: {
                    path: 'messages'
                }
                });
            ///let messages = await chatMdl.find({$or: [{toUser: user._id}, {toGroup: {$in: user.groups}}]})
            response.send({status: 200, message: 'Success', res: user})
        } catch (err) {
            response.status(500).send('Get messages failed');
        }
    },

    getUserMsgs: async (req, response) => {
        try {
            const body = req.body;
            let userId = req.user.userId;
            let toId = body.toId;
            let msgs;
            if (body.chatType=='group') {
                msgs = await groupMdl.findById(body.toId).sort({sentOn: 1})
                .populate('messages')
            } else {
               msgs = await chatMdl.find({fromId: userId, toUser: toId}).sort({sentOn: 1})
                .populate({
                    path: 'toUser',
                    select: {'firstName': 1, lastName: 1}
                    });
            }
            ///let messages = await chatMdl.find({$or: [{toUser: user._id}, {toGroup: {$in: user.groups}}]})
            response.send({status: 200, message: 'Success', res: msgs})
        } catch (err) {
            response.status(500).send('Get messages failed');
        }
    }

}

module.exports = chat;