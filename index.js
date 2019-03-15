const express = require('express');
// let models = require('./models');
let app = express();
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
app.use(express.static('./css'));
app.set('views', './views');
app.set('view engine', 'pug');
var port=3000;

//app.locals.db = models.mongoose.connection;
//app.locals.db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
	res.render('home');
})

app.get('/products', (req, res) => {
	// page that shows all the products available in a list format and on clicking on each item the user can view product details
	res.render('product');
})
app.post('/products', (req, res) => {
	res.send();
})

app.get('/addProduct',(req,res)=>{
//Add products page
	res.render('addProduct');
})
app.post('/addProduct', (req, res) => {
	//we are taking productName,productId,batch and expiry date in yyyy-mm-dd
	//send message added successfully and redirect to the products page
	//increase the product count and map to stack id in stackProductSchema
	res.send();
})

app.get('/deleteProduct',(req,res)=>{
	//delete products page
		res.render('deleteProduct');
})
app.post('/deleteProduct', (req, res) => {
		//we are taking productId and a confirmation that if you really wanna delete the product
		//send message deleted successfully and redirect to the products page
		res.send();
})

app.get('/product/:id',(req,res)=>{
    var id=req.params.id;
	//extract product details based on the id
	//get stack details and count of products by comparing product id in stackProductMapSchema
    
    res.render('productDetails',{product,stackdetails})
})

app.get('/bots', (req, res) => {
	// query bots for location here.
	// pass locations to render
	res.render('bots');
})
app.get('/bot/:id',(req,res)=>{
	var id=req.params.id;
	//extract bot location and it's status active or not 
	res.render('botDetails',{botDetails});
})
app.get('/sensors', (req, res) => {
	res.render('sensors');
})

// app.locals.db.once('open', () => {
// 	app.listen(3000);
// })
app.get('*',(req,res)=>{
	res.send("This is not a valid URL");
	});
app.post('*',(req,res)=>{
		res.send("This is not a valid URL");
		});
app.listen(port)
console.log("Server is running on Port :",port);
	