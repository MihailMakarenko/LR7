import React, { useEffect, useState } from "react";
import "./style.css"; // Убедитесь, что вы импортировали CSS-стили
import SendApi from "../../../Client/pages/service/serverApi";

function SubscriptionDetails({ personId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const sendApi = new SendApi();

  const deleteSubscription = async (subscriptionId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту подписку?")) {
      setLoading(true);
      try {
        await sendApi.deleteSubscription(
          subscriptionId,
          (response) => {
            alert(response.message); // Уведомление об успехе

            // Обновление списка подписок после удаления
            setSubscriptions((prevSubscriptions) =>
              prevSubscriptions.filter(
                (subscription) =>
                  subscription.subscription_id !== subscriptionId
              )
            );
          },
          (error) => {
            // Обработка ошибок
            setError(error.message);
            alert("Не удалось удалить подписку. Попробуйте еще раз.");
          }
        );
      } catch (err) {
        setError(err.message);
        alert("Не удалось удалить подписку. Попробуйте еще раз.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchGetUserSubscriptions();
  }, []);

  const fetchGetUserSubscriptions = async () => {
    setLoading(true); // Устанавливаем загрузку перед получением данных
    try {
      const response = await sendApi.getUserSubscriptions(personId);
      console.log(response);
      setSubscriptions(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Снимаем загрузку после получения данных
    }
  };

  if (loading) {
    return <p>Загрузка...</p>; // Отображение текста загрузки
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  if (subscriptions.length === 0) {
    return <p>У этого пользователя нет активных подписок.</p>;
  }

  return (
    <div className="subscription-table-container">
      <h2>Подписки пользователя</h2>
      <table className="subscription-table">
        <thead>
          <tr>
            <th>Период Подписки (мес.)</th>
            <th>Название Публикации</th>
            <th>Стоимость Подписки</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.subscription_id}>
              <td>{subscription.subscription_period}</td>
              <td>{subscription.publication.publication_name}</td>
              <td>{subscription.publication.subscription_cost} ₽</td>
              <td>
                <button
                  onClick={() =>
                    deleteSubscription(subscription.subscription_id)
                  }
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubscriptionDetails;
