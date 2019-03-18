const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;

raspi.init(() => {
	serial = new Serial("/dev/rfcomm0");
	serial.open(() => {
		console.log("Serial connection open");
		serial.on('data', (data) => {
			data = data.toString()
			console.log(data);
		});
		serial.write(new Buffer("AA", 'utf-8'), () => {
			console.log("Written");
		})
	});
});