
const express = require("express");
const cors = require("cors");
const fs = require("fs"); // встроенный модуль Node.js для работы с файлами

const app = express();
const PORT = 5000;
const DB_FILE = "./db.json"; // путь к файлу

app.use(cors());
app.use(express.json());

// Загружаем данные из файла при старте сервера
let data = {
  users: [],
  comments: [
    {
      id: 1,
      name: "Алексей К.",
      comments:
        "Отличная первая неделя! Всё объяснено просто и по делу. Особенно понравился урок про основы — наконец-то всё стало на свои места.",
    },
    {
      id: 2,
      name: "Марина_2001",
      comments:
        "Спасибо за курс! Давно хотела начать, но боялась, что будет сложно. А тут всё понятно даже новичку. Жду вторую неделю!",
    },
    {
      id: 3,
      name: "Дмитрий Про",
      comments:
        "Круто, что есть практические задания после каждого видео. Сразу закрепляешь материал. Рекомендую всем!",
    },
    {
      id: 4,
      name: "Катя С.",
      comments:
        "Инструктор объясняет спокойно и без воды — это большой плюс. Не ожидала, что за неделю так много узнаю. Спасибо!",
    },
    {
      id: 5,
      name: "Виктор_85",
      comments:
        "Прошёл первую неделю на одном дыхании. Материал актуальный, примеры из реальной жизни. Уже применяю на работе!",
    },
  ],
};

if (fs.existsSync(DB_FILE)) {
  const fileContent = fs.readFileSync(DB_FILE, "utf-8");
  data = JSON.parse(fileContent);
  console.log("Данные загружены из db.json");
} else {
  console.log("db.json не найден, создан новый");
}

// Функция для сохранения в файл
function saveData() {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  console.log("Данные сохранены в db.json");
}

// Роуты для пользователей
app.get("/users", (req, res) => {
  res.json(data.users);
});

app.post("/users", (req, res) => {
  const { name, password, age, img } = req.body;

  // Простые проверки (можно расширить)
  if (!name || !password || !age || !img) {
    return res
      .status(400)
      .json({ message: "Все поля обязательны, включая изображение" });
  }

  // Опционально: проверь, что img действительно Base64 PNG
  if (typeof img !== "string" || !img.startsWith("data:image/png;base64,")) {
    return res
      .status(400)
      .json({ message: "Изображение должно быть в формате PNG Base64" });
  }

  const newUser = {
    id: data.users.length + 1,
    name: name.trim(),
    password, // В реальном проекте НЕ сохраняй пароль в открытом виде! (но для обучения ок)
    age,
    img, // ← сохраняем Base64-строку как есть
  };

  data.users.push(newUser);
  saveData(); // сохраняем в db.json

  res.status(201).json({
    message: "Аккаунт успешно создан",
    user: { id: newUser.id, name: newUser.name, age: newUser.age }, // не возвращаем пароль и img (по желанию)
  });
});

// Роуты для комментариев
app.get("/comments", (req, res) => {
  res.json(data.comments);
});

app.post("/comments", (req, res) => {
  const { name, comment } = req.body;

  if (!name || !comment || comment.trim() === "") {
    return res.status(400).json({ message: "Имя и комментарий обязательны" });
  }

  const newComment = {
    id: data.comments.length + 1,
    name: name.trim(),
    comments: comment.trim(),
  };

  data.comments.push(newComment);
  saveData();

  res.status(201).json({
    message: "Комментарий добавлен",
    comment: newComment,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
