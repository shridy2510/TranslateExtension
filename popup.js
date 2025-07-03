function toggleSection(sectionId) {
            const content = document.getElementById(sectionId + '-content');
            const title = content.previousElementSibling;
            
            content.classList.toggle('collapsed');
            title.classList.toggle('collapsed');
        }

        function playPronunciation(word) {
            // Simulate pronunciation
            console.log('Playing pronunciation for:', word);
            // Add actual text-to-speech logic here
        }

        function deleteWord(word, source) {
            if (confirm(`Delete "${word}" from ${source}?`)) {
                console.log('Deleting word:', word, 'from', source);
                // Add deletion logic here
            }
        }

        function addToFlashcard(word) {
            const targetFlashcard = document.getElementById('targetFlashcard').value;
            console.log('Adding word:', word, 'to flashcard:', targetFlashcard);
            // Add logic to move word to flashcard
        }

        function addWordToFlashcard() {
            const word = prompt('Enter the word:');
            const meaning = prompt('Enter the meaning:');
            const pronunciation = prompt('Enter pronunciation (optional):');
            
            if (word && meaning) {
                console.log('Adding new word to flashcard:', {word, meaning, pronunciation});
                // Add logic to create new word
            }
        }

        function addAllToFlashcard() {
            const targetFlashcard = document.getElementById('targetFlashcard').value;
            if (confirm(`Add all today's words to "${targetFlashcard}"?`)) {
                console.log('Adding all words to flashcard:', targetFlashcard);
                // Add logic to move all words
            }
        }

        document.getElementById('newFlashcardBtn').addEventListener('click', function() {
            const name = prompt('Enter flashcard name:');
            if (name) {
                console.log('Creating new flashcard:', name);
                // Add logic to create new flashcard
            }
        });

        document.getElementById('exportBtn').addEventListener('click', function() {
            const source = document.getElementById('exportSource').value;
            const format = document.getElementById('exportFormat').value;
            
            console.log('Exporting:', source, 'as', format);
            
            // Show feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<span>✅</span><span>Exported!</span>';
            setTimeout(() => this.innerHTML = originalText, 2000);
        });

        document.getElementById('clearBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                console.log('Clearing all data');
                // Add clear logic here
            }
        });

        // Initialize - collapse export section by default
        document.getElementById('export-content').classList.add('collapsed');
        document.querySelector('[onclick="toggleSection(\'export\')"]').classList.add('collapsed');