// require("dotenv").config();
// const express = require("express"); //импорт модуля
// const sequelize = require("./db.js"); //импорт настроек БД
// const cors = require("cors");
// const models = require("./models/models"); //импорт моделей
// const router = require("./routes/index");
// const bodyParser = require("body-parser");

// const PORT = process.env.PORT; //порт, на котором работает сервер

// const app = express(); //создаем объект express
// app.use(cors());
// app.use(express.json());
// app.use("/api", router);

// // Настройка body-parser
// app.use(bodyParser.json({ limit: "10mb" })); // Увеличьте лимит для JSON
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // Увеличьте лимит для URL-encoded данных

// //функция для подключения к БД
// const start = async () => {
//   try {
//     await sequelize.authenticate(); //подключение к БД
//     await sequelize.sync(); //сверка состояния БД со схемой БД

//     app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//   } catch (e) {
//     console.log(e);
//   }
// };

// start();

require("dotenv").config();
const express = require("express"); // Импорт модуля
const sequelize = require("./db.js"); // Импорт настроек БД
const cors = require("cors");
const models = require("./models/models"); // Импорт моделей
const router = require("./routes/index");
const bodyParser = require("body-parser");

const PORT = process.env.PORT; // Порт, на котором работает сервер

const app = express(); // Создаем объект express
app.use(cors());
app.use(express.json());
app.use("/api", router);

// Настройка body-parser
app.use(bodyParser.json({ limit: "10mb" })); // Увеличьте лимит для JSON
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // Увеличьте лимит для URL-encoded данных

// Данные для заполнения
const samplePublications = Array.from({ length: 25 }, (_, index) => ({
  publication_name: `Publication ${index + 1}`,
  publication_type: `Type ${index % 5}`,
  subscription_cost: (Math.random() * 100).toFixed(2),
}));

const sampleSubscribers = Array.from({ length: 25 }, (_, index) => ({
  subscriber_name: `Subscriber ${index + 1}`,
  subscriber_address: `Address ${index + 1}`,
}));

const seedDatabase = async () => {
  try {
    const publicationsCount = await models.Publication.count();
    if (publicationsCount === 0) {
      await models.Publication.bulkCreate(samplePublications);
      console.log("Publication table seeded!");
    } else {
      console.log("Publication table already has data.");
    }

    const subscribersCount = await models.Subscribers.count();
    if (subscribersCount === 0) {
      await models.Subscribers.bulkCreate(sampleSubscribers);
      console.log("Subscribers table seeded!");
    } else {
      console.log("Subscribers table already has data.");
    }

    const subscribers = await models.Subscribers.findAll();
    const publications = await models.Publication.findAll();

    const sampleSubscriptions = Array.from({ length: 25 }, (_, index) => ({
      subscriber_id: subscribers[index % subscribers.length].subscriber_id,
      publication_id: publications[index % publications.length].publication_id,
      subscription_period: 12,
      start_date: new Date(),
    }));

    const subscriptionsCount = await models.Subscriptions.count();
    if (subscriptionsCount === 0) {
      await models.Subscriptions.bulkCreate(sampleSubscriptions);
      console.log("Subscriptions table seeded!");
    } else {
      console.log("Subscriptions table already has data.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Функция для подключения к БД
const start = async () => {
  try {
    await sequelize.authenticate(); // Подключение к БД
    await sequelize.sync(); // Сверка состояния БД со схемой БД

    // Заполнение базы данных начальными данными
    await seedDatabase();

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
