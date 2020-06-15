const express = require('express');
const router = express.Router();
const Product = require('../../models').Product;
const City = require('../../models').City;
const passport = require('passport');

/**
 * @route GET api/app/product/detail
 * @desc Get product detail
 * @access Public
 */


const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'storas_backend',
    password: 'root',
    port: 5432,
})

router.get('/detail', async (req, res) => {
    const productId = req.query.id;
    const product = await Product.findByPk(productId);

    if (product === null) {
        return res.status(404).json({
            success: false,
            errorMessage: "Product not found"
        })
    }

    return res.status(200).json({
        result: {
            id: product.id,
            name: product.name,
            description: product.description,
            city: product.city,
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
            additional_facility: product.additional_facility
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
    console.log("Testt ",req.query)
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
        additional_facility
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

        var input_query = 'INSERT INTO "Products" ("ownerId", name, description, "warehouseType", images, price, "geoLng", "geoLat", city, district, building_area, electricity, total_floor, pdam, additional_facility, "createdAt" , "updatedAt" ) VALUES ($1, $2, $3, $4 ,$5, $6 ,$7, $8 ,$9, $10, $11, $12, $13, $14 ,$15, NOW(), NOW()) returning id;';
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
            additional_facility
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
        additional_facility
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



        var update_query = 'UPDATE public."Products" SET "name"=$1, "ownerId"=$2, "city"=$3, "warehouseType"=$4, images=$5, "geoLng"=$6, "geoLat"=$7, price=$8, "updatedAt"=NOW(), description=$9, building_area=$10, electricity=$11, total_floor=$12, pdam=$13, additional_facility=$14, district=$15 WHERE id=$16;';
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


module.exports = router;