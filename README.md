# 🏨 Rorjan Restaurant & Hotel — Website

A multi-page hotel website with an integrated AI concierge agent (Zara), built with HTML, CSS, JavaScript, and Python.

---

## 📁 Project Structure

```
rorjan-hotel/
│
├── server.py              ← Python backend (run this!)
│
├── index.html             ← Homepage
├── rooms.html             ← Rooms & Suites page
├── contact.html           ← Contact & Reviews page
│
├── static/
│   ├── style.css          ← Shared styles for all pages
│   └── agent.js           ← AI Agent (Zara) logic
│
└── data/                  ← Auto-created JSON "database"
    ├── bookings.json
    ├── orders.json
    ├── complaints.json
    ├── reviews.json
    ├── contacts.json
    └── ai_interactions.json
```

---

## 🚀 Setup & Run

### Step 1: Add your Groq API Key

Open `static/agent.js` and replace the API key on line 2:

```js
const GROQ_API_KEY = "gsk_YOUR_FULL_API_KEY_HERE";
```

### Step 2: Run the Server

No external libraries needed! Uses Python's built-in `http.server`:

```bash
cd rorjan-hotel
python server.py
```

### Step 3: Open the Website

Visit: **http://localhost:8080**

---

## 🤖 AI Agent — Zara

The AI concierge **Zara** is available on ALL pages via the chat button (bottom-right corner).

### What Zara can do:
- 🛏️ **Book rooms** — collects details, generates a booking reference (RRH-XXXX)
- 🍽️ **Take food orders** — processes menu orders, gives order ID (ORD-XXXX)
- 📢 **Handle complaints** — logs issues, gives complaint reference (CMP-XXXX)
- ⭐ **Record reviews** — thanks guests and logs feedback
- 🗺️ **Local guide** — Mardan attractions, Takht-i-Bahi, etc.
- 🧾 **Checkout assistance** — calculates bills, room service info

### Data Storage
All actions are saved to `data/` JSON files:
- Bookings → `data/bookings.json`
- Orders → `data/orders.json`  
- Complaints → `data/complaints.json`
- Reviews → `data/reviews.json`
- AI conversations → `data/ai_interactions.json`

---

## 📊 Admin Endpoints (View Data)

| Endpoint | Description |
|---|---|
| `/admin/stats` | Summary count of all records |
| `/admin/bookings` | All room bookings |
| `/admin/orders` | All food orders |
| `/admin/complaints` | All complaints |
| `/admin/reviews` | All reviews |
| `/admin/contacts` | All contact form submissions |

---

## 🏨 Hotel Info

- **Name:** Rorjan Restaurant & Hotel
- **Location:** Mardan, KPK, Pakistan
- **Phone:** +92 349 9373126
- **Email:** alizeeshanse@gmail.com

---

## 📝 Notes

- This is a **study-based project** — no real database. Data is stored in JSON files.
- The Groq API uses `llama3-8b-8192` model for fast, free responses.
- Responses are generated in real-time by the AI based on the hotel's system prompt.
