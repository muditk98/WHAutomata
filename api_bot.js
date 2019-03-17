const express = require('express');
const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
const axios = require('axios');

let app = express();
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());

app.locals.state = 'idle';
// app.locals.queue = []
// app.locals.lastType = 'return'
app.locals.callback_url = '';
app.locals.location = {
	x: 0,
	y: 0
}
raspi.init(() => {
	app.locals.serial = new Serial("/dev/rfcomm0");
	app.locals.serial.open(() => {
		app.locals.serial.on('data', (data) => {
			data = data.toString()
			console.log(data);
			if (data == 'done') {
				app.locals.state = 'idle';
				axios.post(app.locals.callback_url,
					{
						message: done
					}
				).then(response => {
					console.log(body);
				})
				.catch(err => {
					console.log(err);
				})
			} else if (/\d+:\d+/.test(data)) {
				app.locals.location = {
					x: data.split(':')[0],
					y: data.split(':')[1]
				}
			}
		});
	});
	app.listen(8000, () => {
		console.log("Server started on 8000");
	})
});

app.post('/tasks', function (req, res) {
		var x = req.body.x
		var y = req.body.y
	if (app.locals.state == 'idle') {
		// send command to arduino here using serial/bluetooth
		res.status(202).send({message: 'Accepted'})
		setTimeout(
			() => {
				app.locals.serial.write(`g:${x}:${y}`)
			}, 0)
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


