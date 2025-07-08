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

        function showTranslationBox(word, x, y) {
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
            
            // Set the selected word
            selectedWordElement.textContent = word;
            
            // Look up the word in dictionary
            const wordData = dictionary[word.toLowerCase()];
            
            if (wordData) {
                // Set pronunciation
                pronunciationElement.textContent = wordData.pronunciation;
                
                // Set translation
                let translationHTML = '';
                wordData.translations.forEach(translation => {
                    translationHTML += `
                        <div class="word-type">${translation.type}</div>
                        <div class="translation-text">${translation.meaning}</div>
                        <div class="translation-examples">
                            Examples: ${translation.examples.join(' • ')}
                        </div>
                    `;
                });
                translationContent.innerHTML = translationHTML;
            } else {
                // Word not found in dictionary
                pronunciationElement.textContent = 'Pronunciation not available';
                translationContent.innerHTML = `
                    <div class="error">
                        Translation not available for "${word}". 
                        <br><small>In a real app, this would query an online dictionary API.</small>
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
        function addToCurrentWord() {
            //add to current Word 
            if (!currentWord) return;
            
            alert(`"${currentWord}" added to flashcard! 📚\n\n(In a real app, this would integrate with your flashcard system)`);
        }