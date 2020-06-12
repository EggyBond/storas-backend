'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Products',
            'description',
            Sequelize.TEXT
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Products',
            'description'
        );
    }
};
