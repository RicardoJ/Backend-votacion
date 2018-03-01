'use strict'
//modulos
var bycrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
//modelos

var User = require('../models/user');
//servicios jwt
var jwt = require('../services/jwt');
//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: ' Probando controlador usuario y accion pruebas',
        user: req.user
    });
};
//sguardar nuevo usuario
function saveUser(req, res) { // req peticion y res respuesta
    //crear el objeto del usuario
    var user = new User();

    //Recorger parametros peticion
    var params = req.body; // recoge todos los datos en la peticion , que llega por post

    //asignar valores al objeto usuario

    if (params.password && params.name && params.surname && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({
            email: user.email.toLowerCase()
        }, (err, issetUser) => {
            if (err) {
                res.status(500).send({
                    message: 'Error al comprobar al usuario'
                });
            } else {
                if (!issetUser) {
                    //cifrar contraseña
                    bycrypt.hash(params.password, null, null, function (err, hash) {
                        user.password = hash;
                        //guardar usuario en bd
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Error al guardar al usuario'
                                });

                            } else {
                                if (!userStored) {
                                    res.status(404).send({
                                        message: 'No se ha registrado el usuario'
                                    });
                                } else {
                                    res.status(200).send({
                                        user: userStored
                                    });
                                }
                            }

                        });
                    });
                } else {
                    res.status(200).send({
                        message: 'Usuario no puede registrarse'
                    });
                }
            }
        });

    } else {
        res.status(200).send({
            message: 'Introduce los datos correctamente para poder registrar al usuario'
        });
    }



}

function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: 'Error al comprobar al usuario'
            });
        } else {
            if (user) {
                bycrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        //comprobar y generar token
                        if (params.gettoken) {
                            //devolver el token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });

                        } else {
                            res.status(200).send({
                                user
                            });
                        }

                    } else {
                        res.status(404).send({
                            message: 'El usuario no ha podido loguearse correctamente'
                        });
                    }
                });

            } else {
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse'
                });
            }
        }
    });

}

function updateUser(req, res) {
    var userId = req.params.id; //params contiene parámetros de ruta
    var update = req.body;
    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({
            message: 'no tienes permiso para actualizar'
        })
    }
    User.findByIdAndUpdate(userId, update, {
        new: true
    }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar usuario'
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    message: 'no se ha podido actualizar usuario'
                })
            } else {
                res.status(200).send({
                    user: userUpdated
                })
            }
        }
    });


}





   

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser
   
};