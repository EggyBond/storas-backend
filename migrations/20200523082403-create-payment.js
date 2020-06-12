'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Payments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            transactionId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Transactions',
                    },
                    key: 'id'
                }
            },
            srcBankName: {
                type: Sequelize.STRING
            },
            srcAccountName: {
                type: Sequelize.STRING
            },
            srcAccountNumber: {
                type: Sequelize.STRING
            },
            dstBankName: {
                type: Sequelize.STRING
            },
            dstAccountName: {
                type: Sequelize.STRING
            },
            dstAccountNumber: {
                type: Sequelize.STRING
            },
            paymentMethod: {
                type: Sequelize.STRING,
                defaultValue: "BANK_TRANSFER"
            },
            payableAmount: {
                type: Sequelize.INTEGER
            },
            decimalPoint: {
                type: Sequelize.INTEGER
            },
            currency: {
                type: Sequelize.STRING
            },
            paymentProofUrl: {
                type: Sequelize.TEXT
            },
            status: {
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
        return queryInterface.dropTable('Payments');
    }
};
