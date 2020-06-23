'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'Stocks',
                'productId',
                {
                  type: Sequelize.INTEGER,
                  allowNull: true,
                },
              ),
            queryInterface.changeColumn(
                'Stocks',
                'courierId',
                {
                type: Sequelize.TEXT,
                allowNull: true,
                },
            ),
            queryInterface.changeColumn(
                'Stocks',
                'receiptNo',
                {
                type: Sequelize.TEXT,
                allowNull: true,
                },
            ),
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Stocks', 'productId')
          ]);
    }
};
