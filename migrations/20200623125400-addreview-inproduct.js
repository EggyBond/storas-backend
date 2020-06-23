'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
          queryInterface.addColumn(
            'Products',
            'rating',
            {
              type: Sequelize.FLOAT,
              allowNull: true,
            },
          )
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Products', 'rating')
          ]);
    }
};
