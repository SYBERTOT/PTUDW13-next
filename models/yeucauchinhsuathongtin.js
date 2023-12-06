'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class YeuCauChinhSuaThongTin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      YeuCauChinhSuaThongTin.belongsTo(models.LoaiDiemDat);
      YeuCauChinhSuaThongTin.belongsTo(models.LoaiBangQuangCao);
      YeuCauChinhSuaThongTin.belongsTo(models.DiemDat);
      YeuCauChinhSuaThongTin.belongsTo(models.BangQuangCao);
      YeuCauChinhSuaThongTin.belongsTo(models.HinhThucDiemDat);
    }
  }
  YeuCauChinhSuaThongTin.init({
    LoaiChinhSua: DataTypes.BOOLEAN,
    ThoiDiemXin: DataTypes.DATE,
    LyDo: DataTypes.STRING,
    DiaChi: DataTypes.STRING,
    KichThuoc: DataTypes.STRING,
    DiaChiAnh: DataTypes.STRING,
    KhuVuc: DataTypes.STRING,
    QuyHoach: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'YeuCauChinhSuaThongTin',
  });
  return YeuCauChinhSuaThongTin;
};