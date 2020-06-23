'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserWhistlists = sequelize.define('UserWhistlists', {
    customerId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  UserWhistlists.associate = function(models) {
    // associations can be defined here
  };
  return UserWhistlists;
};