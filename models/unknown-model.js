import { DataTypes } from "@sequelize/core";

import sequelize from "../db.js";

export const UnknownModel = sequelize.define("Unknown", {
  word: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    set(value) {
      if (value) {
        this.setDataValue("word", String(value).trim());
      }
    },
  },
  translate: {
    type: DataTypes.STRING(100),
  },
  correctCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
});
