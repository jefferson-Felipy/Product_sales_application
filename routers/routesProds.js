"use strict";//Modo Estrito;

const express = require('express');
const Prods = express.Router();
const mongoose = require('mongoose');
require('../models/Produtos');
const Produto = mongoose.model('produtos');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');

//Importando a autenticação admin_
const {eAdmin} = require('../helpers/eAdmin');

Prods.get('/formprods',eAdmin,(req,res) =>{
    Categoria.find().lean().sort({date: 'desc'}).then(categorias => {
        res.render('Produtos/CreateProds',{categorias:categorias});
    }).catch(err => {
        req.flash("error_msg","Erro ao listar categorias no formulário: "+err);
        res.redirect('/');
    });
});

Prods.post('/createprods',eAdmin,(req,res) => {
    let erros = [];

    if(!req.body.nomeAutor || typeof req.body.nomeAutor == undefined || req.body.nomeAutor == null){
        erros.push({texto:"Nome inválido"});
    }
    
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto:"Titulo inválido"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"Slug inválido"});
    }

    if(!req.body.preco || typeof req.body.preco == undefined || req.body.preco== null){
        erros.push({texto:"Preço inválido"});
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto:"Descricao inválido"});
    }

    if(!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null){
        erros.push({texto:"Categoria inválida"});
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto:"Conteudo inválido"});
    }

    if(erros.length > 0){
        res.render('Produtos/CreateProds',{erros:erros});
    }
    else{
        const newProduto = {
            nomeAutor: req.body.nomeAutor,
            titulo:req.body.titulo,
            slug: req.body.slug,
            preco: req.body.preco,
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            conteudo: req.body.conteudo
        }

        new Produto(newProduto).save().then(() => {
            req.flash("success_msg","Sucesso ao criar o Produto!");
            res.redirect('/produtos/formprods');
        }).catch(err => {
            req.flash("error_msg","Error ao criar o Produto!: "+err);
            res.redirect('/produtos/formprods');
        });
    }
});

//Rota responsável por listar os produtos na página de listagem de produtos_
Prods.get('/listprods',(req,res) => {
    Produto.find().sort({date: 'desc'}).lean()
    .then(produtos => {
        res.render('Produtos/ListProds',{produtos:produtos});
    }).catch(err => {
        req.flash("error_msg","Erro ao listar produtos: "+err);
        res.redirect('/');
    });
});

//Rotas responsáveis por editar os produtos_
//Essa rota é a rota responsável por renderizar o formulário de edição(update) dos produtos_


//Essa rota é a rota responsável por editar os produtos com os novos dados_


//Rota responsável por deletar os produtos_
Prods.post('/deleteprods',(req,res) => {
    Produto.findOne({_id: req.body.id}).then(() => {
        req.flash("success_msg","sucesso ao deletar produto");
        res.redirect('/');
    }).catch(err => {
        req.flash("error_msg","Error ao deletar produto: "+err);
        res.redirect('/');
    });
});

module.exports = Prods;