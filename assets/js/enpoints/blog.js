document.addEventListener('DOMContentLoaded', () => {
    async function fetchAndRenderBlogPosts() {
        try {
            // Replace with your actual backend URL
            const response = await fetch('http://localhost:4000/blog', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blogs = await response.json();
            const blogContainer = document.querySelector('.axil-post-wrapper');
            
            // Clear existing content
            blogContainer.innerHTML = '';

            // Render each blog post
            blogs.forEach(blog => {
                // Only render active blogs
                if (blog.isActive) {
                    const blogPostElement = document.createElement('div');
                    blogPostElement.className = 'content-blog mt--60';
                    
                    blogPostElement.innerHTML = `
                        <div class="inner">
                            ${blog.image ? `
                            <div class="thumbnail">
                                <a href="blog-details.html">
                                    <img src="${blog.image.startsWith('http') ? blog.image : `http://localhost:4000/${blog.image}`}" alt="Blog Image">
                                </a>
                            </div>
                            ` : ''}
                            <div class="content">
                                <h4 class="title">
                                    <a href="blog-details.html">${blog.title || 'No Title'}</a>
                                </h4>
                                <div class="post-meta-content">
                                    <p>${blog.content || 'No Content'}</p>
                                </div>
                                <div class="read-more-btn">
                                    <a class="axil-btn btn-bg-primary" href="blog-details.html">Read More</a>
                                </div>
                            </div>
                        </div>
                    `;

                    blogContainer.appendChild(blogPostElement);
                }
            });
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            
            const blogContainer = document.querySelector('.axil-post-wrapper');
            blogContainer.innerHTML = `
                <div class="error-message">
                    <p>Unable to load blog posts. Error: ${error.message}</p>
                </div>
            `;
        }
    }

    // Fetch and render blogs when page loads
    fetchAndRenderBlogPosts();
});
