const router = require("express").Router()
const Product = require("../models/Product")
const Client = require("../models/Client")
const verify = require("../verifyToken")

router.get("/get/", async (req, res) => { //verify
    // if(req.user.isAdmin) {
        try {

            const getAllClients = await Client.find()
           
            
            const mapReturn = getAllClients.map( async client => {

                const arrayId = [
                    "6676171009c9b6a887d59bb2*","6676171009c9b6a887d59bb3*","6676171009c9b6a887d59bb4*","6676171009c9b6a887d59bb5*",
                    "6676171009c9b6a887d59bb6*","6676171009c9b6a887d59bb7*","6676171009c9b6a887d59bb8*","6676171009c9b6a887d59bb9*",
                    "6676171009c9b6a887d59bbb*","6676171009c9b6a887d59bbc*","6676171009c9b6a887d59bbd*","6676171009c9b6a887d59bbe*",
                    "6676171009c9b6a887d59bbf*","6676171009c9b6a887d59bc0*","6676171009c9b6a887d59bc1*","6676171009c9b6a887d59bc2*",
                    "6676171009c9b6a887d59bc3*","6676171009c9b6a887d59bc4*","6676171009c9b6a887d59bc5*","6676171009c9b6a887d59bc6*",
                    "6676171009c9b6a887d59bc7*","6676171009c9b6a887d59bc8*","6676171009c9b6a887d59bc9*","6676171009c9b6a887d59bca*",
                    "6676171009c9b6a887d59bcb*","6676171009c9b6a887d59bcc*","6676171009c9b6a887d59bcd*","6676171009c9b6a887d59bce*",
                    "6676171009c9b6a887d59bcf*","6676171009c9b6a887d59bd0*","6676171009c9b6a887d59bd1*","6676171009c9b6a887d59bd2*",
                    "6676171009c9b6a887d59bd3*","6676171009c9b6a887d59bd4*","6676171009c9b6a887d59bd5*","6676171009c9b6a887d59bd6*",
                    "6676171009c9b6a887d59bd7*","6676171009c9b6a887d59bd8*"
                ]

                var arrayPrice = client.prices.split(":")
                var newPrice = ""
                for (let i = 0; i < arrayPrice.length; i++) {
                    if (i !== arrayPrice.length - 1) newPrice += `${arrayId[i]}${arrayPrice[i]}:`
                    else newPrice += `${arrayId[i]}${arrayPrice[i]}`
                }

                // // Update Price -- delete ':' from last
                // const lastChar = client.prices[client.prices.length - 1];
                // if (lastChar === ":") {
                //     client.prices = client.prices.slice(0, -1);
                // }

                client.prices = newPrice
                // console.log(client.prices);
                
                const updateClient = await Client.findByIdAndUpdate(client._id, 
                    {
                        $set:client,
                    },
                    { new: true }
                )
            })

            if (mapReturn.length != 0) {
                res.status(200).json(savedProduct)
            }
            
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
        // res.status(500).json("you are not allowed!")
    // }
})

// CREATE

router.post("/", async (req, res) => { //verify
    // if(req.user.isAdmin) {
        const newProduct = new Product(req.body)

        try {
            const savedProduct = await newProduct.save()

            const getAllClients = await Client.find()
            
            const mapReturn = getAllClients.map( async client => {

                client.prices += `:${savedProduct._id}*${savedProduct.price}`
                
                const updateClient = await Client.findByIdAndUpdate(client._id, 
                    {
                        $set:client,
                    },
                    { new: true }
                )
            })

            if (mapReturn.length != 0) {
                res.status(200).json(savedProduct)
            }
            
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
        // res.status(500).json("you are not allowed!")
    // }
})

//UPDATE

router.put("/:id", async (req, res) => {  //, verify
    // if(req.user.isAdmin) {

    try {
        const data = req.body
        const product = {
            appId: data.appId, 
            name: data.name, 
            price: data.price, 
            qty_par_one: data.qty_par_one,
            image: data.image, 
            status: data.status
        }
        
        if (data.updateall) {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id, 
                { $set: product },
                { new: true }
            )

            const getAllClients = await Client.find()
            
            const mapReturn = getAllClients.map( async client => {
                
                var newStringPrices = ""
                var array1 = client.prices.split(":")

                array1.map( (arr, i) => {
                    var arrayIdPrice = arr.split("*")
                    var newPrice = arrayIdPrice[1]

                    if (arrayIdPrice[0] === req.params.id) {
                        newPrice = product.price
                    }

                    if (i !== array1.length - 1) newStringPrices += `${arrayIdPrice[0]}*${newPrice}:`
                    else newStringPrices += `${arrayIdPrice[0]}*${newPrice}`

                })

                client.prices = newStringPrices

                const updateClient = await Client.findByIdAndUpdate(client._id, 
                    {
                        $set:client,
                    },
                    { new: true }
                )

            })

            if (mapReturn.length != 0) {
                res.status(200).json(updatedProduct)
            }

        } else {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id, 
                { $set: product },
                { new: true }
            )
            res.status(200).json(updatedProduct)
        }

    }
     catch (err) {
        res.status(400).json(console.log(err)
        )
    }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//DELETE

router.delete("/:id", async (req, res) => {//, verify
    // if(req.user.isAdmin) {
        try {
            await Product.findByIdAndDelete(req.params.id)

            const getAllClients = await Client.find()
            
            const mapReturn = getAllClients.map( async client => {
                
                var newStringPrices = ""
                var array1 = client.prices.split(":")

                array1.map( (arr, i) => {
                    var arrayIdPrice = arr.split("*")

                    var newPrice = arrayIdPrice[1]

                    if (arrayIdPrice[0] !== req.params.id) {
                        newStringPrices += `${arrayIdPrice[0]}*${newPrice}:`
                    }
                })

                const lastChar = newStringPrices[newStringPrices.length - 1];
                if (lastChar === ":") {
                    client.prices = newStringPrices.slice(0, -1);
                }
        
                const updateClient = await Client.findByIdAndUpdate(client._id, 
                    {
                        $set:client,
                    },
                    { new: true }
                )

            })

            if (mapReturn.length != 0) {
                res.status(200).json("The product has been deleted...")
            }

        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//GET

router.get("/find/:id", verify, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET RANDOM

router.get("/random", verify, async (req, res) => {
    const type = req.query.type
    let products
    try {
        if (type === "promo") {
            products = await Product.aggregate([
              {$match: { isPromo: true} },
              { $sample: { size: 10 } },
          ])
        } else {
            products = await Product.aggregate([
                {$match: { isPromo: false} },
                { $sample: { size: 10 } },
            ])
        }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL

router.get("/", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            const products = await Product.find()
            res.status(200).json({ products })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

module.exports = router