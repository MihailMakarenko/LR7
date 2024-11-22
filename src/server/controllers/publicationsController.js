const { Publication } = require("../models/models");

class PublicationController {
  // 1. Создание новой записи
  async create(req, res) {
    const { publication_name, publication_type, subscription_cost } = req.body;

    try {
      const publication = await Publication.create({
        publication_name,
        publication_type,
        subscription_cost,
      });
      return res.status(201).json(publication); // 201 Создано
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ошибка при создании публикации", error });
    }
  }

  // 2. Получение списка записей с поддержкой пагинации
  async getAll(req, res) {
    const { page = 1, limit = 10 } = req.query; // Параметры пагинации
    const offset = (page - 1) * limit;

    try {
      const publications = await Publication.findAndCountAll({
        limit: limit,
        offset: offset,
      });
      return res.json({
        total: publications.count,
        pages: Math.ceil(publications.count / limit),
        data: publications.rows,
      });
    } catch (error) {
      console.error("Ошибка при получении публикаций:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении публикаций", error });
    }
  }

  // 3. Получение списка записей с поддержкой сортировки
  async getSorted(req, res) {
    const { sortBy = "publication_name", order = "ASC" } = req.query;

    try {
      const publications = await Publication.findAll({
        order: [[sortBy, order]],
      });
      return res.json(publications);
    } catch (error) {
      console.error("Ошибка при получении публикаций:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении публикаций", error });
    }
  }

  // 4. Получение списка записей с поддержкой фильтрации
  async getFiltered(req, res) {
    const { publication_type } = req.query;

    try {
      // Если publication_type не указан или пустой, возвращаем ошибку
      if (!publication_type) {
        return res.status(400).json({ message: "Тип публикации не указан" });
      }

      const publications = await Publication.findAll({
        where: { publication_type },
      });

      return res.json(publications);
    } catch (error) {
      console.error("Ошибка при получении публикаций:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении публикаций", error });
    }
  }

  // 5. Получение списка записей с поддержкой поиска
  async search(req, res) {
    const { query } = req.query;

    try {
      const publications = await Publication.findAll({
        where: {
          [Op.or]: [
            { publication_name: { [Op.like]: `%${query}%` } },
            { publication_type: { [Op.like]: `%${query}%` } },
          ],
        },
      });
      return res.json(publications);
    } catch (error) {
      console.error("Ошибка при поиске публикаций:", error);
      return res
        .status(500)
        .json({ message: "Ошибка при поиске публикаций", error });
    }
  }

  // 6. Получение детальной информации по ID
  async getById(req, res) {
    const { id } = req.params;

    try {
      const publication = await Publication.findOne({
        where: { publication_id: id },
      });

      if (!publication) {
        return res.status(404).json({ message: "Публикация не найдена" });
      }

      return res.json(publication);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Ошибка при получении публикации", error });
    }
  }

  // 7. Обработка случая отсутствия записи
  async checkExistence(req, res) {
    const { id } = req.params;

    try {
      const publication = await Publication.findOne({
        where: { publication_id: id },
      });

      if (!publication) {
        return res.status(404).json({ message: "Публикация не найдена" });
      }

      return res.status(200).json({ message: "Публикация существует" });
    } catch (error) {
      return res.status(500).json({
        message: "Ошибка при проверке существования публикации",
        error,
      });
    }
  }

  // 8. Обновление записи
  async updatePublication(req, res) {
    const { id } = req.params;
    const { publication_name, publication_type, subscription_cost } = req.body;

    try {
      const publication = await Publication.findOne({
        where: { publication_id: id },
      });

      if (!publication) {
        return res.status(404).json({ message: "Публикация не найдена" });
      }

      await Publication.update(
        { publication_name, publication_type, subscription_cost },
        { where: { publication_id: id } }
      );

      const updatedPublication = await Publication.findOne({
        where: { publication_id: id },
      });

      return res.json(updatedPublication);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении публикации", error });
    }
  }

  // 9. Удаление записи
  async deletePublication(req, res) {
    const { id } = req.params;

    try {
      const publication = await Publication.findOne({
        where: { publication_id: id },
      });

      if (!publication) {
        return res.status(404).json({ message: "Публикация не найдена" });
      }

      await Publication.destroy({
        where: { publication_id: id },
      });

      return res.status(204).send(); // 204 Нет содержимого
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Ошибка при удалении публикации", error });
    }
  }
}

module.exports = new PublicationController();
