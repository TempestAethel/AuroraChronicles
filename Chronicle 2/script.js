const repoOwner = "TempestAethel";
const repoName = "AuroraChronicles";
const branch = "main";  // Change if you want a different branch
const directoryPath = "Chronicle%202/Proto";  // Path to the directory in the repository

// GitHub API URL for fetching the content of the Proto directory
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directoryPath}?ref=${branch}`;

// Fetch the list of files in the Proto directory
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            // Filter out non-Markdown files (optional)
            const markdownFiles = data.filter(file => file.name.endsWith('.md'));

            // Generate buttons dynamically for each Markdown file
            const storyButtonsContainer = document.getElementById('story-buttons');
            markdownFiles.forEach(file => {
                const button = document.createElement('button');
                button.classList.add('story-button');
                button.textContent = file.name.replace('.md', '');
                button.addEventListener('click', () => loadStory(file.download_url)); // Download URL to fetch content
                storyButtonsContainer.appendChild(button);
            });
        } else {
            // Show fallback message if no stories are available
            document.getElementById('fallback-message').style.display = 'block';
        }
    })
    .catch(error => {
        console.error("Error fetching file list:", error);
        alert("Error loading the list of stories.");
        // Show fallback message if there's an error fetching data
        document.getElementById('fallback-message').style.display = 'block';
    });

// Function to fetch and render the selected story
function loadStory(url) {
    fetch(url)
        .then(response => response.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            const htmlContent = converter.makeHtml(markdown);
            document.getElementById('markdown-content').innerHTML = htmlContent;
            document.getElementById('markdown-content').style.display = 'block';
        })
        .catch(error => {
            document.getElementById('markdown-content').innerHTML = `<p>Error loading the story. Please try again later.</p>`;
            console.error('Error loading story:', error);
        });
}

// Function to toggle theme
const toggleTheme = () => {
    const body = document.body;
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    if (currentTheme === 'dark') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
};

// Theme toggle button click event
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.remove(savedTheme === 'dark' ? 'light-theme' : 'dark-theme');
    document.body.classList.add(savedTheme === 'dark' ? 'dark-theme' : 'light-theme');
}
