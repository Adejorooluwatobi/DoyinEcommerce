// banner.js
document.addEventListener('DOMContentLoaded', function() {
    // Get the backend URL once at startup
    const backendUrl = getBackendServiceUrl();
    
    // Add loading state management
    let isLoading = false;

    // Function to show loading state
    function showLoading() {
        const sliderContent = document.querySelector('.main-slider-content');
        if (sliderContent && !document.querySelector('.loading-indicator')) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-indicator';
            loadingDiv.style.padding = '10px';
            loadingDiv.style.marginBottom = '10px';
            loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            sliderContent.prepend(loadingDiv);
        }
    }

    // Function to hide loading state
    function hideLoading() {
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // Function to fetch slider data
    async function fetchSliderData() {
        if (isLoading) return; // Prevent multiple simultaneous requests
        
        try {
            isLoading = true;
            showLoading();

            // Clear any previous error messages
            const existingErrors = document.querySelectorAll('.slider-error');
            existingErrors.forEach(error => error.remove());

            const response = await fetch(`${backendUrl}/slider`, {
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
            
            const data = await response.json();
            if (data && data.slider) {
                updateSliderContent(data.slider);
            } else {
                throw new Error('Invalid data format received from server');
            }
        } catch (error) {
            console.error('Error fetching slider data:', error);
            //showError(`Failed to load slider content: ${error.message}`);
        } finally {
            isLoading = false;
            hideLoading();
        }
    }

    // Function to update slider content
    function updateSliderContent(sliderData) {
        // Update subtitle
        const subtitleElement = document.querySelector('.main-slider-content .subtitle');
        if (subtitleElement && sliderData.subTitle) {
            subtitleElement.innerHTML = `<i class="fas fa-fire"></i>${sliderData.subTitle}`;
        }

        // Update title
        const titleElement = document.querySelector('.main-slider-content .title');
        if (titleElement && sliderData.title) {
            titleElement.textContent = sliderData.title;
        }

        // Update content/paragraph
        const contentElement = document.querySelector('.main-slider-content p');
        if (contentElement && sliderData.content) {
            contentElement.textContent = sliderData.content;
        }

        // Update main background image if it exists
        if (sliderData.image) {
            const sliderArea = document.querySelector('.axil-main-slider-area');
            if (sliderArea) {
                // Preload image
                const img = new Image();
                img.onload = function() {
                    sliderArea.style.backgroundImage = `${backendUrl}/uploads/${sliderData.image}`;
                    sliderArea.style.backgroundSize = 'cover';
                    sliderArea.style.backgroundPosition = 'center';
                    sliderArea.style.transition = 'opacity 0.3s';
                };
                img.src = sliderData.image;
            }
        }

        // Handle secondary image
        if (sliderData.image2) {
            const col = document.querySelector('.row .col-sm-8');
            if (col) {
                // Remove any existing secondary image column
                const existingSecondaryCol = document.querySelector('.row .col-sm-6:last-child');
                if (existingSecondaryCol) {
                    existingSecondaryCol.remove();
                }

                // Change column size to accommodate image
                col.className = 'col-sm-6';
                
                // Create new column for second image
                const newCol = document.createElement('div');
                newCol.className = 'col-sm-6';
                const img = document.createElement('img');
                img.src = sliderData.image2;
                img.alt = 'Secondary Image';
                img.className = 'img-fluid';
                img.style.maxHeight = '400px';
                img.style.objectFit = 'contain';
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s';
                img.onload = () => img.style.opacity = '1';
                newCol.appendChild(img);
                
                col.parentNode.appendChild(newCol);
            }
        }
    }

    // Function to show error messages
    function showError(message) {
        const sliderContent = document.querySelector('.main-slider-content');
        if (sliderContent) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'slider-error';
            errorDiv.style.color = 'red';
            errorDiv.style.padding = '10px';
            errorDiv.style.backgroundColor = '#fff3f3';
            errorDiv.style.borderRadius = '4px';
            errorDiv.style.marginBottom = '10px';
            errorDiv.textContent = message;
            sliderContent.prepend(errorDiv);
        }
    }

    // Initialize slider
    fetchSliderData();

    // Refresh data every 5 minutes
    setInterval(fetchSliderData, 5 * 60 * 1000);
});