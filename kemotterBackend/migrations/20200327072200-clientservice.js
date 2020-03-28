'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('clientservices', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        after: 'updated_at'
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('clientservices', 'deleted_at')
  }
};
