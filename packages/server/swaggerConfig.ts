import BoardGame from "./models/BoardGame";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "BerloGA API",
      version: "1.0.0",
      description: "API для проекта BerloGA",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Maker: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              readonly: true /*т.к. сервер сам создает id*/,
            },
            name: { type: "string", example: "Hobby World" },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
          required: ["id", "name"],
        },
        Genre: {
          type: "object",
          properties: {
            id: { type: "integer", readonly: true },
            name: { type: "string", example: "Стратегия" },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
          required: ["id", "name"],
        },
        City: {
          type: "object",
          properties: {
            id: { type: "integer", readonly: true },
            name: { type: "string", example: "Тюмень" },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
          required: ["id", "name"],
        },
        User: {
          type: "object",
          require: ["id", "nickname", "role"],
          properties: {
            id: { type: "integer", readonly: true },
            nickname: { type: "string", example: "example_user" },
            email: { type: "string", example: "example@mail.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            is_show_city: { type: "boolean" },
            social_network: { type: "string" },
            city: { $ref: "#/components/schemas/City" },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        UserShort: {
          type: "object",
          required: ["id", "nickname"],
          properties: {
            id: { type: "integer", example: 10 },
            nickname: { type: "string", example: "gamer_2026" },
          },
        },
        UserWithGameCount: {
          allOf: [
            { $ref: "#/components/schemas/User" },
            {
              type: "object",
              properties: {
                game_count: {
                  type: "integer",
                  description: "Количество игр в библиотеке пользователя",
                  example: 5,
                },
              },
            },
          ],
        },
        BoardGame: {
          type: "object",
          require: ["id", "name", "photo", "content"],
          properties: {
            id: { type: "integer", readonly: true },
            name: { type: "string", example: "Catan" },
            time: {
              type: "string",
              description: "Длительность игры в минутах",
            },
            photo: { type: "string" },
            content: { type: "string", description: "Описание игры" },
            age: {
              type: "integer",
              example: 10,
              description: "Возрастное ограничение",
            },
            min_number_players: {
              type: "integer",
              example: 3,
              description: "Мин. кол-во игроков",
            },
            max_number_players: {
              type: "integer",
              example: 6,
              description: "Макс. кол-во игроков",
            },
            pdf: { type: "string", description: "Ссылка на правила (PDF)" },
            genres: {
              type: "array",
              items: { $ref: "#/components/schemas/Genre" },
              description: "Список жанров игры",
            },
            maker: {
              $ref: "#/components/schemas/Maker",
              description: "Издательство игры",
            },
            rating: {
              type: "number",
              format: "double",
              example: 8.7,
              description: "Средний рейтинг",
            },
          },
        },
        Library: {
          type: "object",
          required: ["id", "user_id", "game_id"],
          properties: {
            id: { type: "integer", readonly: true },
            user_id: { type: "integer" },
            game_id: { type: "integer" },
            rate: {
              type: "number",
              format: "double",
              minimum: 1,
              maximum: 5,
              description: "Оценка пользователя",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LibraryWithGameDetails: {
          allOf: [
            { $ref: "#/components/schemas/Library" },
            {
              type: "object",
              properties: {
                game: {
                  $ref: "#/components/schemas/BoardGame",
                  description: "Полная информация об игре",
                },
              },
            },
          ],
        },
        Request: {
          type: "object",
          required: ["id", "name", "is_done", "user_id"],
          properties: {
            id: { type: "integer", readonly: true },
            name: { type: "string", example: "Catan" },
            details: {
              type: ["string", "null"],
              nullable: true,
              example: "Игра есть в моей коллекции...",
            },
            is_done: { type: "boolean", example: false },
            user: { $ref: "#/components/schemas/UserShort" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Comment: {
          type: "object",
          required: ["id", "content", "user_id", "blockComment_id"],
          properties: {
            id: { type: "integer", readonly: true },
            content: { type: "string", example: "Отличный ход!" },
            user: { $ref: "#/components/schemas/UserShort" },
            blockComment_id: { type: "integer", example: 7 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BlockComment: {
          type: "object",
          required: ["id", "header", "author_id", "game_id"],
          properties: {
            id: { type: "integer", readonly: true },
            header: { type: "string", example: "Обсуждение партии Catan" },
            author_id: { $ref: "#/components/schemas/UserShort" },
            game_id: { type: "integer", example: 3 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./controllers/**/*.ts"],
};

export default options;
