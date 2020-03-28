'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tokens', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        after: 'updated_at'
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('tokens', 'deleted_at')
  }
};
