'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Products', [
            {
                name: "Warung House",
                ownerId: "2",
                cityId: "KOTA_ADMINISTRASI_JAKARTA_SELATAN",
                warehouseType: "PASSIVE",
                images: [
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg",
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg",
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg"
                ],
                geoLng: 106.6632394,
                geoLat: -6.2197166,
                price: 300000000,
                decimalPoint: 0,
                currency: "IDR",
                active: true,
                deleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Warhorse",
                ownerId: "2",
                cityId: "KOTA_BANDUNG",
                warehouseType: "ACTIVE",
                images: [
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg",
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg",
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg"
                ],
                geoLng: 106.6632394,
                geoLat: -6.2197166,
                price: 100000,
                decimalPoint: 0,
                currency: "IDR",
                active: true,
                deleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Where House?",
                ownerId: "2",
                cityId: "KOTA_BATU",
                warehouseType: "PASSIVE",
                images: [
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg",
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg",
                    "https://images.unsplash.com/photo-1549194388-2469d59ec75c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=chuttersnap-JWaXthlA9Cc-unsplash.jpg"
                ],
                geoLng: 106.6632394,
                geoLat: -6.2197166,
                price: 300000000,
                decimalPoint: 0,
                currency: "IDR",
                active: true,
                deleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }

        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products');
    }
};
