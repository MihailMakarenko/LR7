const Router = require("express");
const router = new Router();
const allController = require("../controllers/allController");

// Предположим, что вы хотите получать подписки для конкретного пользователя по его ID
router.get("/:id", allController.getUserSubscriptions); // Измените на :id, чтобы принимать ID пользователя

module.exports = router;
