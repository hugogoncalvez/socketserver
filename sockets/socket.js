const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Soda Stereo'));
bands.addBand(new Band('virus'));
bands.addBand(new Band('Depeche Mode'));
bands.addBand(new Band('The Cure'));

console.log(bands);

// mensages de sockets
io.on('connection', client => {
    console.log('Cliente conectado')

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
    }); // callBack cuando un cliente en particular se desconecte

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!!', payload);
        io.emit('mensaje', { admin: 'nuevo mensaje' });
    });

    client.on('voto', (payload) => {        
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands()); //este mensaje se envia a todos
    });


    client.on('nueva', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('borrar', (payload) => {        
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands()); //este mensaje se envia a todos
    });

    // client.on('emitir-mensaje', (payload)=>{
    //    // console.log(payload);
    //    // io.emit('nuevo-mensaje', payload);  esto se lo emite a todos
    //    client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos al que lo emitió
    // })


});