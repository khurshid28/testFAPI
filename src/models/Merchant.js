const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
    who_edited: [{
        super_id: {
            type: String,
            default: null,
        },
        date: {
            type: Date,
            default: () => new Date(Date.now() + 5 * 60 * 60 * 1000),
        }
    }],
    who_deleted: {
        type: String,
        default: null,
    },
    who_created: {
        type: String,
        default: null,
    },
    admin_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "Merchant",
        enum: ["Merchant", "Agent"],
    },
    work_status: {
        type: String,
        enum: ["working", "blocked", "deleted", ],
        default: "working",
    },
    percent: {
        type: Number,
        required: true,
    },
    expired_months: [Number],
}, { timestamps: true });





const Merchant = mongoose.model("merchant-test10", merchantSchema);

module.exports = Merchant;