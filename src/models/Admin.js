const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    loginName: {
        type: String,
        required: true,
    },
    loginPassword: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^\+998([378]{2}|(9[013-57-9]))\d{7}$/,
    },
    address: {
        type: {
            region: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            homeAddress: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    work_status: {
        type: String,
        enum: ["working", "blocked", "deleted", ],
        default: "working",
    },
    role: {
        type: String,
        default: "admin"
    }
}, { timestamps: true });


const Admin = mongoose.model("Admin-test10", adminSchema);

module.exports = Admin;