const express = require('express');
const router = express.Router();
const Product = require('../../models').Product;
const UserReviews = require('../../models').UserReviews;
const UserWhistlists = require('../../models').UserWhistlists;
const City = require('../../models').City;
const passport = require('passport');
const User = require('../../models').User;
/**
 * @route GET api/app/product/detail
 * @desc Get product detail
 * @access Public
 */


const Pool = require('pg').Pool
const pool = new Pool({
    user: 'ubuntu',
    host: 'localhost',
    database: 'storas_backend',
    password: 'root',
    port: 5432,
})

router.get('/detail', passport.authenticate('jwt', {
    session: false
}),async (req, res) => {
    const productId = req.query.id;
    const product = await Product.findByPk(productId);
    if (product === null) {
        return res.status(404).json({
            success: false,
            errorMessage: "Product not found"
        })
    }

    const owner = await User.findByPk(product.ownerId);

    let userReviewCount = await UserReviews.count({
        where : {
            productId: productId
        }
    });
    
    const wishlist = await UserWhistlists.findAll({
        where: {
            productId: productId,
            customerId: user.id,
        }
    });
    let isFavorite = false;
    if(wishlist.length > 0){
        isFavorite = true
    }

    let arrImages = JSON.parse(product.images)    
    let arrAdditional_facility = JSON.parse(product.additional_facility)
    return res.status(200).json({
        result: {
            id: product.id,
            ownerPhone: owner.phoneNo,
            ownerName: owner.fullName,
            name: product.name,
            description: product.description,
            city: product.city,
            address: product.address,
            province: product.province,
            warehouseType: product.warehouseType,
            images: product.images,
            price: product.price,
            geoLocation: {
                lng: product.geoLng,
                lat: product.geoLat
            },
            district: product.district,
            building_area: product.building_area,
            electricity: product.electricity,
            total_floor: product.total_floor,
            pdam: product.pdam,
            additional_facility: product.additional_facility,
            rating: product.rating,
            totalReview : userReviewCount,
            arrImages : arrImages,
            arrAdditional_facility : arrAdditional_facility,
            isFavorite: isFavorite
        },
        
        success: true,
        errorMessage: null
    });

});

router.get('/detailAll', async (req, res) => {
    const productId = req.query.id;
    const product = await Product.findByPk(productId);
    if (product === null) {
        return res.status(404).json({
            success: false,
            errorMessage: "Product not found"
        })
    }

    const user = await User.findByPk(product.ownerId);

    let userReviewCount = await UserReviews.count({
        where : {
            productId: productId
        }
    });
    
    let arrImages = JSON.parse(product.images)    
    let arrAdditional_facility = JSON.parse(product.additional_facility)
    return res.status(200).json({
        result: {
            id: product.id,
            ownerPhone: user.phoneNo,
            ownerName: user.fullName,
            name: product.name,
            description: product.description,
            city: product.city,
            address: product.address,
            province: product.province,
            warehouseType: product.warehouseType,
            images: product.images,
            price: product.price,
            geoLocation: {
                lng: product.geoLng,
                lat: product.geoLat
            },
            district: product.district,
            building_area: product.building_area,
            electricity: product.electricity,
            total_floor: product.total_floor,
            pdam: product.pdam,
            additional_facility: product.additional_facility,
            rating: product.rating,
            totalReview : userReviewCount,
            arrImages : arrImages,
            arrAdditional_facility : arrAdditional_facility
        },
        
        success: true,
        errorMessage: null
    });

});

/**
 * @route GET api/app/product/list
 * @desc Get product list
 * @access Public
 */
router.get('/list', passport.authenticate('jwt', {
    session: false
}),async (req, res) => {
    const warehouseType = req.query.warehouseType;
    const ownedOnly = req.query.ownedOnly || false;
    let whereQuery = {};
    if (warehouseType) {
        whereQuery['warehouseType'] = warehouseType;
    }

    if (ownedOnly) {
        whereQuery['ownerId'] = user.id;
    }

    whereQuery['deleted'] = false;
    
    const productList = await Product.findAll({
        where: whereQuery
    });

    const productsResult = [];


    return res.status(200).json({
        result: {
            products: productList
        },
        success: true,
        errorMessage: null
    });
});

router.get('/listAll', async (req, res) => {
    let page = req.query.page;
    const filter = Object.keys(req.query);
    const query = req.query;
    const sort = req.query.sort;
    let whereQuery = {};
    let order = [];
    const { Op } = require("sequelize");
    for(var i = 0; i < filter.length; i++){
        if(filter[i] != "page" && filter[i] != "limit" && filter[i] != "sort" && filter[i] != "facility" && filter[i] != "rating"){
            whereQuery[filter[i]] = {
                [Op.like]: `%${query[filter[i]]}%`
            }
        }else if(filter[i] == "rating"){
            whereQuery[filter[i]] = query[filter[i]]
        }
    }
    whereQuery['deleted'] = false;
    
    if(sort == "PriceHighToLow"){
        order.push(['price', 'desc'])
    }else if(sort == "PriceLowToHigh"){
        order.push(['price', 'asc'])
    }else if(sort == "Newest"){
        order.push(['createdAt', 'desc'])
    }else if(sort == "AscOrder"){
        order.push(['name', 'asc'])
    }else if(sort == "DescOrder"){
        order.push(['name', 'desc'])
    }else if(sort == "Rating"){
        order.push(['rating', 'desc'])
    }

    let limit = undefined
    if(page !== undefined){
        limit = 10;
        page = (page - 1) * limit; 
    }
    try{
        const result = await Product.findAll({
            where: whereQuery, offset: page, limit: limit, order: order
        });
        
        const totalProduct = await Product.count({
            where: whereQuery,
        });

        var totalPage = 1
        if(limit){
            totalPage = Math.ceil(totalProduct/limit)
        }
        const resultList = result.map(product => {
            let arrImages = JSON.parse(product.dataValues.images)    
            let arrAdditional_facility = JSON.parse(product.dataValues.additional_facility)
            return {...product.dataValues, arrImages, arrAdditional_facility}
        })

        let productList = resultList;
        // if(req.query.additional_facility){
        //     let param_additional_facility = req.query.additional_facility;
        //     productList = resultList.filter(e=>{
        //         let filtered = true;
        //         let additional_facility = JSON.parse(e.dataValues.additional_facility)
        //         for (var i = 0 ; i < param_additional_facility.length; i ++){
        //             if(!additional_facility.includes(param_additional_facility[i])){
        //                 filtered = false;
        //             }
        //         }
        //         return filtered
        //     })
        // }
        return res.status(200).json({
            result: {
                products: productList,
                total_page: totalPage
            },
            success: true,
            errorMessage: null
        });
    }catch(e){
        console.log(e)
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "Unknown Error"
        });
    }

});


/**
 * @route GET api/app/product/upsert
 * @desc Insert and Update Product
 * @access Private
 */
router.post('/upsert', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    if (user.type !== "PRODUCT_OWNER") {
        return res.status(403).json({
            result: {
                productId: null
            },
            success: false,
            errorMessage: "Unauthorized. Only Product Owner can create product"
        });
    }

    const {
        id,
        name,
        description,
        warehouseType,
        images,
        price,
        geolocation,
        city,
        district,
        building_area,
        electricity,
        total_floor,
        pdam,
        additional_facility,
        address,
        province
    } = req.body;


    try {
        if (id) {
            const existingProduct = await Product.findByPk(id);
            if (existingProduct.ownerId !== user.id) {
                return res.status(403).json({
                    result: {
                        productId: null
                    },
                    success: true,
                    errorMessage: "Unauthorized. You're not the owner of this product."
                });
            }
        }

        var input_query = 'INSERT INTO "Products" ("ownerId", name, description, "warehouseType", images, price, "geoLng", "geoLat", city, district, building_area, electricity, total_floor, pdam, additional_facility, "createdAt" , "updatedAt", address, province ) VALUES ($1, $2, $3, $4 ,$5, $6 ,$7, $8 ,$9, $10, $11, $12, $13, $14 ,$15, NOW(), NOW(), $16, $17) returning id;';
        var values = [
            user.id,
            name,
            description,
            warehouseType,
            images,
            price,
            geolocation.lng,
            geolocation.lat,
            city,
            district,
            building_area,
            electricity,
            total_floor,
            pdam,
            additional_facility,
            address,
            province
        ]

        pool.query(input_query, values, (error, results) => {
            if (error) {
              throw error
            }
            console.log(results)

          })

        return res.status(201).json({
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

router.put('/delete', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    if (user.type !== "PRODUCT_OWNER") {
        return res.status(403).json({
            result: {
                productId: null
            },
            success: false,
            errorMessage: "Unauthorized. Only Product Owner can create product"
        });
    }

    const {
        id,
    } = req.body;


    try {
        if (id) {
            const existingProduct = await Product.findByPk(id);
            if (existingProduct.ownerId !== user.id) {
                return res.status(403).json({
                    result: {
                        productId: null
                    },
                    success: true,
                    errorMessage: "Unauthorized. You're not the owner of this product."
                });
            }
        }



        Product.update(
            {deleted: true},
            {where: {id: id}}
        ).then(function(rowsUpdated) {
            return res.status(201).json({
                success: true,
                errorMessage: null
            });
        }).catch(function(e){
            return res.status(400).json({
                success: false,
                errorMessage: e
            });
        })


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

router.put('/update', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    if (user.type !== "PRODUCT_OWNER") {
        return res.status(403).json({
            result: {
                productId: null
            },
            success: false,
            errorMessage: "Unauthorized. Only Product Owner can create product"
        });
    }

    const {
        id,
        name,
        description,
        warehouseType,
        images,
        price,
        geolocation,
        city,
        district,
        building_area,
        electricity,
        total_floor,
        pdam,
        additional_facility,
        address,
        province
    } = req.body;


    try {
        if (id) {
            const existingProduct = await Product.findByPk(id);
            if (existingProduct.ownerId !== user.id) {
                return res.status(403).json({
                    result: {
                        productId: null
                    },
                    success: true,
                    errorMessage: "Unauthorized. You're not the owner of this product."
                });
            }
        }



        var update_query = 'UPDATE public."Products" SET "name"=$1, "ownerId"=$2, "city"=$3, "warehouseType"=$4, images=$5, "geoLng"=$6, "geoLat"=$7, price=$8, "updatedAt"=NOW(), description=$9, building_area=$10, electricity=$11, total_floor=$12, pdam=$13, additional_facility=$14, district=$15, address=$16, province=$17 WHERE id=$18;';
        var values = [
            name,
            user.id,
            city,
            warehouseType,
            images,
            geolocation.lng,
            geolocation.lat,
            price,
            description,
            building_area,
            electricity,
            total_floor,
            pdam,
            additional_facility,
            district,
            address,
            province,
            id
        ]
        pool.query(update_query, values, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    errorMessage: error
                });
            }
            console.log(results)
            return res.status(201).json({
                success: true,
                errorMessage: null
            });
          })



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
 * @route POST api/app/transaction/checkout
 * @desc Checkout Transaction
 * @access Private
 */
router.post('/reviewProduct', async (req, res) => {

    const {
        description,
        email,
        name,
        productId,
        rating,
        title
    } = req.body;

    const product = await Product.findByPk(productId);
    
    if (!product) {
        return res.status(403).json({
            result: {
                transactionId: null
            },
            success: false,
            errorMessage: "Product is no longer available"
        });
    }

    try{
        await UserReviews.create({
            productId: product.id,
            description: description,
            email: email,
            name: name,
            title: title,
            rating: rating,
        })
        // let userReview = await UserReviews.findAll({
        //     attributes: [[sequelize.fn('sum', sequelize.col('rating')), 'ratingTotal'], [sequelize.fn('count', sequelize.col('rating')), 'total']],
        //     group : ['UserReviews.rating'],
        //     where : {
        //         productId: prd.id
        //     }
        // });
        let userReviewCount = await UserReviews.count({
            where : {
                productId: productId
            }
        });
        let userReviewTotal =  await UserReviews.sum('rating',{
            where: {
                productId: productId
            }
        })


        let ratingTotal = Math.round(userReviewTotal/userReviewCount);
        await Product.update({
            rating: ratingTotal
          }, {
            where: {
              id: productId
            }
          })

        return res.status(201).json({
            data: null,
            success: true,
            errorMessage: null
        });
    }catch(e){
        console.log(e)
        return res.status(400).json({
            success: false,
            errorMessage: e
        });
    }

});

/**
 * @route POST api/app/transaction/checkout
 * @desc Checkout Transaction
 * @access Private
 */
router.post('/addToWishlist', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    const {
        productId,
    } = req.body;

    const product = await Product.findByPk(productId);
    
    if (!product) {
        return res.status(403).json({
            result: {
                transactionId: null
            },
            success: false,
            errorMessage: "Product is no longer available"
        });
    }

    const wishlist = await UserWhistlists.findAll({
        where: {
            productId: productId,
            customerId: user.id,
        }
    });

    if(wishlist.length > 0){
        return res.status(400).json({
            success: false,
            errorMessage: "Already wished"
        });
    }

    try{
        await UserWhistlists.create({
            productId: productId,
            customerId: user.id,
        })

        return res.status(201).json({
            data: null,
            success: true,
            errorMessage: null
        });
    }catch(e){
        return res.status(400).json({
            success: false,
            errorMessage: e
        });
    }

});

/**
 * @route POST api/app/transaction/checkout
 * @desc Checkout Transaction
 * @access Private
 */
router.post('/removeWishlist', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    const {
        productId,
    } = req.body;

    const product = await Product.findByPk(productId);
    
    if (!product) {
        return res.status(403).json({
            result: {
                transactionId: null
            },
            success: false,
            errorMessage: "Product is no longer available"
        });
    }

    try{
        await UserWhistlists.destroy({
            where: {
                productId: productId,
                customerId: user.id,
            }
        })
        return res.status(201).json({
            data: null,
            success: true,
            errorMessage: null
        });
    }catch(e){
        console.log(e)
        return res.status(400).json({
            success: false,
            errorMessage: e
        });
    }

});

router.get('/wishlist', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const filter = Object.keys(req.query);
    const query = req.query;
    const sort = req.query.sort;

    const wishlist = await UserWhistlists.findAll({
        where: {
            customerId: user.id
        }
    });

    let wishlistId =[];

    for (const wish of wishlist) {
        wishlistId.push(wish.productId)
    }

    if(wishlist.length == 0){
        return res.status(200).json({
            result: {
                products: []
            },
            success: true,
            errorMessage: null
        });
    }

    try{
        let whereQuery = {};
        let order = [];
        console.log(wishlistId)
        whereQuery['deleted'] = false;
        whereQuery['id'] = wishlistId
        
        const productList = await Product.findAll({
            where: whereQuery, order: order
        });
    
        return res.status(200).json({
            result: {
                products: productList
            },
            success: true,
            errorMessage: null
        });
    }catch(e){
        console.log(e)
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "Unknown Error"
        });
    }

});

module.exports = router;