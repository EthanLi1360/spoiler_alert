# Spoiler Alert

**Your smart fridge companion.**

Spoiler Alert helps you track what’s in your fridge, reduce food waste, and make meal planning effortless.

## 🎥 Demo

[![Watch the demo](https://i.imgur.com/9g1qgDX.png)](https://youtu.be/YOLyiLElo8w)

---

## 🚀 Key Features

- **Easy Fridge Management:** Add, delete, search, and categorize your food items in seconds.
- **AI-Powered Suggestions:** Get automatic expiry date and category predictions for new items—no more guessing!
- **Smart Recipe Ideas:** Instantly generate recipes based on what you already have, powered by Gemini AI.
- **Shared Fridge Access:** Invite family or roommates to manage a shared fridge together.
- **Personalized Experience:** Your fridge, your way—customize categories and get suggestions tailored to your habits.
- **Modern UI:** Responsive, clean, and theme-aware interface with beautiful visuals.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, CSS Modules, [shadcn/ui](https://ui.shadcn.dev/) (with Tailwind CSS), Lucide icons, Axios
- **Backend:** Python 3, Flask, Flask-CORS, SQLAlchemy, SQLite
- **AI Integration:** Google Gemini API (via @google/generative-ai)
- **Other:** dotenv, bcrypt, modern ES6+ JavaScript

---

## ⚡ Quickstart

### 1. Clone the repository

```sh
git clone https://github.com/suryaatm21/spoiler_alert.git
cd spoiler_alert
```

### 2. Backend Setup

```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

#### 🗄️ Database Configuration

- By default, Spoiler Alert uses **SQLite** (a file-based database) for easy local development. The database file is created automatically in the backend directory.
- **No setup is required for SQLite.**
- If you want to use a different database (e.g., PostgreSQL, MySQL), update the `SQLALCHEMY_DATABASE_URI` in `backend/app.py` and install the appropriate driver in `requirements.txt`.
  - Example for PostgreSQL:
    ```python
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/dbname'
    ```
  - Then run:
    ```sh
    pip install psycopg2-binary
    ```

By default, the backend runs on port **5001**. If you need to change this, edit `app.py` or set the port in your run command.

### 3. Frontend Setup

```sh
cd ../frontend
npm install
npm start
```

The frontend runs on port **3005** by default (see `.env`). You can change this by editing `.env` or running with `PORT=3002 npm start`.

#### 🔗 Connecting Frontend & Backend

- The frontend will auto-discover the backend on `localhost:5001` or `127.0.0.1:5001`.
- To override, set `REACT_APP_BACKEND_URL` in `frontend/.env`:
  ```properties
  REACT_APP_BACKEND_URL=http://localhost:5001
  ```

---

## 🤖 Gemini API Key Setup

To use AI-powered recipe generation, you need a Google Gemini API key.

1. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a key.
2. **Add your key to the backend:**
   - Create a `.env` file in the `backend/` directory (if it doesn't exist):
     ```properties
     GEMINI_API_KEY=your-gemini-api-key-here
     ```
   - Restart the backend after adding the key.

---

## 🖥️ Usage

1. **Sign up and log in.**
2. **Select or create a fridge:**
   - You’ll see a centered spinner carousel listing all fridges you have access to.
   - Click a name to highlight it, then choose **Select Current Fridge** or **Create New Fridge**.
   - Navigation between pages (Fridges / Recipes / Wishlists) is always available even before selecting a fridge.
3. **Add food items:**
   - Once a fridge is selected and opened, add items; the app predicts expiry date and category.
4. **Generate recipes:**
   - On the Recipes page, if no fridge is selected you’ll first see the same centered spinner.
   - After selecting a fridge, click **Generate Recipes** to produce AI-based ideas from your existing inventory.
   - Save or use a recipe; using it can post ingredients back into your fridge inventory.
5. **Share your fridge:**
   - Invite collaborators via the Share Fridge feature so everyone can view and manage contents.

---

## 📝 Troubleshooting

- **CORS or network errors?**
  - Make sure both frontend and backend are running on the correct ports.
  - Set `REACT_APP_BACKEND_URL` if auto-discovery fails.
- **Gemini API errors?**
  - Check your API key and backend `.env`.
- **Port conflicts?**
  - Change the `PORT` in `frontend/.env` or backend run command.

---

**Questions or feedback?** We’d love to hear from you—open an issue or contribute!
