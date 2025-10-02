const selectedCategory = localStorage.getItem('selectedCategory');
const productContainer = document.getElementById('product-cards');
const categoryTitle = document.getElementById('category-title');
const backBtn = document.getElementById('back-btn');
const addForm = document.getElementById('add-product-form');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

let products = JSON.parse(localStorage.getItem('products')) || [];
let searchTerm = "";

if (categoryTitle) categoryTitle.textContent = selectedCategory;

// Save to localStorage
function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

// Render products for selected category, with search filter
function renderProducts() {
  productContainer.innerHTML = '';
  let filtered = products.filter(p => p.category === selectedCategory);
  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (filtered.length === 0) {
    productContainer.innerHTML = '<p>No products found.</p>';
    return;
  }
  filtered.forEach((product, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Quantity: <span id="qty-${index}">${product.quantity}</span> 
        ${product.quantity === 0 ? '<span class="out-of-stock">Out of stock</span>' : ''}</p>
      <p>Price: $${product.price}</p>
      <button class="buy-btn" onclick="buyProduct('${product.name}')">Buy</button>
      <button class="edit-btn" onclick="editProduct('${product.name}')">Edit</button>
    `;
    productContainer.appendChild(card);
  });
}

// Buy functionality
function buyProduct(name) {
  const product = products.find(p => p.name === name && p.category === selectedCategory);
  if (product.quantity > 0) product.quantity--;
  else alert('Out of stock!');
  saveProducts();
  renderProducts();
}

// Edit product
function editProduct(name) {
  const product = products.find(p => p.name === name && p.category === selectedCategory);
  const newName = prompt("Edit product name:", product.name);
  if (newName) product.name = newName;
  const newQty = prompt("Edit quantity:", product.quantity);
  if (newQty !== null && !isNaN(newQty)) product.quantity = parseInt(newQty);
  const newPrice = prompt("Edit price:", product.price);
  if (newPrice !== null && !isNaN(newPrice)) product.price = parseFloat(newPrice);
  saveProducts();
  renderProducts();
}

// Back to categories
if (backBtn) backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Add new product
if (addForm) {
  addForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    products.push({ name, quantity, price, category: selectedCategory });
    saveProducts();
    renderProducts();
    addForm.reset();
  });
}

// Search functionality
if (searchForm && searchInput) {
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    searchTerm = searchInput.value.trim();
    renderProducts();
  });
}

// Initial render
if (productContainer) renderProducts();

// Expose functions to global scope for inline onclick
window.buyProduct = buyProduct;
window.editProduct = editProduct;