'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
          queryInterface.addColumn(
            'Transactions', // table name
            'start_date', // new field name
            {
              type: Sequelize.DATE,
            },
          ),
          queryInterface.addColumn(
            'Transactions',
            'end_date',
            {
              type: Sequelize.DATE,
            },
          ),
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Transactions', 'start_date'),
            queryInterface.removeColumn('Transactions', 'end_date'),

          ]);
    }
};
