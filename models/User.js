const mongoose = require('mongoose')

let validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new mongoose.Schema({
    username:  {
        type : String,
        required : true,
        unique : true,
        trim : true,
        minlength : [2,'minimum 2 letters']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        minlength : [5,'minimum 5 letters'],
        maxlength : 50
    },
    isAdmin :{
        type: String,
        default:false
    },
},
    {timestamps:true}
)


module.exports = mongoose.model('User', UserSchema)