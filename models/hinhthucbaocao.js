'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HinhThucBaoCao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HinhThucBaoCao.hasMany(models.BaoCao);
    }
  }
  HinhThucBaoCao.init({
    Ten: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HinhThucBaoCao',
  });
  return HinhThucBaoCao;
};