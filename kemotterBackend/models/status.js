'use strict';
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('Status', {
    whose: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    reply: DataTypes.INTEGER,
    boost: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Status.associate = function(models) {
    models.Status.hasMany(models.Like,{
      foreignKey: "to"
    });
    models.Status.belongsTo(models.Account,{
      foreignKey: 'whose',
      targetKey : 'id'
    });
    models.Status.hasMany(models.Status,{
      foreignKey: "reply",
      as: 'replies'
    });
    models.Status.belongsTo(models.Status,{
      foreignKey: 'reply',
      targetKey : 'id',
    });
    models.Status.hasMany(models.Status,{
      foreignKey: "boost",
      as: 'boosts'
    });
    models.Status.belongsTo(models.Status,{
      foreignKey: 'boost',
      targetKey : 'id',
    });
  };
  return Status;
};