'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id'
        }
      },
      cityId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Cities',
          },
          key: 'id'
        }
      },
      warehouseType: {
        type: Sequelize.STRING
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      geoLng: {
        type: Sequelize.DOUBLE
      },
      geoLat: {
        type: Sequelize.DOUBLE
      },
      price: {
        type: Sequelize.INTEGER
      },
      decimalPoint: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'IDR'
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};
