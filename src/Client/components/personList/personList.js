import React, { useState, useEffect } from "react";
import SendApi from "../../../Client/pages/service/serverApi";
import "./style.css";
import SubscriptionForm from "../addSubscriptions/addSubscriptions";
import Modal from "../../components/modal/modal";
import SubscriptionDetails from "../subscriptionDetails/subscriptionDetails";

function PersonList({ onEditUser }) {
  const [allPeoples, setPeople] = useState([]);
  const [currentSubscriberId, setCurrentSubscriberId] = useState(null);
  const sendApi = new SendApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const fetchAllUsers = async () => {
    try {
      const users = await sendApi.getAllUsers();
      console.log(users);
      setPeople(users.data);
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDelete = async (id) => {
    console.log(`Удалить пользователя с ID: ${id}`);
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить этого пользователя?"
    );
    if (!confirmed) return;

    try {
      await sendApi.deleteUser(id);
      console.log(`Пользователь с ID ${id} успешно удален.`);
      fetchAllUsers();
    } catch (error) {
      console.error(`Ошибка при удалении пользователя с ID ${id}:`, error);
    }
  };

  const handleEdit = async (id) => {
    console.log(`Редактировать пользователя с ID: ${id}`);
    try {
      onEditUser(allPeoples.find((person) => person.subscriber_id === id));
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    }
  };

  const handleViewInfo = async (id) => {
    console.log(`Просмотреть полную информацию для пользователя ID: ${id}`);
    try {
      setIsModalOpen2(true);
    } catch (error) {
      console.error("Ошибка при получении подписок:", error);
    }
  };

  const handleAddLog = (id) => {
    setCurrentSubscriberId(id);
    setIsModalOpen(true);
    console.log(`Добавить журнал для пользователя ID: ${id}`);
  };

  return (
    <div className="people-list">
      <h2 className="people-list__title">Список пользователей</h2>
      <table className="people-list__table">
        <thead>
          <tr className="people-list__header-row">
            <th className="people-list__header-cell">ID</th>
            <th className="people-list__header-cell">Имя</th>
            <th className="people-list__header-cell">Профессия</th>
            <th className="people-list__header-cell">Действия</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(allPeoples) &&
            allPeoples.map((person) => (
              <tr key={person.subscriber_id} className="people-list__row">
                <td className="people-list__cell">{person.subscriber_id}</td>
                <td className="people-list__cell">{person.subscriber_name}</td>
                <td className="people-list__cell">
                  {person.subscriber_address}
                </td>
                <td className="people-list__cell">
                  <button onClick={() => handleViewInfo(person.subscriber_id)}>
                    Просмотреть
                  </button>
                  <button onClick={() => handleEdit(person.subscriber_id)}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(person.subscriber_id)}>
                    Удалить
                  </button>
                  <button onClick={() => handleAddLog(person.subscriber_id)}>
                    Добавить журнал
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SubscriptionForm
          subscriberId={currentSubscriberId}
          onAddSubscriptionSuccess={() => setIsModalOpen(false)} // Закрываем модальное окно при успешном добавлении
        />
      </Modal>

      <Modal isOpen={isModalOpen2} onClose={() => setIsModalOpen2(false)}>
        <SubscriptionDetails personId={currentSubscriberId} />
      </Modal>
    </div>
  );
}

export default PersonList;
