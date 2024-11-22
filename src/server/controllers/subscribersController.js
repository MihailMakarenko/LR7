const { Subscribers } = require("../models/models");
const multer = require("multer");
const fs = require("fs");
const { Op } = require("sequelize"); // Импортируем оператор для поиска

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "personImg/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

class SubscribersController {
  // 1. Создание нового подписчика
  async create(req, res) {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Ошибка при загрузке файла", error: err });
      }

      const { subscriber_name, subscriber_address } = req.body;
      const photoPath = req.file ? req.file.path : null; // Путь к загруженному файлу

      try {
        const subscriber = await Subscribers.create({
          subscriber_name,
          subscriber_address,
          subscriber_photo: photoPath,
        });
        return res.status(201).json(subscriber); // 201 Создано
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Ошибка при создании подписчика", error });
      }
    });
  }

  // 2. Получение всех подписчиков с пагинацией
  async getAll(req, res) {
    const { page = 1, limit } = req.query; // Параметры пагинации
    const offset = (page - 1) * (limit ? limit : 0); // Устанавливаем смещение

    try {
      const subscribers = await Subscribers.findAndCountAll({
        limit: limit,
        offset: offset,
      });
      return res.json({
        total: subscribers.count,
        pages: Math.ceil(subscribers.count / limit),
        data: subscribers.rows,
      });
    } catch (error) {
      console.error("Ошибка при получении подписчиков:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении подписчиков", error });
    }
  }

  // 3. Сортировка подписчиков
  async getSorted(req, res) {
    const { sortBy = "subscriber_name", order = "ASC" } = req.query;

    try {
      const subscribers = await Subscribers.findAll({
        order: [[sortBy, order]],
      });
      return res.json(subscribers);
    } catch (error) {
      console.error("Ошибка при получении подписчиков:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении подписчиков", error });
    }
  }

  // 4. Фильтрация подписчиков
  async getFiltered(req, res) {
    const { subscriber_name } = req.query;

    console.log("Параметр subscriber_name:", subscriber_name); // Для отладки

    try {
      const subscribers = await Subscribers.findAll({
        where: subscriber_name
          ? { subscriber_name: { [Op.like]: `%${subscriber_name}%` } }
          : {}, // Если subscriber_name не указан, будет пустой объект
      });

      return res.json(subscribers);
    } catch (error) {
      console.error("Ошибка при получении подписчиков:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении подписчиков", error });
    }
  }
  // 5. Поиск подписчиков
  async search(req, res) {
    const { query } = req.query;

    try {
      const subscribers = await Subscribers.findAll({
        where: {
          [Op.or]: [
            { subscriber_name: { [Op.like]: `%${query}%` } },
            { subscriber_address: { [Op.like]: `%${query}%` } },
          ],
        },
      });
      return res.json(subscribers);
    } catch (error) {
      console.error("Ошибка при поиске подписчиков:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при поиске подписчиков", error });
    }
  }

  // 6. Получение подписчика по ID
  async getById(req, res) {
    const { id } = req.params; // Получаем ID подписчика из параметров URL

    try {
      // Поиск подписчика по ID
      const subscriber = await Subscribers.findOne({
        where: { subscriber_id: id }, // Обратите внимание, что здесь используется subscriber_id
      });

      // Проверка, найден ли подписчик
      if (!subscriber) {
        return res.status(404).json({ message: "Подписчик не найден" });
      }

      // Возвращаем найденного подписчика
      return res.json(subscriber);
    } catch (error) {
      console.error("Ошибка при получении подписчика:", error);
      return res.status(500).json({
        message: "Ошибка при получении подписчика",
        error: error.message,
      });
    }
  }
  // 7. обновление данных подписчика
  async updateSubscriber(req, res) {
    const { id } = req.params; // Получаем ID подписчика из URL
    console.log(id);
    const { subscriber_name, subscriber_address } = req.body; // Имя и адрес из тела запроса

    try {
      // Проверка наличия id
      if (!id) {
        return res.status(400).json({ message: "ID подписчика не указан" });
      }

      // Поиск подписчика по ID
      const subscriber = await Subscribers.findOne({
        where: { subscriber_id: id }, // Убедитесь, что поле соответствует вашей модели
      });

      // Проверка, найден ли подписчик
      if (!subscriber) {
        return res.status(404).json({ message: "Подписчик не найден" });
      }

      // Обновление подписчика
      const [updated] = await Subscribers.update(
        { subscriber_name, subscriber_address },
        { where: { subscriber_id: id } }
      );

      // Проверка, было ли обновление успешным
      if (!updated) {
        return res
          .status(400)
          .json({ message: "Не удалось обновить подписчика" });
      }

      // Возвращаем обновленного подписчика
      const updatedSubscriber = await Subscribers.findOne({
        where: { subscriber_id: id },
      });

      return res.json(updatedSubscriber);
    } catch (error) {
      console.error("Ошибка при обновлении подписчика:", error);
      return res.status(500).json({
        message: "Ошибка при обновлении подписчика",
        error: error.message,
      });
    }
  }

  // 8. Удаление подписчика
  async deleteById(req, res) {
    const { id } = req.params;

    try {
      const subscriber = await Subscribers.findOne({
        where: { subscriber_id: id },
      });

      if (!subscriber) {
        return res.status(404).json({ message: "Подписчик не найден" });
      }

      // Удаляем файл фото, если он существует
      if (subscriber.subscriber_photo) {
        fs.unlinkSync(subscriber.subscriber_photo); // Удаляем файл из файловой системы
      }

      await Subscribers.destroy({
        where: { subscriber_id: id },
      });

      return res.status(200).json({ message: "Подписчик успешно удален" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ошибка при удалении подписчика", error });
    }
  }
}

module.exports = new SubscribersController();
