document.addEventListener('DOMContentLoaded', function() {
    // Get the backend URL once at startup
    const backendUrl = getBackendServiceUrl();
    
    // Add loading state management
    let isLoading = false;

    // Function to show loading state
    function showLoading() {
        const productsContainer = document.querySelector('.row--15');
        if (productsContainer && !document.querySelector('.loading-indicator')) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-indicator';
            loadingDiv.style.padding = '10px';
            loadingDiv.style.marginBottom = '10px';
            loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading products...';
            productsContainer.prepend(loadingDiv);
        }
    }

    // Function to hide loading state
    function hideLoading() {
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // Fetch products function
    async function fetchProducts() {
        if (isLoading) return; // Prevent multiple simultaneous requests
        
        try {
            isLoading = true;
            showLoading();

            const response = await fetch(`${backendUrl}/product`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // Add credentials if needed
                // credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            displayError('Failed to load products. Please try again later.');
        } finally {
            isLoading = false;
            hideLoading();
        }
    }

    function displayProducts(products) {
        const productsContainer = document.querySelector('.row--15');
        productsContainer.innerHTML = ''; // Clear existing content

        products.slice(0, 4).forEach(product => {
            const productHTML = createProductHTML(product);
            productsContainer.innerHTML += productHTML;
        });
    }

    function createProductHTML(product) {
        // Calculate discount percentage if there's a price difference
        const originalPrice = parseFloat(product.price);
        const discountedPrice = originalPrice * 0.8; // Example: 20% discount
        const hasDiscount = true; // You can modify this based on your needs

        const discountBadge = hasDiscount ? `
            <div class="label-block label-right">
                <div class="product-badget">20% OFF</div>
            </div>
        ` : '';

        return `
            <div class="col-xl-3 col-lg-4 col-sm-6 col-12 mb--30">
                <div class="axil-product product-style-one">
                    <div class="thumbnail">
                        <a href="single-product-3.html">
                            <img 
                                 src="${backendUrl}/${product.image}" 
                                 alt="${product.name}">
                        </a>
                        ${discountBadge}
                        <div class="product-hover-action">
                            <ul class="cart-action">
                                <li class="wishlist">
                                    <a href="wishlist.html"><i class="far fa-heart"></i></a>
                                </li>
                                <li class="select-option">
                                    <a href="cart.html">Add to Cart</a>
                                </li>
                                <li class="quickview">
                                    <a href="#" data-bs-toggle="modal" data-bs-target="#quick-view-modal">
                                        <i class="far fa-eye"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="product-content">
                        <div class="inner">
                            <h5 class="title">
                                <a href="single-product-3.html">${product.name}</a>
                            </h5>
                            <div class="product-price-variant">
                                <span class="price old-price">$${originalPrice}</span>
                                <span class="price current-price">$${discountedPrice.toFixed(2)}</span>
                            </div>
                            <div class="color-variant-wrapper">
                                <ul class="color-variant">
                                    <li class="color-extra-01 active">
                                        <span><span class="color"></span></span>
                                    </li>
                                    <li class="color-extra-02">
                                        <span><span class="color"></span></span>
                                    </li>
                                    <li class="color-extra-03">
                                        <span><span class="color"></span></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function displayError(message) {
        const container = document.querySelector('.row--15');
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            </div>
        `;
    }

    function getProductDetails(productId) {
        // Mock function to get product details by ID
        return {
            id: productId,
            name: `Product ${productId}`,
            price: `$${productId * 10}`
        };
    }

    // Add event listeners for interactions
    document.addEventListener('click', function(e) {
        if (e.target.matches('.quickview a')) {
            e.preventDefault();
            const productCard = e.target.closest('.axil-product');
            // Implement quick view functionality
        }
        
        if (e.target.matches('.select-option a')) {
            e.preventDefault();
            // Implement add to cart functionality
        }
        
        if (e.target.matches('.wishlist a')) {
            e.preventDefault();
            // Implement wishlist functionality
        }
    });

    // Initialize product fetching
    fetchProducts();

    // Refresh data every 5 minutes
    setInterval(fetchProducts, 5 * 60 * 1000);
});