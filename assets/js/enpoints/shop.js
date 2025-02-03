document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and populate categories
    let allCategories = [];
    try {
        const categoriesResponse = await fetch('http://localhost:4000/category');
        allCategories = await categoriesResponse.json();

        const categoriesContainer = document.querySelector('.product-categories .shop-submenu');
        if (categoriesContainer) {
            // Create "All Products" option first
            const allProductsLi = document.createElement('li');
            allProductsLi.innerHTML = `
                <a href="#" data-category-id="all">
                    All Products
                </a>
            `;
            categoriesContainer.appendChild(allProductsLi);

            // Add active categories
            const activeCategoriesHtml = allCategories
                .filter(category => category.IsActive)
                .map(category => `
                    <li>
                        <a href="#" data-category-id="${category._id}">
                            ${category.title}
                        </a>
                    </li>
                `).join('');
            
            categoriesContainer.insertAdjacentHTML('beforeend', activeCategoriesHtml);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }

    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const productId = button.getAttribute('data-product-id');
            const productTitle = button.getAttribute('data-product-title');
            const productPrice = button.getAttribute('data-product-price');
            const productImage = button.getAttribute('data-product-image');

            const cartItem = {
                id: productId,
                title: productTitle,
                price: parseFloat(productPrice),
                quantity: 1,
                image: productImage
            };

            try {
                await fetch('http://localhost:4000/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartItem)
                });

                // Navigate to cart page
                window.location.href = 'cart.html';
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        });
    });

    // Pagination and product fetching setup
    let currentPage = 1;
    const limit = 12;
    const productsContainer = document.querySelector('.row.row--15');
    const loadMoreButton = document.querySelector('.btn-load-more');
    let currentCategory = 'all';

    // Function to clear existing products
    function clearProducts() {
        productsContainer.innerHTML = '';
    }

    // Function to fetch and display products
    async function fetchProducts(categoryId = 'all') {
        try {
            // Determine the URL based on whether we're filtering by category
            let url = categoryId === 'all' 
                ? `http://localhost:4000/product?page=${currentPage}&limit=${limit}`
                : `http://localhost:4000/product?page=${currentPage}&limit=${limit}&category=${categoryId}`;

            const response = await fetch(url);
            const products = await response.json();

            // Check if fewer than 12 products are returned, hide the button if so
            if (products.length < limit) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }

            // Append each product to the products container
            products.forEach(product => {

                const originalPrice = parseFloat(product.price);
                const discountedPrice = (originalPrice * 0.8).toFixed(2); // Apply a 20% discount
                const hasDiscount = originalPrice > discountedPrice; // Only show if there's a discount


                const productHtml = `
                    <div class="col-xl-4 col-sm-6">
                        <div class="axil-product product-style-one mb--30">
                            <div class="thumbnail">
                                <a href="single-product-3-3.html">
                                    <img src="http://localhost:4000/${product.image}" alt="${product.name}">
                                </a>
                                <div class="label-block label-right">
                                    <div class="product-badget">10% OFF</div>
                                </div>
                                <div class="product-hover-action">
                                    <ul class="cart-action">
                                        <li class="wishlist"><a href="wishlist.html"><i class="far fa-heart"></i></a></li>
                                        
                                        <li class="select-option">
                                            <button onclick="addToCart('${product._id}', '${product.name}', ${discountedPrice}, '${product.image}')" class="axil-btn">Add to Cart</button>
                                        </li>
                                        <li class="quickview"><a href="#" data-bs-toggle="modal" data-bs-target="#quick-view-modal"><i class="far fa-eye"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="product-content">
                        <div class="inner">
                            <h5 class="title"><a href="single-product-3-3.html">${product.name}</a></h5>
                            <div class="product-price-variant">
                                <span class="price old-price">$${hasDiscount ? originalPrice.toFixed(2) : ''}</span>
                                <span class="price current-price">$${discountedPrice}</span>
                            </div>
                        </div>
                    </div>
                        </div>
                    </div>
                `;
                productsContainer.insertAdjacentHTML('beforeend', productHtml);
            });
            

            // Increment page for the next batch of products
            currentPage += 1;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Event listener for category selection
    document.querySelector('.product-categories .shop-submenu').addEventListener('click', async (e) => {
        if (e.target.matches('[data-category-id]')) {
            e.preventDefault();
            
            // Reset page and clear existing products
            currentPage = 1;
            clearProducts();
            
            // Get selected category
            currentCategory = e.target.getAttribute('data-category-id');
            
            // Fetch products for selected category
            await fetchProducts(currentCategory);
        }
    });

    // Event listener for 'Show More' button
    loadMoreButton.addEventListener('click', () => {
        fetchProducts(currentCategory);
    });

    // Initial fetch of products (all products)
    fetchProducts();
});

async function addToCart(productId, name, price, image) {
    try {
        // Check if cart exists in localStorage
        let cartId = localStorage.getItem('cartId');
        let cart;

        if (!cartId) {
            // Create new cart
            const response = await fetch('http://localhost:4000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer_id: 'default_customer',
                    cart_items: [{
                        product_id: productId,
                        quantity: 1
                    }]
                })
            });
            cart = await response.json();
            localStorage.setItem('cartId', cart._id);
        } else {
            // Update existing cart
            const response = await fetch(`http://localhost:4000/cart/${cartId}`);
            cart = await response.json();
            
            const existingItem = cart.cart_items.find(item => 
                item.product_id._id === productId
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.cart_items.push({
                    product_id: productId,
                    quantity: 1
                });
            }

            await fetch(`http://localhost:4000/cart/${cartId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cart)
            });
        }

        // Show success message
        alert('Product added to cart successfully!');
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart');
    }
}