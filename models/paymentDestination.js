'use strict';
module.exports = (sequelize, DataTypes) => {
    const PaymentDestination = sequelize.define('PaymentDestination', {
        bankName: DataTypes.STRING,
        accountName: DataTypes.STRING,
        accountNumber: DataTypes.STRING
    }, {});
    PaymentDestination.associate = function (models) {
        // associations can be defined here
    };
    return PaymentDestination;
};
