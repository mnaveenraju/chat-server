let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let chatSchema = new Schema({
    message: {
        type: String
    },
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    sentOn: {
        type: Date
    },
    deliveredOn: {
        type: Date
    },
    isRead: {
        type: Boolean, default: false
    }
});

mongoose.model('chat', chatSchema);