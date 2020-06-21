'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
          queryInterface.addColumn(
            'Payments', // table name
            'need_refund', // new field name
            {
              type: Sequelize.BOOLEAN,
              defaultValue: false
            },
          ),
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Payments', 'need_refund'),

          ]);
    }
};
