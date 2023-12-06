'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CapPhepQuangCaos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      NoiDung: {
        type: Sequelize.STRING
      },
      TenCongTy: {
        type: Sequelize.STRING
      },
      Email: {
        type: Sequelize.STRING
      },
      DienThoai: {
        type: Sequelize.STRING
      },
      DiaChiCongTy: {
        type: Sequelize.STRING
      },
      NgayBatDau: {
        type: Sequelize.DATE
      },
      NgayKetThuc: {
        type: Sequelize.DATE
      },
      DiaChiAnh: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('CapPhepQuangCaos');
  }
};