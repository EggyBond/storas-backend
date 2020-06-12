'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    customerId: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    totalAmount: DataTypes.INTEGER,
    decimalPoint: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    expiredAt: DataTypes.DATE
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};
