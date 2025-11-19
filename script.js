let current = 0;
const slides = document.querySelectorAll(".slides");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === index);
    dots[i].classList.toggle("active", i === index);
  });
}

function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

setInterval(nextSlide, 4000);

function currentSlide(index) {
  current = index;
  showSlide(current);
}

document.querySelectorAll('.dropdown-content a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target.getAttribute('data-target');

    document.querySelector('.hero').style.display = 'none';
    document.querySelectorAll('.collections').forEach(section => {
      section.style.display = 'none';
    });

    const showSection = document.getElementById(target);
    if (showSection) {
      showSection.style.display = 'block';
      window.scrollTo({ top: showSection.offsetTop - 60, behavior: 'smooth' });
    }
  });
});

document.querySelector('nav a[href="#"]').addEventListener('click', (e) => {
  e.preventDefault();

  document.querySelector('.hero').style.display = 'block';
  document.querySelectorAll('.collections').forEach(section => {
    section.style.display = 'none';
  });

  const homeCollections = document.getElementById('home-collections');
  if (homeCollections) homeCollections.style.display = 'block';

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', () => {
  const shopNowBtn = document.querySelector('.hero .hero-text button');
  if (!shopNowBtn) return;

  shopNowBtn.addEventListener('click', e => {
    e.preventDefault();

    document.querySelector('.hero').style.display = 'none';

    document.querySelectorAll('.collections').forEach(section => {
      section.style.display = 'none';
    });

    const homeCollections = document.getElementById('home-collections');
    if (homeCollections) {
      homeCollections.style.display = 'block';

      setTimeout(() => {
        homeCollections.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  });
});


window.addEventListener('load', () => {
  document.querySelector('.hero').style.display = 'block';
  document.querySelectorAll('.collections').forEach(section => {
    section.style.display = 'none';
  });

  const homeCollections = document.getElementById('home-collections');
  if (homeCollections) homeCollections.style.display = 'block';
});

const modal = document.getElementById('product-modal');
const modalImg = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalSizes = document.getElementById('modal-sizes');
const closeBtn = document.querySelector('.close-btn');

const prices = {
  men: 49.99,
  women: 44.99,
  kids: 29.99,
  accessories: 19.99
};


document.querySelectorAll('.collection-card img').forEach(img => {
  img.addEventListener('click', (e) => {
    const section = e.target.closest('section').id;
    const productName = e.target.alt;
    const price = prices[section] || 39.99;

    modalImg.src = e.target.src;
    modalTitle.textContent = productName;
    modalPrice.textContent = `$${price.toFixed(2)}`;

    modalSizes.innerHTML = '';

    if (section === 'accessories') {
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

    modal.style.display = 'flex';
  });
});


closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};


