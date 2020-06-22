'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
          queryInterface.addColumn(
            'Products',
            'address',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          ),
          queryInterface.addColumn(
            'Products',
            'province',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          ),
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Products', 'address'),
            queryInterface.removeColumn('Products', 'province'),
          ]);
    }
};
