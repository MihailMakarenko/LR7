const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Publication = sequelize.define("publication", {
  publication_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  publication_name: { type: DataTypes.TEXT },
  publication_type: { type: DataTypes.TEXT },
  subscription_cost: { type: DataTypes.DOUBLE },
});

const Subscribers = sequelize.define("subscribers", {
  subscriber_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subscriber_name: { type: DataTypes.TEXT },
  subscriber_address: { type: DataTypes.TEXT },
  // subscriber_photo: { type: DataTypes.TEXT },
});

const Subscriptions = sequelize.define("subscriptions", {
  subscription_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subscriber_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subscribers, // Указываем на модель Subscribers
      key: "subscriber_id",
    },
  },
  publication_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Publication, // Указываем на модель Publication
      key: "publication_id",
    },
  },
  subscription_period: { type: DataTypes.INTEGER },
  start_date: { type: DataTypes.DATE },
});

// Установка связей
Publication.hasMany(Subscriptions, {
  foreignKey: "publication_id",
});
Subscriptions.belongsTo(Publication, {
  foreignKey: "publication_id",
});

Subscribers.hasMany(Subscriptions, {
  foreignKey: "subscriber_id",
});
Subscriptions.belongsTo(Subscribers, {
  foreignKey: "subscriber_id",
});

// Метод для получения подписок пользователя
// async function getSubscriptionsBySubscriberId(subscriberId) {
//   try {
//     const subscriptions = await Subscriptions.findAll({
//       where: { subscriber_id: subscriberId },
//       include: [
//         {
//           model: Publication,
//           attributes: [
//             "publication_id",
//             "publication_name",
//             "publication_type",
//             "subscription_cost",
//           ],
//         },
//         {
//           model: Subscribers,
//           attributes: [
//             "subscriber_id",
//             "subscriber_name",
//             "subscriber_address",
//           ],
//         },
//       ],
//     });

//     return subscriptions;
//   } catch (error) {
//     console.error("Ошибка при получении подписок:", error);
//     throw error;
//   }

// }

// async function getSubscriptionsBySubscriberId(subscriberId) {
//   try {
//     const subscriptions = await Subscriptions.findAll({
//       where: { subscriber_id: subscriberId },
//       include: [
//         {
//           model: Publication,
//           attributes: ["publication_name", "subscription_cost"],
//         },
//       ],
//       attributes: ["subscription_period"],
//     });

//     console.log("Полученные подписки: ", subscriptions); // Логирование

//     if (subscriptions.length === 0) {
//       return { message: "Подписки не найдены" };
//     }

//     return subscriptions.map((subscription) => {
//       const publication = subscription.Publication || {}; // Защита от undefined
//       return {
//         publicationName: publication.publication_name || "Неизвестно", // Безопасный доступ
//         subscriptionPeriod: subscription.subscription_period,
//         subscriptionCost: publication.subscription_cost || 0, // Безопасный доступ
//       };
//     });
//   } catch (error) {
//     console.error("Ошибка при получении подписок:", error);
//     throw error; // Пробрасываем ошибку
//   }
// }

// async function getSubscriptionsBySubscriberId(subscriberId) {
//   try {
//     // Получаем подписки для указанного subscriberId
//     const subscriptions = await Subscriptions.findAll({
//       where: { subscriber_id: subscriberId },
//     });

//     // Получаем publication_id для подписок
//     const publicationIds = subscriptions.map(
//       (subscription) => subscription.publication_id
//     );

//     // Получаем публикации по publication_id
//     const publications = await Publication.findAll({
//       where: {
//         publication_id: publicationIds,
//       },
//     });

//     return {
//       subscriptions,
//       publications,
//     };
//   } catch (error) {
//     console.error("Ошибка при получении подписок и публикаций:", error);
//     throw error; // Пробрасываем ошибку
//   }
// }

async function getSubscriptionsBySubscriberId(subscriberId) {
  try {
    // Получаем подписки для указанного subscriberId
    const subscriptions = await Subscriptions.findAll({
      where: { subscriber_id: subscriberId },
    });

    // Получаем publication_id для подписок
    const publicationIds = subscriptions.map(
      (subscription) => subscription.publication_id
    );

    // Получаем публикации по publication_id
    const publications = await Publication.findAll({
      where: {
        publication_id: publicationIds,
      },
    });

    // Создаём словарь (map) для быстрого доступа к публикациям по publication_id
    const publicationMap = publications.reduce((acc, publication) => {
      acc[publication.publication_id] = publication;
      return acc;
    }, {});

    // Объединяем подписки с публикациями
    const result = subscriptions.map((subscription) => {
      return {
        ...subscription.dataValues, // Включаем данные подписки
        publication: publicationMap[subscription.publication_id], // Добавляем соответствующую публикацию
      };
    });

    return result; // Возвращаем объединённые данные
  } catch (error) {
    console.error("Ошибка при получении подписок и публикаций:", error);
    throw error; // Пробрасываем ошибку
  }
}

module.exports = {
  Publication,
  Subscribers,
  Subscriptions,
  getSubscriptionsBySubscriberId,
};
