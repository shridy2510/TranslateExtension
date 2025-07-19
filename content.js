     let currentWord = '';
        let isBoxVisible = false;
 
 // Add double-click event listener to the document
        document.addEventListener('dblclick', function(event) {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText) {
                // Clean up the selected text (remove punctuation)
                const cleanWord = selectedText.toLowerCase().replace(/[^\p{L}\p{N}_]/gu, '');
                
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
                event.preventDefault();
            });
        }

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

                        <div class="translation-text">${meaning.definitions[1].definition}</div>
                        <div class="translation-examples">
                            Examples: ${meaning.definitions[1].example || 'No example available'}
                        </div>
                    `;
                });
                translationContent.innerHTML = translationHTML;
                // Set audio if available
                const audioUrl = data[0].phonetics.find(p => p.audio)?.audio;
                const speakBtn = document.getElementById('speakBtn');
                if (audioUrl) {
                    speakBtn.style.display = 'inline-block';
                    speakBtn.onclick = () => speakWord(audioUrl);
                }
                else {
                    speakBtn.style.display = 'none';
                }
                // Save the word to currentWord for later use
                const schema = {
                    word: data[0].word,
                    phonetic: data[0].phonetic || '',
                    meanings: data[0].meanings.map(meaning => ({
                        partOfSpeech: meaning.partOfSpeech,
                        definitions: meaning.definitions.slice(0, 2).map(def => ({
                            definition: def.definition,
                            example: def.example || ''
                        }))
                    }))
                };
                const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const key = `todayWords_${today}`;
    const result = await chrome.storage.local.get(key);
    if (!result[key]) {
        // Chưa có, tạo mới
        await chrome.storage.local.set({ [key]: [] });
        console.log('Khởi tạo todayWords cho ngày', today);
    } else {
           await saveWord(key, result[key], schema);
    }

             
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
       let currentAudio = null;

function speakWord(audioUrl) {
    if (!audioUrl) return;
    // Nếu đang phát audio cũ thì dừng lại
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(audioUrl);
    currentAudio.play();
}
const wordData = {
    word: String, // the word itself
    phonetic: String, // pronunciation
    meanings: [
        {
            partOfSpeech: String, // word type (noun, verb, etc.)
            definitions: [
                {
                    definition: String, 
                    example: String
                }
            ]
        }
    ]
}
// Lưu với key là tên từ (word)
async function saveWord(key, flashcard, wordData) {   
  try {
    // Check for duplicate word before adding
    const exists = flashcard.some(item => item.word === wordData.word);
    if (!exists) {
        flashcard.push(wordData);
        await chrome.storage.local.set({ [key]: flashcard });
        console.log(`Saved data for "${wordData.word}"`);
    } else {
        console.log(`"${wordData.word}" already exists in flashcard.`);
    }
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

async function initTodayWords() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const key = `todayWords_${today}`;
    const result = await chrome.storage.local.get(key);
    if (!result[key]) {
        // Chưa có, tạo mới
        await chrome.storage.local.set({ [key]: [] });
        console.log('Khởi tạo todayWords cho ngày', today);
    } else {
        console.log('todayWords đã tồn tại cho ngày', today);
    }
    // Sau đó, bạn có thể dùng key này để thêm/xóa từ vựng hôm nay
}


initTodayWords();
