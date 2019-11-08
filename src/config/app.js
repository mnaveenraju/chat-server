let config = {
    host: "localhost",
    port: "3000",
    mongoUrl: 'mongodb://localhost:27017/chat'
};

const mongoose = require('mongoose');
mongoose.connect(config.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true });

const fs = require('fs');
const path = require('path');

const models = fs.readdirSync('./src/models');

models.forEach(model => require(path.join('../models/', model)));

exports.config = config;