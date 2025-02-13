// Vanta.js Waves background initialization
VANTA.WAVES({
    el: "#vanta-background", // Make sure this matches the ID of your background container
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x555555 // Dark gray color for the waves
});

let currentSection = '#home';

// Function to slide to a specific section
function slideToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    const currentSectionElement = document.querySelector(currentSection);

    if (targetSection && currentSectionElement) {
        // Remove active class from the current section and add prev class
        currentSectionElement.classList.remove('active');
        currentSectionElement.classList.add('prev');

        // Add active class to the target section
        targetSection.classList.remove('prev');
        targetSection.classList.add('active');

        // Update the current section
        currentSection = targetId;

        // Update the active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.menu-item[href="${targetId}"]`).classList.add('active');

        // Remove the prev class after the transition
        setTimeout(() => {
            currentSectionElement.classList.remove('prev');
        }, 1000); // Match this duration with the CSS transition duration
    }
}

// Smooth scrolling for menu items
document.querySelectorAll('.menu-item').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        slideToSection(targetId);
    });
});

// Smooth scrolling for mobile menu items
document.querySelectorAll('.mobile-menu-item').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        slideToSection(targetId);
    });
});

// On page load, show the home section
document.addEventListener('DOMContentLoaded', () => {
    slideToSection('#home');
});

// Function to toggle the image container
function toggleImage() {
    const imageContainer = document.querySelector('.project-image-container');
    imageContainer.classList.toggle('active');
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    const footer = document.querySelector('footer'); // Get the footer element

    mobileMenu.classList.toggle('active');
    body.classList.toggle('no-scroll');

    // Toggle footer visibility
    if (mobileMenu.classList.contains('active')) {
        footer.style.display = 'none'; // Hide the footer when the menu is open
    } else {
        footer.style.display = 'block'; // Show the footer when the menu is closed
    }
}

// Close the mobile menu when clicking outside of it
document.addEventListener('click', (event) => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const body = document.body;
    const footer = document.querySelector('footer'); // Get the footer element

    // Check if the click is outside the menu and the icon
    if (!mobileMenu.contains(event.target) && !mobileMenuIcon.contains(event.target)) {
        mobileMenu.classList.remove('active'); // Close the menu
        body.classList.remove('no-scroll'); // Enable scrolling
        footer.style.display = 'block'; // Show the footer when the menu is closed
    }
});

async function fetchDiscordProfile() {
    const userId = '737614381046825004'; // Replace with your Discord User ID
    const discordInfo = document.getElementById('discord-info');

    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await response.json();

        if (data.success) {
            const discordData = data.data;
            const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${discordData.discord_user.avatar}.png`;
            const username = discordData.discord_user.username;
            const status = discordData.discord_status; // online, idle, dnd, offline
            const activity = discordData.activities[0] || null;

            // Update the DOM with Discord data
            document.getElementById('discord-avatar').src = avatarUrl;
            document.getElementById('discord-username').innerText = username;

            // Update status indicator
            const statusIndicator = document.getElementById('status-indicator');
            statusIndicator.className = `status-indicator status-${status}`;

            // Update activity
            const activityContainer = document.getElementById('activity-container');
            if (activity) {
                activityContainer.innerHTML = `
                    <span class="activity-icon ${getActivityClass(activity)}">${getActivityIcon(activity)}</span>
                    <span class="activity-text">${activity.name}</span>
                `;
            } else {
                activityContainer.innerHTML = `
                    <span class="activity-icon">🔍</span>
                    <span class="activity-text">No activity</span>
                `;
            }
        } else {
            console.error('Failed to fetch Discord data:', data);
            discordInfo.innerHTML = `<p>Failed to load Discord profile. Make sure your Discord ID is correct.</p>`;
        }
    } catch (error) {
        console.error('Error fetching Discord profile:', error);
        discordInfo.innerHTML = `<p>Error loading Discord profile. Please try again later.</p>`;
    }
}

// Helper function to get activity icon
function getActivityIcon(activity) {
    switch (activity.type) {
        case 0: // Playing a game
            return '🎮';
        case 2: // Listening to Spotify
            return '🎵';
        case 4: // Custom status
            return '💬';
        default:
            return '🔍';
    }
}

// Helper function to get activity class for colors
function getActivityClass(activity) {
    switch (activity.type) {
        case 0: // Playing a game
            return 'activity-game';
        case 2: // Listening to Spotify
            return 'activity-spotify';
        case 4: // Custom status
            return 'activity-custom';
        default:
            return '';
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchDiscordProfile();
});