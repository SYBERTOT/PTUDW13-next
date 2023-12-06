'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('DiemDats','HinhThuc');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('DiemDats');
  }
};
