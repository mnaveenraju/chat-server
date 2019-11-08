let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    userName: {
        type: String, unique: true
    },
    password: {
        type: String
    },
    status: {
        type: Boolean, default: false
    },
    groups: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'group' 
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    }]
});

mongoose.model('user', userSchema);