// use this to insert sample data into your db
// db is whautomata

// check out promises and mongoose
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// https://mongoose.js


let models = require('./models')

let stacks = [
	{
		x: 3,
		y: 3
	},
	{
		x: 4,
		y: 2
	},
	{
		x: 1,
		y: 1
	}
]

let products = [
	{
		name: 'Amul Cheese',
		batch: new Date(2019, 1),
		expiry: new Date(2019, 3)
	},
	{
		name: 'Aloo Bhujia',
		batch: new Date(2019, 0),
		expiry: new Date(2019, 2)
	},
	{
		name: 'Amul Cheese',
		batch: new Date(2019, 2),
		expiry: new Date(2019, 4)
	}
]

/*
// This code also works. I was just trying out different methods of creating documents.
models.mongoose.connection.once('open', async () => {
	try {
		stacks = await models.Stack.create(stacks)
		products = await models.Product.create(products)
		let stackprods = [
			{
				stack: stacks[0]._id,
				product: products[0]._id,
			},
			{
				stack: stacks[2]._id,
				product: products[1]._id,
				count: 3
			},
			{
				stack: stacks[0]._id,
				product: products[1]._id,
				count: 3
			}
		]		
		stackprods = await models.StackProductMap.create(stackprods);
		console.log('Successfully inserted products into stacks');
		console.log(stackprods);
	} catch (error) {
		console.log('Caught an error');
		console.error(err);
	}
	console.log("Closing connection");
	models.mongoose.connection.close()
})

*/

models.mongoose.connection.once('open', async () => {
	stacks = models.Stack.create(stacks)
	products = models.Product.create(products)
	Promise.all([stacks, products])
		.then(([stacks, products]) => {
		// stacks = values[0]
		// products = values[1]
		let stackprods = [
			{
				stack: stacks[0]._id,
				product: products[0]._id,
			},
			{
				stack: stacks[2]._id,
				product: products[1]._id,
				count: 3
			},
			{
				stack: stacks[0]._id,
				product: products[1]._id,
				count: 3
			}
		]
		return models.StackProductMap.create(stackprods);
	})
	.then(stackprods => {
		console.log('Successfully inserted products into stacks');
		console.log(stackprods);
	})
	.catch(err => {
		console.log('Caught an error');
		console.error(err);
	})
	.then(() => {
		console.log("Closing connection");
		models.mongoose.connection.close()
	})
})
