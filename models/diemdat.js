'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiemDat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DiemDat.hasMany(models.BangQuangCao);
      DiemDat.belongsTo(models.LoaiDiemDat);
      DiemDat.belongsTo(models.HinhThucDiemDat);
      DiemDat.hasMany(models.YeuCauChinhSuaThongTin);
      DiemDat.hasMany(models.CapPhepQuangCao);
    }
  }
  DiemDat.init({
    DiaChi: DataTypes.STRING,
    KinhDo: DataTypes.STRING,
    ViDo: DataTypes.STRING,
    KhuVuc: DataTypes.STRING,
    DiaChiAnh: DataTypes.STRING,
    QuyHoach: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'DiemDat',
  });
  return DiemDat;
};