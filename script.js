        function saveThemePreference(isLightTheme) {
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
        }

        function toggleTheme() {
            document.body.classList.toggle('light-theme');
            const isLightTheme = document.body.classList.contains('light-theme');
            saveThemePreference(isLightTheme);
        }

        function changeFont(font) {
            document.documentElement.style.setProperty('--font-family', font);
        }

        function changeFontSize(size) {
            document.documentElement.style.setProperty('--font-size', size + 'px');
            const options = document.querySelectorAll('.font-size-option');
            options.forEach(option => option.classList.remove('selected'));
            document.querySelector(`.font-size-option[data-size="${size}"]`).classList.add('selected');
        }

        function toggleLayout() {
            const isFullWidth = document.body.classList.toggle('full-width');
            localStorage.setItem('layout', isFullWidth ? 'full' : 'fixed');
        }

        function loadLayout() {
            const savedLayout = localStorage.getItem('layout');
            if (savedLayout === 'full') {
                document.body.classList.add('full-width');
            } else {
                document.body.classList.remove('full-width');
            }
        }

        const stories = {
            "Flash Fiction": [
                { name: "A Tale of Two Perspectives", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Flash%20Fiction/A%20Tale%20of%20Two%20Perspectives.md" },
                { name: "A Balanced Life", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Flash%20Fiction/A%20Balanced%20Life.md" },
                { name: "The Fault Lines", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Flash%20Fiction/The%20Fault%20Lines.md" },
                { name: "The Needs We Carry", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Flash%20Fiction/The%20Needs%20We%20Carry.md" },
                { name: "The Weight of Expectations", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Flash%20Fiction/The%20Weight%20of%20Expectations.md" },
                { name: "The Weight of Words", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Flash%20Fiction/The%20Weight%20of%20Words.md" }
            ],
            "Short Stories": [
                { name: "A Journey Through Gender Roles", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Short%20Stories/A%20Journey%20Through%20Gender%20Roles.md" },
                { name: "Unspoken Expectations", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Short%20Stories/Unspoken%20Expectations.md" }
            ],
            "Novel": [
                { name: "Fractured", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Novel/Fractured.md" }
            ],
            "Epic": [
                { name: "The Crumbling Citadel", url: "https://raw.githubusercontent.com/TempestAethel/AuroraChronicles/main/Stories/Epic/The%20Crumbling%20Citadel.md" }
            ]
        };

        function loadStories() {
            const storySections = document.getElementById('story-sections');

            Object.keys(stories).forEach(category => {
                const section = document.createElement('div');
                section.classList.add('story-section');

                const header = document.createElement('h2');
                header.textContent = category;
                section.appendChild(header);

                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('story-buttons');

                stories[category].forEach(story => {
                    const storyButton = document.createElement('a');
                    storyButton.href = '#';
                    storyButton.classList.add('story-button');
                    storyButton.textContent = story.name;
                    storyButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        loadStory(story.url, story.name);
                    });
                    buttonsContainer.appendChild(storyButton);
                });

                section.appendChild(buttonsContainer);
                storySections.appendChild(section);
            });
        }

        function loadStory(url, title) {
            window.history.pushState({title: title}, title, `?story=${encodeURIComponent(title)}`);

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(markdown => {
                    const converter = new showdown.Converter();
                    const htmlContent = converter.makeHtml(markdown);
                    document.getElementById('markdown-content').innerHTML = htmlContent;
                    document.getElementById('markdown-content').style.display = 'block';
                    document.title = `${title} - Aurora Chronicles`;

                    // Hide story sections and show markdown content
                    document.getElementById('story-sections').style.display = 'none';
                })
                .catch(error => {
                    document.getElementById('markdown-content').innerHTML = `<p>Error loading the story content. Please try again later.</p>`;
                    console.error('Error loading story content:', error);
                });
        }

        function showMenu() {
            const menu = document.getElementById('settings-menu');
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }

        function toggleMenuOption(option) {
            if (option === 'toggleTheme') {
                toggleTheme();
            } else if (option.startsWith('font-')) {
                const font = option.split('-')[1];
                changeFont(font);
            } else if (option.startsWith('size-')) {
                const size = option.split('-')[1];
                changeFontSize(size);
            } else if (option === 'toggleLayout') {
                toggleLayout();
            } else if (option === 'showMenu') {
                showStoryMenu();
            }
            showMenu(); // Hide the settings menu after selection
        }

        function showStoryMenu() {
            document.getElementById('story-sections').style.display = 'block';
            document.getElementById('markdown-content').style.display = 'none';
        }

        window.onload = function () {
            loadTheme();
            loadLayout(); // Load the layout preference
            loadStories();
        };
