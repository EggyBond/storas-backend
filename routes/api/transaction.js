const express = require('express');
const router = express.Router();
const passport = require('passport');
const Transaction = require('../../models').Transaction;
const BillingDetail = require('../../models').BillingDetail;
const Product = require('../../models').Product;
const Payment = require('../../models').Payment;
const PaymentDestination = require('../../models').PaymentDestination;
const User = require('../../models').User;
const firebaseAdmin = require("../../services/firebaseAdmin");
const mimeTypes = require('mimetypes');
const {v4: UUID} = require('uuid');
const db = require("../../models/index");
const moment = require('moment'); 
const multer = require('multer');
var upload = multer();
/**
 * @route GET api/app/transaction/detail
 * @desc Get transaction detail
 * @access Private
 */

router.get('/adminDetail', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const transactionId = req.query.id;
    const transaction = await Transaction.findByPk(transactionId);

    if ((!transaction
        || (transaction.customerId !== user.id && transaction.ownerId !== user.id))
        && (user.type !== 'ADMIN')
    ) {
        return res.status(404).json({
            result: null,
            success: false,
            errorMessage: "Particular transaction id not found"
        })
    }

    const product = await Product.findByPk(transaction.productId);

    let ownerData = [];
    let paymentList = [];
    let billingDetail = [];
    let paymentDestination = {};

    if (user.type === 'ADMIN' && product != null) {
        ownerData = await User.findAll(
            {
                where: {
                    id: product.ownerId
                }
            }
        );
        // TODO: For now this is hardcoded to find the first paymentDestination
    }

    if ((user.type === 'CUSTOMER' || user.type === 'ADMIN') && transaction != null) {
        paymentList = await Payment.findAll(
            {
                where: {
                    transactionId: transaction.id
                }
            }
        );
        // TODO: For now this is hardcoded to find the first paymentDestination
    }

    if ((user.type === 'CUSTOMER' || user.type === 'ADMIN') && paymentList.length > 0) {
        billingDetail = await BillingDetail.findAll(
            {
                where: {
                    paymentId: paymentList[0].dataValues.id
                }
            }
        );
        // TODO: For now this is hardcoded to find the first paymentDestination
        paymentDestination = await PaymentDestination.findOne();
    }

    // TODO: Should do this process in frontend instead
    const transactionTime = new Date(transaction.createdAt);
    const localTransactionTime = new Date(transactionTime.getTime() + (7 * 60 * 60 * 1000)); // Hackily convert to +7 timezone

    return res.status(200).json({
        result: {
            id: transaction.id,
            status: transaction.status,
            customerId: transaction.customerId,
            ownerId: transaction.ownerId,
            totalAmount: transaction.totalAmount,
            transactionTime: localTransactionTime,
            startDate: transaction.start_date,
            endDate: transaction.end_date,
            productInfo: {
                id: product.id,
                ownerId : product.ownerId,
                name: product.name,
                city: product.city,
                warehouseType: product.warehouseType,
                images: product.images,
                price: product.price,
                description: product.description,
                geoLocation: {
                    lng: product.geoLng,
                    lat: product.geoLat
                },
            },
            ownerData: ownerData[0],
            paymentList: paymentList[0],
            billingDetail: billingDetail[0]
        },
        success: true,
        errorMessage: null
    });
});

router.get('/detail', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const transactionId = req.query.id;
    const transaction = await Transaction.findByPk(transactionId);

    if ((!transaction
        || (transaction.customerId !== user.id && transaction.ownerId !== user.id))
        && (user.type !== 'ADMIN')
    ) {
        return res.status(404).json({
            result: null,
            success: false,
            errorMessage: "Particular transaction id not found"
        })
    }

    const product = await Product.findByPk(transaction.productId);

    let paymentList = [];
    let billingDetail = [];
    let paymentDestination = {};
    if ((user.type === 'CUSTOMER' || user.type === 'ADMIN') && transaction != null) {
        paymentList = await Payment.findAll(
            {
                where: {
                    transactionId: transaction.id
                }
            }
        );
        // TODO: For now this is hardcoded to find the first paymentDestination
    }

    if ((user.type === 'CUSTOMER' || user.type === 'ADMIN') && paymentList != null) {
        billingDetail = await BillingDetail.findAll(
            {
                where: {
                    paymentId: paymentList[0].dataValues.id
                }
            }
        );
        // TODO: For now this is hardcoded to find the first paymentDestination
        paymentDestination = await PaymentDestination.findOne();
    }

    // TODO: Should do this process in frontend instead
    const transactionTime = new Date(transaction.createdAt);
    const localTransactionTime = new Date(transactionTime.getTime() + (7 * 60 * 60 * 1000)); // Hackily convert to +7 timezone
    let arrImages = JSON.parse(product.images)    
    let arrAdditional_facility = JSON.parse(product.additional_facility)

    return res.status(200).json({
        result: {
            id: transaction.id,
            status: transaction.status,
            customerId: transaction.customerId,
            ownerId: transaction.ownerId,
            totalAmount: transaction.totalAmount,
            transactionTime: localTransactionTime,
            startDate: transaction.start_date,
            endDate: transaction.end_date,
            productInfo: {
                id: product.id,
                name: product.name,
                city: product.city,
                warehouseType: product.warehouseType,
                images: product.images,
                price: product.price,
                description: product.description,
                geoLocation: {
                    lng: product.geoLng,
                    lat: product.geoLat
                },
                additional_facility: product.additional_facility,
                building_area: product.building_area,
                electricity: product.electricity,
                total_floor: product.total_floor,
                pdam: product.pdam,
                arrImages : arrImages,
                arrAdditional_facility : arrAdditional_facility
            },
            paymentList: paymentList[0],
            billingDetail: billingDetail[0]
        },
        success: true,
        errorMessage: null
    });
});




/**
 * @route GET api/app/transaction/list
 * @desc Get transaction list
 * @access Private
 */
router.get('/manualTransactionList', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    let whereQuery = {};

    switch (user.type) {
        case 'PRODUCT_OWNER':
            whereQuery['ownerId'] = user.id;
            break;
        case 'CUSTOMER':
            whereQuery['customerId'] = user.id;
            break;
        case 'ADMIN':
            whereQuery = {};
            break;
    }
    whereQuery['status']="MANUAL"
    const transactions = await Transaction.findAll(
        {
            where: whereQuery
        }
    );
    const transactionsResult = [];

    for (const trx of transactions) {
        let product = await Product.findByPk(trx.productId);

        // TODO: Should do this process in frontend instead
        let transactionTime = new Date(trx.createdAt);
        let localTransactionTime = new Date(transactionTime.getTime() + (7 * 60 * 60 * 1000)); // Hackily convert to +7 timezone

        transactionsResult.push(
            {
                id: trx.id,
                status: trx.status,
                totalAmount: trx.totalAmount,
                customerId: trx.customerId,
                ownerId: trx.ownerId,
                warehouseId: product.id,
                warehouseName: product.name,
                startDate: trx.start_date,
                endDate: trx.end_date,
                productInfo: {
                    id: product.id,
                    name: product.name,
                    warehouseType: product.warehouseType,
                    price: product.price
                },
                transactionTime: localTransactionTime
            }
        )
    }
    return res.status(200).json({
        result: {
            transactions: transactionsResult
        },
        success: true,
        errorMessage: null
    });
});


router.delete('/deleteManualTransaction', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const transactionId = req.query.id;
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction && transaction.ownerId !== user.id) {
        return res.status(404).json({
            result: null,
            success: false,
            errorMessage: "Particular transaction id not found"
        })
    }

    Transaction.destroy(
        {
            where: { id : transactionId}
        }
    ).then(() => {
        return res.status(200).json({
            success: true,
            errorMessage: null
        });
    }).catch((err)=>{
        console.log(err)
        return res.status(500).json({
            success: false,
            errorMessage: "Unexpected Server Error",
            result: null
        });
    });
});


/**
 * @route GET api/app/transaction/list
 * @desc Get transaction list
 * @access Private
 */
router.get('/list', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    let page = req.query.page;
    const filter = Object.keys(req.query);
    const query = req.query;
    let whereQuery = {};

    for(var i = 0; i < filter.length; i++){
        if(filter[i] != "page" && filter[i] != "status"){
            whereQuery[filter[i]] = query[filter[i]]
        }
    }

    switch (user.type) {
        case 'PRODUCT_OWNER':
            whereQuery['ownerId'] = user.id;
            break;
        case 'CUSTOMER':
            whereQuery['customerId'] = user.id;
            break;
        case 'ADMIN':
            whereQuery = {};
            break;
    }
    const { Op } = require("sequelize");

    if(req.query.status){
        whereQuery["status"] = { [Op.not]: 'MANUAL', [Op.eq] : req.query.status}
    }else{
        whereQuery["status"] = { [Op.not]: 'MANUAL'}
    }
    
    let limit = undefined
    if(page !== undefined){
        limit = 10;
        page = (page - 1) * limit; 
    }

    const transactions = await Transaction.findAll(
        {
            where: whereQuery, offset: page, limit: limit
        }
    );
    const transactionsResult = [];

    for (const trx of transactions) {
        let product = await Product.findByPk(trx.productId);

        // TODO: Should do this process in frontend instead
        let transactionTime = new Date(trx.createdAt);
        let localTransactionTime = new Date(transactionTime.getTime() + (7 * 60 * 60 * 1000)); // Hackily convert to +7 timezone

        let paymentList = {};
        if ( trx != null) {
            paymentList = await Payment.findAll(
                {
                    where: {
                        transactionId: trx.id
                    }
                }
            );
            // TODO: For now this is hardcoded to find the first paymentDestination
        }
        let arrImages = JSON.parse(product.images)    
        let arrAdditional_facility = JSON.parse(product.additional_facility)    
        var dataResult = {
            id: trx.id,
            status: trx.status,
            totalAmount: trx.totalAmount,
            customerId: trx.customerId,
            ownerId: trx.ownerId,
            warehouseId: product.id,
            warehouseName: product.name,
            startDate: trx.start_date,
            endDate: trx.end_date,
            productInfo: {
                id: product.id,
                name: product.name,
                warehouseType: product.warehouseType,
                price: product.price,
                images: product.images,
                district: product.district,
                city: product.city,
                arrImages : arrImages,
                arrAdditional_facility : arrAdditional_facility
            },
            transactionTime: localTransactionTime
        }
        if(paymentList.length > 0){
            dataResult.paymentId = paymentList[0].dataValues.id
        }
    
        transactionsResult.push(dataResult)
    }
    return res.status(200).json({
        result: {
            transactions: transactionsResult
        },
        success: true,
        errorMessage: null
    });
});

/**
 * @route GET api/app/transaction/list
 * @desc Get transaction list
 * @access Private
 */
router.get('/bookedList', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const filter = Object.keys(req.query);
    const query = req.query;
    let whereQuery = {};

    for(var i = 0; i < filter.length; i++){
        if(filter[i] != "page"){
            whereQuery[filter[i]] = query[filter[i]]
        }
    }


    whereQuery["status"] = 'BOOKED'
    switch (user.type) {
        case 'PRODUCT_OWNER':
            whereQuery['ownerId'] = user.id;
            break;
        case 'CUSTOMER':
            whereQuery['customerId'] = user.id;
            break;
        case 'ADMIN':
            whereQuery = {};
            break;
    }
    const { Op } = require("sequelize");

    const transactions = await Transaction.findAll(
        {
            where: whereQuery
        }
    );
    const transactionsResult = [];

    for (const trx of transactions) {
        let product = await Product.findByPk(trx.productId);

        // TODO: Should do this process in frontend instead
        let transactionTime = new Date(trx.createdAt);
        let localTransactionTime = new Date(transactionTime.getTime() + (7 * 60 * 60 * 1000)); // Hackily convert to +7 timezone

        let paymentList = {};
        if ( trx != null) {
            paymentList = await Payment.findAll(
                {
                    where: {
                        transactionId: trx.id
                    }
                }
            );
            // TODO: For now this is hardcoded to find the first paymentDestination
        }
        let arrImages = JSON.parse(product.images)    
        let arrAdditional_facility = JSON.parse(product.additional_facility)    
        var dataResult = {
            id: trx.id,
            status: trx.status,
            totalAmount: trx.totalAmount,
            customerId: trx.customerId,
            ownerId: trx.ownerId,
            warehouseId: product.id,
            warehouseName: product.name,
            startDate: trx.start_date,
            endDate: trx.end_date,
            productInfo: {
                id: product.id,
                name: product.name,
                warehouseType: product.warehouseType,
                price: product.price,
                images: product.images,
                district: product.district,
                city: product.city,
                arrImages : arrImages,
                arrAdditional_facility : arrAdditional_facility
            },
            transactionTime: localTransactionTime
        }
        if(paymentList.length > 0){
            dataResult.paymentId = paymentList[0].dataValues.id
        }
    
        transactionsResult.push(dataResult)
    }
    return res.status(200).json({
        result: {
            transactions: transactionsResult
        },
        success: true,
        errorMessage: null
    });
});


/**
 * @route POST api/app/transaction/checkout
 * @desc Checkout Transaction
 * @access Private
 */
router.post('/test', async (req, res) => {

    const {
        customerId,
        full_name,
        phone,
        email,
        country,
        address,
        city,
        state,
        pincode,
        item,
        startDate,
        endDate,
        total
    } = req.body;

    const { Op } = require("sequelize");
    const checkTransaction = await Transaction.findAll(
        {
            where: {
                productId: item,
                status: {
                    [Op.not]: "REJECTED",
                    [Op.not]: "CANCELED",
                    [Op.not]: "REFUND",
                },
                start_date: {
                    [Op.lte]: moment(endDate)
                },
                end_date: {
                    [Op.gte]: moment(startDate)
                }
            }
        }
    );       

    if(checkTransaction.length > 0){
        return res.status(403).json({
            result: {
                transactionId: null
            },
            success: false,
            errorMessage: "Date not available"
        });
    }
    const product = await Product.findByPk(item);
    
    if (!product.active) {
        return res.status(403).json({
            result: {
                transactionId: null
            },
            success: false,
            errorMessage: "Product is no longer available"
        });
    }



    const trxSession = await db.sequelize.transaction();
    try{
        const currentDate = new Date();
        const expiryDate = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000)); // Expiry date 2 days after created.
        const newTrasaction = await Transaction.create({
            customerId: customerId,
            ownerId: product.ownerId,
            productId: product.id,
            status: "NOT PAID",
            totalAmount: total,
            decimalPoint: product.decimalPoint,
            currency: product.currency,
            expiredAt: expiryDate,
            start_date: moment(startDate),
            end_date: moment(endDate)
        }, { transaction: trxSession });
    
        const newPayment = await Payment.create({
            transactionId: newTrasaction.id,
            paymentMethod: "BANK_TRANSFER",
            payableAmount: product.id,
            status: "NOT PAID",
            totalAmount: total,
            status: "NOT PAID",
        }, { transaction: trxSession });
    
        const newBillingDetail = await BillingDetail.create({
            paymentId: newPayment.id,
            full_name:full_name,
            phone:phone,
            email:email,
            country:country,
            address:address,
            city:city,
            state:state,
            pincode:pincode,
        }, { transaction: trxSession });

        await trxSession.commit();
        return res.status(201).json({
            result: {
                transactionId: newTrasaction.id
            },
            success: true,
            errorMessage: null
        });
    }catch(e){
        console.log(e)
        await trxSession.rollback();
        return res.status(400).json({
            success: false,
            errorMessage: null
        });
    }

});

/**
 * @route POST api/app/transaction/checkout
 * @desc Checkout Transaction
 * @access Private
 */
router.post('/checkout', passport.authenticate('jwt', {
    session: false
}),async (req, res) => {

    const {
        full_name,
        phone,
        email,
        country,
        address,
        city,
        state,
        pincode,
        item,
        startDate,
        endDate,
        total
    } = req.body;

    const { Op } = require("sequelize");
    const checkTransaction = await Transaction.findAll(
        {
            where: {
                productId: item,
                status: {
                    [Op.not]: "REJECTED",
                    [Op.not]: "CANCELED",
                    [Op.not]: "REFUND",
                },
                start_date: {
                    [Op.lte]: moment(endDate)
                },
                end_date: {
                    [Op.gte]: moment(startDate)
                }
            }
        }
    );       

    if(checkTransaction.length > 0){
        return res.status(403).json({
            result: {
                transactionId: null
            },
            success: false,
            errorMessage: "Date not available"
        });
    }
    const product = await Product.findByPk(item);
    
    if (!product.active) {
        return res.status(403).json({
            result: {
                transactionId: null
            },
            success: false,
            errorMessage: "Product is no longer available"
        });
    }

    

    const trxSession = await db.sequelize.transaction();
    try{
        const currentDate = new Date();
        const expiryDate = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000)); // Expiry date 2 days after created.
        const newTrasaction = await Transaction.create({
            customerId: user.id,
            ownerId: product.ownerId,
            productId: product.id,
            status: "NOT PAID",
            totalAmount: total,
            decimalPoint: product.decimalPoint,
            currency: product.currency,
            expiredAt: expiryDate,
            start_date: moment(startDate),
            end_date: moment(endDate)
        }, { transaction: trxSession });
    
        const newPayment = await Payment.create({
            transactionId: newTrasaction.id,
            paymentMethod: "BANK_TRANSFER",
            payableAmount: product.id,
            status: "NOT PAID",
            totalAmount: total,
            status: "NOT PAID",
        }, { transaction: trxSession });
    
        const newBillingDetail = await BillingDetail.create({
            paymentId: newPayment.id,
            full_name:full_name,
            phone:phone,
            email:email,
            country:country,
            address:address,
            city:city,
            state:state,
            pincode:pincode,
        }, { transaction: trxSession });

        await trxSession.commit();
        return res.status(201).json({
            result: {
                transactionId: newTrasaction.id
            },
            success: true,
            errorMessage: null
        });
    }catch(e){
        console.log(e)
        await trxSession.rollback();
        return res.status(400).json({
            success: false,
            errorMessage: null
        });
    }

});


/**
 * @route POST api/app/transaction/checkout
 * @desc Checkout Transaction
 * @access Private
 */
router.post('/manualInput', async (req, res) => {
    const {
        productId,
        startDate,
        endDate,
    } = req.body;

    const product = await Product.findByPk(productId);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000)); // Expiry date 2 days after created.
    
    if (!product.active) {
        return res.status(403).json({
            result: {
                transactionId: null
            },
            success: false,
            errorMessage: "Product is no longer available"
        });
    }

    const newManualTrasaction = await Transaction.create({
        customerId: product.ownerId,
        ownerId: product.ownerId,
        productId: product.id,
        status: "MANUAL",
        totalAmount: 0,
        decimalPoint: product.decimalPoint,
        currency: product.currency,
        expiredAt: expiryDate,
        start_date: moment(startDate),
        end_date: moment(endDate)
    });

    return res.status(201).json({
        result: {
            manualTransactionId: newManualTrasaction.id
        },
        success: true,
        errorMessage: null
    });
});


/**
 * @route POST api/app/transaction/submitPayment
 * @desc Submit Payment
 * @access Private
 */
router.post('/submitPayment', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        transactionId,
        paymentProof
    } = req.body;

    const transaction = await Transaction.findOne({
        where: {
            id: transactionId,
            customerId: user.id
        }
    });

    if (!transaction) {
        return res.status(404).json({
            result: null,
            success: false,
            errorMessage: "Transaction not found."
        });
    }

    const storage = firebaseAdmin.storage();
    const bucket = storage.bucket();

    const image = paymentProof,
        mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1],
        fileName = user.id + "-" + transaction.id + "-" + new Date().getTime() + "." + mimeTypes.detectExtension(mimeType),
        base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, ''),
        imageBuffer = Buffer.from(base64EncodedImageString, 'base64');


    // Upload the image to the bucket
    const file = bucket.file('asset/payment/' + fileName);

    const uuid = UUID();
    file.save(imageBuffer, {
        metadata: {
            contentType: mimeType,
            firebaseStorageDownloadTokens: uuid
        },
        public: true
    }, async function (error) {
        if (error) {
            return res.status(500).json({
                success: false,
                errorMessage: "Unable to upload payment proof"
            });
        }

        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;

        // TODO: For now this is hardcoded to find the first paymentDestination
        const paymentDestination = await PaymentDestination.findOne();
        try{
            const newPayment = await Payment.update({
                paymentMethod: "BANK_TRANSFER",
                paymentProofUrl: imageUrl,
                status: "PENDING_VERIFICATION",
            },{
                where: {
                  transactionId: transactionId
                }});
            await Transaction.update({
                status: "PAID",
            },{
                where: {
                    id: transactionId
                }});
            return res.status(201).json({
                result: {
                    transactionId: transaction.id,
                    paymentId: newPayment.id
                },
                success: true,
                errorMessage: null
            });
        }catch(e){
            console.log(e)
            return res.status(500).json({
                result: null,
                success: false,
                errorMessage: "Unexpected error when creating new payment"
            });
        }

    });
});


/**
 * @route POST api/app/transaction/verifyPayment
 * @desc Payment Verification
 * @access Private to Admin only
 */
router.post('/verifyPayment', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        transactionId,
        paymentId,
        newState
    } = req.body;

    if (user.type !== 'ADMIN') {
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "You're not authorized to use this API."
        });
    }

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
        return res.status(404).json({
            result: null,
            success: false,
            errorMessage: "Transaction not found."
        });
    }

    const payment = await Payment.findOne({
        where: {
            id: paymentId,
            transactionId
        }
    });

    if (!payment) {
        return res.status(404).json({
            result: null,
            success: false,
            errorMessage: "No payment data for this transaction."
        });
    }

    // 0. Check if new state is same as current state, or if it's already in a final state
    if ((newState !== payment.status) ||
        (transaction.status === 'PAID') ||
        (transaction.status === 'NOT PAID')
    ) {
        const trxSession = await db.sequelize.transaction();

        try {
            // 1. If the newState is PAID, go to next process.
            if (newState === 'PAID') {
                payment.status = newState;
                transaction.status = 'BOOKED';
                // 1a. Check if the totalAmount paid is greater or equal. If it less, then mark the transaction as PARTIALLY_PAID.
                // const remainingAmount = transaction.totalAmount - payment.payableAmount;
                // if (remainingAmount <= 0) {
                //     transaction.status = 'ISSUED';
                // } else {
                //     transaction.status = 'PARTIALLY_PAID';
                //     console.log(`Transaction for ${transaction.id} is PARTIALLY_PAID, amount to be paid is ${remainingAmount}`);
                // }
            }

            // 2. For now, if the payment is rejected, the transaction will be cancelled. The customer need to rebook their transaction.
            if (newState === 'REJECTED') {
                if(payment.status === 'PAID'){
                    payment.status = 'REFUND';
                    transaction.status = 'REFUND';
                }else{
                    payment.status = newState;
                    transaction.status = 'REJECTED';
                }
            }

            // Finally, save the transaction
            await payment.save({
                transaction: trxSession
            });
            await transaction.save({
                transaction: trxSession
            });

            // 3. Commit the transaction.
            await trxSession.commit();
            console.log(`New status for payment: ${payment.id} - ${payment.status} transaction: ${transaction.id} - ${transaction.status}`);

            return res.status(200).json({
                result: {
                    transactionId: transaction.id,
                    paymentId: payment.id
                },
                success: true,
                errorMessage: null
            });
        } catch (e) {
            console.log(`Transaction is aborted with exception: ${e}`);
            await trxSession.rollback();

            return res.status(500).json({
                result: null,
                success: false,
                errorMessage: `Unexpected server error ${e.message}`
            });
        }
    } else {
        return res.status(400).json({
            result: null,
            success: false,
            errorMessage: `Bad request, this payment is already at the same state or in final state`
        });
    }
});

module.exports = router;
