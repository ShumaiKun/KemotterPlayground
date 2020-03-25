'use strict';
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    service_id: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        isInt: true
      }
    },
    account_id: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        isInt: true
      }
    },
    access_token: DataTypes.STRING,
    refresh_token: DataTypes.STRING
  }, {
    paranoid: true,
    underscored: true,
  });
  Token.associate = function(models) {
    // associations can be defined here
  };
  return Token;
};