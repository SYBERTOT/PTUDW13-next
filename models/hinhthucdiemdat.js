'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HinhThucDiemDat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HinhThucDiemDat.hasMany(models.DiemDat);
      HinhThucDiemDat.hasMany(models.YeuCauChinhSuaThongTin);
    }
  }
  HinhThucDiemDat.init({
    Ten: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HinhThucDiemDat',
  });
  return HinhThucDiemDat;
};