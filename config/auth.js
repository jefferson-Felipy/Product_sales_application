const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Model de Usuario_
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

module.exports = (passport) => {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'senha'},
        (email,password,done) => {
            Usuario.findOne({email: email}).then(usuario => {
                if(!usuario)
                {
                    return done(null,false,{message: 'Essa conta nao existe, tente novamente ou cadastre-se!'});
                }

                bcrypt.compare(password,usuario.senha,(err,batem) => {
                    if(batem)
                    {
                        return done(null,usuario);
                    }
                    else
                    {
                        return done(null,false,{message: 'senha incorreta!: '+err});
                    }
                });
            });
    }));

    passport.serializeUser((usuario,done) => {
        done(null,usuario._id);
    });

    passport.deserializeUser((id,done) => {
        Usuario.findById(id,(err,usuario) => {
            done(null,usuario);
        });
    });
}