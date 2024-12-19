document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:4000/about') // Replace with your backend route
        .then(response => response.json())
        .then(data => {
            if (data.about) {
                const { subtitle, title, content, others } = data.about;

                // Update About Us Section
                document.getElementById("about-subtitle").textContent = subtitle || "About Store";
                document.getElementById("about-title").textContent = title || "Default Title";
                document.getElementById("about-content").textContent = content || "Default content";

                // Render Why Choose Us Section
                const container = document.getElementById("whychooseus-container");
                container.innerHTML = ''; // Clear existing content
                others.forEach(item => {
                    const box = document.createElement("div");
                    box.className = "col-lg-4";
                    box.innerHTML = `
                    
                        <div class="about-info-box">
                            <div class="thumb">
                                <img src="assets/images/about/shape-01.png" alt="Shape">
                            </div>
                            <div class="content">
                                <h6 class="title">${item.title}</h6>
                                <p class="content">${item.content}</p>
                            </div>
                        </div>
                    
                    `;
                    container.appendChild(box);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching About Us data:", error);
        });
});