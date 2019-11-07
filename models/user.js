var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/user-panel", { useNewUrlParser: true , useUnifiedTopology: true });

// schema maps to a collection
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    toNumber: {
        type: Number,
        required: true,
        unique:true,
        // maxlength:10
    },
    createdDate: { 
        type: Date, 
        default: Date.now 
    },
    otp:{
        type:String
    }
})

// require model
var User = mongoose.model("user", registrationSchema);


// module export here
module.exports.User = User;