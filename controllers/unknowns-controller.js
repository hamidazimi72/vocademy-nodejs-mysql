import axios from "axios";

import sequelize from "../db.js";
import { ConfigModel, KnownModel, UnknownModel } from "../models/index.js";
import { Op } from "@sequelize/core";
import { unknownsData } from "../data.js";
import { ArrayAPI } from "../utils/array.js";

export class UnknownsController {
  static async createWord(req, res) {
    const word = req?.body?.word;
    const translate = req?.body?.translate || null;

    try {
      const item = await UnknownModel.create({ word, translate });
      res.success("کلمه جدید با موفقیت ثبت شد", item, 201);
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
    }
  }

  static async bulkCreateWord(req, res) {
    try {
      const items = await UnknownModel.bulkCreate(
        unknownsData.map((item) => ({ word: item?.word, translate: item?.translate || null }))
      );
      // UnknownModel.destroy({ where: { word: { [Op.isNot]: null } } });
      res.success("کلمه جدید با موفقیت ثبت شد", items, 201);
    } catch (error) {
      console.log(error);
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
    const { wordId, selectedTranslate } = req?.body;

    try {
      const item = await UnknownModel.findByPk(wordId);
      if (!item) {
        res.fail("کلمه ای با این شناسه یافت نشد", 400);
        return;
      }
      if (item?.translate === selectedTranslate) {
        const correctAnswerConfigObj = await ConfigModel.findOne({
          where: { symbol: "MAX_CORRECT_COUNT_ANSWER" },
          raw: true,
        });
        if (correctAnswerConfigObj) {
          const configValue = +correctAnswerConfigObj?.value || 0;
          if (item?.correctCount + 1 < configValue) {
            const updatedItem = await item.update({ correctCount: item?.correctCount + 1 });
            res.success("پاسخ صحیح میباشد", updatedItem);
          } else if (item?.correctCount + 1 === configValue) {
            try {
              sequelize.transaction(async () => {
                await UnknownModel.destroy({ where: { id: item?.id } });
                await KnownModel.create({
                  word: item?.word,
                  translate: item?.translate,
                  correctCount: item?.correctCount + 1,
                });
                res.success("کلمه به لیست شناخته شده ها منتقل شد", null);
              });
            } catch (error) {
              console.log(error);
            }
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

  static async getAllUntranslatedWord(req, res) {
    const limit = req?.query?.limit || 10;
    const page = req?.query?.page || 1;

    try {
      const { rows, count } = await UnknownModel.findAndCountAll({
        where: { translate: null },
        limit,
        offset: (page - 1) * limit,
      });

      res.success("عملیات با موفقیت انجام شد", { items: rows, count });
    } catch (error) {
      //
    }
  }

  static async searchTranslate(req, res) {
    const word = req?.query?.word;

    try {
      const response = await axios.get(`${process.env.TRANSLATOR_BASE_URI}/get?langpair=en|fa&q=${word}`);
      res.success("عملیات با موفقیت انجام شد", response?.data?.matches);
    } catch (err) {
      res.status(500).json({ message: err?.message });
    }
  }

  static async createQuestion(req, res) {
    try {
      const { value: currentCountWord } = await ConfigModel.findOne({
        where: { symbol: "UNKNOWN_CURRENT_COUNT_WORD" },
        attributes: ["value"],
      });

      const items = await UnknownModel.findAll({
        where: { translate: { [Op.not]: null } },
        limit: +currentCountWord,
        attributes: ["id", "word", "translate"],
      });
      const selectedOptions = ArrayAPI.getRandomItems(items, 4);
      const options = selectedOptions.map((item) => item?.translate);
      const question = selectedOptions[Math.floor(Math.random() * 4)];
      const formattedQuestion = { id: question?.id, word: question?.word };
      res.success("ok", { options, question: formattedQuestion });
    } catch (error) {
      //
    }
  }
}
