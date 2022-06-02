const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://srk694307:pProhSA8wkNe7zy4@cluster0.zghds.mongodb.net/pms?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true });
var conn = mongoose.Collection;
var addpassSchema = new mongoose.Schema({
    password_category: {
        type: String,
        required: true,
    },

    project_name: {
        type: String,
        required: true,
    },

    password_detail: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now
    }
});

var addpassModel = mongoose.model('password_details', addpassSchema);
module.exports = addpassModel;