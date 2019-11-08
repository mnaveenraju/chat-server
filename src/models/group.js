let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let groupSchema = new Schema({
    name: {
        type: String, unique: true
    },
    groupMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'chat'
        }]
});

mongoose.model('group', groupSchema);