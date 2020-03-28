'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        after: 'updated_at'
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'deleted_at')
  }
};
