"use strict";//Modo Estrito;

//Importando os modulos e os armazenando nas constantes, as quais serão as principais do app_
const express = require('express');
const User = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const passport = require('passport');
const bcrypt = require('bcryptjs');

//Rota responsável por renderizar o formulário de login do usuario na aplicação_
User.get('/formlogin',(req,res) => {
    res.render('usuarios/login');
});

//Rota responsável por autenticar o usuario que estar tentando logar na aplicação_
User.post('/login',(req,res,next) => {
    passport.authenticate("local",{
        successRedirect: '/',
        failureRedirect: '/usuarios/formlogin',
        failureFlash: true
    })(req,res,next);
});

//Rota responsável por renderizar o formulário de cadastro do usuario na aplicação_
User.get('/formcadastro',(req,res) => {
    res.render('usuarios/cadastro');
});

//Rota responsável por cadastrar o usuario no banco de dados_
User.post('/cadastroruser',(req,res) => {
    let erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Campo nome inválido!'});
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome muito pequeno!'});
    }//-------------------

    if(!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.sobrenome == null){
        erros.push({texto: 'Campo Sobrenome inválido!'});
    }
    if(req.body.sobrenome.length < 2){
        erros.push({texto: 'Sobrenome muito pequeno!'});
    }//-------------------

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'Campo Email inválido!'});
    }
    if(req.body.email !== req.body.email2){
        erros.push({texto: 'E-mails diferentes!'});
    }//-------------------

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Campo Senha inválido!'});
    }
    if(req.body.senha.legth < 4){
        erros.push({texto: 'Senha muito pequena!'});
    }
    if(req.body.senha !== req.body.senha2){
        erros.push({texto: 'Senhas diferentes!'});
    }//-------------------

    if(erros.length > 0){
        res.render('usuarios/cadastro',{erros:erros});
    }
    else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg","Email já cadastrado no banco!");
                res.redirect('/usuarios/formcadastro');
            }
            else{
                const newUsuario = new Usuario({
                    nome: req.body.nome,
                    sobrenome: req.body.sobrenome,
                    email: req.body.email,
                    eAdmin: req.body.eAdmin,
                    senha: req.body.senha
                });
            
                let adm = '';
                if(req.body.eAdmin == 1) adm = 'administrador';

                bcrypt.genSalt(10,(erro,salt) => {
                    bcrypt.hash(newUsuario.senha,salt,(erro,hash) => {
                        if(erro)
                        {
                            req.flash("error_msg","Erro ao salvar usuarios!");
                            res.redirect('/usuarios/formcadastro');
                        }
    
                        newUsuario.senha = hash;
    
                        newUsuario.save().then(() => {
                            req.flash("success_msg",`Usuario ${adm} cadastrado com sucesso!`);
                            res.redirect('/usuarios/formcadastro');
                        }).catch(err => {
                            req.flash("error_msg","Erro ao cadastrar usuario no banco!");
                            res.redirect('/usuarios/formcadastro');
                        });
                        
                    });
                });
            }
            
        }).catch(err => {
            res.flash("error_msg","Error interno no sistema!: "+err);
            res.redirect('/usuarios/formcadastro');
         });
    }
});

//Rota responsável por fazer o logout do usuario na aplicação_
User.get('/logout',(req,res,next) => {
    req.logout(err => {
        if(err)
        {
            return next(err);
        }
        req.flash("success_msg","Deslogado com sucesso!");
        res.redirect('/');
    });
});


module.exports = User;