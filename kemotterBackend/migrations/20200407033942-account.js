'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'displayName');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'displayName', {
      allowNull: false,
      type: Sequelize.STRING,
      after: 'name'
    });
  }
};
