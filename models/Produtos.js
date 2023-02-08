const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Produto = new Schema({
    nomeAutor: {
        type: String,
    },
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    preco: {
        type: String,
        required: true
    },
    descricao: {
        type: String
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('produtos',Produto);

module.exports = Produto;