const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/pms', { useNewUrlParser: true, useCreateIndex: true });
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