'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                'Products',
                'rating',
                {
                  type: Sequelize.INTEGER,
                  allowNull: true,
                },
              )
        ]);
      },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
          ]);
    }
};
