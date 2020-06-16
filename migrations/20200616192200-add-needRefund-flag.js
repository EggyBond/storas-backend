'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
          queryInterface.addColumn(
            'Transactions', // table name
            'need_refund', // new field name
            {
              type: Sequelize.BOOLEAN,
            },
          ),
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Transactions', 'need_refund'),

          ]);
    }
};
