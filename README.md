# 🛒 Product List with Cart

A responsive product list application built with **vanilla JavaScript**, focusing on **state management, UI synchronization, and clean architecture**.

This project was created as part of the **Frontend Mentor – Product List with Cart challenge**.

---

## 🔗 Live Demo
👉 https://your-demo-link.netlify.app

## 📂 Repository
👉 https://github.com/YOUR_USERNAME/product-list-with-cart

---

## 🧠 Project Focus

This project is **not framework-based**.  
The goal was to demonstrate:

- how to manage application state without React
- how to keep UI in sync with state changes
- how to structure a front-end project using ES modules
- how to build a realistic cart flow with persistence

---

## 🛠 Built with
- 🧱 Semantic HTML5
- 🎨 CSS3 (Flexbox & Grid)
- ⚙️ Vanilla JavaScript (ES Modules)
- 💾 LocalStorage for cart persistence
- ♿ Accessibility-focused UI

---

## 🧩 Code Architecture

The application is split into **clear, isolated responsibilities**:

### `app.js` – Application controller
- Loads product data from `data.json`
- Initializes the cart store
- Connects UI events to business logic
- Orchestrates the app flow:
  **load → render → listen**

```js
async function init() {
  await loadProducts();
  store.load();
  rerenderAll();
  initListeners();
}