import React, { useState, useEffect } from "react";
import SendApi from "../../pages/service/serverApi"; // Импортируйте ваш API

function SubscriptionForm({ subscriberId, onAddSubscriptionSuccess }) {
  const [magazine, setMagazine] = useState("");
  const [months, setMonths] = useState(1);
  const [magazinesList, setMagazinesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(""); // Состояние для уведомления
  const sendApi = new SendApi();

  const fetchMagazines = async () => {
    try {
      const response = await sendApi.getMagazines();
      console.log(response);
      setMagazinesList(response.data);
    } catch (error) {
      console.error("Ошибка при получении журналов:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddSubscriptions = async (data) => {
    try {
      await sendApi.addSubscriptions(
        data,
        (response) => {
          console.log("Подписка успешно добавлена:", response);
          setSuccessMessage("Подписка успешно добавлена!"); // Устанавливаем сообщение об успехе
          if (onAddSubscriptionSuccess) {
            onAddSubscriptionSuccess(); // Закрываем модальное окно
          }
        },
        (errorMessage) => {
          console.error("Ошибка добавления подписки:", errorMessage);
        }
      );
    } catch (error) {
      console.error("Ошибка при добавлении подписки:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newSubscriptionData = {
      subscriber_id: subscriberId,
      publication_id: magazine,
      subscription_period: months,
      start_date: new Date(),
    };

    // Вызываем функцию добавления подписки с обновленными данными
    fetchAddSubscriptions(newSubscriptionData);

    console.log(
      `Подписка на журнал: ${magazine}, Количество месяцев: ${months}`
    );
  };

  return (
    <div className="subscription-form">
      <h2>Форма подписки на журнал</h2>
      {loading ? (
        <p>Загрузка журналов...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="magazine">Выберите журнал:</label>
          <select
            id="magazine"
            value={magazine}
            onChange={(e) => setMagazine(e.target.value)}
            required
          >
            <option value="">--Выберите журнал--</option>
            {magazinesList.map((mag) => (
              <option key={mag.publication_id} value={mag.publication_id}>
                {mag.publication_name}
              </option>
            ))}
          </select>

          <label htmlFor="months">Количество месяцев:</label>
          <input
            type="number"
            id="months"
            value={months}
            min="1"
            max="12"
            onChange={(e) => setMonths(e.target.value)}
            required
          />

          <button type="submit">Подписаться</button>
        </form>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}{" "}
      {/* Уведомление об успехе */}
    </div>
  );
}

export default SubscriptionForm;
