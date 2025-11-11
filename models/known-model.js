import { DataTypes } from "@sequelize/core";

import sequelize from "../db.js";

export const KnownModel = sequelize.define(
  "Known",
  {
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
    },
  },
  {
    updatedAt: false,
  }
);
