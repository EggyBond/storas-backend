'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('BillingDetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            paymentId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Payments',
                    },
                    key: 'id'
                }
            },
            full_name: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            country: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING
            },
            city: {
                type: Sequelize.STRING
            },
            state: {
                type: Sequelize.STRING
            },
            pincode: {
                type: Sequelize.STRING
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
      return queryInterface.dropTable('BillingDetails');
    }
};
