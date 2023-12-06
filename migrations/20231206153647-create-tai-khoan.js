'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaiKhoans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      HoTen: {
        type: Sequelize.STRING
      },
      NgaySinh: {
        type: Sequelize.DATE
      },
      Email: {
        type: Sequelize.STRING
      },
      DienThoai: {
        type: Sequelize.STRING
      },
      TenTaiKhoan: {
        type: Sequelize.STRING
      },
      MatKhau: {
        type: Sequelize.STRING
      },
      KhuVuc: {
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
    await queryInterface.dropTable('TaiKhoans');
  }
};