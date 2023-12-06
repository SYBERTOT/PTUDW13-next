'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('YeuCauChinhSuaThongTins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      LoaiChinhSua: {
        type: Sequelize.BOOLEAN
      },
      ThoiDiemXin: {
        type: Sequelize.DATE
      },
      LyDo: {
        type: Sequelize.STRING
      },
      DiaChi: {
        type: Sequelize.STRING
      },
      KichThuoc: {
        type: Sequelize.STRING
      },
      DiaChiAnh: {
        type: Sequelize.STRING
      },
      KhuVuc: {
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
    await queryInterface.dropTable('YeuCauChinhSuaThongTins');
  }
};