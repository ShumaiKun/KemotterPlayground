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
    models.Token.belongsTo(models.ClientService,{
      foreignKey: 'service_id',
      targetKey : 'id'
    });
    models.Token.belongsTo(models.Account,{
      foreignKey: 'account_id',
      targetKey : 'id'
    });
  };
  return Token;
};