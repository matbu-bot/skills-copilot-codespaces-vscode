// ChefConnect App - Main JavaScript

// Sample data for chefs and food influencers
const chefsAndInfluencers = [
    {
        id: 1,
        name: "Chef Maria Rodriguez",
        type: "Professional Chef",
        specialty: "Mediterranean & Vegetarian",
        specialties: ["vegetarian", "mediterranean", "gluten-free"],
        description: "Award-winning chef specializing in Mediterranean cuisine with 15 years of experience.",
        rating: 4.9
    },
    {
        id: 2,
        name: "Chef David Chen",
        type: "Professional Chef",
        specialty: "Asian Fusion & Vegan",
        specialties: ["vegan", "asian", "gluten-free"],
        description: "Expert in plant-based Asian fusion cuisine. Featured in Food & Wine Magazine.",
        rating: 4.8
    },
    {
        id: 3,
        name: "Sarah Johnson",
        type: "Food Influencer",
        specialty: "Keto & Low-Carb",
        specialties: ["keto", "low-carb", "high-protein"],
        description: "Health food blogger with 500K followers. Specializes in keto lifestyle and recipes.",
        rating: 4.7
    },
    {
        id: 4,
        name: "Chef Antoine Laurent",
        type: "Professional Chef",
        specialty: "French Cuisine",
        specialties: ["french", "mediterranean"],
        description: "Trained in Paris, bringing authentic French cooking techniques to home chefs.",
        rating: 4.9
    },
    {
        id: 5,
        name: "Emily Garcia",
        type: "Food Influencer",
        specialty: "Gluten-Free Baking",
        specialties: ["gluten-free", "vegetarian"],
        description: "Gluten-free baking expert. Author of two bestselling cookbooks.",
        rating: 4.8
    },
    {
        id: 6,
        name: "Chef Marcus Thompson",
        type: "Professional Chef",
        specialty: "Paleo & High-Protein",
        specialties: ["paleo", "high-protein", "keto"],
        description: "Former NFL nutritionist, now teaching healthy, protein-rich cooking.",
        rating: 4.6
    },
    {
        id: 7,
        name: "Isabella Rossi",
        type: "Food Influencer",
        specialty: "Italian & Mediterranean",
        specialties: ["italian", "mediterranean", "vegetarian"],
        description: "Italian cooking enthusiast sharing family recipes from Tuscany.",
        rating: 4.8
    },
    {
        id: 8,
        name: "Chef Roberto Martinez",
        type: "Professional Chef",
        specialty: "Mexican & Vegan",
        specialties: ["mexican", "vegan", "vegetarian"],
        description: "Bringing authentic Mexican flavors to plant-based cuisine.",
        rating: 4.7
    },
    {
        id: 9,
        name: "Alex Kim",
        type: "Food Influencer",
        specialty: "Vegan Asian Cuisine",
        specialties: ["vegan", "asian", "gluten-free"],
        description: "Plant-based food creator with a passion for Asian street food.",
        rating: 4.9
    },
    {
        id: 10,
        name: "Chef Patricia Moore",
        type: "Professional Chef",
        specialty: "Farm-to-Table",
        specialties: ["vegetarian", "gluten-free", "paleo"],
        description: "Sustainable cooking expert focused on seasonal, local ingredients.",
        rating: 4.8
    }
];

// User profile data
let userProfile = null;

// DOM Elements
const profileForm = document.getElementById('profile-form');
const profileSection = document.getElementById('user-profile');
const profileDisplay = document.getElementById('profile-display');
const chefsDirectory = document.getElementById('chefs-directory');
const profileInfo = document.getElementById('profile-info');
const chefsList = document.getElementById('chefs-list');
const editProfileBtn = document.getElementById('edit-profile');
const findChefsBtn = document.getElementById('find-chefs');
const searchFilter = document.getElementById('search-filter');
const connectionModal = document.getElementById('connection-modal');
const closeModal = document.querySelector('.close');
const sendConnectionBtn = document.getElementById('send-connection');
const successMessage = document.getElementById('success-message');

// Event Listeners
profileForm.addEventListener('submit', handleProfileSubmit);
editProfileBtn.addEventListener('click', handleEditProfile);
findChefsBtn.addEventListener('click', showChefsDirectory);
searchFilter.addEventListener('change', filterChefs);
closeModal.addEventListener('click', closeConnectionModal);
sendConnectionBtn.addEventListener('click', sendConnectionRequest);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === connectionModal) {
        closeConnectionModal();
    }
});

// Handle profile form submission
function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(profileForm);
    const preferences = Array.from(document.querySelectorAll('input[name="preferences"]:checked'))
        .map(cb => cb.value);
    
    userProfile = {
        name: formData.get('username'),
        email: formData.get('email'),
        preferences: preferences,
        allergies: formData.get('allergies'),
        dietaryNotes: formData.get('dietary-notes')
    };
    
    displayUserProfile();
    showSuccessMessage('Profile saved successfully!');
}

// Display user profile
function displayUserProfile() {
    profileSection.style.display = 'none';
    profileDisplay.style.display = 'block';
    
    const allergiesList = userProfile.allergies 
        ? userProfile.allergies.split(',').map(a => a.trim()).filter(a => a)
        : [];
    
    profileInfo.innerHTML = `
        <h3>👤 ${userProfile.name}</h3>
        <p><strong>Email:</strong> ${userProfile.email}</p>
        
        ${userProfile.preferences.length > 0 ? `
            <div style="margin-top: 15px;">
                <strong>Meal Preferences:</strong><br>
                ${userProfile.preferences.map(pref => 
                    `<span class="badge">${capitalizeFirstLetter(pref)}</span>`
                ).join('')}
            </div>
        ` : ''}
        
        ${allergiesList.length > 0 ? `
            <div style="margin-top: 15px;">
                <strong>⚠️ Food Allergies:</strong><br>
                ${allergiesList.map(allergy => 
                    `<span class="badge allergy-badge">${capitalizeFirstLetter(allergy)}</span>`
                ).join('')}
            </div>
        ` : ''}
        
        ${userProfile.dietaryNotes ? `
            <div style="margin-top: 15px;">
                <strong>Additional Notes:</strong><br>
                <p style="margin-top: 5px;">${userProfile.dietaryNotes}</p>
            </div>
        ` : ''}
    `;
}

// Handle edit profile
function handleEditProfile() {
    profileDisplay.style.display = 'none';
    profileSection.style.display = 'block';
    chefsDirectory.style.display = 'none';
    
    // Populate form with existing data
    if (userProfile) {
        document.getElementById('username').value = userProfile.name;
        document.getElementById('email').value = userProfile.email;
        document.getElementById('allergies').value = userProfile.allergies || '';
        document.getElementById('dietary-notes').value = userProfile.dietaryNotes || '';
        
        // Check the appropriate preferences
        document.querySelectorAll('input[name="preferences"]').forEach(cb => {
            cb.checked = userProfile.preferences.includes(cb.value);
        });
    }
}

// Show chefs directory
function showChefsDirectory() {
    chefsDirectory.style.display = 'block';
    displayChefs(chefsAndInfluencers);
    
    // Scroll to directory
    chefsDirectory.scrollIntoView({ behavior: 'smooth' });
}

// Display chefs and influencers
function displayChefs(chefs) {
    chefsList.innerHTML = '';
    
    if (chefs.length === 0) {
        chefsList.innerHTML = '<p>No chefs or influencers found matching your criteria.</p>';
        return;
    }
    
    chefs.forEach(chef => {
        const chefCard = document.createElement('div');
        chefCard.className = 'chef-card';
        chefCard.innerHTML = `
            <h3>${chef.name}</h3>
            <span class="chef-type">${chef.type}</span>
            <p><strong>Specialty:</strong> ${chef.specialty}</p>
            <p>${chef.description}</p>
            <div class="specialties">
                ${chef.specialties.map(spec => 
                    `<span class="specialty-tag">${capitalizeFirstLetter(spec)}</span>`
                ).join('')}
            </div>
            <p><strong>⭐ Rating:</strong> ${chef.rating}/5.0</p>
            <button class="btn btn-success connect-btn" onclick="openConnectionModal(${chef.id})">
                Connect
            </button>
        `;
        chefsList.appendChild(chefCard);
    });
}

// Filter chefs by specialty
function filterChefs() {
    const filterValue = searchFilter.value;
    
    if (filterValue === 'all') {
        displayChefs(chefsAndInfluencers);
    } else {
        const filtered = chefsAndInfluencers.filter(chef => 
            chef.specialties.includes(filterValue)
        );
        displayChefs(filtered);
    }
}

// Open connection modal
function openConnectionModal(chefId) {
    const chef = chefsAndInfluencers.find(c => c.id === chefId);
    if (!chef) return;
    
    document.getElementById('modal-chef-name').textContent = chef.name;
    document.getElementById('modal-chef-specialty').textContent = 
        `${chef.type} - ${chef.specialty}`;
    document.getElementById('connection-message').value = '';
    
    connectionModal.style.display = 'flex';
    connectionModal.dataset.chefId = chefId;
}

// Close connection modal
function closeConnectionModal() {
    connectionModal.style.display = 'none';
}

// Send connection request
function sendConnectionRequest() {
    const chefId = connectionModal.dataset.chefId;
    const message = document.getElementById('connection-message').value;
    const chef = chefsAndInfluencers.find(c => c.id == chefId);
    
    if (!message.trim()) {
        alert('Please enter a message to send with your connection request.');
        return;
    }
    
    // Simulate sending connection request
    closeConnectionModal();
    showSuccessMessage(`Connection request sent to ${chef.name}! They will review your message and respond soon.`);
    
    // In a real app, this would send data to a backend server
    console.log('Connection request:', {
        user: userProfile,
        chef: chef,
        message: message,
        timestamp: new Date()
    });
}

// Show success message
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' ');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('ChefConnect app initialized');
});
