import { DataTypes } from "@sequelize/core";

import sequelize from "../db.js";

export const ConfigModel = sequelize.define("Config", {
  symbol: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    set(value) {
      if (value) {
        this.setDataValue("symbol", String(value).trim());
      }
    },
  },
  value: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});
