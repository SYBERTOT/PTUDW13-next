'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CapPhepQuangCao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CapPhepQuangCao.belongsTo(models.DiemDat);
      CapPhepQuangCao.belongsTo(models.BangQuangCao);
    }
  }
  CapPhepQuangCao.init({
    NoiDung: DataTypes.STRING,
    TenCongTy: DataTypes.STRING,
    Email: DataTypes.STRING,
    DienThoai: DataTypes.STRING,
    DiaChiCongTy: DataTypes.STRING,
    NgayBatDau: DataTypes.DATE,
    NgayKetThuc: DataTypes.DATE,
    DiaChiAnh: DataTypes.STRING,
    TinhTrang: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'CapPhepQuangCao',
  });
  return CapPhepQuangCao;
};