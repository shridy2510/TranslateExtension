     let currentWord = '';
        let isBoxVisible = false;
 
 // Add double-click event listener to the document
        document.addEventListener('dblclick', function(event) {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText) {
                // Clean up the selected text (remove punctuation)
                const cleanWord = selectedText.toLowerCase().replace(/[^\w]/g, '');
                
                if (cleanWord) {
                    showTranslationBox(cleanWord, event.pageX, event.pageY);
                }
            }
        });
               // Close translation box when clicking outside
        document.addEventListener('click', function(event) {
            const translationBox = document.getElementById('translationBox');
            if (isBoxVisible && !translationBox.contains(event.target)) {
                hideTranslationBox();
            }
        });
         // Prevent double-click text selection on translation box
        document.getElementById('translationBox').addEventListener('selectstart', function(event) {
            event.preventDefault();
        });
           // Prevent double-click text selection on translation box
        document.getElementById('translationBox').addEventListener('selectstart', function(event) {
            event.preventDefault();
        });

          async function showTranslationBox(word, x, y) {
            currentWord = word;
            const translationBox = document.getElementById('translationBox');
            const selectedWordElement = document.getElementById('selectedWord');
            const pronunciationElement = document.getElementById('pronunciationText');
            const translationContent = document.getElementById('translationContent');
            
            // Position the box
            translationBox.style.left = Math.min(x, window.innerWidth - 420) + 'px';
            translationBox.style.top = (y + 20) + 'px';
            
            // Show the box
            translationBox.classList.add('show');
            isBoxVisible = true;

            //fetch the dictionary data
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                const data = await response.json();
                // Process the dictionary data
                 // Set the selected word
            selectedWordElement.textContent = data[0].word || word;
           
            // Set pronunciation
                pronunciationElement.textContent = data[0].phonetic || 'Pronunciation not available';

                // Set translation
                let translationHTML = '';
                data[0].meanings.forEach(meaning => {
                    translationHTML += `
                        <div class="word-type">${meaning.partOfSpeech}</div>
                        <div class="translation-text">${meaning.definitions[0].definition}</div>
                        <div class="translation-examples">
                            Examples: ${meaning.definitions[0].example || 'No example available'}
                        </div>
                    `;
                });
                translationContent.innerHTML = translationHTML;

            } catch (error) {
                console.error('Error fetching dictionary data:', error);
                 // Word not found in dictionary

                translationContent.innerHTML = `
                    <div class="error">
                        Translation not available for "${word}". 
                        Please try another word or check your spelling.
                    </div>
                `;
            }
        }

        function hideTranslationBox() {
            const translationBox = document.getElementById('translationBox');
            translationBox.classList.remove('show');
            isBoxVisible = false;

            // Clear any text selection
            window.getSelection().removeAllRanges();
        }
        function hideTranslationBox() {
            const translationBox = document.getElementById('translationBox');
            translationBox.classList.remove('show');
            isBoxVisible = false;
            
            // Clear any text selection
            window.getSelection().removeAllRanges();
        }
        function addToCurrentWord() {
            //add to current Word 
            if (!currentWord) return;
            
            alert(`"${currentWord}" added to flashcard! 📚\n\n(In a real app, this would integrate with your flashcard system)`);
        }