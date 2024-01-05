'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaiKhoan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaiKhoan.belongsTo(models.LoaiTaiKhoan);
      TaiKhoan.hasMany(models.BaoCao);
    }
  }
  TaiKhoan.init({
    HoTen: DataTypes.STRING,
    NgaySinh: DataTypes.DATE,
    Email: DataTypes.STRING,
    DienThoai: DataTypes.STRING,
    TenTaiKhoan: DataTypes.STRING,
    MatKhau: DataTypes.STRING,
    KhuVuc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TaiKhoan',
  });
  return TaiKhoan;
};