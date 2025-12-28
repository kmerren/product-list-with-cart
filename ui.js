// ui.js

// ===== DOM =====
const grid = document.getElementById("product-grid");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartSummaryEl = document.getElementById("cart-summary");

const modalEl = document.getElementById("modal");
const modalItemsEl = document.getElementById("modal-items");
const modalTotalEl = document.getElementById("modal-total");
const startNewOrderBtn = document.getElementById("start-new-order");

const toastEl = document.getElementById("toast");

let toastTimeout = null;
let lastFocusEl = null;

export const dom = {
  grid,
  cartItemsEl,
  cartSummaryEl,
  modalEl,
  startNewOrderBtn,
};

// ===== HELPERS =====
export function money(n) {
  return `$${n.toFixed(2)}`;
}

export function showToast(message = "Added to cart") {
  if (!toastEl) return;

  toastEl.textContent = message;
  toastEl.hidden = false;
  toastEl.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => {
      toastEl.hidden = true;
    }, 200);
  }, 1500);
}

export function bumpCartCount() {
  if (!cartCountEl) return;
  cartCountEl.classList.remove("cart-bump");
  void cartCountEl.offsetWidth; // restart animation
  cartCountEl.classList.add("cart-bump");
}

// ===== RENDER =====
export function renderProducts(products, cart = {}) {
    if (!grid) return;
  
    grid.innerHTML = products
      .map((p) => {
        const qty = cart[String(p.id)] || 0;
  
        return `
          <article class="product-card">
            <img src="${p.image.desktop}" alt="${p.name}">
            <p class="category">${p.category}</p>
            <h3 class="name">${p.name}</h3>
            <p class="price">${money(p.price)}</p>
  
            ${
              qty > 0
                ? `<p class="in-cart-badge" aria-live="polite">In cart: <strong>${qty}</strong></p>`
                : ``
            }
  
            <button
              type="button"
              class="add-btn"
              data-action="add"
              data-id="${p.id}"
            >
              ${qty > 0 ? `Add another (${qty})` : "Add to Cart"}
            </button>
          </article>
        `;
      })
      .join("");
  }
  

export function renderCart({ products, cart }) {
  const ids = Object.keys(cart);
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  cartCountEl.textContent = count;

  if (ids.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">Your cart is empty</p>
        <p class="empty-cart">Your added items will appear here</p>
      </div>
    `;
    cartSummaryEl.innerHTML = `
      <button type="button" id="confirm-order" disabled>
        Confirm Order
      </button>
    `;
    return;
  }

  cartItemsEl.innerHTML = ids
    .map((id) => {
      const p = products.find((x) => String(x.id) === String(id));
      if (!p) return "";

      const qty = cart[id];
      const lineTotal = p.price * qty;

      return `
        <div class="cart-line">
          <div>
            <p class="cart-name">${p.name}</p>
            <p class="cart-meta">${qty} × ${money(p.price)} <strong>${money(lineTotal)}</strong></p>
          </div>

          <div class="cart-actions">
            <button type="button" data-action="dec" data-id="${id}" aria-label="Decrease quantity">−</button>
            <button type="button" data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
            <button type="button" data-action="remove" data-id="${id}" aria-label="Remove item">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");

  const total = ids.reduce((sum, id) => {
    const p = products.find((x) => String(x.id) === String(id));
    return p ? sum + p.price * cart[id] : sum;
  }, 0);

  cartSummaryEl.innerHTML = `
    <p class="cart-total">Total: <strong>${money(total)}</strong></p>
    <button type="button" id="confirm-order">Confirm Order</button>
  `;
}

// ===== MODAL =====
export function openModal({ products, cart }) {
  lastFocusEl = document.activeElement;

  const ids = Object.keys(cart);

  modalItemsEl.innerHTML = ids
    .map((id) => {
      const p = products.find((x) => String(x.id) === String(id));
      if (!p) return "";
      const qty = cart[id];

      return `
        <div class="modal-line">
          <div class="modal-line__left">
            <p class="modal-name">${p.name}</p>
            <p class="modal-meta">${qty} × ${money(p.price)}</p>
          </div>
          <p class="modal-line__right">${money(p.price * qty)}</p>
        </div>
      `;
    })
    .join("");

  const total = ids.reduce((sum, id) => {
    const p = products.find((x) => String(x.id) === String(id));
    return p ? sum + p.price * cart[id] : sum;
  }, 0);

  modalTotalEl.textContent = money(total);

  modalEl.hidden = false;
  startNewOrderBtn.focus();
}

export function closeModal() {
  modalEl.hidden = true;
  if (lastFocusEl) lastFocusEl.focus();
}

