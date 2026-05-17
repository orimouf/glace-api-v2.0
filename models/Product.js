const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: false },
        name: { type: String, required: true, unique: true },
        price: { type: String, required: true },
        purchasePrice: { type: String, required: true },
        qtyGlobal: { type: String, default: "" },
        qty_par_one: { type: String, default: "" },
        image: { type: String, default: ""},
        status: { type: Boolean, default: false}
    },
    {timestamps: true}
)

module.exports = mongoose.model("Product", ProductSchema)