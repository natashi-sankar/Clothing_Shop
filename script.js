
// SLIDESHOW 
// ==========================
let current = 0;
const slides = document.querySelectorAll(".slides");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === index);
    if (dots[i]) {
      dots[i].classList.toggle("active", i === index);
    }
  });
}

function nextSlide() {
  if (slides.length === 0) return;
  current = (current + 1) % slides.length;
  showSlide(current);
}

if (slides.length > 0) {
  setInterval(nextSlide, 4000);
}

// for dots' onclick
function currentSlide(index) {
  current = index;
  showSlide(current);
}
window.currentSlide = currentSlide; // make it global

// ==========================
// DROPDOWN NAVIGATION
// ==========================
document.querySelectorAll(".dropdown-content a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target.getAttribute("data-target");

    const hero = document.querySelector(".hero");
    if (hero) hero.style.display = "none";

    document.querySelectorAll(".collections").forEach((section) => {
      section.style.display = "none";
    });

    const showSection = document.getElementById(target);
    if (showSection) {
      showSection.style.display = "block";
      window.scrollTo({
        top: showSection.offsetTop - 60,
        behavior: "smooth",
      });
    }
  });
});

// ==========================
// "HOME" 
// ==========================
const homeNavLink = document.querySelector('nav a[href="#"]');
if (homeNavLink) {
  homeNavLink.addEventListener("click", (e) => {
    e.preventDefault();

    const hero = document.querySelector(".hero");
    if (hero) hero.style.display = "block";

    document.querySelectorAll(".collections").forEach((section) => {
      section.style.display = "none";
    });

    const homeCollections = document.getElementById("home-collections");
    if (homeCollections) homeCollections.style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==========================
// "SHOP NOW" button
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const shopNowBtn = document.querySelector(".hero .hero-text button");
  if (!shopNowBtn) return;

  shopNowBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const hero = document.querySelector(".hero");
    if (hero) hero.style.display = "none";

    document.querySelectorAll(".collections").forEach((section) => {
      section.style.display = "none";
    });

    const homeCollections = document.getElementById("home-collections");
    if (homeCollections) {
      homeCollections.style.display = "block";
      setTimeout(() => {
        homeCollections.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  });
});

// ==========================
// INITIAL HERO VISIBILITY
// ==========================
window.addEventListener("load", () => {
  const hero = document.querySelector(".hero");
  if (hero) hero.style.display = "block";

  document.querySelectorAll(".collections").forEach((section) => {
    section.style.display = "none";
  });

  const homeCollections = document.getElementById("home-collections");
  if (homeCollections) homeCollections.style.display = "block";
});

// ==========================
// PRODUCT MODAL (index.html)
// ==========================
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalSizes = document.getElementById("modal-sizes");
const closeBtn = document.querySelector(".close-btn");

const prices = {
  men: 49.99,
  women: 44.99,
  kids: 29.99,
  accessories: 19.99,
};

if (modal && modalImg && modalTitle && modalPrice && modalSizes) {
  document.querySelectorAll(".collection-card img").forEach((img) => {
    img.addEventListener("click", (e) => {
      const section = e.target.closest("section").id;
      const productName = e.target.alt;
      const price = prices[section] || 39.99;

      modalImg.src = e.target.src;
      modalTitle.textContent = productName;
      modalPrice.textContent = `$${price.toFixed(2)}`;

      modalSizes.innerHTML = "";

      if (section === "accessories") {
        const btn = document.createElement("button");
        btn.textContent = "One Size";
        btn.classList.add("active");
        modalSizes.appendChild(btn);
      } else {
        ["XS", "S", "M", "L", "XL"].forEach((size) => {
          const btn = document.createElement("button");
          btn.textContent = size;
          btn.addEventListener("click", () => {
            document
              .querySelectorAll(".sizes button")
              .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
          });
          modalSizes.appendChild(btn);
        });
      }

      modal.style.display = "flex";
    });
  });
}

if (closeBtn && modal) {
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}

// ==========================
// SHOPPING CART MODULE
// ==========================
const Cart = {
  cartKey: "clothingShopCart",

  // ---------- STORAGE ----------
  defaultCart() {
    return {
      items: [],
      discountCode: null,
      shippingMethod: "standard",
      shippingCost: 5.99,
      taxRate: 0.06,
    };
  },

  loadCart() {
    const stored = localStorage.getItem(this.cartKey);
    if (!stored) return this.defaultCart();
    try {
      const parsed = JSON.parse(stored);
      // make sure missing fields don’t break totals
      return {
        ...this.defaultCart(),
        ...parsed,
      };
    } catch (e) {
      console.error("Error parsing cart from localStorage", e);
      return this.defaultCart();
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  },

  // ---------- BADGE ----------
  getItemCount() {
    const cart = this.loadCart();
    return cart.items.reduce((sum, item) => sum + item.qty, 0);
  },

  updateCartCountBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    const count = this.getItemCount();
    if (count <= 0) {
      badge.style.display = "none";
    } else {
      badge.style.display = "inline-flex";
      badge.textContent = String(count);
    }
  },

  // ---------- BASIC MUTATIONS ----------
  addItem(product) {
    const cart = this.loadCart();
    const existing = cart.items.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({ ...product, qty: 1 });
    }

    this.saveCart(cart);
    this.renderCart();
    this.renderMiniCart();
    this.renderCheckoutSummary();
    this.updateCartCountBadge();
  },

  removeItem(productId) {
    const cart = this.loadCart();
    cart.items = cart.items.filter((item) => item.id !== productId);
    this.saveCart(cart);
    this.renderCart();
    this.renderMiniCart();
    this.renderCheckoutSummary();
    this.updateCartCountBadge();
  },

  updateQuantity(productId, newQty) {
    const cart = this.loadCart();
    const item = cart.items.find((i) => i.id === productId);
    if (!item) return;

    item.qty = Math.max(1, newQty);
    this.saveCart(cart);
    this.renderCart();
    this.renderMiniCart();
    this.renderCheckoutSummary();
    this.updateCartCountBadge();
  },

  // ---------- DISCOUNT / SHIPPING ----------
  applyDiscount(code) {
    const validCodes = {
      SAVE10: 0.1,
      WELCOME5: 0.05,
    };

    const cart = this.loadCart();
    const normalized = (code || "").trim().toUpperCase();

    if (validCodes[normalized]) {
      cart.discountCode = normalized;
      this.saveCart(cart);
      return {
        success: true,
        message: `Discount code '${normalized}' applied.`,
      };
    } else {
      cart.discountCode = null;
      this.saveCart(cart);
      return { success: false, message: "Invalid discount code." };
    }
  },

  setShipping(method, cost) {
    const cart = this.loadCart();
    cart.shippingMethod = method;
    cart.shippingCost = parseFloat(cost) || 0;
    this.saveCart(cart);
    this.renderCart();
    this.renderMiniCart();
    this.renderCheckoutSummary();
  },

  // ---------- TOTALS ----------
  calculateTotals() {
    const cart = this.loadCart();
    let subtotal = 0;

    cart.items.forEach((item) => {
      subtotal += item.price * item.qty;
    });

    const discountMap = {
      SAVE10: 0.1,
      WELCOME5: 0.05,
    };

    let discountRate = 0;
    if (cart.discountCode && discountMap[cart.discountCode]) {
      discountRate = discountMap[cart.discountCode];
    }

    const discountAmount = subtotal * discountRate;
    const shipping = cart.shippingCost || 0;
    const taxableAmount = subtotal - discountAmount + shipping;
    const tax = taxableAmount * (cart.taxRate || 0.06);
    const total = taxableAmount + tax;

    return {
      subtotal,
      discountAmount,
      shipping,
      tax,
      total,
    };
  },

  // ==========================
  // CART PAGE (cart.html)
  // ==========================
  renderCart() {
    const cart = this.loadCart();
    const tbody = document.getElementById("cart-items-body");
    if (!tbody) return; // not on cart.html

    tbody.innerHTML = "";

    cart.items.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <img src="${item.image}" alt="${item.name}"
               style="width:50px;height:50px;object-fit:cover;margin-right:8px;">
          ${item.name}
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${item.qty}"
                 class="cart-qty-input"
                 data-product-id="${item.id}">
        </td>
        <td>$${(item.price * item.qty).toFixed(2)}</td>
        <td>
          <button class="remove-from-cart-btn" data-product-id="${item.id}">Remove</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    const totals = this.calculateTotals();

    const subtotalEl = document.getElementById("subtotal-amount");
    const discountEl = document.getElementById("discount-amount");
    const shippingEl = document.getElementById("shipping-amount");
    const taxEl = document.getElementById("tax-amount");
    const totalEl = document.getElementById("total-amount");

    if (subtotalEl) subtotalEl.textContent = totals.subtotal.toFixed(2);
    if (discountEl) discountEl.textContent = totals.discountAmount.toFixed(2);
    if (shippingEl) shippingEl.textContent = totals.shipping.toFixed(2);
    if (taxEl) taxEl.textContent = totals.tax.toFixed(2);
    if (totalEl) totalEl.textContent = totals.total.toFixed(2);

    this.attachCartRowEvents();
  },

  attachCartRowEvents() {
    document.querySelectorAll(".cart-qty-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const productId = e.target.getAttribute("data-product-id");
        const newQty = parseInt(e.target.value, 10) || 1;
        this.updateQuantity(productId, newQty);
      });
    });

    document.querySelectorAll(".remove-from-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-product-id");
        this.removeItem(productId);
      });
    });
  },

  // ==========================
  // CHECKOUT: fake payment
  // ==========================
  handleCheckout() {
    const cart = this.loadCart();
    if (cart.items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const name = document.getElementById("full-name")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const city = document.getElementById("city")?.value.trim();
    const state = document.getElementById("state")?.value.trim();
    const zip = document.getElementById("zip")?.value.trim();
    const cardNumber = document.getElementById("card-number")?.value.trim();
    const cardExpiry = document.getElementById("card-expiry")?.value.trim();
    const cardCvc = document.getElementById("card-cvc")?.value.trim();
    const messageEl = document.getElementById("checkout-message");

    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !zip ||
      !cardNumber ||
      !cardExpiry ||
      !cardCvc
    ) {
      if (messageEl) {
        messageEl.textContent = "Please fill in all checkout fields.";
        messageEl.style.color = "red";
      }
      return;
    }

    // fake "payment" success
    const emptied = this.defaultCart();
    this.saveCart(emptied);

    this.renderCart();
    this.renderMiniCart();
    this.renderCheckoutSummary();
    this.updateCartCountBadge();

    if (messageEl) {
      messageEl.textContent = "Payment successful! Thank you for your order.";
      messageEl.style.color = "green";
    }

    const form = document.getElementById("checkout-form");
    if (form) form.reset();
  },

  // ==========================
  // MINI CART (slide-out)
  // ==========================
  renderMiniCart() {
    const miniCart = document.getElementById("mini-cart");
    const itemsContainer = document.getElementById("mini-cart-items");
    const subtotalEl = document.getElementById("mini-cart-subtotal");

    if (!miniCart || !itemsContainer || !subtotalEl) return;

    const cart = this.loadCart();
    itemsContainer.innerHTML = "";

    if (cart.items.length === 0) {
      itemsContainer.innerHTML =
        '<p class="mini-cart-empty">Your cart is empty.</p>';
      subtotalEl.textContent = "0.00";
      return;
    }

    cart.items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "mini-cart-item";
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="mini-cart-item-details">
          <p class="mini-cart-item-name">${item.name}</p>
          <p class="mini-cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="mini-cart-item-actions">
            <div class="mini-cart-qty-controls">
              <button class="mini-cart-qty-btn" data-id="${item.id}" data-direction="dec">−</button>
              <span class="mini-cart-qty">${item.qty}</span>
              <button class="mini-cart-qty-btn" data-id="${item.id}" data-direction="inc">+</button>
            </div>
            <button class="mini-cart-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
      itemsContainer.appendChild(div);
    });

    const totals = this.calculateTotals();
    subtotalEl.textContent = totals.subtotal.toFixed(2);

    // quantity buttons
    itemsContainer
      .querySelectorAll(".mini-cart-qty-btn")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          const dir = e.target.getAttribute("data-direction");
          const cart = this.loadCart();
          const item = cart.items.find((i) => i.id === id);
          if (!item) return;

          const newQty = dir === "inc" ? item.qty + 1 : item.qty - 1;
          this.updateQuantity(id, newQty);
        })
      );

    // remove buttons
    itemsContainer
      .querySelectorAll(".mini-cart-remove")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          this.removeItem(id);
        })
      );
  },

  openMiniCart() {
    const miniCart = document.getElementById("mini-cart");
    if (miniCart) miniCart.classList.add("open");
  },

  closeMiniCart() {
    const miniCart = document.getElementById("mini-cart");
    if (miniCart) miniCart.classList.remove("open");
  },

  // ==========================
  // CHECKOUT PAGE SUMMARY
  // ==========================
  renderCheckoutSummary() {
    const itemsWrapper = document.getElementById("checkout-summary-items");
    const totalEl = document.getElementById("checkout-summary-total");

    const subEl = document.getElementById("checkout-subtotal");
    const discEl = document.getElementById("checkout-discount");
    const shipEl = document.getElementById("checkout-shipping");
    const taxEl = document.getElementById("checkout-tax");

    // if not on checkout.html, nothing to do
    if (!itemsWrapper || !totalEl) return;

    const cart = this.loadCart();
    itemsWrapper.innerHTML = "";

    if (cart.items.length === 0) {
      itemsWrapper.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cart.items.forEach((item) => {
        const p = document.createElement("p");
        p.textContent = `${item.name} × ${item.qty}`;
        itemsWrapper.appendChild(p);
      });
    }

    const totals = this.calculateTotals();

    totalEl.textContent = totals.total.toFixed(2);
    if (subEl) subEl.textContent = totals.subtotal.toFixed(2);
    if (discEl) discEl.textContent = totals.discountAmount.toFixed(2);
    if (shipEl) shipEl.textContent = totals.shipping.toFixed(2);
    if (taxEl) taxEl.textContent = totals.tax.toFixed(2);
  },

  // ==========================
  // INIT
  // ==========================
  init() {
    // Modal "Add to Cart" button
    const modalAddBtn = document.querySelector("#product-modal .add-to-cart");
    if (modalAddBtn) {
      modalAddBtn.addEventListener("click", () => {
        const titleEl = document.getElementById("modal-title");
        const priceEl = document.getElementById("modal-price");
        const imageEl = document.getElementById("modal-image");

        const name = titleEl ? titleEl.textContent.trim() : "";
        const priceText = priceEl ? priceEl.textContent : "";
        const priceMatch = priceText.match(/(\d+(\.\d+)?)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : NaN;
        const image = imageEl ? imageEl.getAttribute("src") || "" : "";

        if (!name || isNaN(price)) {
          console.error("Modal missing product name or price");
          alert("Could not add item to cart.");
          return;
        }

        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        this.addItem({ id, name, price, image });
        alert("Item added to cart!");
      });
    }

    // Discount code (cart.html)
    const applyBtn = document.getElementById("apply-discount-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        const input = document.getElementById("discount-code");
        const messageEl = document.getElementById("discount-message");
        const result = this.applyDiscount(input.value || "");

        if (messageEl) {
          messageEl.textContent = result.message;
          messageEl.style.color = result.success ? "green" : "red";
        }

        this.renderCart();
        this.renderMiniCart();
        this.renderCheckoutSummary();
      });
    }

    // Shipping options (cart.html)
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    if (shippingRadios.length > 0) {
      shippingRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
          const method = e.target.value;
          const cost = e.target.getAttribute("data-cost");
          this.setShipping(method, cost);
        });
      });

      const selected = document.querySelector('input[name="shipping"]:checked');
      if (selected) {
        this.setShipping(selected.value, selected.getAttribute("data-cost"));
      }
    }

    // Checkout form (checkout.html)
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCheckout();
      });
    }

    // Render cart (if on cart.html)
    this.renderCart();

    // Mini cart initial render (if present)
    this.renderMiniCart();

    // Cart icon → open mini cart when available
    const cartIconLink = document.querySelector(".cart-icon-link");
    if (cartIconLink) {
      cartIconLink.addEventListener("click", (e) => {
        const miniCart = document.getElementById("mini-cart");
        if (miniCart) {
          // page has mini cart (index etc.)
          e.preventDefault();
          this.openMiniCart();
        } else {
          // on cart/checkout pages → follow link normally
        }
      });
    }

    // mini-cart close buttons / overlay
    const miniCart = document.getElementById("mini-cart");
    if (miniCart) {
      const overlay = miniCart.querySelector(".mini-cart-overlay");
      const closeBtn = miniCart.querySelector(".mini-cart-close");

      if (overlay) {
        overlay.addEventListener("click", () => this.closeMiniCart());
      }
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.closeMiniCart());
      }

      const checkoutBtn = document.getElementById("mini-cart-checkout");
      const viewCartBtn = document.getElementById("mini-cart-view-cart");

      if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
          window.location.href = "checkout.html";
        });
      }
      if (viewCartBtn) {
        viewCartBtn.addEventListener("click", () => {
          window.location.href = "cart.html";
        });
      }
    }

    // badge + checkout summary on load
    this.updateCartCountBadge();
    this.renderCheckoutSummary();
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Cart.init();
});
