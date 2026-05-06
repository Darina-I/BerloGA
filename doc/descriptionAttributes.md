| Таблица | Ключ | Наимненование | Ограничения | Тип данных | Краткое описание |
|------------------------|------|---------------|-------------|------------|------------------|
| 🎲**BoardGame** | PK | id | NOT NULL | integer | Поле, идентифицирующее запись в таблице |
|  | - | name | NOT NULL | text | Наименование настольной игры |
|  | - | photo | NOT NULL, UNIQUE | text | Путь к фотографии настольной игры |
|  | - | rating | NOT NULL | numeric | Рейтинг настольной игры |
|  | - | content | NOT NULL | text | Описание настольной игры |
|  | - | age | NOT NULL | integer | Возрастное ограничение настольной игры |
|  | - | max_number_players | NOT NULL | integer | Максимальное количество игроков |
|  | FK | marker_id | NULL | integer | Издательство настольной игры |
| 🖊️**Marker** | PK | id | NOT NULL | integer | Поле, идентифицирующее запись в таблице |
|  | - | name | NOT NULL, UNIQUE | text | Наименование издательства |
| 🧩**Genre** | PK | id | NOT NULL | integer | Поле, идентифицирующее запись в таблице |
|  | - | name | NOT NULL, UNIQUE | text | Наименование жанра |
| 🎯**GenreGame** | PK | id | NOT NULL | integer | Поле, идентифицирующее запись в таблице |
|  | FK | genre_id | NOT NULL | integer | Жанр настольной игры |
|  | FK | game_id | NOT NULL | integer | Настольная игра |
| 🗿**User** | PK | id | NOT NULL | integer | Поле, идентифицирующее запись в таблице |
|  | - | nickname | NOT NULL, UNIQUE | text | Псевдоним пользователя, который будут видеть другие. В том числе это поле является логином при входе в систему |
|  | - | email | NULL | text | Почта пользователя |
|  | - | city | NULL | text | Город, в котором проживает пользователь |
|  | - | password | NOT NULL | text | Пароль пользователя |
| ❤️**FavouriteGenre** | PK | id | NOT NULL | integer | Поле, идентифицирующее запись в таблице |
|  | FK | genre_id | NOT NULL | integer | Жанр |
|  | FK | user_id | NOT NULL | integer | Пользователь |
| 🗂️**Library** | PK | id | NOT NULL | integer | Поле, идентифицирующее запись в таблице |
|  | FK | user_id | NOT NULL | integer | Пользователь |
|  | FK | game_id | NOT NULL | integer | Настольная игра |
|  | - | rate | NOT NULL | integer | Личная оценка настольной игры от пользователя |
| ❓**BlockComment** | PK | id | NOT NULL | integer | Поле, идентифицирующее пользователя |
|  | FK | game_id | NOT NULL | integer | Пользователь |
|  | - | header | NOT NULL | text | Первоначальный комментай/вопрос для обсуждения - заголовок блока комментариев |
| 💬**Comment** | PK | id | NOT NULL | integer | Поле, идентифицирующее пользователя |
|  | FK | blockComment_id | NOT NULL | integer | Блок, к которому относится текущий комментарий |
|  | FK | user_id | NOT NULL | integer | Пользователь |
|  | - | content | NOT NULL | text | Содержание комментария |





