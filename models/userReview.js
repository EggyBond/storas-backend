'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserReviews = sequelize.define('UserReviews', {
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  UserReviews.associate = function(models) {
    // associations can be defined here
  };
  return UserReviews;
};