'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BangQuangCao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BangQuangCao.belongsTo(models.DiemDat);
      BangQuangCao.belongsTo(models.LoaiBangQuangCao);
      BangQuangCao.hasMany(models.YeuCauChinhSuaThongTin);
      BangQuangCao.hasMany(models.CapPhepQuangCao);
    }
  }
  BangQuangCao.init({
    KichThuoc: DataTypes.STRING,
    DiaChiAnh: DataTypes.STRING,
    NgayHetHan: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BangQuangCao',
  });
  return BangQuangCao;
};