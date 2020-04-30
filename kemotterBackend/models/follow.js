'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    who: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    confirmed: DataTypes.BOOLEAN
  }, {
    underscored: true,
  });
  Follow.associate = function(models) {
    models.Follow.belongsTo(models.Account,{
      as: "following",
      foreignKey: "who",
      targetKey: "id"
    });
    models.Follow.belongsTo(models.Account,{
      as: "follower",
      foreignKey: "to",
      targetKey: "id"
    });
  };
  return Follow;
};