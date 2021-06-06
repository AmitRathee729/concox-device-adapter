const net = require('net');

/***** Protcol numbers *****/
const StartBit = '7878'
const LoginProtocal = '01';
const HeartBeat = '23';
const GPSposition = '22';
const StopBit = '0D0A'

/***** create tcp server *****/
const server = net.createServer(socket => {
  /***** connection' listener. *****/
  console.log('client connected');
  
  /***** listen data socket event. There we will get data which is passed by the client. *****/
  socket.on('data', data => {

    /***** covert data buffer in string format *****/
    data = data.slice().toString('hex');

    /***** check start bit is valid *****/
    if (data.substr(0,4) === StartBit){
      console.log(data.length);
      /***** check if hex code matched with HeartBeat protocol *****/
      if(data.substr(6,2) === LoginProtocal && data.length === 44){
        console.log('login packet')
        /***** data is as according to the LoginProtocal *****/
        data = `${StartBit}05${LoginProtocal}00059FF8${StopBit}`;

        /***** responds to the login packet *****/
        socket.write(Buffer.from(data, 'hex'));

        /***** check if hex code matched with HeartBeat protocol *****/
      } else if (data.substr(6,2) === HeartBeat && data.length === 32){
        console.log('heart beat packet');
        /***** data is as according to the heartbeat *****/
        data = `${StartBit}05${HeartBeat}0100670E${StopBit}`;

        /***** responds to the heartbeat packet *****/
        socket.write(Buffer.from(data, 'hex'));

        /***** check if hex code matched with gps protocol *****/
      } else if (data.substr(6, 2) === GPSposition && data.length === 78){
        console.log('gps packet')
      } else {
        console.log('Doesnot matched with LoginProtocal or HeartBeat or GPS packet hex')
      }

    } else {
      console.log('Invaild packet hex')
    }
  });

  /***** time out if there is no socket/tcp connection ****/
  // socket.setTimeout(5000);
  // socket.on('timeout', () => {
  //   console.log('heartbeat packet is timeout')
  //   socket.end();
  // });
  // server.once('close', () => {
  //   console.log('Connection Close');
  // });

});

/***** if server get error then throw error ****/
server.on('error', (err) => {
  throw err;
});

/***** server is listening on port 3000 *****/
server.listen(3000, () => {
  console.log('server connected');
});