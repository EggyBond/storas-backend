const express = require('express');
const router = express.Router();
const passport = require('passport');
const Stock = require('../../models').Stock;
const Courier = require('../../models').Courier;
const db = require("../../models/index");
const axios = require('axios');
const rajaOngkirKey = require('../../config/keys').rajaOngkirKey;

/**
 * @route GET api/app/stock/detail
 * @desc Get stock detail
 * @access Private
 */
router.get('/detail', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const stockId = req.query.id;
    const stock = await Stock.findByPk(stockId);

    if (user.type !== 'CUSTOMER') {
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "You're not authorized to use this API."
        });
    }

    if (!stock || (stock.customerId !== user.id)) {
        return res.status(404).json({
            result: null,
            success: false,
            errorMessage: "Particular stock id not found"
        })
    }

    const courier = await Courier.findByPk(stock.courierId);

    const requestBody = {
        waybill: stock.receiptNo,
        courier: courier.name
      }
    
    try {
        const shipment = await axios({
            method: 'post',
            url: 'https://pro.rajaongkir.com/api/waybill',
            data: requestBody,
            headers: {key: rajaOngkirKey ,'Content-Type': 'application/json' }
            })
            
        return res.status(200).json({
            result: {
                id: stock.id,
                receiptNo: stock.receiptNo,
                itemName: stock.itemName,
                description: stock.description,
                quantity: stock.quantity,
                courier: stock.courierId,
                status: shipment.data.rajaongkir.result.delivery_status.status
            },
            success: true,
            errorMessage: null
        });
    } catch (e) {
        console.log(`Shipment is error with exception: ${e}`);
        return res.status(200).json({
            result: {
                id: stock.id,
                receiptNo: stock.receiptNo,
                itemName: stock.itemName,
                description: stock.description,
                quantity: stock.quantity,
                courier: stock.courierId,
                status: "Your receipt no is not valid / not yet processed by agent"
            },
            success: true,
            errorMessage: null
        });
    }
});

/**
 * @route GET api/app/stock/list
 * @desc Get stock list
 * @access Private
 */
router.get('/list', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    const whereQuery = {};

    if (user.type !== 'CUSTOMER') {
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "You're not authorized to use this API."
        });
    }

    const {
        productId
    } = req.query;

    const stocks = await Stock.findAll(
        {
            where: {
                customerId: user.id,
                productId: productId
            } 
        }
    );

    const stockResult = [];

    for (const stx of stocks) {
        let courier = await Courier.findByPk(stx.courierId);

        stockResult.push(
            {
                id: stx.id,
                itemName: stx.itemName,
                receiptNo: stx.receiptNo,
                quantity: stx.quantity,
                customerId: stx.customerId,
            }
        )
    }
    return res.status(200).json({
        result: {
            stocks: stockResult
        },
        success: true,
        errorMessage: null
    });
});

/**
 * @route GET api/app/stock/in
 * @desc Insert and Update sSock
 * @access Private
 */
router.post('/in', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    if (user.type !== "CUSTOMER") {
        return res.status(403).json({
            result: {
                productId: null
            },
            success: false,
            errorMessage: "Unauthorized. Only Customer can create stock"
        });
    }

    const {
        id,
        receiptNo,
        itemName,
        description,
        quantity,
        courierId,
        productId,
        category,
        price
    } = req.body;

    try {
        if (id) {
            const existingStock = await Stock.findByPk(id);
            if (existingStock.customerId !== user.id) {
                return res.status(403).json({
                    result: {
                        stockId: null
                    },
                    success: true,
                    errorMessage: "Unauthorized. You're not the owner of this stock."
                });
            }
        }

        const existingStock = await Stock.findAll({
            where: {
                    itemName: itemName,
                    productId: productId
                } 
            }
        );

        if (existingStock[0]) {
            currentStock = parseInt(existingStock[0].quantity,10) + parseInt(quantity,10)
            currentId = parseInt(existingStock[0].id)
        } else {
            currentStock = quantity
            currentId = id
        }

        const [record, created] = await Stock.upsert({
                id: currentId,
                customerId: user.id,
                itemName,
                description,
                quantity: currentStock,
                receiptNo,
                courierId,
                productId,
                category,
                price
            },
            {
                returning: true
            }
        );

        return res.status(201).json({
            result: {
                stockId: record.id
            },
            success: true,
            errorMessage: null
        });
    } catch (e) {
        return res.status(500).json({
            result: {
                productId: null
            },
            success: false,
            errorMessage: e.message
        });
    }

});

/**
 * @route GET api/app/stock/out
 * @desc Insert and Update sSock
 * @access Private
 */
router.post('/out', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    if (user.type !== "CUSTOMER") {
        return res.status(403).json({
            result: {
                productId: null
            },
            success: false,
            errorMessage: "Unauthorized. Only Customer can create stock"
        });
    }

    const {
        id,
        receiptNo,
        itemName,
        description,
        quantity,
        courierId,
        productId
    } = req.body;

    try {
        if (id) {
            const existingStock = await Stock.findByPk(id);
            if (existingStock.customerId !== user.id) {
                return res.status(403).json({
                    result: {
                        stockId: null
                    },
                    success: true,
                    errorMessage: "Unauthorized. You're not the owner of this stock."
                });
            }
        }

        const existingStock = await Stock.findAll({
            where: {
                    itemName: itemName,
                    productId: productId
                } 
            }
        );

        if (existingStock[0]) {
            currentStock = parseInt(existingStock[0].quantity,10) - parseInt(quantity,10)
            currentId = parseInt(existingStock[0].id)
        } else {
            return res.status(404).json({
                result: {
                    productId: null
                },
                success: false,
                errorMessage: `There is no item called ${itemName}`
            });
        }

        

        const [record, created] = await Stock.upsert({
                id: currentId,
                customerId: user.id,
                itemName,
                description,
                quantity: currentStock,
                receiptNo,
                courierId
            },
            {
                returning: true
            }
        );

        return res.status(201).json({
            result: {
                stockId: record.id
            },
            success: true,
            errorMessage: null
        });
    } catch (e) {
        return res.status(500).json({
            result: {
                productId: null
            },
            success: false,
            errorMessage: e.message
        });
    }

});

/**
 * @route GET api/app/stock/courierList
 * @desc Get List of Couriers
 * @access Private
 */
router.get('/courierList', async (req, res) => {
    const courier = await Courier.findAll();

    const courierResult = courier.map(courier => {
        return {
            id: courier.id,
            name: courier.name
        }
    });

    return res.status(200).json({
        result: {
            couriers: courierResult,
        },
        success: true,
        errorMessage: null
    });
});

/**
 * @route GET api/app/stock/courierList
 * @desc Get List of Couriers
 * @access Private
 */
router.get('/stockCategory', async (req, res) => {
    var category=[
        "Bahan Baku",
        "Barang Dalam Proses",
        "Barang Jadi",
        "Barang Suplai",
        "Barang Dagangan"
    ]
    return res.status(200).json({
        result: {
            category: category,
        },
        success: true,
        errorMessage: null
    });
});

module.exports = router;
