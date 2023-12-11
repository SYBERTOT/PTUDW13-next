'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('DiemDats', [
      {
        DiaChi: '125 Đ.An Dương Vương, Phường 8, Quận 5, Thành phố Hồ Chí Minh, Vietnam',
        KinhDo: '10.756610736330147',
        ViDo :'106.67031818071604',
        KhuVuc:'Phường 8, Quận 5',
        DiaChiAnh:'../img/1.png',
        QuyHoach:true,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()'), 
        LoaiDiemDatId: 2
      },
      {
        DiaChi: '227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Vietnam',
        KinhDo: '10.762742931644675',
        ViDo :  '106.68231546746098',
        KhuVuc: 'Phường 4, Quận 5',
        DiaChiAnh:'../img/1.png',
        QuyHoach:true,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()'), 
        LoaiDiemDatId: 1
      },
      {
        DiaChi: '202 Đ. Lê Hồng Phong, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Vietnam',
        KinhDo: '10.759907630412188',
        ViDo :  '106.67749822036792',
        KhuVuc: 'Phường 4, Quận 5',
        DiaChiAnh:'../img/1.png',
        QuyHoach:true,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()'), 
        LoaiDiemDatId: 6
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('DiemDats', null, {});
  }
};
