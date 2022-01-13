'use strict';
const {
  Model
} = require('sequelize');
const { encryptPass } = require('../helpers/Password');
const {appUrl,appPort} = require("../config/app");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    avatar: {
      type: DataTypes.STRING,
      get() { // esto retorna el avatar
        const avatar = this.getDataValue('avatar'); // leer la propiedad avatar cuando se obtiene un registro

        if(!avatar) {
          const img = this.getDataValue('gender') ? 'male.svg': 'female.svg';
          const url = `http://${appUrl}:${appPort}/${img}`;
          return url;
        }

        const id = this.getDataValue("id");
        return `http://${appUrl}:${appPort}/user/${id}/${avatar}` ; // devolver la nueva imagen
      }
    },
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: { // funciones que se ejecutan antes o despues de una funcion
      beforeCreate: async (user) => {
          user.password = await encryptPass(user.password,10); // encriptar la clave antes de que inserte, usando el hook de beforeCreate
        return user;
      },
      beforeUpdate: () => async (user) => {
        user.password = await encryptPass(user.password,10); // encriptar la clave antes de que inserte, usando el hook de beforeCreate
        return user;
      }
    }
  });
  return User;
};