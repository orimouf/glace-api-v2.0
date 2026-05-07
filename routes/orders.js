const router = require("express").Router()
const Order = require("../models/Order")
const Client = require("../models/Client")
const verify = require("../verifyToken")
const mongoose = require("mongoose")

// CREATE

router.post("/", async (req, res) => { // , verify
    // if(req.user.isAdmin) {
    const dataFromApp = req.body.data
    var idCheck
    var idObj = []
    var reutrnStatus

    console.log(dataFromApp);
    

    async function insertData(Element) {
        var status = ""
        Element.server_id == "" ? idCheck = null : idCheck = await Order.findById(Element.server_id)
        
        if (idCheck != null) {
            status = "done"
        } else { 
            var newProductList = []
            if (Element.product_list != "") {
                var productListArr = Element.product_list.split(":")
                var productObj = {}
                productListArr.map( product => {
                    let productArr = product.split("*")
                    productObj = {
                        "productId": productArr[0],
                        "productName": productArr[1],
                        "productQty": productArr[2],
                        "productQtyItem": productArr[3],
                        "productPrice": productArr[4]
                    }

                    newProductList.push(productObj)
                })
            }
        
            const newOrder = new Order ({
                appId: order.id,
                clientName: order.client_name,
                clientId: new mongoose.mongo.ObjectId(order.client_id), 
                clientRegion: order.client_region,
                productList : newProductList, 
                totalToPay: order.total_to_pay, 
                verssi: order.verssi, 
                rest: order.rest, 
                profit: order.profit,
                remise: order.remise,
                camion: order.camion,
                isCredit: order.iscredit, 
                date: order.date, 
                isCheck: order.is_check
            })

            try{
                const order = await newOrder.save()
                idObj.push(order)
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
    // } else {
        // res.status(500).json("you are not allowed!")
    // }
})

//UPDATE

router.put("/:id", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            const newData = {
                clientName: req.body.clientName,
                clientId: new mongoose.mongo.ObjectId(req.body.clientId),
                clientRegion: req.body.client_region,
                totalToPay: req.body.totalToPay,
                verssi: req.body.verssi,
                rest: req.body.rest,
                date: req.body.date,
                camion: req.body.camion,
                isCheck: req.body.isCheck,
                isCredit: req.body.isCredit
            }
            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id, 
                { $set: newData },
                { new: true }
            )
            res.status(200).json(updatedOrder);
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//DELETE

router.delete("/:id", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            await Order.findByIdAndDelete(req.params.id)
            res.status(200).json("The Order has been deleted...")
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
        const order = await Order.findById(req.params.id)
        res.status(200).json(order)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET RANDOM

router.get("/random", verify, async (req, res) => {
    const type = req.query.type
    let orders
    try {
        if (type === "promo") {
            orders = await Order.aggregate([
              {$match: { isPromo: true} },
              { $sample: { size: 10 } },
          ])
        } else {
            orders = await Order.aggregate([
                {$match: { isPromo: false} },
                { $sample: { size: 10 } },
            ])
        }
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL orders AND orderedProduct JOIN

router.get("/ordresJoin/:type/:value", async (req, res) => {
    // if(req.user.isAdmin) {
    var searchDateOne = 0;
    var searchDateTwo = 0;
    var match

        try {

            // const orders = await Order.find()
            if(req.params.type === "date") { match = { $match : { date : req.params.value } } } 
            else if(req.params.type === "all") { 
                const dates = req.params.value.split('*')
                const paramsDateOne = dates[0].split('-').reverse().join('/')
                const paramsDateTwo = dates[1].split('-').reverse().join('/')
                searchDateOne = +(new Date(paramsDateOne));
                searchDateTwo = +(new Date(paramsDateTwo));

                match = { $match : { __v : 0 } } } 
            else if(req.params.type === "clientName") { match = { $match : { clientName : req.params.value } } } 
            else if(req.params.type === "clientId") { 
                const propertyId = req.params.value;
                const ObjectId = require('mongoose').Types.ObjectId;
                const objectId = new ObjectId(propertyId);
                match = { $match : { clientId : objectId } } 
            } else { res.status(500).json(err) }

            Order.aggregate([
                match,
                {
                $lookup: {
                    from: "orderedproducts", // collection name in db
                    localField: "productListId",
                    foreignField: "_id",
                    as: "productsOrdered"
                }
            }]).exec(function(err, orders) {
                // students contain WorksnapsTimeEntries
                let arr = []
                Promise.all(orders.map( async order => {
                    const client = await Client.findOne({ "_id": order.clientId})
                    .catch(function (err) {
                        res.status(422).json(err)
                    });
                    // console.log(order._id + "-----------" +  order.clientName + "-----------" + order.clientId)
                    order.clientPrices = client.prices

                    if(req.params.type === "all") {
                        const orderDate = order.date.split('-').reverse().join('/')
                        const newOrderDate = +(new Date(orderDate));

                        if (newOrderDate <= searchDateTwo && newOrderDate >= searchDateOne) {
                            arr.push(order)
                        }
                    }
                    
                })).then(results => { res.status(200).json((req.params.type === "all") ? {arr} : {orders})})
                .catch(function (err) {
                    // console.log(err);
                    
                    res.status(500).json(err)
                });
            });
            
        } catch (err) {
            res.status(400).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//GET ALL orders AND payments JOIN

router.get("/ordresPayment", async (req, res) => {
    // if(req.user.isAdmin) {
        try {

            Order.aggregate([
                // { $match : { date : req.params.value } },
                {
                $lookup: {
                    from: "payments", // collection name in db
                    localField: "clientId",
                    foreignField: "clientId",
                    as: "payments"
                }
            }]).exec(function(err, orders) {
                // students contain WorksnapsTimeEntries
                let arr = []
                Promise.all(orders.map( async order => {
                })).then(results => { res.status(200).json({ orders })})
                .catch(function (err) {
                    res.status(505).json(err)
                });
            });
            
        } catch (err) {
            res.status(400).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//GET ALL

router.get("/", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            const orders = await Order.find()
            res.status(200).json({ orders })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

module.exports = router