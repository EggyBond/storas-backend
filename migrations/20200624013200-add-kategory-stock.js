'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'Stocks',
                'category',
                {
                  type: Sequelize.STRING,
                  allowNull: true,
                },
              ),
            queryInterface.addColumn(
                'Stocks',
                'price',
                {
                  type: Sequelize.INTEGER,
                  allowNull: true,
                },
              ),
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Stocks', 'category'),
            queryInterface.removeColumn('Stocks', 'price')
          ]);
    }
};
