const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/whautomata', {
	useNewUrlParser: true,
});
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;


// Created a schema for stack. Refer diagram from ppt
var StackSchema = new mongoose.Schema({
	x: {
		type: Number,
		min: 0,
		required: true
	},
	y: {
		type: Number,
		min: 0,
		required: true
	},
	processing: {
		type: Boolean,
		default: false
	}
})
// make sure that only one stack can be on a location
StackSchema.index({x: 1, y: 1}, {unique: true});

var Stack = mongoose.model('Stack', StackSchema);

// Created Product schema. Only name is a required field
var ProductSchema = new mongoose.Schema({
	name: {type: String, required: true},
	batch: {type: Date, required: true},
	expiry: Date
})
ProductSchema.index({name: 1, batch: 1}, {unique: true})
var Product = mongoose.model('Product', ProductSchema);

// StackProductMap holds stack id, product id, and product count. 
// Also see mongoose populate. 
// https://mongoosejs.com/docs/populate.html

var StackProductMapSchema = new mongoose.Schema({
	stack: {type: mongoose.Schema.Types.ObjectId, ref: 'Stack', required: true},
	product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
	count: {
		type: Number,
		min: 1,
		required: true,
		default: 1
	}
})
var StackProductMap = mongoose.model('StackProductMap', StackProductMapSchema);

// adding exports

exports.Stack = Stack;
exports.Product = Product;
exports.StackProductMap = StackProductMap;
exports.mongoose = mongoose;

/* Stack.find()
.then(data => {
	console.log(data);
})
.then(() => {
	mongoose.disconnect();
})
.catch(err => {
	console.log("Failed to insert");
	mongoose.disconnect();
}) */
