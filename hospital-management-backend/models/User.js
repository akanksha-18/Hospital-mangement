const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['patient', 'doctor', 'super_admin'], 
        default: 'patient' 
    },
    specialization: { 
        type: String, 
        required: function () {
            return this.role === 'doctor'; 
        }
    }
});



const User = mongoose.model('User', userSchema);



module.exports = User;

