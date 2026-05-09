const router = require("express").Router()
const User = require("../models/User")
const Client = require("../models/Client")
const Region = require("../models/Region")
const Fees = require("../models/Fees")
const Product = require("../models/Product")
const Order = require("../models/Order")
const CryptoJS = require("crypto-js")
const Payment = require("../models/Payment")
const mongoose = require("mongoose")

//SET DATA CLIENTS
router.post("/dataclients", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus

    async function insertData(Element) {
        var status = ""
        const idCheck = await Client.findOne({ _id: Element.server_id})
        let is_credit = Element.is_credit ? true : false
        let is_frigo = Element.is_frigo ? true : false
        let is_promo = Element.is_promo ? true : false

        if (idCheck != null) {
            try {
                const appDate = new Date(Element.updatedAt)
                const serverDate = new Date(idCheck.updatedAt)

                if (appDate > serverDate) {
                    const updatedClient = await Client.findByIdAndUpdate(idCheck._id, 
                        {
                            id: Element.id,
                            clientName: Element.client_name,
                            phone: Element.phone,
                            region: Element.region,
                            prices: Element.prices,
                            oldCredit: Element.old_credit,
                            isCredit: is_credit,
                            isFrigo: is_frigo,
                            isPromo: is_promo,
                            camion: Element.camion,
                            creditBon: Element.credit_bon,
                            remise: Element.remise,
                            status: Element.status,
                            synchronization: Element.synchronization
                        },
                        { new: true }
                    )
                    status = "done"
                } else {
                    status = "done"
                }
            } catch (err) {
                status = err
            }
        } else {
            const newClient = new Client ({
                id: Element.id,
                clientName: Element.client_name,
                phone: Element.phone,
                region: Element.region,
                prices: Element.prices,
                oldCredit: Element.old_credit,
                isCredit: is_credit,
                isFrigo: is_frigo,
                isPromo: is_promo,
                camion: Element.camion,
                creditBon: Element.credit_bon,
                remise: Element.remise,
                status: Element.status,
                synchronization: Element.synchronization
            })
            
            try{
                const client = await newClient.save()
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({
            status: 1,
            message: "Clients data save Successful",
        })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA USERS
router.post("/datausers", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus

    async function insertData(Element) {
        var status = ""
        const idCheck = await User.findOne({ _id: Element.server_id})
        if (idCheck != null) {
            try {
                const appDate = new Date(Element.updatedAt)
                const serverDate = new Date(idCheck.updatedAt)

                if (appDate > serverDate) {
                    const updatedUser = await User.findByIdAndUpdate(idCheck._id, 
                        {
                            username: Element.username,
                            email: Element.email,
                            password: CryptoJS.AES.encrypt(
                                Element.password,
                                process.env.SECRET_KEY
                                ).toString(),
                            profilePic: Element.profilePic,
                            camion: Element.camion,
                            isAdmin: Element.isadmin,
                        },
                        { new: true }
                    )
                    status = "done"
                } else {
                    status = "done"
                }
            } catch (err) {
                status = err
            }
        } else {
            const newUser = new User ({
                id: Element.id,
                username: Element.username,
                email: `${Element.username}@gmail.com`,
                password: CryptoJS.AES.encrypt(
                    Element.password,
                    process.env.SECRET_KEY
                    ).toString(),
                profilePic: Element.profilePic,
                camion: Element.camion,
                isAdmin: Element.isadmin,
            })
    
            try{
                const user = await newUser.save()
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({
            status: 1,
            message: "Users data save Successful",
        })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA REGIONS
router.post("/dataregions", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus
    var idCheck
    var idObj = []
 
    async function insertData(Element) {
        var status = ""
        Element.server_id == "" ? idCheck = null : idCheck = await Region.findById(Element.server_id)
       
        if (idCheck != null) {
            status = "done"
        } else {
            const newRegion = new Region ({
                id: Element.id,
                regionName: Element.region_name,
                camion: Element.camion
            })
    
            try{
                const region = await newRegion.save()
                idObj.push(region)
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({ idObj })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA REGIONS
router.post("/datafees", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus
    var idCheck
    var idObj = []
 
    async function insertData(Element) {
        var status = ""
        Element.server_id == "" ? idCheck = null : idCheck = await Fees.findById(Element.server_id)
       
        if (idCheck != null) {
            status = "done"
        } else {
            const newFees = new Fees ({
                id: Element.id,
                DieselFees: Element.diesel_fees,
                MealFees: Element.meal_fees,
                OtherCostsSum: Element.other_costs_sum,
                DescriptionFees: Element.description_fees,
                date: Element.date,
                camion: Element.camion
            })
    
            try{
                const fees = await newFees.save()
                idObj.push(fees)
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({ idObj })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA PRODUCTS
router.post("/dataproducts", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus

    async function insertData(Element) {
        var status = ""
        const idCheck = await Product.findOne({ id: Element.id})
        if (idCheck != null) {
            try {
                const appDate = new Date(Element.updatedAt)
                const serverDate = new Date(idCheck.updatedAt)

                if (appDate > serverDate) {
                    const updatedProduct = await Product.findByIdAndUpdate(idCheck._id, 
                        {
                            id: Element.id,
                            name: Element.name,
                            price: Element.price,
                            qty_par_one: Element.qty_par_one,
                            image: Element.image,
                            status: Element.status
                        },
                        { new: true }
                    )
                    status = "done"
                } else {
                    status = "done"
                }
            } catch (err) {
                status = err
            }
        } else {
            const newProduct = new Product ({
                id: Element.id,
                name: Element.name,
                price: Element.price,
                qty_par_one: Element.qty_par_one,
                image: Element.image,
                status: Element.status
            })
    
            try{
                const product = await newProduct.save()
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({
            status: 1,
            message: "Products data save Successful",
        })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA PAYMENTS
router.post("/datapayments", async (req, res) => {

    const dataFromApp = req.body.data
    var idCheck
    var idObj = []
    var reutrnStatus

    async function insertData(Element) {
        var status = ""
        Element.server_id == "" ? idCheck = null : idCheck = await Payment.findById(Element.server_id)
        
        if (idCheck != null) {
            status = "done"
        } else { 
            const newPayment = new Payment ({
                id: Element.id,
                clientName: Element.client_name,
                clientId: new mongoose.mongo.ObjectId(Element.client_id),
                region: Element.region,
                oldSomme: Element.oldSomme,
                verssi: Element.verssi,
                rest: Element.rest,
                date: Element.date,
                camion: Element.camion,
                isCheck: Element.is_check
            })

            try{
                const payment = await newPayment.save()
                idObj.push(payment)
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        reutrnStatus = await insertData(dataFromApp[i])
    }

    if (reutrnStatus == "done") {
        res.status(201).json({ idObj })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

module.exports = router