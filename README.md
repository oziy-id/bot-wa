# 🤖 Nadiaa BOT V2.52 - Secure Utility WhatsApp Bot

**Nadiaa** is a high-performance, multipurpose WhatsApp bot built with `whatsapp-web.js`. Designed as a private "Jarvis-style" assistant, it integrates advanced AI models (Gemini & OpenAI) to provide smart responses, media tools, and automation directly in your chat.



---

### 🚀 Core Features

* **🤖 Smart AI Assistant:** Powered by **Gemini 2.5 Flash** and **GPT-3.5 Turbo**. Use the `.ai` command for coding help, brainstorming, or general questions.
* **🕵️ Silent Ghost Tag:** Use `.h` to ping every member in a group without their names appearing in the message. Perfect for silent announcements.
* **📸 Mata Elang (OCR):** Extract text instantly from any image using the `.baca` command.
* **📥 Media Downloader:** Download TikTok videos without watermarks silently using the `.vt` command.
* **🎨 Sticker Studio:** * `.s` - Convert images to transparent stickers.
    * `.t [text]` - Create meme stickers with top/bottom text.
    * `.st [text]` - Generate retro text stickers.
    * `.tofoto` - Reverse stickers back into raw images.
* **🧹 Auto-Maintenance:** Features a **Smart Cleaner** that automatically wipes cache and temporary files on every restart to keep the server lean.

---

### 🛠️ Tech Stack

* **Language:** [Node.js](https://nodejs.org/)
* **Library:** [whatsapp-web.js](https://wwebjs.dev/)
* **AI Engines:** Google Generative AI & OpenAI API
* **Image Processing:** Jimp
* **Server:** Express.js (for 24/7 uptime monitoring)

---

### 🛡️ Secure Configuration

This project is built with security in mind. All sensitive credentials are managed via **Environment Variables**. 

**Required Secrets:**
* `BOS_NUMBER`: Your personal WhatsApp number (e.g., `6285780024319`).
* `GEMINI_KEY_1` to `5`: API Keys for rotation.
* `OPENAI_KEY_1` to `3`: API Keys for rotation.

---

### 📦 Installation & Deployment

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/oziy-id/nadia-bot.git](https://github.com/oziy-id/bot-wa.git)
    cd bot-wa
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Secrets:** Add your API keys and number to your hosting provider's "Secrets" or "Environment Variables" section.
4.  **Run the Bot:**
    ```bash
    node index.js
    ```

---

### 🌐 24/7 Uptime
To keep the bot active 24/7 on platforms like Replit, use **UptimeRobot** to ping the built-in Express server URL every 5 minutes.

---

### 📄 License
This project is for personal use and educational purposes.

*Developed with ⚡ by [oziy-id](https://github.com/oziy-id)*
