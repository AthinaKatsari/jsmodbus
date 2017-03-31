/**
 * Created by sarko on 30-Mar-17.
 */

var net = require('net');
var datetime = require('node-datetime');
var thistimeis=datetime.create();
var stampit = require('stampit'),
    modbus = require('jsmodbus');
require('mocha');
require('sinon');
var checker  = true ;
var iptoconnectsocket=null;
var porttoconnect=null;

var tcpserver = net.createServer(function(socket) {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('Time :' + new Date(thistimeis.now()) + 'CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);

    // Add a 'data' event handler to this instance of socket
    socket.on('data', function(data) {
        checker = false;
        iptoconnectsocket = socket.remoteAddress;
        porttoconnect = socket.remotePort;
        console.log('DATA ' + socket.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        socket.write('You said "' + data + '"');
        var client = modbus.client.tcp.complete({
            'host': iptoconnectsocket,
            'port': 502,
            'autoReconnect': true,
            'reconnectTimeout': 1000,
            'timeout': 5000,
            'unitId': 1
        });

        client.connect();

        client.readHoldingRegisters(13312, 11).then(function (resp) {

            // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ], payload: <Buffer> }
            console.log(resp);

        }, console.error);

    });
    // Add a 'close' event handler to this instance of socket
    socket.on('close', function(data) {
        console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
    });
});

tcpserver.listen(502, '192.168.3.4');
tcpserver.date='hell yeah';
tcpserver.close();

/*if (tcpserver.on){
    tcpserver.close()

    var stampit = require('stampit'),
        modbus = require('jsmodbus');

    var server = modbus.server.tcp.complete({ port : 502, responseDelay :100, logLevel:'debug'});

    server.init;


    console.log(server);
}*/



