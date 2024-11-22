import axios from "axios";

class SendApi {
  constructor() {
    this.baseUrl = "http://localhost:8000/api";

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async addPerson(person, successCallback, errorCallback) {
    console.log(person.subscriber_photo);
    try {
      const response = await this.api.post("/subscriber", {
        subscriber_name: person.subscriber_name,
        subscriber_address: person.subscriber_address,
        subscriber_photo: person.subscriber_photo,
      });

      if (successCallback) {
        successCallback(response.data);
      }
    } catch (error) {
      if (error.response) {
        if (errorCallback) {
          errorCallback(error.response.data.message);
        }
      } else {
        if (errorCallback) {
          errorCallback("Error");
        }
      }
    }
  }

  async addPublications(publication, successCallback, errorCallback) {
    try {
      const response = await this.api.post("/publication", {
        publication_name: publication.publication_name,
        publication_type: publication.publication_type,
        subscription_cost: publication.subscription_cost,
      });

      if (successCallback) {
        successCallback(response.data);
      }
    } catch (error) {
      if (error.response) {
        if (errorCallback) {
          errorCallback(error.response.data.message);
        }
      } else {
        if (errorCallback) {
          errorCallback("Error");
        }
      }
    }
  }

  async addSubscriptions(subscriptions, successCallback, errorCallback) {
    console.log(subscriptions);
    try {
      const response = await this.api.post("/subscription", {
        subscriber_id: subscriptions.subscriber_id,
        publication_id: subscriptions.publication_id,
        subscription_period: subscriptions.subscription_period,
        start_date: subscriptions.start_date,
      });

      if (successCallback) {
        successCallback(response.data);
      }
    } catch (error) {
      if (error.response) {
        if (errorCallback) {
          errorCallback(error.response.data.message);
        }
      } else {
        if (errorCallback) {
          errorCallback("Error");
        }
      }
    }
  }

  async getAllUsers() {
    try {
      const response = await this.api.get("/subscriber");
      return response.data; // Возвращаем данные
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : "Error");
    }
  }

  async deleteUser(id, successCallback, errorCallback) {
    try {
      const response = await this.api.delete(`/subscriber/${id}`);
      return response.data; // Возвращаем данные
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : "Error");
    }
  }

  async getMagazines(successCallback, errorCallback) {
    try {
      const response = await this.api.get("/publication");
      return response.data; // Возвращаем данные
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : "Error");
    }
  }

  async getUserSubscriptions(id, successCallback, errorCallback) {
    try {
      const response = await this.api.get(`/subscriptionsForPerson/${id}`);
      return response.data; // Возвращаем данные
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : "Error");
    }
  }

  async updatePerson(person, id, successCallback, errorCallback) {
    console.log(person);
    try {
      const response = await this.api.put(`/subscriber/${id}`, {
        subscriber_name: person.subscriber_name,
        subscriber_address: person.subscriber_address,
        subscriber_photo: person.subscriber_photo, // Добавьте фото, если нужно
      });

      if (successCallback) {
        successCallback(response.data); // Вызов колбека успеха с данными ответа
      }
    } catch (error) {
      if (error.response) {
        if (errorCallback) {
          errorCallback(error.response.data.message); // Вызов колбека ошибки с сообщением об ошибке
        }
      } else {
        if (errorCallback) {
          errorCallback("Ошибка"); // Вызов колбека ошибки с обобщенным сообщением об ошибке
        }
      }
    }
  }

  async deleteSubscription(id, successCallback, errorCallback) {
    try {
      const response = await this.api.delete(`/subscription/${id}`);

      // Вызов колбека успеха с данными ответа
      if (successCallback) {
        console.log("ВСЕ ПОЛУЧИЛОСЬ");
        successCallback({
          success: true,
          message: "Подписка успешно удалена.",
          data: response.data, // Возвращаем данные, если они есть
        });
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response
        ? error.response.data.message
        : "Произошла ошибка при удалении подписки.";

      // Вызов колбека ошибки с сообщением об ошибке
      if (errorCallback) {
        errorCallback({
          success: false,
          message: errorMessage,
        });
      }
    }
  }
  // async addSubscriptions(successCallback, errorCallback) {
  //   try {
  //     const response = await this.api.post("/publication");
  //     return response.data; // Возвращаем данные
  //   } catch (error) {
  //     throw new Error(error.response ? error.response.data.message : "Error");
  //   }
  // }
}

export default SendApi;
