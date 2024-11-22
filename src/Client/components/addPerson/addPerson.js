import "./addPerson.css";
import React, { useState, useEffect } from "react";
import SendApi from "../../pages/service/serverApi";

function AddPerson({ onUserAdded, editUserData }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const sendApi = new SendApi();

  // Эффект для заполнения формы при редактировании
  useEffect(() => {
    if (editUserData) {
      setName(editUserData.subscriber_name);
      setAddress(editUserData.subscriber_address);
      setPhoto(null); // Сбросить фото, если нужно
    } else {
      // Если нет данных для редактирования, сбросьте поля
      setName("");
      setAddress("");
      setPhoto(null);
    }
  }, [editUserData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("Данные отправлены");

    const data = {
      subscriber_name: name,
      subscriber_address: address,
    };

    if (photo) {
      try {
        data.subscriber_photo = await fileToBase64(photo);
      } catch (error) {
        console.error("Ошибка преобразования фото:", error);
        alert("Ошибка преобразования фото. Пожалуйста, попробуйте еще раз.");
        setLoading(false);
        return;
      }
    }

    // Измените логику здесь для обновления существующего пользователя
    if (editUserData) {
      data.subscriber_name = name;
      data.subscriber_address = address;
      sendApi.updatePerson(
        data,
        editUserData.subscriber_id,

        (response) => {
          console.log("Изменение успешно:", response);
          setLoading(false);
          onUserAdded();
          setName("");
          setAddress("");
          setPhoto(null);
        },
        (errorMessage) => {
          console.error("Ошибка изменения:", errorMessage);
          alert("Ошибка изменения. Пожалуйста, проверьте введенные данные.");
          setLoading(false);
        }
      );
    } else {
      sendApi.addPerson(
        data,
        (response) => {
          console.log("Регистрация успешна:", response);
          setLoading(false);
          onUserAdded();
          setName("");
          setAddress("");
          setPhoto(null);
        },
        (errorMessage) => {
          console.error("Ошибка регистрации:", errorMessage);
          alert("Ошибка регистрации. Пожалуйста, проверьте введенные данные.");
          setLoading(false);
        }
      );
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="add-person-container">
      <h2 className="add-person-title">
        {editUserData ? "Изменить человека" : "Добавить нового человека"}
      </h2>
      <form onSubmit={handleSubmit} className="add-person-form">
        <label htmlFor="name">Имя:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="add-person-input"
        />

        <label htmlFor="address">Адрес:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="add-person-input"
        />

        {/* <label htmlFor="photo">Фото:</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="add-person-input"
        /> */}

        <button type="submit" className="add-person-button">
          {editUserData ? "Сохранить" : "Добавить"}
        </button>
      </form>
    </div>
  );
}

export default AddPerson;
