'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  events.init({
    user_id: DataTypes.INTEGER,
    imgURL: DataTypes.STRING,
    eventName: DataTypes.STRING,
    startDate: DataTypes.STRING,
    startTime: DataTypes.STRING,
    venueName: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    URL: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'events',
  });
  return events;
};