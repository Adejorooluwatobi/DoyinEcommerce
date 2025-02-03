//let backendServiceUrl = getBackendServiceUrl();
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultationForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        const payload = {};
        formData.forEach((value, key) => {
            payload[key] = value;
        });

        const url = `http://localhost:4000/consultation/create`; // Updated backend endpoint URL
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            alert('Message sent successfully!');
            form.reset(); // Reset the form after successful submission
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again later.');
        }
    });
});
