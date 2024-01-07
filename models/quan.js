'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Quan.hasMany(models.Phuong);
    }
  }
  Quan.init({
    Ten: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Quan',
  });
  return Quan;
};