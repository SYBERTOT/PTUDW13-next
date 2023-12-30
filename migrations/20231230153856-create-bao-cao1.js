'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BaoCaos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      NoiDung: {
        type: Sequelize.TEXT
      },
      HoTen: {
        type: Sequelize.STRING
      },
      Email: {
        type: Sequelize.STRING
      },
      DienThoai: {
        type: Sequelize.STRING
      },
      laDiemDat: {
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
    await queryInterface.dropTable('BaoCaos');
  }
};