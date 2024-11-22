const Router = require("express");
const router = new Router();
const subscriptionsController = require("../controllers/subscriptionsController");

// 1. Создание новой подписки
router.post("/", subscriptionsController.create);

// 2. Получение всех подписок с пагинацией
router.get("/", subscriptionsController.getAll);

// 3. Сортировка подписок
router.get("/sorted", subscriptionsController.getSorted);

// 4. Фильтрация подписок
router.get("/filtered", subscriptionsController.getFiltered);

// 5. Поиск подписок
router.get("/search", subscriptionsController.search);

// 6. Получение подписки по ID
router.get("/:id", subscriptionsController.getById);

// 7. Обновление подписки
router.put("/:id", subscriptionsController.updateSubscription); // Обновление по ID

// 8. Удаление подписки
router.delete("/:id", subscriptionsController.deleteById); // Удаление по ID

module.exports = router;
