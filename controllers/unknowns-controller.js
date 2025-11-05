import { UnknownModel } from "../models/index.js";

export class UnknownsController {
  static async createWord(req, res) {
    const { word, translate, correctCount } = req?.body;

    try {
      const item = await UnknownModel.create({ word, translate, correctCount });
      res.success("کلمه جدید با موفقیت ثبت شد", item, 201);
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
    }
  }

  static async updateTranslate(req, res) {
    const { translate } = req?.body;

    const id = +req?.params?.id || 0;

    try {
      const item = await UnknownModel.findByPk(id);
      if (!item) {
        res.fail("کلمه ای با این شناسه یافت نشد", 400);
      }
      const updatedItem = await item.update({ translate });
      res.success("ترجمه با موفقیت ویرایش شد", updatedItem);
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
    }
  }
}
