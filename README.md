# LR7

1) Создание новой публикации
post http://localhost:8000/api/publication
{
    "publication_name": "Тестовая публикация",
    "publication_type": "Журнал",
    "subscription_cost": 100
}
2) Получение всех публикаций
get http://localhost:8000/api/publication
3) Получение публикации по ID
get http://localhost:8000/api/publication/29 (для 29 id)
4) Обновление публикации
put http://localhost:8000/api/publication/29 (для 29 id)
{
    "publication_name": "Обновленная публикация",
    "publication_type": "Газета",
    "subscription_cost": 150
}
5) Удаление публикации
delete http://localhost:8000/api/publication/29 (для 29 id)
6) Получение списка публикаций с поддержкой пагинации
get http://localhost:8000/api/publication?page=1&limit=10
7) Получение списка публикаций с поддержкой сортировки
get http://localhost:8000/api/publication?sortBy=publication_name&order=ASC
8) Получение списка публикаций с поддержкой фильтрации (доделать)
http://localhost:8000/api/publication?publication_type=Журнал
9) Получение списка публикаций с поддержкой поиска (доделать)
http://localhost:8000/api/publication/search?query=Тест




1) Создание нового подписчика
post http://localhost:8000/api/subscriber
{
    "subscriber_name": "Иван Иванов",
    "subscriber_address": "Москва, ул. Ленина, д. 1"
}
2) Получение всех подписчиков с пагинацией
get http://localhost:8000/api/subscriber?page=1&limit=10
3) Сортировка подписчиков
get http://localhost:8000/api/subscriber?sortBy=subscriber_name&order=ASC
4) Фильтрация подписчиков
get http://localhost:8000/api/subscriber/filtered?subscriber_name=Иван
5)Получение подписчика по ID
get http://localhost:8000/api/subscriber/1 (указать id)
6) Обновление данных подписчика
put http://localhost:8000/api/subscribers/55 
{
    "subscriber_name": "Обновленный Иван Иванов",
    "subscriber_address": "Москва, ул. Новая, д. 10"
}
7) Удаление подписчика
delete http://localhost:8000/api/subscribers/1
Выполнить запуск сервера: cd src/server
node index.js
Запуск клиента npm start



1. Создание новой подписки
post http://localhost:8000/api/subscription
{
  "subscriber_id": 1,
  "publication_id": 1,
  "subscription_period": "1",
  "start_date": "2024-01-01"
}
2. Получение всех подписок с пагинацией
get http://localhost:8000/api/subscription?page=1&limit=10
3. Получение подписки по ID
get http://localhost:8000/api/subscription/1
4. Обновление подписки
put http://localhost:8000/api/subscription/1
{
  "subscription_period": "2",
  "start_date": "2024-02-01"
}
6. Фильтрация подписок
get http://localhost:8000/api/subscription/filtered?subscription_period[]=6&subscription_period[]=1 (фильтр на период где берется только 6 и 1 месяц)
7. Поиск подписок
get http://localhost:8000/api/subscription/filtered?subscriber_id=4&publication_id=29&subscription_period=6
8. Удаление подписок по id
delete http://localhost:8000/api/subscription/deleteById/4 ()
