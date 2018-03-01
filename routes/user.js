'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router();
var md_auth = require('../middlewares/autheticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'});

api.get('/pruebas-del-controlador',md_auth.ensureAuth, UserController.pruebas);
// por post por que cuando se va  guardar un nuevo recurso , apirest
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);

module.exports = api;  