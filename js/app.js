(function () {
  "use strict";

  const products = window.GSS_PRODUCTS || [];
  const categories = window.GSS_CATEGORIES || [];
  const page = document.body.dataset.page || "home";
  const root = document.getElementById("page-root");
  const rupee = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  let headerController;
  let menuHistoryActive = false;

  const keys = {
    users: "gss_users",
    currentUser: "gss_current_user",
    remember: "gss_remember_user",
    cart: "gss_cart",
    wishlist: "gss_wishlist",
    orders: "gss_orders"
  };

  const iconMap = {
    heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cart: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h15l-1.8 8.6a2 2 0 0 1-2 1.6H8.4a2 2 0 0 1-2-1.7L5 3H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor"/></svg>',
    search: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.6-3.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    user: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>',
    package: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3 7 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    logout: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phone: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shield: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" stroke-width="2"/><path d="m9 12 2 2 4-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    truck: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 17H6V5h10v4h3l3 4v4h-2M10 17h4m-4 0a2 2 0 1 1-4 0m14 0a2 2 0 1 1-4 0m-2 0h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    headset: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h4v6H6a2 2 0 0 1-2-2v-4Zm16 0h-4v6h2a2 2 0 0 0 2-2v-4Zm-4 6c0 1-2 2-4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    activity: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12h-4l-3 8-6-16-3 8H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tool: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14.7 6.3 3-3a4 4 0 0 1 3 3l-3 3M3 21l9.5-9.5m2.2-5.2 3 3-3 3-3-3 3-3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    kit: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-3 4v6m-3-3h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    wheel: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="17" r="4" stroke="currentColor" stroke-width="2"/><path d="M8 4h3l1 7h4l3 6m-7-6H8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lungs: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v9m0 0c-2.5-4-5-6-7-5.5C2 7.2 2 15.5 3.6 19c.9 2 4.4 1.3 5.9-.7C11 16.4 12 12 12 12Zm0 0c2.5-4 5-6 7-5.5 3 .7 3 9 1.4 12.5-.9 2-4.4 1.3-5.9-.7C13 16.4 12 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function currentUser() {
    const id = read(keys.currentUser, null);
    return read(keys.users, []).find((user) => user.id === id) || null;
  }

  function cart() {
    return read(keys.cart, []);
  }

  function wishlist() {
    return read(keys.wishlist, []);
  }

  function orders() {
    return read(keys.orders, []);
  }

  function byId(id) {
    return products.find((item) => item.id === id);
  }

  function money(value) {
    return rupee.format(value);
  }

  function stars(rating) {
    const whole = Math.round(rating);
    return `${"★".repeat(whole)}${"☆".repeat(5 - whole)} <span>${rating.toFixed(1)}</span>`;
  }

  function pageName() {
    const file = location.pathname.split("/").pop() || "index.html";
    return file === "" ? "index.html" : file;
  }

  function setHeader() {
    headerController?.abort();
    headerController = new AbortController();
    const { signal } = headerController;
    const user = currentUser();
    const cartItems = cart();
    const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const total = cartItems.reduce((sum, item) => sum + ((byId(item.id)?.price || 0) * item.qty), 0);
    const nav = [
      ["Home", "index.html"],
      ["Products", "products.html"],
      ["Categories", "categories.html"],
      ["About Us", "about.html"],
      ["Contact Us", "contact.html"]
    ];

    document.getElementById("app-header").innerHTML = `
      <header class="site-header">
        <div class="container topbar">
          <button class="mobile-toggle" type="button" aria-label="Open menu" aria-controls="mobileDrawer" aria-expanded="false"><span></span><span></span><span></span></button>
          <a class="brand" href="index.html" aria-label="Ganesh Surgical Store home">
            <img class="brand-logo" src="assets/logo.svg" alt="Ganesh Surgical Store logo">
            <span>
              <strong class="brand-title">Ganesh Surgical Store</strong>
              <span class="brand-tagline">Your Health, Our Priority</span>
            </span>
          </a>
          <nav class="nav" aria-label="Main navigation">
            ${nav.map(([label, href]) => `<a class="${pageName() === href ? "active" : ""}" href="${href}">${label}</a>`).join("")}
          </nav>
          <a class="mobile-wishlist" href="wishlist.html" aria-label="Wishlist">${iconMap.heart}</a>
          <div class="header-actions">
            <div class="account">
              <button class="account-button" type="button" aria-label="Open account menu">
                <img class="avatar" src="${user?.image || "assets/default-avatar.svg"}" alt="">
                <span class="account-copy"><small>${user ? "Welcome," : "Welcome"}</small><strong>${user ? escapeHtml(user.name.split(" ")[0]) : "Guest"}</strong></span>
                <span aria-hidden="true">⌄</span>
              </button>
              <div class="account-menu">
                ${user ? `
                  <a href="profile.html">${iconMap.user} My Profile</a>
                  <a href="orders.html">${iconMap.package} My Orders</a>
                  <a href="wishlist.html">${iconMap.heart} Wishlist</a>
                  <button id="logoutBtn" type="button">${iconMap.logout} Logout</button>
                ` : `
                  <a href="login.html">${iconMap.user} Login</a>
                  <a href="register.html">${iconMap.package} Register</a>
                  <a href="wishlist.html">${iconMap.heart} Wishlist</a>
                `}
              </div>
            </div>
            <a class="cart-link" href="cart.html" aria-label="Cart">
              <span class="cart-icon">${iconMap.cart}<b class="cart-count">${cartCount}</b></span>
              <span>Cart<small>${money(total)}</small></span>
            </a>
          </div>
        </div>
      </header>
      <div class="menu-overlay" aria-hidden="true"></div>
      <aside class="mobile-drawer" id="mobileDrawer" aria-label="Mobile navigation" aria-hidden="true">
        <div class="drawer-head">
          <img src="assets/logo.svg" alt="">
          <div><strong>Ganesh Surgical Store</strong><small>${user ? `Hello, ${escapeHtml(user.name.split(" ")[0])}` : "Your Health, Our Priority"}</small></div>
          <button class="drawer-close" type="button" aria-label="Close menu">&times;</button>
        </div>
        <nav class="drawer-links">
          <a href="index.html">Home</a>
          <a href="products.html">Products</a>
          <a href="categories.html">Categories</a>
          <a href="wishlist.html">Wishlist</a>
          <a href="cart.html">Cart <b class="drawer-cart-count">${cartCount}</b></a>
          <a href="${user ? "profile.html" : "login.html"}">Profile</a>
          <a href="orders.html">Orders</a>
          <a href="contact.html">Contact</a>
          <a href="about.html">About</a>
          <a href="profile.html#settings">Settings</a>
          <button class="drawer-logout" type="button">Logout</button>
        </nav>
      </aside>
      ${page !== "login" && page !== "register" ? searchBand() : ""}
      ${mobileBottomNav(cartCount, user)}
    `;

    document.querySelector(".mobile-toggle")?.addEventListener("click", toggleMobileMenu, { signal });
    document.querySelector(".drawer-close")?.addEventListener("click", () => closeMobileMenu(), { signal });
    document.querySelector(".menu-overlay")?.addEventListener("click", () => closeMobileMenu(), { signal });
    document.querySelector(".drawer-logout")?.addEventListener("click", logout, { signal });
    document.querySelector(".account-button")?.addEventListener("click", () => document.querySelector(".account")?.classList.toggle("open"), { signal });
    document.getElementById("logoutBtn")?.addEventListener("click", logout, { signal });
    document.addEventListener("keydown", handleMenuKey, { signal });
    window.addEventListener("popstate", handleMenuBack, { signal });
    setupSearch();
  }

  function mobileBottomNav(cartCount, user) {
    const items = [
      ["home", "index.html", "Home", '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3V10.5Z"/>'],
      ["categories", "categories.html", "Categories", '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'],
      ["account", user ? "profile.html" : "login.html", "Account", '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'],
      ["cart", "cart.html", "Cart", '<path d="M3 4h2l2 12h11l2-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>']
    ];
    const active = page === "profile" || page === "login" || page === "register" || page === "orders" ? "account" : page;
    return `<nav class="mobile-bottom-nav" aria-label="Mobile shortcuts">${items.map(([key, href, label, paths]) => `
      <a class="${active === key ? "active" : ""}" href="${href}"${active === key ? ' aria-current="page"' : ""}>
        <span class="bottom-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>${key === "cart" ? `<b class="bottom-cart-count">${cartCount}</b>` : ""}</span>
        <span>${label}</span>
      </a>`).join("")}</nav>`;
  }

  function openMobileMenu() {
    if (document.body.classList.contains("menu-open")) return;
    document.body.classList.add("menu-open");
    document.querySelector(".mobile-toggle")?.setAttribute("aria-expanded", "true");
    document.querySelector(".mobile-drawer")?.setAttribute("aria-hidden", "false");
    history.pushState({ ...(history.state || {}), gssMenu: true }, "");
    menuHistoryActive = true;
  }

  function closeMobileMenu(useHistory = true) {
    if (!document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    document.querySelector(".mobile-toggle")?.setAttribute("aria-expanded", "false");
    document.querySelector(".mobile-drawer")?.setAttribute("aria-hidden", "true");
    if (useHistory && menuHistoryActive && history.state?.gssMenu) history.back();
    menuHistoryActive = false;
  }

  function toggleMobileMenu() {
    if (document.body.classList.contains("menu-open")) closeMobileMenu();
    else openMobileMenu();
  }

  function handleMenuKey(event) {
    if (event.key === "Escape") closeMobileMenu();
  }

  function handleMenuBack() {
    if (document.body.classList.contains("menu-open")) closeMobileMenu(false);
  }

  function searchBand() {
    return `
      <section class="search-band">
        <div class="container">
          <form class="search-shell" id="globalSearch">
            <span class="search-symbol">${iconMap.search}</span>
            <input id="searchInput" type="search" autocomplete="off" placeholder="Search for products...">
            <button type="submit">Search</button>
            <div class="suggestions" id="suggestions"></div>
          </form>
        </div>
      </section>
    `;
  }

  function setFooter() {
    document.getElementById("app-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            <h3>Ganesh Surgical Store</h3>
            <p>Premium surgical and medical products delivered with quality, safety, and care across India.</p>
          </div>
          <div><h3>Shop</h3><a href="products.html">Products</a><a href="categories.html">Categories</a><a href="cart.html">Cart</a></div>
          <div><h3>Account</h3><a href="profile.html">Profile</a><a href="orders.html">Orders</a><a href="wishlist.html">Wishlist</a></div>
          <div><h3>Contact</h3><a href="tel:+919876543210">+91 98765 43210</a><a href="mailto:care@ganeshsurgicalstore.com">care@ganeshsurgicalstore.com</a><a href="contact.html">Store location</a></div>
        </div>
      </footer>
    `;
  }

  function setupSearch() {
    const form = document.getElementById("globalSearch");
    const input = document.getElementById("searchInput");
    const box = document.getElementById("suggestions");
    if (!form || !input || !box) return;

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        box.classList.remove("visible");
        box.innerHTML = "";
        return;
      }
      const matches = products
        .filter((item) => `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query))
        .slice(0, 6);
      box.innerHTML = matches.length ? matches.map((item) => `
        <button class="suggestion-item" type="button" data-id="${item.id}">
          <img src="${item.image}" alt="">
          <span><strong>${item.name}</strong><br><small>${item.category} • ${money(item.price)}</small></span>
        </button>
      `).join("") : `<div class="suggestion-item">No matching products found</div>`;
      box.classList.add("visible");
      box.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
        location.href = `product-details.html?id=${button.dataset.id}`;
      }));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = encodeURIComponent(input.value.trim());
      location.href = `products.html${query ? `?search=${query}` : ""}`;
    });
  }

  function renderHome() {
    root.innerHTML = `
      <section class="container fade-in">
        <div class="hero">
          <div class="hero-content">
            <div class="trust-badge">${iconMap.shield.replace('width="42" height="42"', 'width="22" height="22"')} Trusted by Thousands</div>
            <h1>Your Trusted <span>Medical &</span> Surgical Store</h1>
            <p>Premium surgical and medical products delivered with quality, safety and care.</p>
            <div class="hero-actions">
              <a class="btn primary" href="products.html">Shop Now ${iconMap.package}</a>
              <a class="btn outline" href="contact.html">${iconMap.phone} Contact Us</a>
            </div>
          </div>
        </div>
        <div class="features">
          ${featureCard("shield", "Premium Quality", "High quality products from trusted brands")}
          ${featureCard("truck", "Fast Delivery", "Quick and safe delivery across India")}
          ${featureCard("headset", "24/7 Support", "We are here to help you anytime")}
          ${featureCard("lock", "Secure Payment", "100% secure and safe payment gateway")}
        </div>
      </section>
      <section class="container page-section">
        <div class="section-title">
          <div><h2><span class="desktop-product-title">Featured Products</span><span class="mobile-product-title">Best Selling Products</span></h2><p>Popular essentials selected for clinics, hospitals, home care, and emergency use.</p></div>
          <a class="btn ghost" href="products.html">View All</a>
        </div>
        <div class="product-grid">${products.slice(0, 8).map(productCard).join("")}</div>
      </section>
    `;
    bindProductButtons();
  }

  function featureCard(icon, title, copy) {
    return `<article class="feature-card"><div class="feature-icon">${iconMap[icon]}</div><div><h3>${title}</h3><p>${copy}</p></div></article>`;
  }

  function renderProducts() {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="section-title">
          <div><h1>Products</h1><p>Browse professional surgical products with live search, category filtering, and price sorting.</p></div>
        </div>
        <div class="toolbar">
          <input id="productSearch" type="search" placeholder="Search products, categories, descriptions..." value="${escapeHtml(search)}">
          <select id="categoryFilter"><option value="">All Categories</option>${categories.map((category) => `<option value="${category.name}">${category.name}</option>`).join("")}</select>
          <select id="sortFilter"><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top Rated</option></select>
        </div>
        <div class="product-grid" id="productGrid"></div>
      </section>
    `;
    const searchInput = document.getElementById("productSearch");
    const cat = document.getElementById("categoryFilter");
    const sort = document.getElementById("sortFilter");
    const draw = () => {
      let filtered = products.filter((item) => {
        const hay = `${item.name} ${item.category} ${item.description}`.toLowerCase();
        return (!searchInput.value || hay.includes(searchInput.value.toLowerCase())) && (!cat.value || item.category === cat.value);
      });
      if (sort.value === "price-low") filtered.sort((a, b) => a.price - b.price);
      if (sort.value === "price-high") filtered.sort((a, b) => b.price - a.price);
      if (sort.value === "rating") filtered.sort((a, b) => b.rating - a.rating);
      document.getElementById("productGrid").innerHTML = filtered.length ? filtered.map(productCard).join("") : emptyState("No products found", "Try a different search or category filter.", "View categories", "categories.html");
      bindProductButtons();
    };
    [searchInput, cat, sort].forEach((el) => el.addEventListener("input", draw));
    draw();
  }

  function productCard(item) {
    const liked = wishlist().includes(item.id);
    return `
      <article class="product-card">
        <div class="product-media"><img src="${item.image}" alt="${item.name}"></div>
        <div class="product-body">
          <span class="pill">${item.category}</span>
          <h3>${item.name}</h3>
          <div class="rating">${stars(item.rating)}</div>
          <p>${item.description}</p>
          <div class="price-row"><span class="price">${money(item.price)}</span><button class="icon-btn wishlist-btn ${liked ? "active" : ""}" data-id="${item.id}" aria-label="Toggle wishlist">${iconMap.heart}</button></div>
          <div class="product-actions">
            <button class="btn primary add-cart" data-id="${item.id}">Add to Cart</button>
            <a class="btn ghost" href="product-details.html?id=${item.id}">View Details</a>
          </div>
        </div>
      </article>
    `;
  }

  function bindProductButtons() {
    document.querySelectorAll(".add-cart").forEach((button) => button.addEventListener("click", () => addToCart(button.dataset.id)));
    document.querySelectorAll(".wishlist-btn").forEach((button) => button.addEventListener("click", () => {
      toggleWishlist(button.dataset.id);
      button.classList.toggle("active", wishlist().includes(button.dataset.id));
    }));
  }

  function renderDetails() {
    const id = new URLSearchParams(location.search).get("id") || products[0].id;
    const item = byId(id);
    if (!item) {
      root.innerHTML = notFoundMarkup();
      return;
    }
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="details-layout">
          <div class="details-media panel"><img src="${item.image}" alt="${item.name}"></div>
          <article class="details-info panel">
            <span class="pill">${item.category}</span>
            <h1>${item.name}</h1>
            <div class="rating">${stars(item.rating)}</div>
            <div class="price">${money(item.price)}</div>
            <p>${item.description}</p>
            <ul class="spec-list">${item.specs.map((spec) => `<li>${spec}</li>`).join("")}</ul>
            <div class="actions">
              <button class="btn primary add-cart" data-id="${item.id}">Add to Cart</button>
              <button class="btn outline wishlist-btn ${wishlist().includes(item.id) ? "active" : ""}" data-id="${item.id}">${iconMap.heart} Wishlist</button>
              <a class="btn ghost" href="products.html">Back to Products</a>
            </div>
          </article>
        </div>
      </section>
    `;
    bindProductButtons();
  }

  function renderCategories() {
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="section-title"><div><h1>Categories</h1><p>Find the right product family quickly and move straight into matching items.</p></div></div>
        <div class="category-grid">
          ${categories.map((category) => {
            const count = products.filter((item) => item.category === category.name).length;
            return `<article class="category-card"><div class="feature-icon">${iconMap[category.icon]}</div><h2>${category.name}</h2><p>${category.description}</p><a class="btn primary" href="products.html?search=${encodeURIComponent(category.name)}">${count} Products</a></article>`;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderAbout() {
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="section-title"><div><h1>About Us</h1><p>Ganesh Surgical Store serves families, clinics, and care providers with dependable medical supplies and personal attention.</p></div></div>
        <div class="about-layout">
          <aside class="owner-card card">
            <img src="assets/owner.png" alt="Owner of Ganesh Surgical Store">
            <div class="panel"><h2>Mr. Ganesh.S</h2><p>Owner and care advisor</p></div>
          </aside>
          <div class="story-grid">
            <article class="panel"><h2>Store Story</h2><p>Ganesh Surgical Store began with a simple promise: make trusted surgical and medical products easy to access without confusion or compromise. Our team carefully selects clinic-grade essentials, explains product use clearly, and supports customers from purchase to after-sales care.</p></article>
            <article class="panel"><h2>Vision</h2><p>To become a dependable medical supply partner for every home, clinic, and care facility that values safety, speed, and honest guidance.</p></article>
            <article class="panel"><h2>Mission</h2><p>We provide high-quality surgical goods, diagnostic tools, protection products, and patient care equipment with transparent pricing, fast delivery, and responsive service.</p></article>
            <article class="panel"><h2>Contact Information</h2><ul class="contact-list"><li><strong>Phone:</strong> +91 98765 43210</li><li><strong>Email:</strong> care@ganeshsurgicalstore.com</li><li><strong>Address:</strong> 24 Health Market Road, Jaipur, Rajasthan 302001</li><li><strong>Hours:</strong> Monday to Saturday, 9:00 AM - 8:30 PM</li></ul></article>
          </div>
        </div>
      </section>
    `;
  }

  function renderContact() {
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="section-title"><div><h1>Contact Us</h1><p>Need help choosing a product or tracking an order? Send a message and our support team will respond quickly.</p></div></div>
        <div class="contact-layout">
          <article class="panel">
            <h2>Store Details</h2>
            <ul class="contact-list">
              <li><strong>Phone:</strong> +91 98765 43210</li>
              <li><strong>WhatsApp:</strong> +91 98765 43210</li>
              <li><strong>Email:</strong> care@ganeshsurgicalstore.com</li>
              <li><strong>Address:</strong> 24 Health Market Road, Jaipur, Rajasthan 302001</li>
              <li><strong>Delivery:</strong> Across India with careful packing and shipment tracking.</li>
            </ul>
          </article>
          <form class="panel form-grid" id="contactForm">
            <div class="notice" id="contactNotice">Thank you. Your message has been saved locally and our team will contact you soon.</div>
            <div class="inline-fields"><label>Name<input required name="name"></label><label>Phone<input required name="phone"></label></div>
            <label>Email<input required type="email" name="email"></label>
            <label>Message<textarea required name="message"></textarea></label>
            <button class="btn primary" type="submit">Send Message</button>
          </form>
        </div>
      </section>
    `;
    document.getElementById("contactForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const messages = read("gss_contact_messages", []);
      messages.push({ date: new Date().toISOString(), ...Object.fromEntries(new FormData(event.currentTarget)) });
      write("gss_contact_messages", messages);
      event.currentTarget.reset();
      document.getElementById("contactNotice").classList.add("visible");
    });
  }

  function renderLogin() {
    root.innerHTML = authMarkup("Login", "Welcome back to Ganesh Surgical Store.", `
      <form class="panel form-grid" id="loginForm">
        <div class="notice" id="authNotice"></div>
        <label>Email<input required type="email" name="email"></label>
        <label>Password<input required type="password" name="password"></label>
        <label style="display:flex;grid-template-columns:auto 1fr;align-items:center;"><input type="checkbox" name="remember" style="width:auto;"> Remember user</label>
        <button class="btn primary" type="submit">Login</button>
        <p>New customer? <a href="register.html"><strong>Create an account</strong></a></p>
      </form>
    `);
    document.getElementById("loginForm").addEventListener("submit", login);
  }

  function renderRegister() {
    root.innerHTML = authMarkup("Register", "Create your frontend-only account stored safely in this browser.", `
      <form class="panel form-grid" id="registerForm">
        <div class="notice" id="authNotice"></div>
        <label>Full Name<input required name="name"></label>
        <label>Email<input required type="email" name="email"></label>
        <label>Phone<input required name="phone"></label>
        <label>Password<input required type="password" minlength="6" name="password"></label>
        <button class="btn primary" type="submit">Create Account</button>
        <p>Already registered? <a href="login.html"><strong>Login here</strong></a></p>
      </form>
    `);
    document.getElementById("registerForm").addEventListener("submit", register);
  }

  function authMarkup(title, copy, form) {
    return `
      <section class="container page-section fade-in">
        <div class="auth-layout">
          <article class="panel auth-copy"><h1>${title}</h1><p>${copy}</p><p>Manage your profile, wishlist, cart, and order history using Local Storage.</p></article>
          ${form}
        </div>
      </section>
    `;
  }

  function register(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const users = read(keys.users, []);
    if (users.some((user) => user.email.toLowerCase() === data.email.toLowerCase())) {
      showNotice("authNotice", "An account with this email already exists.");
      return;
    }
    const user = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      address: "",
      image: "assets/default-avatar.svg",
      joined: new Date().toISOString()
    };
    users.push(user);
    write(keys.users, users);
    write(keys.currentUser, user.id);
    location.href = "profile.html";
  }

  function login(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const user = read(keys.users, []).find((item) => item.email.toLowerCase() === data.email.toLowerCase() && item.password === data.password);
    if (!user) {
      showNotice("authNotice", "Invalid email or password. Please try again.");
      return;
    }
    write(keys.currentUser, user.id);
    if (data.remember) write(keys.remember, user.id);
    location.href = "profile.html";
  }

  function logout() {
    localStorage.removeItem(keys.currentUser);
    localStorage.removeItem(keys.remember);
    location.href = "index.html";
  }

  function renderProfile() {
    const user = currentUser();
    if (!user) {
      root.innerHTML = guardMarkup("Please login to view and edit your profile.", "Login", "login.html");
      return;
    }
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="section-title"><div><h1>My Profile</h1><p>Edit your account details and upload a profile photo that appears in the navigation bar.</p></div></div>
        <div class="profile-layout">
          <article class="panel">
            <img class="profile-photo" src="${user.image || "assets/default-avatar.svg"}" alt="${escapeHtml(user.name)}">
            <h2>${escapeHtml(user.name)}</h2>
            <p>${escapeHtml(user.email)}</p>
            <p>${escapeHtml(user.phone || "")}</p>
          </article>
          <form class="panel form-grid" id="profileForm">
            <div class="notice" id="profileNotice">Profile updated successfully.</div>
            <label>Profile Image<input type="file" accept="image/*" name="image"></label>
            <label>Full Name<input required name="name" value="${escapeHtml(user.name)}"></label>
            <label>Email<input required type="email" name="email" value="${escapeHtml(user.email)}"></label>
            <label>Phone<input required name="phone" value="${escapeHtml(user.phone || "")}"></label>
            <label>Address<textarea name="address">${escapeHtml(user.address || "")}</textarea></label>
            <button class="btn primary" type="submit">Save Profile</button>
          </form>
        </div>
      </section>
    `;
    document.getElementById("profileForm").addEventListener("submit", saveProfile);
  }

  function saveProfile(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const users = read(keys.users, []);
    const user = currentUser();
    const index = users.findIndex((item) => item.id === user.id);
    const file = form.image.files[0];
    const finish = (image) => {
      users[index] = { ...users[index], name: data.name, email: data.email, phone: data.phone, address: data.address, image: image || users[index].image };
      write(keys.users, users);
      showNotice("profileNotice", "Profile updated successfully.");
      setHeader();
      renderProfile();
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = () => finish(reader.result);
      reader.readAsDataURL(file);
    } else {
      finish();
    }
  }

  function addToCart(id) {
    const items = cart();
    const found = items.find((item) => item.id === id);
    if (found) found.qty += 1;
    else items.push({ id, qty: 1 });
    write(keys.cart, items);
    setHeader();
  }

  function toggleWishlist(id) {
    const items = wishlist();
    const next = items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
    write(keys.wishlist, next);
    setHeader();
  }

  function renderCart() {
    const items = cart();
    const subtotal = items.reduce((sum, item) => sum + ((byId(item.id)?.price || 0) * item.qty), 0);
    const shipping = subtotal > 0 && subtotal < 2500 ? 99 : 0;
    const total = subtotal + shipping;
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="section-title"><div><h1>Cart</h1><p>Adjust quantities, remove products, and place a frontend-only order saved in Local Storage.</p></div></div>
        ${items.length ? `
          <div class="cart-layout">
            <div class="cart-list">
              ${items.map((entry) => cartRow(entry)).join("")}
            </div>
            <aside class="panel">
              <h2>Order Summary</h2>
              <div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
              <div class="summary-line"><span>Shipping</span><strong>${shipping ? money(shipping) : "Free"}</strong></div>
              <div class="summary-line total"><span>Total</span><strong>${money(total)}</strong></div>
              <button class="btn primary" id="checkoutBtn" type="button" style="width:100%;margin-top:16px;">Place Order</button>
            </aside>
          </div>
        ` : emptyState("Your cart is empty", "Add surgical products to your cart and they will stay here using Local Storage.", "Shop Products", "products.html")}
      </section>
    `;
    document.querySelectorAll("[data-qty]").forEach((button) => button.addEventListener("click", updateQty));
    document.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", removeCartItem));
    document.getElementById("checkoutBtn")?.addEventListener("click", placeOrder);
  }

  function cartRow(entry) {
    const item = byId(entry.id);
    return `
      <article class="cart-row">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.category} • ${money(item.price)}</p>
          <div class="qty"><button data-qty="-1" data-id="${item.id}">-</button><span>${entry.qty}</span><button data-qty="1" data-id="${item.id}">+</button></div>
        </div>
        <div class="actions"><strong>${money(item.price * entry.qty)}</strong><button class="btn danger" data-remove="${item.id}" type="button">Remove</button></div>
      </article>
    `;
  }

  function updateQty(event) {
    const id = event.currentTarget.dataset.id;
    const delta = Number(event.currentTarget.dataset.qty);
    const items = cart().map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item);
    write(keys.cart, items);
    setHeader();
    renderCart();
  }

  function removeCartItem(event) {
    write(keys.cart, cart().filter((item) => item.id !== event.currentTarget.dataset.remove));
    setHeader();
    renderCart();
  }

  function placeOrder() {
    const items = cart();
    if (!items.length) return;
    const total = items.reduce((sum, item) => sum + ((byId(item.id)?.price || 0) * item.qty), 0);
    const newOrder = {
      id: `GSS-${Date.now().toString().slice(-7)}`,
      date: new Date().toISOString(),
      status: "Confirmed",
      items,
      total
    };
    write(keys.orders, [newOrder, ...orders()]);
    write(keys.cart, []);
    location.href = "orders.html";
  }

  function renderWishlist() {
    const liked = wishlist().map(byId).filter(Boolean);
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="section-title"><div><h1>Wishlist</h1><p>Your saved products are kept in Local Storage and can be added to cart anytime.</p></div></div>
        ${liked.length ? `<div class="product-grid">${liked.map(productCard).join("")}</div>` : emptyState("No wishlist products", "Tap the heart on any product to save it here.", "Browse Products", "products.html")}
      </section>
    `;
    bindProductButtons();
  }

  function renderOrders() {
    const history = orders();
    root.innerHTML = `
      <section class="container page-section fade-in">
        <div class="section-title"><div><h1>My Orders</h1><p>Frontend-only order history generated from checkout and persisted in Local Storage.</p></div></div>
        <div class="orders-list">
          ${history.length ? history.map(orderCard).join("") : emptyState("No orders yet", "Place an order from your cart to see it appear here.", "Go to Cart", "cart.html")}
        </div>
      </section>
    `;
  }

  function orderCard(order) {
    return `
      <article class="order-card">
        <div class="order-head"><div><strong>${order.id}</strong><br><small>${new Date(order.date).toLocaleString()}</small></div><span class="pill">${order.status}</span></div>
        <ul class="order-items">${order.items.map((entry) => `<li>${byId(entry.id)?.name || "Product"} × ${entry.qty}</li>`).join("")}</ul>
        <div class="summary-line total"><span>Total</span><strong>${money(order.total)}</strong></div>
      </article>
    `;
  }

  function renderNotFound() {
    root.innerHTML = notFoundMarkup();
  }

  function notFoundMarkup() {
    return `<section class="container page-section fade-in">${emptyState("404 - Page Not Found", "The page you are looking for is not available in Ganesh Surgical Store.", "Go Home", "index.html")}</section>`;
  }

  function emptyState(title, copy, label, href) {
    return `<div class="empty-state panel"><h2>${title}</h2><p>${copy}</p>${label ? `<a class="btn primary" href="${href}">${label}</a>` : ""}</div>`;
  }

  function guardMarkup(copy, label, href) {
    return `<section class="container page-section fade-in">${emptyState("Account required", copy, label, href)}</section>`;
  }

  function showNotice(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.classList.add("visible");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function setupChatbot() {
    document.getElementById("chatbot-root").innerHTML = `
      <div class="chatbot" id="chatbot">
        <div class="chat-window">
          <div class="chat-head"><strong>Ganesh Care Bot</strong><button class="icon-btn" id="chatClose" type="button" aria-label="Close chat">×</button></div>
          <div class="quick-chips">
            <button data-chat="Suggest products">Suggest products</button>
            <button data-chat="Shipping">Shipping</button>
            <button data-chat="Contact">Contact</button>
          </div>
          <div class="chat-log" id="chatLog"><div class="msg">Hello. I can help you find surgical products, explain shipping, show contact details, or guide you to categories.</div></div>
          <form class="chat-form" id="chatForm"><input id="chatInput" placeholder="Ask about products..."><button class="btn primary" type="submit">➤</button></form>
        </div>
        <div class="chat-floating">
    <button class="chat-toggle" id="chatToggle" type="button" aria-label="Open chatbot">
        <img src="assets/products/chitti.png" alt="Ganesh AI Assistant">
    </button>
</div>
</button>
      </div>
    `;
    const chat = document.getElementById("chatbot");
    const setChatOpen = (open) => {
      chat.classList.toggle("open", open);
      document.body.classList.toggle("chat-open", open);
      document.getElementById("chatToggle").setAttribute("aria-expanded", String(open));
    };
    document.getElementById("chatToggle").setAttribute("aria-expanded", "false");
    document.getElementById("chatToggle").addEventListener("click", () => setChatOpen(!chat.classList.contains("open")));
    document.getElementById("chatClose").addEventListener("click", () => setChatOpen(false));
    document.querySelectorAll("[data-chat]").forEach((button) => button.addEventListener("click", () => sendChat(button.dataset.chat)));
    document.getElementById("chatForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("chatInput");
      if (!input.value.trim()) return;
      sendChat(input.value.trim());
      input.value = "";
    });
  }

  function sendChat(text) {
    addMessage(text, true);
    setTimeout(() => addMessage(botReply(text)), 180);
  }

  function addMessage(text, user) {
    const log = document.getElementById("chatLog");
    const div = document.createElement("div");
    div.className = `msg${user ? " user" : ""}`;
    div.innerHTML = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function botReply(input) {
    const text = input.toLowerCase();
    const matched = products.filter((item) => `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(text)).slice(0, 3);
    if (text.includes("ship") || text.includes("deliver")) return "We deliver across India. Orders above ₹2,500 get free shipping; smaller orders use careful packing with a ₹99 delivery charge.";
    if (text.includes("contact") || text.includes("phone") || text.includes("address")) return 'You can call +91 98765 43210, email care@ganeshsurgicalstore.com, or visit <a href="contact.html"><strong>Contact Us</strong></a>.';
    if (text.includes("category") || text.includes("navigate")) return `You can browse <a href="categories.html"><strong>Categories</strong></a>: ${categories.map((item) => item.name).join(", ")}.`;
    if (text.includes("suggest") || text.includes("recommend")) return 'For clinics, start with a Digital BP Monitor, Premium Stethoscope, Nitrile Gloves, First Aid Kit, and Nebulizer Machine. Open <a href="products.html"><strong>Products</strong></a> to compare.';
    if (matched.length) return `I found ${matched.map((item) => `<a href="product-details.html?id=${item.id}"><strong>${item.name}</strong></a>`).join(", ")}.`;
    return "I can help with diagnostics, protection, instruments, first aid, mobility, respiratory products, shipping, and contact details. Try asking for gloves, BP monitor, wheelchair, or first aid.";
  }

  const renderers = {
    home: renderHome,
    products: renderProducts,
    details: renderDetails,
    categories: renderCategories,
    about: renderAbout,
    contact: renderContact,
    login: renderLogin,
    register: renderRegister,
    profile: renderProfile,
    cart: renderCart,
    wishlist: renderWishlist,
    orders: renderOrders,
    notfound: renderNotFound
  };

  setHeader();
  setFooter();
  setupChatbot();
  (renderers[page] || renderNotFound)();
})();
