const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true },
        clientName: { type: String, required: true },
        clientId: { type: Object, required: true },
        productList: { type: Object, required: true },
        totalToPay: { type: String, required: true },
        verssi: { type: String, required: true },
        rest: { type: String, required: true },
        date: { type: String, required: true },
        profit: { type: String, required: true },
        remise: { type: String, required: true },
        camion: { type: String, required: true },
        isCheck: { type: Boolean, default: false },
        isCredit: { type: Boolean, default: false }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Order", OrderSchema)