# 🛒 Product List with Cart (Vanilla JavaScript)

A responsive product list application built with **vanilla JavaScript**, focusing on  
**state management, UI synchronization, and clean modular architecture**.

This project was created as part of the  
**Frontend Mentor – Product List with Cart challenge**, with a strong emphasis on
*understanding how things work under the hood*, without using a framework.

---

## 🔗 Live Demo
👉 https://your-demo-link.netlify.app

## 📂 Repository
👉 https://github.com/kmerren/product-list-with-cart

---

## 🧠 Project Focus

This project is **not framework-based**.

The goal was to demonstrate:

- how to manage application state without React or Vue
- how to keep the UI fully synchronized with state changes
- how to structure a front-end project using **ES modules**
- how to implement a realistic shopping cart flow
- how to persist data using **localStorage**
- how to handle accessibility and UI feedback properly

---

## ✨ Features

- 🍰 Products loaded dynamically from `data.json`
- 🆔 Product ID normalization (data source has no IDs)
- 🛒 Centralized cart store with a clear public API
- 💾 Automatic cart persistence using `localStorage`
- 🔁 Full UI re-render after each state change
- ➕➖ Increase / decrease quantities
- 🗑️ Automatic removal when quantity reaches zero
- 🔢 Animated cart item counter (bump effect)
- 🔔 Toast notifications on add actions
- ✅ Order confirmation modal
- 🔄 “Start new order” flow (cart reset)
- ♿ Accessibility-friendly interactions (ARIA, keyboard, reduced motion)

---

## 🛠 Built With

- 🧱 **Semantic HTML5**
- 🎨 **CSS3** (Flexbox & Grid)
- ⚙️ **Vanilla JavaScript** (ES Modules)
- 💾 **LocalStorage** for persistence
- ♿ **Accessibility-first UI patterns**

---

## 🧩 Code Architecture

The application is split into **clear, isolated responsibilities**.

### `app.js` — Application controller
- Loads product data from `data.json`
- Normalizes product IDs
- Initializes the cart store
- Wires UI events to business logic
- Orchestrates the full app lifecycle

```js
async function init() {
  await loadProducts();
  store.load();
  rerenderAll();
  initListeners();
}