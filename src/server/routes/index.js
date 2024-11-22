const Router = require("express");
const router = new Router();
const publicationRouter = require("./publicationRouter");
const subscriberRouter = require("./subscribersRouter");
const subscriptionsRouter = require("./subscriptionsRouter");
const allRouter = require("./allRouter");

// Подключаем другие маршруты
router.use("/publication", publicationRouter);
router.use("/subscriber", subscriberRouter);
router.use("/subscription", subscriptionsRouter);
router.use("/subscriptionsForPerson", allRouter);

module.exports = router;
