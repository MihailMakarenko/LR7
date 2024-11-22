import React, { useState } from "react";
import "./styles.css"; // Импортируем стили
import SendApi from "../service/serverApi";

function JournalForm() {
  const [publicationName, setPublicationName] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [subscriptionCost, setSubscriptionCost] = useState("");
  const sendApi = new SendApi();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "publicationName") setPublicationName(value);
    if (name === "publicationType") setPublicationType(value);
    if (name === "subscriptionCost") setSubscriptionCost(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newJournal = {
      publication_name: publicationName,
      publication_type: publicationType,
      subscription_cost: subscriptionCost,
    };
    console.log(newJournal);
    sendApi.addPublications(
      newJournal,
      (response) => {
        console.log("Регистрация успешна:", response);
        // setLoading(false); // Сбрасываем состояние загрузки
      },
      (errorMessage) => {
        console.error("Ошибка регистрации:", errorMessage);
        // setLoading(false); // Сбрасываем состояние загрузки
      }
    );
    // Здесь можно отправить данные на сервер или выполнить другие действия
    // Сброс формы
    setPublicationName("");
    setPublicationType("");
    setSubscriptionCost("");
  };

  return (
    <form className="journal-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Добавить новый журнал</h2>
      <div className="form-group">
        <label className="form-label">
          Название публикации:
          <input
            type="text"
            name="publicationName"
            value={publicationName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label className="form-label">
          Тип публикации:
          <input
            type="text"
            name="publicationType"
            value={publicationType}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label className="form-label">
          Стоимость подписки:
          <input
            type="number"
            name="subscriptionCost"
            value={subscriptionCost}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>
      </div>
      <button type="submit" className="form-button">
        Добавить журнал
      </button>
    </form>
  );
}

export default JournalForm;
