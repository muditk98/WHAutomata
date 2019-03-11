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

app.get('/products', (req, res) => {
	res.render('product');
})
app.post('/products', (req, res) => {
	// form that allows us to add product.
	res.send();
})

app.get('/bots', (req, res) => {
	// query bots for location here.
	// pass locations to render
	res.render('bots');
})
app.get('/sensors', (req, res) => {
	res.render('sensors');
})

app.locals.db.once('open', () => {
	app.listen(3000);
})