'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    ownerId: DataTypes.INTEGER,
    cityId: DataTypes.STRING,
    warehouseType: DataTypes.STRING,
    images: DataTypes.ARRAY(DataTypes.TEXT),
    geoLng: DataTypes.DOUBLE,
    geoLat: DataTypes.DOUBLE,
    price: DataTypes.INTEGER,
    decimalPoint: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};
