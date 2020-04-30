'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    who: DataTypes.INTEGER,
    to: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Like.associate = function(models) {
    models.Like.belongsTo(models.Status,{
      foreignKey: 'to',
      targetKey : 'id'
    });
    models.Like.belongsTo(models.Account,{
      foreignKey: 'who',
      targetKey : 'id'
    });
  };
  return Like;
};