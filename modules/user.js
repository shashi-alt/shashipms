const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://srk694307:Srk694307@cluster0.zghds.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true,useCreateIndex: true});
var conn =mongoose.Collection;
var userSchema =new mongoose.Schema({
    username: {type:String, 
        required: true,
        index: {
            unique: true,        
        }},

	Email: {
        type:String, 
        required: true,
        index: {
            unique: true, 
        }},
    password: {
        type:String, 
        required: true
    },
    date:{
        type: Date, 
        default: Date.now }
});

var userModel = mongoose.model('users', userSchema);
module.exports=userModel;