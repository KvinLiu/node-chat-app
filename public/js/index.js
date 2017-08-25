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
	let li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`);

	jQuery('#messages').append(li);
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

// socket.emit('createMessage', {
// 	from: 'Frank',
// 	text: 'Hi'
// }, function (data) {
// 	console.log('Got it', data);
// });
// socket.on('newEmail', function (email) {
// 	console.log('New email', email);
// });

socket.on('newLocationMessage', function (message) {
	let li = $('<li></li>');
	let a = $('<a target="_blank">My current location</a>');
	li.text(`${message.from}: `);
	a.attr('href', message.url);
	li.append(a);
	$('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message]').val()
	}, function () {

	});
});

let locationButton = $('#send-location');

locationButton.on('click', function (e) {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}

	navigator.geolocation.getCurrentPosition(function (position) {
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		})
	}, function () {
		alert('Unable to fetch location.');
	})
});