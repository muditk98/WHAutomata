const express = require('express');
const bluetooth = require('node-bluetooth')
const axios = require('axios');

let app = express();
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
const device = new bluetooth.DeviceINQ();
const address = '98:D3:32:20:59:62'

app.locals.state = 'idle';
// app.locals.queue = []
// app.locals.lastType = 'return'
app.locals.callback_url = '';
app.locals.location = {
	x: 0,
	y: 0
}
app.locals.nextword = '';
app.locals.buff = ''
device.findSerialPortChannel(address, function (channel) {
	console.log('Found RFCOMM channel for serial port  ', channel);

	// make bluetooth connect to remote device
	bluetooth.connect(address, channel, function (err, connection) {
		if (err) return console.error(err);
		app.locals.bcon = connection
		connection.on('data', (buffer) => {
			console.log('received message:', buffer.toString());
			buffer = buffer.toString()
			
			if (/done/.test(buffer)) {
				app.locals.state = 'idle'
			}
		});
		connection.on('error', (err) => {
			console.log(err);
			
		})
		app.listen(8000 ,() => {
			console.log('Listening on 8000');
			
		})
	});

});

app.post('/tasks', function (req, res) {
		var x = req.body.x
		var y = req.body.y
	if (app.locals.state == 'idle') {
		// send command to arduino here using serial/bluetooth
		app.locals.bcon.write(new Buffer(`g:${x}:${y}`, 'utf-8'), () => {
			console.log('Just wrote to bluetooth');
		})
		res.status(202).send({message: 'Accepted'})
		app.locals.state = 'processing'
		app.locals.callback_url = req.body.callback_url
	} else {
		res.status(503).send({message: 'Bot is busy'})
	}
})

app.post('/kill', (req, res) => {
	app.locals.state = 'idle'
	res.send({message: 'You monster! What have you done! You killed him!!'})
})


app.get('/', function (req, res) {
	res.send({
		status: app.locals.state,
		location: app.locals.location
	})
})


