const { Subscriptions } = require("../models/models");
const { Op } = require("sequelize"); // Импортируем оператор для поиска

class SubscriptionsController {
  // 1. Создание новой подписки
  async create(req, res) {
    const { subscriber_id, publication_id, subscription_period, start_date } =
      req.body;

    try {
      // Проверка на наличие обязательных полей
      if (
        !subscriber_id ||
        !publication_id ||
        !subscription_period ||
        !start_date
      ) {
        return res
          .status(400)
          .json({ message: "Все поля обязательны для заполнения" });
      }

      const subscription = await Subscriptions.create({
        subscriber_id,
        publication_id,
        subscription_period,
        start_date,
      });

      return res.status(201).json(subscription); // 201 Создано
    } catch (error) {
      console.error("Ошибка при создании подписки:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при создании подписки", error });
    }
  }

  // 2. Получение всех подписок с пагинацией
  async getAll(req, res) {
    const { page = 1, limit = 10 } = req.query; // Параметры пагинации
    const offset = (page - 1) * limit;

    try {
      const subscriptions = await Subscriptions.findAndCountAll({
        limit: limit,
        offset: offset,
      });
      return res.json({
        total: subscriptions.count,
        pages: Math.ceil(subscriptions.count / limit),
        data: subscriptions.rows,
      });
    } catch (error) {
      console.error("Ошибка при получении подписок:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении подписок", error });
    }
  }

  // 3. Сортировка подписок
  async getSorted(req, res) {
    const { sortBy = "start_date", order = "ASC" } = req.query;

    try {
      const subscriptions = await Subscriptions.findAll({
        order: [[sortBy, order]],
      });
      return res.json(subscriptions);
    } catch (error) {
      console.error("Ошибка при получении подписок:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении подписок", error });
    }
  }

  // 4. Фильтрация подписок
  async getFiltered(req, res) {
    const { subscriber_id, publication_id, subscription_period } = req.query;

    // Создаем объект для условий поиска
    const whereCondition = {};

    // Добавляем условия в зависимости от переданных параметров
    if (subscriber_id) {
      whereCondition.subscriber_id = Array.isArray(subscriber_id)
        ? { [Op.in]: subscriber_id.map((id) => parseInt(id, 10)) } // Поддержка массива subscriber_id
        : parseInt(subscriber_id, 10); // Поддержка одного subscriber_id
    }

    if (publication_id) {
      whereCondition.publication_id = Array.isArray(publication_id)
        ? { [Op.in]: publication_id.map((id) => parseInt(id, 10)) } // Поддержка массива publication_id
        : parseInt(publication_id, 10); // Поддержка одного publication_id
    }

    if (subscription_period) {
      whereCondition.subscription_period = Array.isArray(subscription_period)
        ? { [Op.in]: subscription_period.map((period) => parseInt(period, 10)) } // Поддержка массива subscription_period
        : parseInt(subscription_period, 10); // Поддержка одного subscription_period
    }

    try {
      const subscriptions = await Subscriptions.findAll({
        where: whereCondition,
      });
      return res.json(subscriptions);
    } catch (error) {
      console.error("Ошибка при получении подписок:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении подписок", error });
    }
  }

  // 5. Поиск подписок
  async search(req, res) {
    const { subscriber_id, publication_id, subscription_period } = req.query;

    // Проверка на множественные значения для каждого параметра
    if (
      Array.isArray(subscriber_id) ||
      Array.isArray(publication_id) ||
      Array.isArray(subscription_period)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Пожалуйста, передайте только одно значение для каждого параметра.",
        });
    }

    // Создаем объект для условий поиска
    const whereCondition = {};

    // Проверка и добавление subscriber_id
    if (subscriber_id) {
      const numericSubscriberId = parseInt(subscriber_id, 10);
      whereCondition.subscriber_id = isNaN(numericSubscriberId)
        ? { [Op.like]: `%${subscriber_id}%` } // Частичное совпадение
        : numericSubscriberId; // Точное совпадение
    }

    // Проверка и добавление publication_id
    if (publication_id) {
      const numericPublicationId = parseInt(publication_id, 10);
      whereCondition.publication_id = isNaN(numericPublicationId)
        ? { [Op.like]: `%${publication_id}%` } // Частичное совпадение
        : numericPublicationId; // Точное совпадение
    }

    // Проверка и добавление subscription_period
    if (subscription_period) {
      const numericSubscriptionPeriod = parseInt(subscription_period, 10);
      whereCondition.subscription_period = isNaN(numericSubscriptionPeriod)
        ? { [Op.like]: `%${subscription_period}%` } // Частичное совпадение
        : numericSubscriptionPeriod; // Точное совпадение
    }

    try {
      const subscriptions = await Subscriptions.findAll({
        where: whereCondition,
      });
      return res.json(subscriptions);
    } catch (error) {
      console.error("Ошибка при поиске подписок:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при поиске подписок", error });
    }
  }

  // 6. Получение подписки по ID
  async getById(req, res) {
    const { id } = req.params;

    try {
      const subscription = await Subscriptions.findOne({
        where: { subscription_id: id },
      });

      if (!subscription) {
        return res.status(404).json({ message: "Подписка не найдена" });
      }

      return res.json(subscription);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Ошибка при получении подписки", error });
    }
  }

  // 7. Обновление подписки
  async updateSubscription(req, res) {
    const { id } = req.params; // Исправлено с reg на req
    const { subscription_period, start_date } = req.body;

    try {
      // Проверка наличия id
      if (!id) {
        return res.status(400).json({ message: "ID подписки не указан" });
      }

      // Поиск подписки по ID
      const subscription = await Subscriptions.findOne({
        where: { subscription_id: id },
      });

      if (!subscription) {
        return res.status(404).json({ message: "Подписка не найдена" });
      }

      // Обновляем только те поля, которые были переданы
      const updatedFields = {};
      if (subscription_period)
        updatedFields.subscription_period = subscription_period;
      if (start_date) updatedFields.start_date = start_date;

      // Если нет никаких полей для обновления, возвращаем ошибку
      if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "Нет данных для обновления" });
      }

      // Обновление подписки и возврат обновленного объекта
      const [_, updatedSubscriptions] = await Subscriptions.update(
        updatedFields,
        {
          where: { subscription_id: id },
          returning: true, // Возвращаем обновленные строки
        }
      );

      // Возвращаем обновленную подписку
      return res.json(updatedSubscriptions[0]);
    } catch (error) {
      console.error("Ошибка при обновлении подписки:", error);
      return res.status(500).json({
        message: "Ошибка при обновлении подписки",
        error: error.message,
      });
    }
  }
  // 8. Удаление подписки
  async deleteById(req, res) {
    const { id } = req.params;

    try {
      const subscription = await Subscriptions.findOne({
        where: { subscription_id: id },
      });

      if (!subscription) {
        return res.status(404).json({ message: "Подписка не найдена" });
      }

      await Subscriptions.destroy({
        where: { subscription_id: id },
      });

      return res.status(200).json({ message: "Подписка успешно удалена" });
    } catch (error) {
      console.error("Ошибка при удалении подписки:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при удалении подписки", error });
    }
  }
}

module.exports = new SubscriptionsController();
