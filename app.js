// app.js
// Entry point of the application:
// - loads data
// - initializes state
// - wires UI events to business logic

import { createCartStore } from "./cart.js";
import {
  dom,
  renderProducts,
  renderCart,
  openModal,
  closeModal,
  showToast,
  bumpCartCount,
} from "./ui.js";

console.log("app.js module running ✅");

// Central cart store (state + persistence)
const store = createCartStore();

// Application-level state (products only)
// Cart state lives inside the store
const state = {
  products: [],
};

// Build a snapshot combining products + cart
// This is passed to UI render functions
function snapshot() {
  return {
    products: state.products,
    cart: store.getSnapshot(),
  };
}

// Load products from local JSON file
// Also normalizes IDs (Frontend Mentor data has none)
async function loadProducts() {
  const res = await fetch("./data.json");
  if (!res.ok) throw new Error(`data.json not found (HTTP ${res.status})`);

  const products = await res.json();

  state.products = products.map((p, idx) => ({
    ...p,
    id: p.id ?? idx + 1,
  }));

  console.log("Loaded products ✅", state.products.length);
}

// Re-render everything that depends on cart or products
// Keeps UI fully in sync after any state change
function rerenderAll() {
  renderCart(snapshot());
  renderProducts(state.products, store.getSnapshot());
}

// Attach all event listeners (called once at init)
function initListeners() {
  // Add item from product list
  dom.grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action='add']");
    if (!btn) return;

    const id = btn.dataset.id;
    store.add(id);

    rerenderAll();
    bumpCartCount();

    const qty = store.getQty(id);
    showToast(qty === 1 ? "Item added" : `Added ${qty} items`);
  });

  // Cart item actions: increase / decrease / remove
  dom.cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const { action, id } = btn.dataset;

    if (action === "inc") store.inc(id);
    if (action === "dec") store.dec(id);
    if (action === "remove") store.remove(id);

    rerenderAll();
    bumpCartCount();
  });

  // Confirm order button (opens modal)
  dom.cartSummaryEl.addEventListener("click", (e) => {
    const btn = e.target.closest("#confirm-order");
    if (!btn || btn.disabled) return;

    openModal(snapshot());
  });

  // Start a new order (clear cart + close modal)
  dom.startNewOrderBtn.addEventListener("click", () => {
    store.reset();
    rerenderAll();
    closeModal();
  });

  // Close modal when clicking backdrop
  dom.modalEl.addEventListener("click", (e) => {
    const close = e.target.closest("[data-action='close-modal']");
    if (close) closeModal();
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (!dom.modalEl.hidden && e.key === "Escape") {
      closeModal();
    }
  });
}

// Application bootstrap:
// 1. Check DOM
// 2. Load products
// 3. Load persisted cart
// 4. Render UI
// 5. Attach listeners
async function init() {
  console.log("DOM check", {
    grid: !!dom.grid,
    cartItemsEl: !!dom.cartItemsEl,
    cartSummaryEl: !!dom.cartSummaryEl,
    modalEl: !!dom.modalEl,
    startNewOrderBtn: !!dom.startNewOrderBtn,
  });

  await loadProducts();

  // Load cart before first render so UI reflects saved state
  store.load();

  rerenderAll();
  initListeners();
}

// Start the app
init().catch((err) => {
  console.error("Init failed ❌", err);
});
