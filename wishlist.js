let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(product) {
  const index = wishlist.findIndex(item => item.title === product.title);
  if (index === -1) wishlist.push(product);
  else wishlist.splice(index, 1);
  saveWishlist();
}

function isInWishlist(product) {
  return wishlist.some(item => item.title === product.title);
}

let currentProduct = null;

const modal = document.getElementById('product-modal');
const modalImg = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalSizes = document.getElementById('modal-sizes');
const closeBtn = document.querySelector('.close-btn');
const heart = document.getElementById('wishlist-heart');

function openModal(product) {
  currentProduct = product;
  modalImg.src = product.image;
  modalTitle.textContent = product.title;
  modalPrice.textContent = `$${product.price.toFixed(2)}`;
  modalSizes.innerHTML = '';

  if (product.section === 'accessories') {
    const btn = document.createElement('button');
    btn.textContent = 'One Size';
    btn.classList.add('active');
    modalSizes.appendChild(btn);
  } else {
    ['XS','S','M','L','XL'].forEach(size => {
      const btn = document.createElement('button');
      btn.textContent = size;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sizes button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      modalSizes.appendChild(btn);
    });
  }

  updateHeartIcon();
  modal.style.display = 'flex';
}

function updateHeartIcon() {
  if (!currentProduct) return;
  heart.textContent = isInWishlist(currentProduct) ? "❤️" : "♡";
}

heart.addEventListener('click', () => {
  if (!currentProduct) return;
  toggleWishlist(currentProduct);
  updateHeartIcon();
  renderWishlist("wishlist-content");
});

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

function renderWishlist(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-wishlist">
        <p>Your wishlist is empty 😢</p>
        <button class="go-shopping-btn" onclick="window.location.href='index.html'">Back To Shopping</button>
      </div>`;
    return;
  }

  container.innerHTML = wishlist.map((item, i) => `
    <div class="wishlist-item" 
         data-title="${item.title}" 
         data-image="${item.image}" 
         data-price="${item.price}" 
         data-section="${item.section}"
         style="cursor:pointer;background:#fff;padding:20px;margin:15px auto;border-radius:10px;width:350px;box-shadow:0 4px 15px rgba(0,0,0,0.1);text-align:center;">
      <img src="${item.image}" style="width:100%;border-radius:10px;">
      <h3>${item.title}</h3>
      <span class="remove-heart" data-index="${i}" style="font-size:25px;cursor:pointer;color:red;">❤️</span>
    </div>
  `).join("");

  document.querySelectorAll(".remove-heart").forEach(el => {
    el.addEventListener("click", e => {
      e.stopPropagation();
      wishlist.splice(parseInt(el.dataset.index), 1);
      saveWishlist();
      renderWishlist(containerId);
    });
  });

  document.querySelectorAll(".wishlist-item").forEach(itemEl => {
    itemEl.addEventListener("click", () => {
      const product = {
        title: itemEl.dataset.title,
        image: itemEl.dataset.image,
        price: parseFloat(itemEl.dataset.price),
        section: itemEl.dataset.section
      };
      openModal(product);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => renderWishlist("wishlist-content"));
