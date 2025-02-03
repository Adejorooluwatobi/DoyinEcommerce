// // Function to fetch and display team members
// async function fetchTeamData() {
//     try {
//         const response = await fetch('http://localhost:4000/team'); // Adjust the endpoint if necessary
//         if (!response.ok) {
//             throw new Error('Failed to fetch team data');
//         }

//         const teamMembers = await response.json();

//         // Get the container to append team member cards
//         const teamContainer = document.querySelector('.team-slide-activation');

//         // Clear existing content
//         teamContainer.innerHTML = '';

//         // Iterate through team members and append HTML
//         teamMembers.forEach(member => {
//             const box = document.createElement("div");
//                     box.className = "slick-single-layout";
//             const teamCard = `
//                     <div class="axil-team-member">
//                         <div class="thumbnail">
//                             <img src="http://localhost:4000/uploads/${member.image}" alt="${member.name}">
//                         </div>
//                         <div class="team-content">
//                             <h5 class="title">${member.name}</h5>
//                             <span class="subtitle">${member.designation}</span>
//                         </div>
//                     </div>
                
//             `;
//             teamContainer.innerHTML += teamCard;
//         });
//     } catch (error) {
//         console.error('Error fetching team data:', error);
//     }
// }

// // Call the function when the page loads
// document.addEventListener('DOMContentLoaded', fetchTeamData);

// Function to fetch team members and populate the team section
async function fetchAndPopulateTeamMembers() {
    try {
        // Fetch team members from the backend
        const response = await fetch('http://localhost:4000/team');
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Parse the JSON response
        const teamMembers = await response.json();
        
        // Get the team slide container
        const teamSlideContainer = document.querySelector('.team-slide-activation');
        
        // Clear existing team members (if any)
        teamSlideContainer.innerHTML = '';
        
        // Iterate through team members and create slide layouts
        teamMembers.forEach(member => {
            // Create slide layout div
            const slideLayout = document.createElement('div');
            slideLayout.className = 'slick-single-layout';
            
            // Create team member div
            const teamMemberDiv = document.createElement('div');
            teamMemberDiv.className = 'axil-team-member';
            
            // Create thumbnail div
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = 'thumbnail';
            const img = document.createElement('img');
            img.src = `http://localhost:4000/uploads/${member.image}`; // Assuming images are served from uploads folder
            img.alt = member.name;
            thumbnailDiv.appendChild(img);
            
            // Create team content div
            const teamContentDiv = document.createElement('div');
            teamContentDiv.className = 'team-content';
            
            // Create subtitle span
            const subtitleSpan = document.createElement('span');
            subtitleSpan.className = 'subtitle';
            subtitleSpan.textContent = member.designation;
            
            // Create title h5
            const titleH5 = document.createElement('h5');
            titleH5.className = 'title';
            titleH5.textContent = member.name;
            
            // Assemble the team member div
            teamContentDiv.appendChild(subtitleSpan);
            teamContentDiv.appendChild(titleH5);
            
            teamMemberDiv.appendChild(thumbnailDiv);
            teamMemberDiv.appendChild(teamContentDiv);
            
            slideLayout.appendChild(teamMemberDiv);
            
            // Add social media links if available
            if (member.facebook || member.linkedin) {
                const socialDiv = document.createElement('div');
                socialDiv.className = 'team-social';
                
                if (member.facebook) {
                    const fbLink = document.createElement('a');
                    fbLink.href = member.facebook;
                    fbLink.innerHTML = '<i class="fab fa-facebook-f"></i>';
                    socialDiv.appendChild(fbLink);
                }
                
                if (member.linkedin) {
                    const linkedinLink = document.createElement('a');
                    linkedinLink.href = member.linkedin;
                    linkedinLink.innerHTML = '<i class="fab fa-linkedin-in"></i>';
                    socialDiv.appendChild(linkedinLink);
                }
                
                teamMemberDiv.appendChild(socialDiv);
            }
            
            // Add to the container
            teamSlideContainer.appendChild(slideLayout);
        });
        
        // Reinitialize Slick slider if it exists
        if (typeof $ !== 'undefined' && $.fn.slick) {
            $('.team-slide-activation').slick('unslick').slick({
                dots: false,
                infinite: true,
                speed: 500,
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: true,
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });
        }
    } catch (error) {
        console.error('Error fetching team members:', error);
        
        // Optional: Display an error message in the UI
        const teamSlideContainer = document.querySelector('.team-slide-activation');
        teamSlideContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load team members. Please try again later.</p>
            </div>
        `;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAndPopulateTeamMembers);
