//Importando os modulos e armazenado-os em uma constante, que será a constante principal_
const express =  require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');
require('./config/auth')(passport);

//Models
require('./models/Produtos');
const Produto = mongoose.model('produtos');

//Importação das constantes das rotas_
// const admin = require('./routers/admin');
const User = require('./routers/usuario');
const cats = require('./routers/routesCats');
const prods = require('./routers/routesProds');

//Configurando o Express-Session_
app.use(session({
    secret:'node1234',
    resave: true,
    saveUninitialized: true
}));

//Configurando a Ferramenta Passport_
//Devido a hierarquia dds Middlewares, o passport deve ser configurado depois do session e antes
//do flash;
app.use(passport.initialize());
app.use(passport.session());

//Configurando o Connect-Flash_
app.use(flash());

//Configurando o Middleware_
app.use((req,res,next) => {
    //Aqui dentro configuramos as variaveis globais da aplicação_
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    res.locals.error_adm = req.flash("error_adm");
    next();
});

//Configurando o Mongoose_
mongoose.connect('mongodb://localhost/application_sales')
.then(() => console.log('Conexão com o banco de dados bem sucedida!'))
.catch(err => console.log('Error ao conectar com o banco de dados: '+err));

//Configurando o Template Engine do Handlebars_
app.engine('handlebars',handlebars.engine({defaultLayoult:'main'}));
app.set('view engine','handlebars');

//Configurando o Body-Parser_
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Configurando os Arquivos Estáticos_
app.use(express.static(path.join(__dirname+'/public')));

//Rota Principal_
app.get('/',(req,res) =>{
    Produto.find().populate('categoria').sort({date: 'desc'}).lean()
    .then(produtos => {
        res.render('home',{produtos:produtos}); 
    }).catch(err => {
        req.flash("erro_msg","Error ao listar Produtos: "+err);
        res.redirect('/');
    });
});

//Configurando as rotas externas_
// app.use('/admin',admin);
app.use('/usuarios',User);
app.use('/categorias',cats);
app.use('/produtos',prods);

//Configurando o Servidor_
const PORT = 8081;
app.listen(PORT,() => console.log('Servidor rodando na url:  http://localhost:8081/'));