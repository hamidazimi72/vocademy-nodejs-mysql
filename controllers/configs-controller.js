import { ConfigModel } from "../models/index.js";

export class ConfigController {
  static async getAllConfigs(req, res) {
    try {
      const items = await ConfigModel.findAll();
      if (items) {
        res.success("عملیات با موفقیت انجام شد", items);
      } else {
        res.fail("تنظیماتی یافت نشد", 400);
      }
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
    }
  }

  static async getConfigBySymbol(req, res) {
    const symbol = req?.params?.symbol || "";

    try {
      const item = await ConfigModel.findOne({ where: { symbol } });
      if (item) {
        res.success("عملیات با موفقیت انجام شد", item);
      } else {
        res.fail("تنظیماتی با این نماد یافت نشد", 400);
      }
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
    }
  }

  static async createConfig(req, res) {
    const { symbol, value } = req?.body;

    try {
      const item = await ConfigModel.create({ symbol, value: String(value) });
      res.success("تنظیمات با موفقیت ثبت شد", item);
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
    }
  }

  static async updateConfig(req, res) {
    const { value } = req?.body;

    const symbol = req?.params?.symbol || "";

    try {
      const item = await ConfigModel.findOne({ where: { symbol } });
      if (!item) {
        res.fail("تنظیماتی با این نماد یافت نشد", 400);
      }
      const updatedItem = await item.update({ value: String(value) });
      res.success("تنظیمات با موفقیت ویرایش شد", updatedItem);
    } catch (error) {
      res.fail("خطایی رخ داده است", 400);
    }
  }
}
