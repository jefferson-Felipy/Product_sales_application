"use strict";//Modo Estrito;

const express = require('express');
const Cats = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');

//Criação de variaveis_
let visualCat = '';
let id = '';

//Importando a autenticação admin_
const {eAdmin} = require('../helpers/eAdmin');

//Rota responsável por renderizar o formulário de cadastro de categorias_
Cats.get('/formcats',eAdmin,(req,res) => {
    Categoria.find().lean().then(categorias => {
        res.render('categorias/createCategorias',{categorias:categorias});
    }).catch(err => {
        req.flash('error_msg','Error ao exibir listagens das categorias: '+err);
        res.redirect('/categorias/listcategorias');
    });
});

//Rota responsável por cadastrar as categorias no banco de dados_
Cats.post('/addcategoria',eAdmin,(req,res) => {
    let erros = [];
    let userName = req.body.nome;
    let valid = false;
    visualCat = req.body.nome;

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        if(req.body.nomeCat == 'selected' || req.body.nomeCat == "0"){
            erros.push({texto:'Nome da categoria é necessário! Digite ou escolha!'});
        }
        else{
            userName = req.body.nomeCat;
            valid = true;
        }
    }
    if(req.body.nome.length < 2 && req.body.nome.length > 0){
        erros.push({texto:'Nome da categoria muito pequeno!'});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:'Slug da categoria inválido!'});
    }
    if(req.body.slug.length < 2 && req.body.slug.length > 0){
        erros.push({texto:'Slug da categoria muito pequeno!'});
    }

    if(erros.length > 0){
        res.render('categorias/createCategorias',{erros:erros});
    }
    else{

        Categoria.findOne({nome: req.body.nome}).then(categoria => {
            if(categoria){
                req.flash("error_msg","Essa categoria já está criada, escolha ela nas opções!");
                res.redirect('/categorias/formcats');
            }
            else{
               
                // ========================================
               if(valid == true){
                    const newCategoria = {
                        slug: req.body.slug
                    }
        
                    new Categoria(newCategoria).save().then(() => {
                        req.flash('success_msg','Sucesso ao salvar categoria!');
                        res.redirect('/categorias/formcats')
                    }).catch(err => {
                        req.flash('error_msg','Error ao salvar categoria: '+err);
                        res.redirect('/categorias/formcats');
                    });
               }
               // ========================================

               if(valid == false){
                    const newCategoria = {
                        nome: userName,
                        slug: req.body.slug
                    }

                    new Categoria(newCategoria).save().then(() => {
                        req.flash('success_msg','Sucesso ao salvar categoria!');
                        res.redirect('/categorias/formcats')
                    }).catch(err => {
                        req.flash('error_msg','Error ao salvar categoria: '+err);
                        res.redirect('/categorias/formcats');
                    });
               }// ========================================
                

            }
        }).catch(err => {
            req.flash('error_msg','Error ao exibir listagens das categorias: '+err);
            res.redirect('/categorias/listcategorias');
        });
    }
});

//Rota responsável por listar as categorias_
Cats.get('/listcategorias',eAdmin,(req,res) => {
    
        Categoria.find().lean().sort({date: 'desc'})
        .then((categorias) => {
            let tamanho = categorias.length;

            res.render('categorias/ListCategorias',{categorias:categorias,tamanho:tamanho});
        }).catch(err => {
            req.flash('error_msg','Error ao listar categorias: '+err);
            res.redirect('/categorias/formcats');
        });
    
});

//Rotas responnsável por editar ascategorias_
//Essa rota além de renderizar o formulário de edição de categorias, ela tambem vai exibir os
//dados atuais da categoria que será editada;
Cats.get('/editarcats/:id',eAdmin,(req,res) => {
    Categoria.find().lean().then(categorias => {
        Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
            res.render('categorias/updateCategorias',{categoria:categoria,categorias:categorias});
        }).catch(err => {
            req.flash('error_msg','Error ao exibir dados da categorias: '+err);
            res.redirect('/categorias/listcategorias');
        });
    }) .catch(err => {
        req.flash('error_msg','Error ao exibir listagens das categorias: '+err);
        res.redirect('/categorias/listcategorias');
    });
});

//Essa rota irá editar os valores dos campos das categorias no banco de dados_
Cats.post('/editadocats',eAdmin,(req,res) => {
    let erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:'Nome da categoria inválido!'});
    }
    if(req.body.nome.length < 2 && req.body.nome.length > 0){
        erros.push({texto:'Nome da categoria muito pequeno!'});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:'Slug da categoria inválido!'});
    }
    if(req.body.slug.length < 2 && req.body.slug.length > 0){
        erros.push({texto:'Slug da categoria muito pequeno!'});
    }

    if(erros.length > 0){
        res.render('categorias/updateCategorias',{erros:erros});
    }
    else{
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
            if(categoria.nome == req.body.nome){
                req.flash("error_msg","categoria já criada, escolha as opções!");
                res.redirect('/categorias/formcats');
            }
            else{
                categoria.nome = req.body.nome
                categoria.slug = req.body.slug
    
                categoria.save().then(() => {
                    req.flash("success_msg","Sucesso ao salvar edição da categoria!");
                    res.redirect('/categorias/listcategorias');
                }).catch(err => {
                    req.flash("error_msg","Error ao salvar edição da categoria!: "+err);
                    res.redirect('/categorias/listcategorias');
                });     
            }
        }).catch(err => {
            req.flash("error_msg","Error ao editar categoria!: "+err);
            res.redirect('/categorias/listcategorias');
        });
    }
});

//Rota responsável por deletar as categorias do banco de dados_
Cats.post('/deletarcat/:id',eAdmin,(req,res) => {
    Categoria.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg","Sucesso ao deletar categoria!");
        res.redirect('/categorias/listcategorias');
    }).catch(err => {
        req.flash("error_msg","Error ao deletar categoria!: "+err);
        res.redirect('/categorias/listcategorias');
    });
});

//Rota responsável por listar as categorias na página de listagens dos nomes das categorias_
Cats.get('/categorias',(req,res) => {
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
        res.render('categorias/categorias',{categorias:categorias,visualCat:visualCat});
        console.log("valor da variavel: "+visualCat);
    }).catch(err => {
        req.flash("error_msg","Error ao listar categorias: "+err);
        res.redirect('/');
    });
});

module.exports = Cats;