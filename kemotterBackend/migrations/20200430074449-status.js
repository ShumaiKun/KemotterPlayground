'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('statuses', 'created_at', {
        type: Sequelize.DATE,
        after: 'createdAt'
      }),
      queryInterface.addColumn('statuses', 'updated_at', {
        type: Sequelize.DATE,
        after: 'updatedAt'
      }),
      queryInterface.removeColumn('statuses', 'createdAt'),
      queryInterface.removeColumn('statuses', 'updatedAt')
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('statuses', 'createdAt', {
        type: Sequelize.DATE,
        after: 'created_at'
      }),
      queryInterface.addColumn('statuses', 'updatedAt', {
        type: Sequelize.DATE,
        after: 'updated_at'
      }),
      queryInterface.removeColumn('statuses', 'created_at'),
      queryInterface.removeColumn('statuses', 'updated_at')
    ]);
  }
};
