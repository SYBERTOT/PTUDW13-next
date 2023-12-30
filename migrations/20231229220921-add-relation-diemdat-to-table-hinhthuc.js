'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('DiemDats','HinhThucDiemDatId',{
      type: Sequelize.INTEGER,
      references:{
        model: 'HinhThucDiemDats',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('DiemDats','HinhThucDiemDatId');
    }
  }
};
