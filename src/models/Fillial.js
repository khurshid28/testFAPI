const mongoose = require("mongoose");

const fillialSchema = new mongoose.Schema({
    merchant_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
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
    who_deleted: {
        type: String,
        default: null,
    },
    who_created: {
        type: String,
        default: null,
    },
    inn: {
        type: String,
        required: true,
    },
}, { timestamps: true });


const Fillial = mongoose.model("Fillial-test10", fillialSchema);

module.exports = Fillial;