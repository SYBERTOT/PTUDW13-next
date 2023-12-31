'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BaoCao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BaoCao.belongsTo(models.DiemDat);
      BaoCao.belongsTo(models.BangQuangCao);
      BaoCao.belongsTo(models.HinhThucBaoCao);
      BaoCao.belongsTo(models.TaiKhoan);
    }
  }
  BaoCao.init({
    NoiDung: DataTypes.TEXT,
    HoTen: DataTypes.STRING,
    Email: DataTypes.STRING,
    DienThoai: DataTypes.STRING,
    laDiemDat: DataTypes.BOOLEAN,
    XuLy: DataTypes.BOOLEAN,
    HinhThucXuLy: DataTypes.STRING,
    DiaChi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'BaoCao',
  });
  return BaoCao;
};