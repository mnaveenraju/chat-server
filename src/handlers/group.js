const mongoose = require('mongoose');
const groupMdl = mongoose.models.group;
const userMdl = mongoose.models.user;

let group = {
    createGroup: async (req, response) => {
        try {
            const body = req.body;

            let addGroupData = {
                name: body.name,
                groupMembers: body.members
            };

            const group = new groupMdl(addGroupData)

            let addGroupRes = await group.save();
            
            await userMdl.update({_id: {$in: body.members}}, {$push: {groups: group._id}});

            response.send({status: 200, message: 'Group created succesfully', res: addGroupRes})
        } catch (err) {
            response.status(500).send('Create group failed')
        }
    },
    listGroup: async (req, response) => {
        try {
            let groupList = await groupMdl.find();

            response.send({status: 200, message: 'Success', res: groupList})
        } catch (err) {
            response.status(500).send('Get groups failed')
        }
    },
}


module.exports = group;