'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    itemName: DataTypes.STRING,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    receiptNo: DataTypes.STRING,
    courierId: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER
  }, {});
  Stock.associate = function(models) {
    // associations can be defined here
  };
  return Stock;
};