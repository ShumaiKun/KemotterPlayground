'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'protect', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: 'profile'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'protect');
  }
};
