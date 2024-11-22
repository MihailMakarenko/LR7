const Router = require("express");
const router = new Router();
const publicationController = require("../controllers/publicationsController");

// 1. Создание новой публикации
router.post("/", publicationController.create);

// 2. Получение всех публикаций с пагинацией
router.get("/", publicationController.getAll);

// 3. Сортировка публикаций
router.get("/sorted", publicationController.getSorted);

// 4. Фильтрация публикаций
router.get("/filtered", publicationController.getFiltered);

// 5. Поиск публикаций
router.get("/search", publicationController.search);

// 6. Получение публикации по ID
router.get("/:id", publicationController.getById);

// 7. Обновление публикации
router.put("/:id", publicationController.updatePublication); // Обновление по ID

// 8. Удаление публикации
router.delete("/:id", publicationController.deletePublication); // Удаление по ID

module.exports = router;
