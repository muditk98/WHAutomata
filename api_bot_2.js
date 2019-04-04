const express = require('express');
const bluetooth = require('node-bluetooth')
const axios = require('axios');

let app = express();
app.use(express.urlencoded({
	extended: true
}));

app.use(express.json());

delete process.env['http_proxy'];
delete process.env['HTTP_PROXY'];
delete process.env['https_proxy'];
delete process.env['HTTPS_PROXY'];

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
app.locals.cmd = 'g'
app.locals.nextword = '';
app.locals.buff = ''
device.findSerialPortChannel(address, function (channel) {
	console.log('Found RFCOMM channel for serial port  ', channel);

	// make bluetooth connect to remote device
	bluetooth.connect(address, channel, function (err, connection) {
		if (err){
			console.error(err);
			console.log('Disconnected');
		} 
		app.locals.bcon = connection
		connection.on('data', (buffer) => {
			console.log('received message:', buffer.toString());
			buffer = buffer.toString()
			var message = '';
			if (/[$]?done/.test(buffer)) {
				message = 'done';
			} else if (/[$]?rfiderr/.test(buffer)) {
				message = 'rfiderr'
			} else if (/[$]?aborted:\d+:\d+/.test(buffer)) {
				message = 'aborted'
				app.locals.location = {
					x: buffer.split(':')[1],
					y: buffer.split(':')[2]
				}
			}
			if (message) {
				app.locals.state = 'idle'
				axios.post(app.locals.callback_url, {
					message: message,
					location: app.locals.location,
					cmd: app.locals.cmd
				})
				.then(response => {
					console.log(response.status);
					console.log(response.data);
				})
				.catch(ax_err => {
					console.log(ax_err.message);
				})
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
		var x = req.body.x || 0
		var y = req.body.y || 0
		var cmd = req.body.cmd.toLowerCase() || 'g'
		if (cmd == 's') {
			x = 1
			y = 1
		}
	if (cmd == 'a' || (app.locals.state == 'idle' && ['r', 'g', 's'].includes(cmd))) {
		// send command to arduino here using serial/bluetooth
		var package = cmd + (['r','g'].includes(cmd)?`:${x}:${y}`:'') + (cmd=='g'?':611703943':'')
		console.log(package);
		app.locals.bcon.write(new Buffer(package, 'utf-8'), () => {
			console.log('Just wrote to bluetooth');
		})
		res.status(202).send({message: 'Accepted'})
		app.locals.state = 'processing'
		app.locals.cmd = cmd;
		app.locals.location = {
			x: x,
			y: y
		}
		app.locals.callback_url = req.body.callback_url
	} else {
		res.status(503).send({message: 'Bot is busy'})
	}
})

app.post('/kill', (req, res) => {
	app.locals.state = 'idle'
	res.send({message: 'Bot is now idle'})
})


app.get('/', function (req, res) {
	res.send({
		status: app.locals.state,
		location: app.locals.location
	})
})


