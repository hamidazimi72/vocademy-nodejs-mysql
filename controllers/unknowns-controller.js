import { raw } from "express";
import { ConfigModel, UnknownModel } from "../models/index.js";

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

  static async answerChecking(req, res) {
    const { wordId, translate } = req?.body;

    try {
      const item = await UnknownModel.findByPk(wordId);
      if (!item) {
        res.fail("کلمه ای با این شناسه یافت نشد", 400);
        return;
      }
      if (item?.translate === translate) {
        const correctAnswerConfigObj = await ConfigModel.findOne({
          where: { symbol: "MAX_CORRECT_COUNT_ANSWER" },
          raw: true,
        });
        if (correctAnswerConfigObj) {
          const value = +correctAnswerConfigObj?.value || 0;
          if (item?.correctCount + 1 < value) {
            const updatedItem = await item.update({ correctCount: item?.correctCount + 1 });
            res.success("پاسخ صحیح میباشد", updatedItem);
          } else if (item?.correctCount + 1 === value) {
            res.success("کلمه به لیست شناخته شده ها منتقل شد", null);
          }
        } else {
        }
        // console.log(correctAnswerConfig);
      } else {
        res.fail("ترجمه صحیح نمیباشد", 404);
      }
      // const updatedItem = await item.update({ translate });
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
      console.log(error);
    }
  }
}
