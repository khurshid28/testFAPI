const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "finished",
        enum: ["finished", "canceled"],
    },
    device: {
        id: {
            type: String,
            required: true

        },
        name: {
            type: String,
            required: true
        }
    },
    location: {
        lat: {
            type: Number,
            required: true

        },
        long: {
            type: Number,
            required: true
        }
    },
    products: [{
        "name": {
            type: String,
            required: true,
        },
        "price": {
            type: Number,
            required: true,
        }
    }],
    amount: {
        type: Number,
        default: null,
    },
    payment_amount: {
        type: Number,
        default: null,
    },
    expired_month: {
        type: Number,
        required: true,
    },
    finished_time: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 60 * 1000),
    },
    canceled_reason: {
        type: String,
        default: null,
    },

}, { timestamps: true });


const App = mongoose.model("app-test10", appSchema);

module.exports = App;