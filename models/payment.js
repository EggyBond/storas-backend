'use strict';
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        transactionId: DataTypes.INTEGER,
        srcBankName: DataTypes.STRING,
        srcAccountName: DataTypes.STRING,
        srcAccountNumber: DataTypes.STRING,
        dstBankName: DataTypes.STRING,
        dstAccountName: DataTypes.STRING,
        dstAccountNumber: DataTypes.STRING,
        paymentMethod: DataTypes.INTEGER,
        payableAmount: DataTypes.INTEGER,
        decimalPoint: DataTypes.INTEGER,
        currency: DataTypes.STRING,
        paymentProofUrl: DataTypes.TEXT,
        status: DataTypes.STRING
    }, {});
    Payment.associate = function (models) {
        // associations can be defined here
    };
    return Payment;
};
