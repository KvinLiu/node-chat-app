let socket = io();

socket.on('connect', function () {
	console.log('Connected to Server!');
	// socket.emit('createMessage', {
	// 	from: 'jen@example.com',
	// 	text: 'Hey, This is Kevin.'
	// });
});

socket.on('newMessage', function (message) {
	console.log('New Message:', message);
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

// socket.on('newEmail', function (email) {
// 	console.log('New email', email);
// });

