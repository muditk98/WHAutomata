const bluetooth = require('node-bluetooth');

// create bluetooth device instance
const device = new bluetooth.DeviceINQ();

var address = '98:D3:32:20:59:62'
device.findSerialPortChannel(address, function (channel) {
	console.log('Found RFCOMM channel for serial port  ', channel);

	// make bluetooth connect to remote device
	bluetooth.connect(address, channel, function (err, connection) {
		if (err) return console.error(err);
		connection.write(new Buffer('2:1', 'utf-8'), () => {
			console.log("wrote");
		});
	});

});