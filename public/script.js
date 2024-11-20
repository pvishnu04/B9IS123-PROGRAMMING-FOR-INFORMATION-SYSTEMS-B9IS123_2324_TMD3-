// Fetch products and display
function fetchProducts() {
    fetch('/api/products')
      .then(response => response.json())
      .then(products => {
        let html = '<h2>Products</h2><ul>';
        products.forEach(product => {
          html += `<li>${product.name} - $${product.price}</li>`;
        });
        html += '</ul>';
        document.getElementById('productList').innerHTML = html;
      })
      .catch(error => console.error('Error fetching products:', error));
  }
  
  fetchProducts();
  