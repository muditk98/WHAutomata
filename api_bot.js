const express = require('express');
let app = express();
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());

app.locals.state = 'idle';
// app.locals.queue = []
// app.locals.lastType = 'return'
app.locals.callback_url = '';
app.post('/tasks', function (req, res) {
	coords = {
		x: req.body.x,
		y: req.body.y
	}
	if (app.locals.state == 'idle') {
		// send command to arduino here using serial/bluetooth
		app.locals.state == 'processing'
		app.locals.callback_url = req.body.callback_url
		res.status(202).send({message: 'Accepted'})
	} else {
		res.status(503).send({message: 'Bot is busy'})
	}
})

app.get('/', function (req, res) {
	res.send({
		status: app.locals.state,
		location: null, // rocation o oshiete kudasai

	})
})

app.listen(8000)