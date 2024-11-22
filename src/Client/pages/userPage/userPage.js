import React, { useState } from "react";
import AddPerson from "../../components/addPerson/addPerson";
import PersonList from "../../components/personList/personList";
import { useNavigate } from "react-router-dom";
import "./style.css";

function UserPage() {
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState(null); // Для хранения данных редактируемого пользователя

  const handleUserAdded = () => {
    setRefresh((prev) => !prev); // Изменяем состояние для перерисовки
    setEditUser(null); // Сбрасываем данные редактирования после добавления
  };

  const handleEditUser = (userData) => {
    setEditUser(userData); // Устанавливаем данные пользователя для редактирования
  };

  const handleClick = () => {
    navigate("/addPublication"); // Перейти на страницу "О нас"
  };

  return (
    <div>
      <AddPerson onUserAdded={handleUserAdded} editUserData={editUser} />{" "}
      <button onClick={handleClick}>Добавить журнал</button>
      {/* Передача editUserData */}
      <PersonList key={refresh} onEditUser={handleEditUser} />{" "}
      {/* Передача onEditUser */}
    </div>
  );
}

export default UserPage;
