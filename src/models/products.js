'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    sold: DataTypes.INTEGER,
    type: DataTypes.STRING,
    image: DataTypes.STRING,
    unit: DataTypes.STRING,
    describe: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};