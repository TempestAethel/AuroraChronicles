// Aurora Chronicles - Story Hub Application

// Story data as specified
const stories = {
    "Flash Fiction": [
        { name: "A Tale of Two Perspectives", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Flash%20Fiction/A%20Tale%20of%20Two%20Perspectives.md" },
        { name: "A Balanced Life", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Flash%20Fiction/A%20Balanced%20Life.md" },
        { name: "The Fault Lines", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Flash%20Fiction/The%20Fault%20Lines.md" },
        { name: "The Needs We Carry", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Flash%20Fiction/The%20Needs%20We%20Carry.md" },
        { name: "The Weight of Expectations", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Flash%20Fiction/The%20Weight%20of%20Expectations.md" },
        { name: "The Weight of Words", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Flash%20Fiction/The%20Weight%20of%20Words.md" }
    ],
    "Short Stories": [
        { name: "A Journey Through Gender Roles", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Short%20Stories/A%20Journey%20Through%20Gender%20Roles.md" },
        { name: "Unspoken Expectations", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Short%20Stories/Unspoken%20Expectations.md" }
    ],
    "Novel": [
        { name: "Fractured", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Novel/Fractured.md" }
    ],
    "Epic": [
        { name: "The Crumbling Citadel", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/refs/heads/main/Chronicle%201/Stories/Epic/The%20Crumbling%20Citadel.md" }
    ]
};

// Application state
let currentStory = null;
let converter = null;

// DOM elements
const themeHub = document.getElementById('theme-hub');
const settingsToggle = document.getElementById('settings-toggle');
const settingsMenu = document.getElementById('settings-menu');
const closeSettingsBtn = document.getElementById('close-settings');
const storyListContainer = document.getElementById('story-list-container');
const contentContainer = document.getElementById('content-container');
const storyContent = document.getElementById('story-content');
const backButton = document.getElementById('back-to-stories');
const loadingIndicator = document.getElementById('loading-indicator');

// Settings elements
const showStoryMenuCheckbox = document.getElementById('show-story-menu');
const themeSelect = document.getElementById('theme-select');
const layoutSelect = document.getElementById('layout-select');
const fontFamilySelect = document.getElementById('font-family-select');
const fontSizeSelect = document.getElementById('font-size-select');
const resetPreferencesBtn = document.getElementById('reset-preferences');
const skipThemeBtn = document.getElementById('skip-theme-selection');

// Default preferences
const defaultPreferences = {
    theme: 'light',
    layout: 'fixed',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16',
    showStoryMenu: true,
    hasSelectedTheme: false
};

// Initialize the application
function init() {
    // Initialize Showdown converter
    if (typeof showdown !== 'undefined') {
        converter = new showdown.Converter({
            headerLevelStart: 1,
            simplifiedAutoLink: true,
            excludeTrailingPunctuationFromURLs: true,
            strikethrough: true,
            tables: true,
            ghCodeBlocks: true,
            smoothLivePreview: true
        });
    } else {
        console.error('Showdown library not loaded');
        return;
    }

    // Load preferences
    loadPreferences();
    
    // Check if user has selected a theme before
    const savedPreferences = localStorage.getItem('aurora-chronicles-preferences');
    const preferences = savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
    
    if (!preferences.hasSelectedTheme) {
        showThemeHub();
    } else {
        hideThemeHub();
    }
    
    // Render story categories
    renderStoryCategories();
    
    // Set up event listeners
    setupEventListeners();
    
    // Handle initial URL hash
    handleHashChange();
    
    console.log('Aurora Chronicles - Story Hub initialized');
}

// Show theme selection hub
function showThemeHub() {
    themeHub.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Hide theme selection hub
function hideThemeHub() {
    themeHub.classList.add('hidden');
    document.body.style.overflow = '';
}

// Load user preferences from localStorage
function loadPreferences() {
    const savedPreferences = localStorage.getItem('aurora-chronicles-preferences');
    const preferences = savedPreferences ? 
        { ...defaultPreferences, ...JSON.parse(savedPreferences) } : 
        defaultPreferences;
    
    // Apply preferences to UI
    themeSelect.value = preferences.theme;
    layoutSelect.value = preferences.layout;
    fontFamilySelect.value = preferences.fontFamily;
    fontSizeSelect.value = preferences.fontSize;
    showStoryMenuCheckbox.checked = preferences.showStoryMenu;
    
    // Apply preferences to document
    applyTheme(preferences.theme);
    applyLayout(preferences.layout);
    applyFontFamily(preferences.fontFamily);
    applyFontSize(preferences.fontSize);
    applyStoryMenuVisibility(preferences.showStoryMenu);
}

// Save preferences to localStorage
function savePreferences() {
    const preferences = {
        theme: themeSelect.value,
        layout: layoutSelect.value,
        fontFamily: fontFamilySelect.value,
        fontSize: fontSizeSelect.value,
        showStoryMenu: showStoryMenuCheckbox.checked,
        hasSelectedTheme: true
    };
    
    localStorage.setItem('aurora-chronicles-preferences', JSON.stringify(preferences));
}

// Reset preferences to defaults
function resetPreferences() {
    // Reset UI elements
    themeSelect.value = defaultPreferences.theme;
    layoutSelect.value = defaultPreferences.layout;
    fontFamilySelect.value = defaultPreferences.fontFamily;
    fontSizeSelect.value = defaultPreferences.fontSize;
    showStoryMenuCheckbox.checked = defaultPreferences.showStoryMenu;
    
    // Apply default preferences
    applyTheme(defaultPreferences.theme);
    applyLayout(defaultPreferences.layout);
    applyFontFamily(defaultPreferences.fontFamily);
    applyFontSize(defaultPreferences.fontSize);
    applyStoryMenuVisibility(defaultPreferences.showStoryMenu);
    
    // Save to localStorage
    savePreferences();
    
    // Show confirmation
    showNotification('Settings reset to defaults');
}

// Apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Apply layout
function applyLayout(layout) {
    document.documentElement.className = layout === 'full' ? 'container-full' : 'container-fixed';
}

// Apply font family
function applyFontFamily(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
}

// Apply font size
function applyFontSize(fontSize) {
    document.documentElement.style.setProperty('--font-size', fontSize + 'px');
}

// Apply story menu visibility
function applyStoryMenuVisibility(show) {
    if (show) {
        storyListContainer.classList.remove('hidden');
    } else {
        storyListContainer.classList.add('hidden');
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Set up event listeners
function setupEventListeners() {
    // Theme hub events
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            const theme = card.getAttribute('data-theme');
            selectTheme(theme);
        });
    });
    
    skipThemeBtn.addEventListener('click', () => {
        selectTheme('light');
    });
    
    // Settings toggle
    settingsToggle.addEventListener('click', toggleSettingsMenu);
    closeSettingsBtn.addEventListener('click', hideSettingsMenu);
    
    // Close settings menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsMenu.contains(e.target) && !settingsToggle.contains(e.target)) {
            hideSettingsMenu();
        }
    });
    
    // Settings changes
    showStoryMenuCheckbox.addEventListener('change', (e) => {
        applyStoryMenuVisibility(e.target.checked);
        savePreferences();
    });
    
    themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
        savePreferences();
    });
    
    layoutSelect.addEventListener('change', (e) => {
        applyLayout(e.target.value);
        savePreferences();
    });
    
    fontFamilySelect.addEventListener('change', (e) => {
        applyFontFamily(e.target.value);
        savePreferences();
    });
    
    fontSizeSelect.addEventListener('change', (e) => {
        applyFontSize(e.target.value);
        savePreferences();
    });
    
    // Reset preferences button
    resetPreferencesBtn.addEventListener('click', resetPreferences);
    
    // Back button
    backButton.addEventListener('click', showStoryList);
    
    // Hash change for browser navigation
    window.addEventListener('hashchange', handleHashChange);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Select theme from hub
function selectTheme(theme) {
    // Update theme cards visual state
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.classList.remove('selected');
        if (card.getAttribute('data-theme') === theme) {
            card.classList.add('selected');
        }
    });
    
    // Apply theme immediately
    applyTheme(theme);
    themeSelect.value = theme;
    
    // Save preferences
    savePreferences();
    
    // Hide theme hub after a short delay
    setTimeout(() => {
        hideThemeHub();
    }, 500);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Escape key to close settings or show story list
    if (e.key === 'Escape') {
        if (settingsMenu.classList.contains('show')) {
            hideSettingsMenu();
        } else if (currentStory) {
            showStoryList();
        } else if (!themeHub.classList.contains('hidden')) {
            selectTheme('light');
        }
    }
    
    // Ctrl/Cmd + K to toggle settings
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSettingsMenu();
    }
}

// Toggle settings menu
function toggleSettingsMenu() {
    if (settingsMenu.classList.contains('show')) {
        hideSettingsMenu();
    } else {
        showSettingsMenu();
    }
}

// Show settings menu
function showSettingsMenu() {
    settingsMenu.classList.add('show');
    settingsMenu.setAttribute('aria-hidden', 'false');
    settingsToggle.setAttribute('aria-expanded', 'true');
}

// Hide settings menu
function hideSettingsMenu() {
    settingsMenu.classList.remove('show');
    settingsMenu.setAttribute('aria-hidden', 'true');
    settingsToggle.setAttribute('aria-expanded', 'false');
}

// Render story categories and stories
function renderStoryCategories() {
    const storyCategoriesContainer = document.getElementById('story-categories');
    storyCategoriesContainer.innerHTML = '';
    
    Object.keys(stories).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'story-category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category;
        
        const storyList = document.createElement('div');
        storyList.className = 'story-list';
        
        stories[category].forEach(story => {
            const storyButton = document.createElement('button');
            storyButton.className = 'story-btn';
            storyButton.textContent = story.name;
            storyButton.setAttribute('aria-label', `Read story: ${story.name}`);
            storyButton.addEventListener('click', () => loadStory(story));
            
            storyList.appendChild(storyButton);
        });
        
        categoryDiv.appendChild(categoryTitle);
        categoryDiv.appendChild(storyList);
        storyCategoriesContainer.appendChild(categoryDiv);
    });
}

// Load and display a story
async function loadStory(story) {
    if (!converter) {
        showError('Markdown converter not available');
        return;
    }
    
    // Update URL hash
    window.location.hash = `story=${encodeURIComponent(story.name)}`;
    
    // Show loading indicator
    showLoading();
    
    try {
        const response = await fetch(story.url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdown = await response.text();
        const html = converter.makeHtml(markdown);
        
        // Update content
        storyContent.innerHTML = html;
        currentStory = story;
        
        // Update page title
        document.title = `Aurora Chronicles - Story Hub | ${story.name}`;
        
        // Show back button
        backButton.style.display = 'block';
        
        // Hide loading indicator
        hideLoading();
        
        // Scroll to top of content
        contentContainer.scrollTop = 0;
        
    } catch (error) {
        console.error('Error loading story:', error);
        showError(`Failed to load story: ${error.message}`);
        hideLoading();
    }
}

// Show story list
function showStoryList() {
    // Reset URL hash
    window.location.hash = '';
    
    // Reset page title
    document.title = 'Aurora Chronicles - Story Hub';
    
    // Show welcome message
    storyContent.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome to Aurora Chronicles</h2>
            <p>Select a story from the menu to begin reading, or use the settings to customize your reading experience.</p>
        </div>
    `;
    
    // Hide back button
    backButton.style.display = 'none';
    
    // Reset current story
    currentStory = null;
}

// Handle URL hash changes
function handleHashChange() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#story=')) {
        const storyName = decodeURIComponent(hash.substring(7));
        
        // Find the story
        let foundStory = null;
        for (const category of Object.keys(stories)) {
            foundStory = stories[category].find(s => s.name === storyName);
            if (foundStory) break;
        }
        
        if (foundStory) {
            loadStory(foundStory);
        } else {
            console.warn('Story not found:', storyName);
            showStoryList();
        }
    } else {
        showStoryList();
    }
}

// Show loading indicator
function showLoading() {
    loadingIndicator.style.display = 'flex';
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Show error message
function showError(message) {
    storyContent.innerHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="showStoryList()" class="back-btn" style="position: static; margin-top: 1rem;">
                Return to Story List
            </button>
        </div>
    `;
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Global functions for error handler
window.showStoryList = showStoryList;