'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    phoneNo: DataTypes.BIGINT,
    verificationStatus: DataTypes.BOOLEAN,
    type: DataTypes.STRING,
    birthdate:  DataTypes.DATE,
    profile_picture: DataTypes.STRING,
    id_picture: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};