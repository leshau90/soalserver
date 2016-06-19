var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SoalSchema   = new Schema({
    _id: Schema.Types.ObjectId,
    s: String,  
    c: [],
    k: []
});

module.exports = mongoose.model('Soal', SoalSchema, 'soal');