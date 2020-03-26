'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClientService = sequelize.define('ClientService', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'name is empty.'
        },
        len: {
          args: [1,30],
          msg: 'name is over 1~30 length.'
        }
      }
    },
    auther_id: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        isInt: true
      }
    },
    profile: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [0, 500]
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
  });
  ClientService.associate = function(models) {
    models.ClientService.hasMany(models.Token,{
      foreignKey: "service_id"
    });
    models.ClientService.belongsTo(models.Account,{
      foreignKey: 'auther_id',
      targetKey : 'id'
    });
  };
  return ClientService;
};