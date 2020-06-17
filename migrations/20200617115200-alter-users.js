'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
          queryInterface.addColumn(
            'Users', // table name
            'birthdate', // new field name
            {
              type: Sequelize.DATE,
            },
          ),
          queryInterface.addColumn(
            'Users',
            'profile_picture',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          ),
          queryInterface.addColumn(
            'Users',
            'id_picture',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          ),
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Users', 'birthdate'),
            queryInterface.removeColumn('Users', 'profile_picture'),
            queryInterface.removeColumn('Users', 'id_picture'),
          ]);
    }
};
