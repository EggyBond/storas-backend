'use strict';
module.exports = (sequelize, DataTypes) => {
    const BillingDetail = sequelize.define('BillingDetail', {
        paymentId: DataTypes.INTEGER,
        full_name: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        pincode: DataTypes.STRING,
    }, {});
    BillingDetail.associate = function (models) {
        // associations can be defined here
    };
    return BillingDetail;
};
