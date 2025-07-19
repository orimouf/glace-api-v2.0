const mongoose = require("mongoose")

const ClientSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true },
        clientName: { type: String, required: true },
        phone: { type: String, required: true },
        region: { type: String, required: true },
        prices: { type: String, required: true },
        oldCredit: { type: String, required: true },
        isCredit: { type: Boolean, default: false },
        isFrigo: { type: Boolean, default: false },
        isPromo: { type: Boolean, default: falser },
        remise: {type: String, required: true, default: "0" },
        status: {type: String, required: true, default: "0" },
        creditBon: { type: String, default: "0" },
        synchronization: { type: String, default: "0" },
        camion: { type: String, required: true }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Client", ClientSchema)