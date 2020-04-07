'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'display_name', {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
        after: 'displayName'
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'display_name')
  }
};
