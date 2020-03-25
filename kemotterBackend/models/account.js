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
    displayName: {
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
    // associations can be defined here
  };
  return Account;
};