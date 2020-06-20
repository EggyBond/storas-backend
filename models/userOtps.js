'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserOtps = sequelize.define('UserOtps', {
    userId: DataTypes.INTEGER,
    otp: DataTypes.STRING,
    expired: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  UserOtps.associate = function(models) {
    // associations can be defined here
  };
  return UserOtps;
};