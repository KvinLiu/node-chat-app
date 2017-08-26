const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use('/', express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	// socket.emit('newEmail', {
	// 	from: 'mike@example.com',
	// 	text: 'Hey, What is going on.',
	// 	createdAt: 123
	// });
	// socket.emit('newMessage', {
	// 	form: 'Mike@example.com',
	// 	text: 'Hey, What\' going on',
	// 	createdAt: 221133
	// });

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.')
		}

		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);
		//socket.leave('The Office Fans');
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		// io.emit -> io.to('The Office Fans').emit
		// socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
		// socket.emit

		// socket.emit from Admin text Welcome to the chat app
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
		// socket.broadcast.emit from Admin text New user joined
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		console.log('Create Message', message);
		// io.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// })
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	// socket.on('createEmail', (newEmail) => {
	// 	console.log('createEmail', newEmail);
	// });

	socket.on('disconnect', () => {
		let user = users.removeUser(socket.id);
		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
	})
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

