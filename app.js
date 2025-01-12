// Initialize Lucide icons
lucide.createIcons();

// Sample data with owner details and Indian Rupee prices
const houses = [
    {
        id: '1',
        title: 'Modern Downtown Apartment',
        description: 'Luxurious apartment with city views',
        price: 25000,
        location: 'Koramangala, Bangalore',
        address: '123 5th Block, Koramangala, Bangalore - 560034',
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        amenities: ['Parking', 'Gym', 'Pool'],
        owner: {
            name: 'Rahul Kumar',
            phone: '+91 98765 43210',
            email: 'rahul.kumar@email.com'
        }
    },
    {
        id: '2',
        title: 'Suburban Family Home',
        description: 'Spacious house with large backyard',
        price: 35000,
        location: 'HSR Layout, Bangalore',
        address: '456 Sector 2, HSR Layout, Bangalore - 560102',
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: 2400,
        imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
        amenities: ['Garage', 'Garden', 'Fireplace'],
        owner: {
            name: 'Priya Singh',
            phone: '+91 98765 12345',
            email: 'priya.singh@email.com'
        }
    },
    {
        id: '3',
        title: 'Cozy Studio Loft',
        description: 'Perfect for young professionals',
        price: 18000,
        location: 'Indiranagar, Bangalore',
        address: '789 12th Main, Indiranagar, Bangalore - 560038',
        bedrooms: 1,
        bathrooms: 1,
        squareFootage: 800,
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        amenities: ['Pet Friendly', 'Rooftop', 'Security'],
        owner: {
            name: 'Arun Patel',
            phone: '+91 98765 98765',
            email: 'arun.patel@email.com'
        }
    },
    {
        id: '4',
        title: 'Premium Lake View Apartment',
        description: 'Luxury living with scenic lake views',
        price: 45000,
        location: 'Whitefield, Bangalore',
        address: '101 Lake Road, Whitefield, Bangalore - 560066',
        bedrooms: 3,
        bathrooms: 3,
        squareFootage: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        amenities: ['Pool', 'Gym', 'Security', 'Parking'],
        owner: {
            name: 'Sneha Reddy',
            phone: '+91 98765 56789',
            email: 'sneha.reddy@email.com'
        }
    }
];

// State
let currentUser = null;
let filteredHouses = [...houses];
let favorites = [];
let selectedAmenities = [];
let showingFavorites = false;
let activeFilters = {
    location: '',
    price: '',
    amenities: []
};

// DOM Elements
const modalContainer = document.getElementById('modal-container');
const propertiesGrid = document.getElementById('properties-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const favoritesContainer = document.getElementById('favorites-container');
const locationFilter = document.getElementById('location-filter');
const priceFilter = document.getElementById('price-filter');
const amenitiesFilter = document.getElementById('amenities-filter');
const signinBtn = document.getElementById('signin-btn');
const favoritesBtn = document.getElementById('favorites-btn');

// Filter functions
function applyFilters() {
    let filtered = [...houses];

    // Apply location filter
    if (activeFilters.location) {
        filtered = filtered.filter(house =>
            house.location.toLowerCase().includes(activeFilters.location.toLowerCase())
        );
    }

    // Apply price filter
    if (activeFilters.price) {
        if (activeFilters.price.endsWith('+')) {
            const minPrice = parseInt(activeFilters.price.replace('+', ''));
            filtered = filtered.filter(house => house.price >= minPrice);
        } else {
            const [min, max] = activeFilters.price.split('-').map(Number);
            filtered = filtered.filter(house => house.price >= min && house.price <= max);
        }
    }

    // Apply amenities filter
    if (selectedAmenities.length > 0) {
        filtered = filtered.filter(house =>
            selectedAmenities.every(amenity => house.amenities.includes(amenity))
        );
    }

    filteredHouses = filtered;
    renderProperties();
}

// Event listeners for filters
locationFilter.addEventListener('input', (e) => {
    activeFilters.location = e.target.value;
    applyFilters();
});

priceFilter.addEventListener('change', (e) => {
    activeFilters.price = e.target.value;
    applyFilters();
});

// Authentication functions
function showAuthModal(isSignIn = true) {
    modalContainer.style.display = 'flex';
    modalContainer.innerHTML = `
        <div class="modal">
            <button class="modal-close" onclick="closeModal()">
                <i data-lucide="x"></i>
            </button>
            <h2 class="text-2xl font-bold mb-4">${isSignIn ? 'Sign In' : 'Sign Up'}</h2>
            <form id="auth-form" onsubmit="handleAuth(event, ${isSignIn})">
                ${!isSignIn ? `
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" required>
                    </div>
                ` : ''}
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                ${!isSignIn ? `
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="address">Address</label>
                        <input type="text" id="address" required>
                    </div>
                ` : ''}
                <button type="submit" class="btn-primary w-full">
                    ${isSignIn ? 'Sign In' : 'Sign Up'}
                </button>
                <div class="form-footer">
                    <p>
                        ${isSignIn ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" onclick="showAuthModal(${!isSignIn})">
                            ${isSignIn ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </form>
        </div>
    `;
    lucide.createIcons();
}

function handleAuth(event, isSignIn) {
    event.preventDefault();
    const formData = new FormData(event.target);
    currentUser = {
        email: formData.get('email'),
        name: formData.get('name') || 'User'
    };
    signinBtn.textContent = `Welcome, ${currentUser.name}`;
    closeModal();
}

function closeModal() {
    modalContainer.style.display = 'none';
}

function showPropertyDetails(house) {
    modalContainer.style.display = 'flex';
    modalContainer.innerHTML = `
        <div class="modal property-details-modal">
            <button class="modal-close" onclick="closeModal()">
                <i data-lucide="x"></i>
            </button>
            <img src="${house.imageUrl}" alt="${house.title}">
            <h2 class="text-2xl font-bold mb-2">${house.title}</h2>
            <p class="text-xl font-bold text-primary mb-4">₹${house.price.toLocaleString('en-IN')}/month</p>
            <p class="mb-4">${house.description}</p>
            <p class="mb-4"><strong>Address:</strong> ${house.address}</p>
            
            <div class="owner-details">
                <h3>Owner Details</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <i data-lucide="user"></i>
                        <span>${house.owner.name}</span>
                    </div>
                    <div class="contact-item">
                        <i data-lucide="phone"></i>
                        <span>${house.owner.phone}</span>
                    </div>
                    <div class="contact-item">
                        <i data-lucide="mail"></i>
                        <span>${house.owner.email}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// Toggle favorites view
favoritesBtn.addEventListener('click', () => {
    showingFavorites = !showingFavorites;
    favoritesContainer.classList.toggle('hidden');
    renderFavorites();
});

// Event listeners
signinBtn.addEventListener('click', () => showAuthModal(true));

function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    renderProperties();
    if (showingFavorites) {
        renderFavorites();
    }
}

function renderProperties() {
    const grid = showingFavorites ? favoritesGrid : propertiesGrid;
    grid.innerHTML = '';

    const housesToShow = showingFavorites 
        ? houses.filter(house => favorites.includes(house.id))
        : filteredHouses;

    if (housesToShow.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 3rem;">
                <p style="color: var(--gray-600); font-size: 1.125rem;">
                    ${showingFavorites ? 'No favorite properties yet.' : 'No properties found matching your criteria.'}
                </p>
            </div>
        `;
        return;
    }

    housesToShow.forEach(house => {
        const isFavorite = favorites.includes(house.id);
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.innerHTML = `
            <div class="property-image">
                <img src="${house.imageUrl}" alt="${house.title}">
                <div class="property-price">₹${house.price.toLocaleString('en-IN')}/mo</div>
                <button class="favorite-btn" onclick="toggleFavorite('${house.id}')">
                    <i data-lucide="heart" style="color: ${isFavorite ? '#ef4444' : '#6b7280'}; ${isFavorite ? 'fill: #ef4444' : ''}"></i>
                </button>
            </div>
            <div class="property-details">
                <h3 class="property-title">${house.title}</h3>
                <div class="property-location">
                    <i data-lucide="map-pin"></i>
                    <span>${house.location}</span>
                </div>
                <div class="property-features">
                    <div class="feature">
                        <i data-lucide="bed"></i>
                        <span>${house.bedrooms} beds</span>
                    </div>
                    <div class="feature">
                        <i data-lucide="bath"></i>
                        <span>${house.bathrooms} baths</span>
                    </div>
                    <div class="feature">
                        <i data-lucide="home"></i>
                        <span>${house.squareFootage} sq ft</span>
                    </div>
                </div>
                <div class="property-amenities">
                    ${house.amenities.map(amenity => `
                        <span class="amenity-tag">${amenity}</span>
                    `).join('')}
                </div>
            </div>
        `;
        propertyCard.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                showPropertyDetails(house);
            }
        });
        grid.appendChild(propertyCard);
        lucide.createIcons();
    });
}

function renderFavorites() {
    if (showingFavorites) {
        renderProperties();
    }
}

// Initialize the app
renderProperties();