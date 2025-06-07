document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    const placesContainer = document.getElementById('placesContainer');

    // Add dynamic places input
    placesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-place-btn')) {
            const count = placesContainer.querySelectorAll('.place-input').length + 1;
            const newGroup = document.createElement('div');
            newGroup.className = 'input-group mb-2';
            newGroup.innerHTML = `
                <input type="text" class="form-control place-input" placeholder="Place ${count}" required>
                <button type="button" class="btn btn-danger remove-place-btn">-</button>
            `;
            placesContainer.appendChild(newGroup);
        }
        if (e.target.classList.contains('remove-place-btn')) {
            if (placesContainer.querySelectorAll('.place-input').length > 1) {
                e.target.parentElement.remove();
            } else {
                alert('At least one place to visit is required.');
            }
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Comprehensive Regex patterns
        const nameRegex = /^[a-zA-Zà-üÀ-Ü\s]{2,50}$/; // Allows international characters and spaces
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
        const locationRegex = /^[a-zA-Z0-9à-üÀ-Ü\s\-,.()]{2,100}$/; // Comprehensive location pattern
        const numPersonsRegex = /^[1-9]\d*$/; // Positive integer
        const placeNameRegex = /^[a-zA-Z0-9à-üÀ-Ü\s\-,.()]{2,100}$/; // Same as location but for places

        // Get form values
        const travellerName = document.getElementById('travellerName').value.trim();
        const dateOfTravel = document.getElementById('dateOfTravel').value;
        const pickupLocation = document.getElementById('pickupLocation').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const numPersons = document.getElementById('numPersons').value;
        const termsAccepted = document.getElementById('terms').checked;
        const placeInputs = document.querySelectorAll('.place-input');
        const placesToVisit = [...placeInputs].map(input => input.value.trim());

        // Validate fields with specific error messages
        if (!nameRegex.test(travellerName)) {
            alert('Please enter a valid name (2-50 characters, only letters and spaces).');
            return;
        }
        
        if (!dateRegex.test(dateOfTravel)) {
            alert('Please select a valid travel date.');
            return;
        }
        
        // Check if date is in the future
        const today = new Date();
        const travelDate = new Date(dateOfTravel);
        today.setHours(0, 0, 0, 0);
        if (travelDate < today) {
            alert('Travel date must be today or in the future.');
            return;
        }
        
        if (!locationRegex.test(pickupLocation)) {
            alert('Please enter a valid pickup location (2-100 characters, letters, numbers, and basic punctuation).');
            return;
        }
        
        if (!locationRegex.test(destination)) {
            alert('Please enter a valid destination (2-100 characters, letters, numbers, and basic punctuation).');
            return;
        }
        
        if (!numPersonsRegex.test(numPersons)) {
            alert('Please enter a valid number of persons (minimum 1).');
            return;
        }
        
        if (placesToVisit.length === 0) {
            alert('Please add at least one place to visit.');
            return;
        }
        
        for (let i = 0; i < placesToVisit.length; i++) {
            if (!placeNameRegex.test(placesToVisit[i])) {
                alert(`Please enter a valid name for place ${i+1} (2-100 characters, letters, numbers, and basic punctuation).`);
                return;
            }
        }
        
        if (!termsAccepted) {
            alert('You must accept the Terms and Conditions to proceed.');
            return;
        }

        // Prepare data
        const bookingData = {
            travellerName,
            dateOfTravel: new Date(dateOfTravel).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            pickupLocation,
            destination,
            placesToVisit,
            numPersons
        };

        // Save to sessionStorage
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Redirect to success page
        window.location.href = 'success.html';
    });
});

// Success page logic
document.addEventListener('DOMContentLoaded', () => {
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
    const summaryDiv = document.getElementById('bookingSummary');
    
    if (bookingData) {
        summaryDiv.innerHTML = `
            <div class="success-icon">
                <div class="circle">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </div>
            </div>
            <h2 class="text-center mb-4">Thank you, ${bookingData.travellerName}!</h2>
            <p class="text-center mb-4">Your booking has been confirmed. Here are your travel details:</p>
            
            <div class="booking-details">
                <div class="booking-detail">
                    <span class="detail-label">Date of Travel:</span>
                    <span class="detail-value">${bookingData.dateOfTravel}</span>
                </div>
                <div class="booking-detail">
                    <span class="detail-label">Pickup Location:</span>
                    <span class="detail-value">${bookingData.pickupLocation}</span>
                </div>
                <div class="booking-detail">
                    <span class="detail-label">Destination:</span>
                    <span class="detail-value">${bookingData.destination}</span>
                </div>
                <div class="booking-detail">
                    <span class="detail-label">Number of Persons:</span>
                    <span class="detail-value">${bookingData.numPersons}</span>
                </div>
                <div class="booking-detail align-items-start">
                    <span class="detail-label">Places to Visit:</span>
                    <span class="detail-value">
                        <ul class="list-unstyled">
                            ${bookingData.placesToVisit.map(place => `<li>${place}</li>`).join('')}
                        </ul>
                    </span>
                </div>
            </div>
            
            <div class="cta-button mt-4">
                <button class="btn btn-success" onclick="window.location.href='index.html'">Back to Home</button>
            </div>
        `;
        
        // Trigger confetti effect
        createConfetti();
    } 
});

// Confetti effect function
function createConfetti() {
    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        const size = Math.random() * 10 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        container.appendChild(confetti);
        animateConfetti(confetti);
    }
}

function animateConfetti(confetti) {
    const animationDuration = Math.random() * 3 + 2;
    
    confetti.style.opacity = '1';
    confetti.style.animation = `drop ${animationDuration}s ease-in forwards`;
    
    // Remove confetti after animation
    setTimeout(() => {
        confetti.remove();
    }, animationDuration * 1000);
}

// Add the keyframes dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes drop {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);




document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form fields
    const formData = {
      name: document.getElementById('contactName').value,
      email: document.getElementById('contactEmail').value,
      subject: document.getElementById('contactSubject').value,
      message: document.getElementById('contactMessage').value
    };
    
     setTimeout(() => {      
      successModal.show();     
      contactForm.reset();     
    }, 100); 
  });  

  document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
    contactForm.scrollIntoView({ behavior: 'smooth' });
  });
});