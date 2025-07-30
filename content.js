let currentWord = "";
let isBoxVisible = false;
function hideTranslationBox() {
  const translationBox = document.getElementById("translationBox");
  translationBox.classList.remove("show");
  isBoxVisible = false;

  // Clear any text selection
  window.getSelection().removeAllRanges();
}

function createTranslationBox() {
  if (document.getElementById("translationBox")) return;

  const box = document.createElement("div");
  box.id = "translationBox";
  box.className = "translation-box";
  box.innerHTML = `
    <div class="translation-header">
      <h3 class="selected-word" id="selectedWord">Loading...</h3>
      <button class="close-btn" id="closeBtn">✕</button>
    </div>
    <div class="pronunciation-section">
      <div class="pronunciation-text" id="pronunciationText">Loading pronunciation...</div>
      <div class="pronunciation-controls">
        <button class="speak-btn" id="speakBtn"><span id="speakIcon">🔊</span></button>
      </div>
    </div>
    <div class="translation-section">
      <div class="translation-label">Translation</div>
      <div id="translationContent">
        <div class="loading">Loading translation...</div>
      </div>
    </div>
  `;

  document.body.appendChild(box);
  const closeBtn = box.querySelector(".close-btn");
  closeBtn.addEventListener("click", hideTranslationBox);
}

// Add double-click event listener to the document
document.addEventListener("dblclick", function (event) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText) {
    // Clean up the selected text (remove punctuation)
    const cleanWord = selectedText
      .toLowerCase()
      .replace(/[^\p{L}\p{N}_]/gu, "");

    if (cleanWord) {
      showTranslationBox(cleanWord, event.pageX, event.pageY);
    }
  }
});
// Close translation box when clicking outside
document.addEventListener("click", function (event) {
  const translationBox = document.getElementById("translationBox");
  if (isBoxVisible && !translationBox.contains(event.target)) {
    hideTranslationBox();
  }
});
// Prevent double-click text selection on translation box
document
  .getElementById("translationBox")
  .addEventListener("selectstart", function (event) {
    event.preventDefault();
  });
// Function to show the translation box

async function showTranslationBox(word, x, y) {
  createTranslationBox();
  currentWord = word;
  const translationBox = document.getElementById("translationBox");
  const selectedWordElement = document.getElementById("selectedWord");
  const pronunciationElement = document.getElementById("pronunciationText");
  const translationContent = document.getElementById("translationContent");

  // Position the box
  translationBox.style.left = Math.min(x, window.innerWidth - 420) + "px";
  translationBox.style.top = y + 20 + "px";

  // Show the box
  translationBox.classList.add("show");
  isBoxVisible = true;

  //fetch the dictionary data
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await response.json();
    // Process the dictionary data
    // Set the selected word
    selectedWordElement.textContent = data[0].word || word;

    // Set pronunciation
    pronunciationElement.textContent =
      data[0]?.phonetic || data[1]?.phonetic || "/ /";

    // Set translation
    let translationHTML = "";

    data[0].meanings.forEach((meaning) => {
      translationHTML += `
                        <div class="word-type">${
                          meaning.partOfSpeech || ""
                        }</div>
                        <div class="translation-text">${
                          meaning.definitions[0]?.definition || ""
                        }</div>

                       ${
                         meaning.definitions[0]?.example
                           ? `<div class="translation-examples">Example 1: ${meaning.definitions[0].example}</div>`
                           : ""
                       }

                        ${
                          meaning.definitions[1]?.definition
                            ? `<div class="translation-text">${meaning.definitions[1].definition}</div>`
                            : ""
                        }
                        ${
                          meaning.definitions[1]?.example
                            ? `<div class="translation-examples">Example 2: ${meaning.definitions[1].example}</div>`
                            : ""
                        }
                    `;
    });
    translationContent.innerHTML = translationHTML;
    // Set audio if available
    const audioUrl = data[0].phonetics.find((p) => p.audio)?.audio;
    const speakBtn = document.getElementById("speakBtn");
    if (audioUrl) {
      speakBtn.style.display = "inline-block";
      speakBtn.onclick = () => speakWord(audioUrl);
    } else {
      speakBtn.style.display = "none";
    }
    // Save the word to currentWord for later use
    const schema = {
      word: data[0].word,
      phonetic: data[0].phonetic || "",
      meanings: data[0].meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.slice(0, 2).map((def) => ({
          definition: def.definition,
          example: def.example || "",
        })),
      })),
    };
    await saveTodayWord(schema);
  } catch (error) {
    console.error("Error fetching dictionary data:", error);
    // Word not found in dictionary

    translationContent.innerHTML = `
        <div class="error">
            Translation not available for "${word}". 
        </div>
    `;
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
            example: String,
          },
        ],
      },
    ],
  };
  // Lưu với key là tên từ (word)
  async function saveTodayWord(wordData) {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const key = `todayWords_${today}`;
      const storage = await chrome.storage.local.get("wordTodays");
      const wordTodays = storage.wordTodays || {};

      //  Initialize today's array if it doesn't exist
      if (!wordTodays[key]) {
        wordTodays[key] = [];
      }

      //  Check for duplicate
      const exists = wordTodays[key].some(
        (item) => item.word === wordData.word
      );

      if (!exists) {
        //  Add new word
        wordTodays[key].push(wordData);

        //  Save updated data
        await chrome.storage.local.set({ wordTodays });
        console.log("Word saved successfully:", wordData.word);
      } else {
        console.log("Word already exists for today:", wordData.word);
      }
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }
}
