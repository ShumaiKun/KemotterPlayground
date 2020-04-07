'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    name: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        len: [1,30]
      }
    },
    display_name: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 50]
      }
    },
    profile: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 500]
      }
    },
    location: {
      type: DataTypes.STRING,
      validate: {
        len: [0,50]
      }
    },
    webaddress: {
      type: DataTypes.STRING,
      validate: {
        len: [0,50]
      }
    },
    birthday: {
      type: DataTypes.DATE,
    },
    json: {
      type: DataTypes.TEXT
    }
  }, {
    paranoid: true,
    underscored: true,
  });
  Account.associate = function(models) {
    models.Account.hasMany(models.ClientService,{
      foreignKey: "auther_id"
    });
    models.Account.hasMany(models.Token,{
      foreignKey: "account_id"
    });
  };
  return Account;
};