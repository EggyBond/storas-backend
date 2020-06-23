'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    ownerId: DataTypes.INTEGER,
    cityId: DataTypes.STRING,
    address: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    district: DataTypes.STRING,
    warehouseType: DataTypes.STRING,
    images: DataTypes.ARRAY(DataTypes.TEXT),
    geoLng: DataTypes.DOUBLE,
    geoLat: DataTypes.DOUBLE,
    price: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    decimalPoint: DataTypes.INTEGER,
    building_area: DataTypes.INTEGER,
    electricity: DataTypes.INTEGER,
    total_floor: DataTypes.INTEGER,
    pdam: DataTypes.INTEGER,
    additional_facility: DataTypes.STRING,
    currency: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};
