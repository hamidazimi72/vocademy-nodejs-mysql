import { Op } from "@sequelize/core";
import sequelize from "../db.js";
import { KnownModel, UnknownModel } from "../models/index.js";

export class KnownsController {
  static async getAllKnowns(req, res) {
    const limit = +req?.query?.limit || 10;
    const page = +req?.query?.page || 1;
    const q = req?.query?.q || "";

    try {
      const { rows, count } = await KnownModel.findAndCountAll({
        where: { word: { [Op.like]: `%${q}%` } },
        limit,
        offset: (page - 1) * limit,
      });

      res.success("عملیات با موفقیت انجام شد", { items: rows, count });
    } catch (error) {}
  }

  static async returnToUnknowns(req, res) {
    const id = +req?.params?.id || 0;

    try {
      const item = await KnownModel.findByPk(id);
      if (!item) {
        res.fail("کلمه ای با این شناسه یافت نشد", 400);
        return;
      }

      try {
        sequelize.transaction(async () => {
          await KnownModel.destroy({ where: { id } });
          await UnknownModel.create({ word: item?.word, translate: item?.translate, correctCount: 0 });
          res.success("کلمه به لیست ناشناخته ها منتقل شد", null);
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
    }
  }

  static async moveToKnowns(req, res) {
    const id = +req?.body?.id || 0;

    const item = await UnknownModel.findByPk(id);
    if (!item) {
      res.fail("کلمه ای با این شناسه یافت نشد", 400);
      return;
    }

    try {
      sequelize.transaction(async () => {
        await UnknownModel.destroy({ where: { id } });
        await KnownModel.create({
          word: item?.word,
          translate: item?.translate || null,
          correctCount: item?.correctCount > 0 ? item?.correctCount + 1 : 0,
        });
        res.success("کلمه به لیست شناخته ها منتقل شد", null);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
