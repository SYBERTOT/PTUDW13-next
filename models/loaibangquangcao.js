'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoaiBangQuangCao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LoaiBangQuangCao.hasMany(models.BangQuangCao);
      LoaiBangQuangCao.hasMany(models.YeuCauChinhSuaThongTin);
    }
  }
  LoaiBangQuangCao.init({
    Ten: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LoaiBangQuangCao',
  });
  return LoaiBangQuangCao;
};