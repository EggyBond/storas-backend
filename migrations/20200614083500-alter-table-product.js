'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
          queryInterface.addColumn(
            'Products', // table name
            'building_area', // new field name
            {
              type: Sequelize.INTEGER,
              allowNull: true,
            },
          ),
          queryInterface.addColumn(
            'Products',
            'electricity',
            {
              type: Sequelize.INTEGER,
              allowNull: true,
            },
          ),
          queryInterface.addColumn(
            'Products',
            'total_floor',
            {
              type: Sequelize.INTEGER,
              allowNull: true,
            },
          ),
          queryInterface.addColumn(
            'Products',
            'pdam',
            {
              type: Sequelize.INTEGER,
              allowNull: true,
            },
          ),
          queryInterface.addColumn(
            'Products',
            'additional_facility',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          ),
          queryInterface.addColumn(
            'Products',
            'city',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          ),
          queryInterface.addColumn(
            'Products',
            'district',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          ),
          queryInterface.changeColumn(
            'Products',
            'images',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          ),
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Products', 'building_area'),
            queryInterface.removeColumn('Products', 'electricity'),
            queryInterface.removeColumn('Products', 'total_floor'),
            queryInterface.removeColumn('Products', 'pdam'),
            queryInterface.removeColumn('Products', 'additional_facility'),
            queryInterface.removeColumn('Products', 'city'),
            queryInterface.removeColumn('Products', 'district'),
          ]);
    }
};
