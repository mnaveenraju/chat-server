const mongoose = require('mongoose');
const userMdl = mongoose.models.user;

let user = {
    createUser: async (req, response) => {
        try {
            const body = req.body;

            let addUserData = {
                firstName: body.firstName,
                lastName: body.lastName,
                userName: body.userName,
                password: await internals.encryptPassword(body.password)
            };

            const user = new userMdl(addUserData)

            let addUserRes = await user.save();
            delete addUserRes.password;
            response.send({status: 200, message: 'User added succesfully', res: addUserRes})
        } catch (err) {
            response.status(500).send('Create user failed')
        }
    },

    getUser: async (req, response) => {
        try {
            let userId = req.params.userId;
            let user = await userMdl.findById(userId);

            response.send({status: 200, message: 'Success', res: user})
        } catch (err) {
            response.status(500).send('Get user failed')
        }
    },

    listUser: async (req, response) => {
        try {
            let userList = await userMdl.find().select({password: 0, userName: 0});

            response.send({status: 200, message: 'Success', res: userList})
        } catch (err) {
            response.status(500).send('Get user failed')
        }
    },

    login: async (req, response) => {
        try {
            const body = req.body;
            let user = await userMdl.findOne({userName: body.userName});
            if (user && user._id) {
                await internals.validatePassword(body.password, user.password);
                const token = await internals.generateToken(user._id)

                const loginres = {
                    token: token,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    id: user._id
                };
                response.send({status: 200, message: 'Logged in success', res: loginres})
            } else {
                response.status(404).send('User not registered')
            }
        } catch (err) {
            response.status(500).send('Login user failed')
        }
    }

}

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

let internals = {

    encryptPassword: (password) => {
        return new Promise((resolve, reject) => {
            resolve(bcrypt.hashSync(password, 10));
        });
    },

    validatePassword: (password, hash) => {
        return new Promise((resolve, reject) => {
            bcrypt.compareSync(password, hash)? resolve(true): reject("Invalid password");
        });
    },

    generateToken: (userId) => {
        return new Promise((resolve, reject) => {
            const token = jwt.sign({userId: userId}, 'chatapp');

            resolve(token)
        })
    }
}


module.exports = user;