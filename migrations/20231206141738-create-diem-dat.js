'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DiemDats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DiaChi: {
        type: Sequelize.STRING
      },
      KinhDo: {
        type: Sequelize.STRING
      },
      ViDo: {
        type: Sequelize.STRING
      },
      KhuVuc: {
        type: Sequelize.STRING
      },
      HinhThuc: {
        type: Sequelize.STRING
      },
      DiaChiAnh: {
        type: Sequelize.STRING
      },
      QuyHoach: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DiemDats');
  }
};