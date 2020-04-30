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
  };
  return Status;
};