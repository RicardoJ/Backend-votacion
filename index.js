'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;
mongoose.Promise =global.Promise;
mongoose.connect('mongodb://votacion:votacion@ds119585.mlab.com:19585/votacion', (err,res)=>{
    if(err){
        throw err;
    }else{
        console.log('Conexion exitosa a Votacion');
    }
    app.listen(port,()=>{
        console.log("SERVIDOR LOCAL CON NODE Y EXPRESS CORRE CORRCTAMENTE");
    });
});  