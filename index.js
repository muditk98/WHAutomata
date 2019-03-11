const express = require('express');
let models = require('./models');
let app = express();
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
app.use(express.static('./css'));
app.set('views', './views');
app.set('view engine', 'pug');

app.locals.db = models.mongoose.connection;
app.locals.db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
	res.render('home');
})
app.get('/bots', (req, res) => {
	res.render('bots');
})
app.get('/sensors', (req, res) => {
	res.render('sensors');
})