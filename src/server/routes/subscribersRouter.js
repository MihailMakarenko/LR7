const Router = require("express");
const router = new Router();
const subscribersController = require("../controllers/subscribersController");

// 1. Создание нового подписчика
router.post("/", subscribersController.create);

// 2. Получение всех подписчиков с пагинацией
router.get("/", subscribersController.getAll);

// 3. Фильтрация подписчиков
router.get("/filtered", subscribersController.getFiltered);

// 4. Сортировка подписчиков
router.get("/sorted", subscribersController.getSorted);

// 5. Поиск подписчиков
router.get("/search", subscribersController.search);

// 6. Получение подписчика по ID
router.get("/:id", subscribersController.getById);

// 7. Обновление подписчика
router.put("/:id", subscribersController.updateSubscriber); // Обновление по ID

// 8. Удаление подписчика
router.delete("/:id", subscribersController.deleteById); // Удаление по ID

module.exports = router;
