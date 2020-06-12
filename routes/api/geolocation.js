const express = require('express');
const router = express.Router();
const Province = require('../../models').Province;
const City = require('../../models').City;

router.get('/cityList', async (req, res) => {
    const provinceIds = req.query.provinceIds === undefined ? [] : req.query.provinceIds.split(",");
    const whereQuery = {};

    if (provinceIds[0]) {
        whereQuery['provinceId'] = provinceIds;
    }

    const cities = await City.findAll(
        {
            where: whereQuery
        }
    );

    const citiesResult = cities.map(city => {
        return {
            id: city.id,
            name: city.name,
            provinceId: city.provinceId
        }
    });

    return res.status(200).json({
        result: {
            cities: citiesResult
        },
        success: true,
        errorMessage: null
    });
});

router.get('/provinceList', async (req, res) => {
    const provinces = await Province.findAll();

    const provincesResult = provinces.map(province => {
        return {
            id: province.id,
            name: province.name
        }
    });

    return res.status(200).json({
        result: {
            provinces: provincesResult,
        },
        success: true,
        errorMessage: null
    });
});


module.exports = router;
