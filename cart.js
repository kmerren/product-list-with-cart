// cart.js
export function createCartStore() {
    const state = { cart: {} };
  
    function load() {
      try {
        const raw = localStorage.getItem("cart");
        state.cart = raw ? JSON.parse(raw) : {};
      } catch {
        state.cart = {};
      }
    }
  
    function save() {
      localStorage.setItem("cart", JSON.stringify(state.cart));
    }
  
    function getSnapshot() {
      return { ...state.cart };
    }
  
    function getCartCount() {
      return Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
    }
  
    function getQty(id) {
      return state.cart[id] || 0;
    }
  
    function add(id) {
      state.cart[id] = getQty(id) + 1;
      save();
    }
  
    function inc(id) {
      if (!state.cart[id]) return;
      state.cart[id] += 1;
      save();
    }
  
    function dec(id) {
      if (!state.cart[id]) return;
      state.cart[id] -= 1;
      if (state.cart[id] <= 0) delete state.cart[id];
      save();
    }
  
    function remove(id) {
      delete state.cart[id];
      save();
    }
  
    function reset() {
      state.cart = {};
      save();
    }
  
    return {
      load,
      save,
      getSnapshot,
      getCartCount,
      getQty,
      add,
      inc,
      dec,
      remove,
      reset,
    };
  }
  