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
    await queryInterface.addColumn('BaoCaos','HinhThucBaoCaoId',{
      type: Sequelize.INTEGER,
      references:{
        model: 'HinhThucBaoCaos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('BaoCaos','DiemDatId',{
      type: Sequelize.INTEGER,
      references:{
        model: 'DiemDats',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('BaoCaos','BangQuangCaoId',{
      type: Sequelize.INTEGER,
      references:{
        model: 'BangQuangCaos',
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
    await queryInterface.removeColumn('BaoCaos','HinhThucBaoCaoId');
    await queryInterface.removeColumn('BaoCaos','DiemDatId');
    await queryInterface.removeColumn('BaoCaos','BangQuangCaoId');
  }
};
