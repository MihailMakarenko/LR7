// controllers/subscriptionsController.js
const { getSubscriptionsBySubscriberId } = require("../models/models"); // Импортируем метод

// Контроллер для получения подписок пользователя
const subscriptionsController = {
  async getUserSubscriptions(req, res) {
    const subscriberId = req.params.id; // Получаем ID подписчика из параметров

    try {
      const subscriptions = await getSubscriptionsBySubscriberId(subscriberId); // Получаем подписки

      // Если подписок нет, возвращаем пустой массив
      res.json(subscriptions); // Отправляем подписки (пустой массив, если подписок нет)
    } catch (error) {
      console.error("Ошибка при получении подписок:", error); // Логируем ошибку
      res.status(500).json({ message: "Ошибка сервера" }); // Возвращаем сообщение об ошибке
    }
  },
};

module.exports = subscriptionsController; // Экспортируем контроллер
