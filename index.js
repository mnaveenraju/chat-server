let express = require('express');
let app = express();
const config = require('./src/config/app').config;
const bodyParser = require('body-parser');

//handlers
const userHandler = require('./src/handlers/user');
const chatHandler = require('./src/handlers/chat');
const groupHandler = require('./src/handlers/group');

const jwt = require('express-jwt');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());



app.use(jwt({ secret: 'chatapp'}).unless({path: ['/add_user', '/login']}));

app.post('/add_user', userHandler.createUser);
app.post('/login', userHandler.login);
app.get('/list_user', userHandler.listUser);

app.post('/send_msg', chatHandler.sendMsg);
app.get('/get_msgs', chatHandler.getMsgs);

app.post('/add_group', groupHandler.createGroup);

app.listen(config.port, () => {
    console.log('Server running on 3000');
});