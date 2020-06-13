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
router.get('/detail', async (req, res) => {
    const productId = req.query.id;
    const product = await Product.findByPk(productId);

    if (product === null) {
        return res.status(404).json({
            success: false,
            errorMessage: "Product not found"
        })
    }
    const city = await City.findByPk(product.cityId);

    return res.status(200).json({
        result: {
            id: product.id,
            name: product.name,
            description: product.description,
            cityName: city.name,
            warehouseType: product.warehouseType,
            images: product.images,
            price: product.price,
            geoLocation: {
                lng: product.geoLng,
                lat: product.geoLat
            }
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
    const cityIds = req.query.cityIds === undefined ? [] : req.query.cityIds.split(",");

    let whereQuery = {};
    if (warehouseType) {
        whereQuery['warehouseType'] = warehouseType;
    }

    if (ownedOnly) {
        whereQuery['ownerId'] = user.id;
    }

    if (cityIds[0]) {
        whereQuery['cityId'] = cityIds;
    }

    const productList = await Product.findAll({
        where: whereQuery
    });

    const productsResult = [];

    for (const product of productList) {
        let city = await City.findByPk(product.cityId);

        productsResult.push(
            {
                id: product.id,
                name: product.name,
                cityName: city.name,
                warehouseType: product.warehouseType,
                image: product.images[0],
                price: product.price
            }
        )
    }

    return res.status(200).json({
        result: {
            products: productsResult
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
        cityId,
        warehouseType,
        images,
        price,
        geolocation
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
        const [record, created] = await Product.upsert({
                id,
                ownerId: user.id,
                name,
                description,
                cityId,
                warehouseType,
                images,
                price,
                geoLng: geolocation.lng,
                geoLat: geolocation.lat
            },
            {
                returning: true
            }
        );

        return res.status(201).json({
            result: {
                productId: record.id
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

module.exports = router;