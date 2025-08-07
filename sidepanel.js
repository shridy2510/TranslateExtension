// Sample data for demonstration
const sampleHistoryWords = [
    { word: "Hello", translation: "Xin chào" },
    { word: "World", translation: "Thế giới" },
    { word: "Language", translation: "Ngôn ngữ" },
    { word: "Programming", translation: "Lập trình" },
    { word: "Developer", translation: "Nhà phát triển" },
    { word: "Algorithm", translation: "Thuật toán" },
    { word: "Database", translation: "Cơ sở dữ liệu" }
];

const sampleFlashcardWords = [
    { word: "Computer", translation: "Máy tính" },
    { word: "Programming", translation: "Lập trình" },
    { word: "Software", translation: "Phần mềm" },
    { word: "Network", translation: "Mạng lưới" },
    { word: "Interface", translation: "Giao diện" },
    { word: "Framework", translation: "Khung làm việc" },
    { word: "Application", translation: "Ứng dụng" },
    { word: "Extension", translation: "Phần mở rộng" }
];

// DOM Elements
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const historySelector = document.getElementById('historySelector');
const flashcardSelector = document.getElementById('flashcardSelector');
const historyWordList = document.getElementById('historyWordList');
const flashcardWordList = document.getElementById('flashcardWordList');

// Buttons
const addAllToFlashcardBtn = document.getElementById('addAllToFlashcardBtn');
const exportWordsBtn = document.getElementById('exportWordsBtn');
const createFlashcardBtn = document.getElementById('createFlashcardBtn');
const deleteFlashcardBtn = document.getElementById('deleteFlashcardBtn');
const exportFlashcardBtn = document.getElementById('exportFlashcardBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const exportAllDataBtn = document.getElementById('exportAllDataBtn');

// Toggle switches
const toggleSwitches = document.querySelectorAll('.toggle-switch');

// Initialize the extension
document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
    setupEventListeners();
});

// Initialize UI with sample data
function initializeUI() {
    renderHistoryWords(sampleHistoryWords);
    renderFlashcardWords(sampleFlashcardWords);
}

// Setup all event listeners
function setupEventListeners() {
    // Tab navigation
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => showTab(tab.dataset.tab));
    });

    // Selector changes
    historySelector.addEventListener('change', handleHistorySelectorChange);
    flashcardSelector.addEventListener('change', handleFlashcardSelectorChange);

    // Button clicks
    addAllToFlashcardBtn.addEventListener('click', addAllToFlashcard);
    exportWordsBtn.addEventListener('click', exportWords);
    createFlashcardBtn.addEventListener('click', createFlashcard);
    deleteFlashcardBtn.addEventListener('click', deleteFlashcard);
    exportFlashcardBtn.addEventListener('click', exportFlashcard);
    clearDataBtn.addEventListener('click', clearData);
    exportAllDataBtn.addEventListener('click', exportAllData);

    // Toggle switches
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', () => toggleSetting(toggle));
    });
}

// Tab management
function showTab(tabName) {
    // Remove active class from all tabs and contents
    navTabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Render history words list
function renderHistoryWords(words) {
    historyWordList.innerHTML = '';
    
    if (words.length === 0) {
        historyWordList.innerHTML = '<div class="empty-state">No words found for selected date</div>';
        return;
    }

    words.forEach(wordData => {
        const wordItem = createWordItem(wordData, 'history');
        historyWordList.appendChild(wordItem);
    });
}

// Render flashcard words list
function renderFlashcardWords(words) {
    flashcardWordList.innerHTML = '';
    
    if (words.length === 0) {
        flashcardWordList.innerHTML = '<div class="empty-state">No words in this flashcard</div>';
        return;
    }

    words.forEach(wordData => {
        const wordItem = createWordItem(wordData, 'flashcard');
        flashcardWordList.appendChild(wordItem);
    });
}

// Create word item element
function createWordItem(wordData, type) {
    const wordItem = document.createElement('div');
    wordItem.className = 'word-item';
    
    const wordContent = document.createElement('div');
    wordContent.className = 'word-content';
    
    const wordText = document.createElement('div');
    wordText.className = 'word-text';
    wordText.textContent = wordData.word;
    
    const wordTranslation = document.createElement('div');
    wordTranslation.className = 'word-translation';
    wordTranslation.textContent = wordData.translation;
    
    wordContent.appendChild(wordText);
    wordContent.appendChild(wordTranslation);
    
    const wordActions = document.createElement('div');
    wordActions.className = 'word-actions';
    
    if (type === 'history') {
        // Add to flashcard button
        const addBtn = document.createElement('button');
        addBtn.className = 'icon-btn add-btn';
        addBtn.innerHTML = '➕';
        addBtn.title = 'Add to flashcard';
        addBtn.addEventListener('click', () => addToFlashcard(wordData.word));
        wordActions.appendChild(addBtn);
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-btn delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete word';
        deleteBtn.addEventListener('click', () => deleteWord(wordData.word));
        wordActions.appendChild(deleteBtn);
    } else if (type === 'flashcard') {
        // Delete from flashcard button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-btn delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Remove from flashcard';
        deleteBtn.addEventListener('click', () => removeFromFlashcard(wordData.word));
        wordActions.appendChild(deleteBtn);
    }
    
    wordItem.appendChild(wordContent);
    wordItem.appendChild(wordActions);
    
    return wordItem;
}

// Event handlers
function handleHistorySelectorChange() {
    const selectedDate = historySelector.value;
    console.log('Loading words for:', selectedDate);
    // Here you would load words for the selected date
    // For demo, we'll just show the same words
    renderHistoryWords(sampleHistoryWords);
}

function handleFlashcardSelectorChange() {
    const selectedFlashcard = flashcardSelector.value;
    console.log('Loading flashcard:', selectedFlashcard);
    // Here you would load words for the selected flashcard
    // For demo, we'll just show the same words
    renderFlashcardWords(sampleFlashcardWords);
}

function addAllToFlashcard() {
    alert('Added all words to flashcard!');
}

function exportWords() {
    alert('Words exported successfully!');
}

function addToFlashcard(word) {
    alert(`Added "${word}" to flashcard!`);
}

function deleteWord(word) {
    if (confirm(`Are you sure you want to delete "${word}"?`)) {
        alert(`Deleted word "${word}"`);
        // Here you would remove the word from the data and re-render
    }
}

function createFlashcard() {
    const name = prompt('Enter new flashcard name:');
    if (name && name.trim()) {
        alert(`Created flashcard "${name}"`);
        // Here you would add the new flashcard to the selector
    }
}

function deleteFlashcard() {
    const selected = flashcardSelector.value;
    const selectedText = flashcardSelector.options[flashcardSelector.selectedIndex].text;
    if (confirm(`Are you sure you want to delete flashcard "${selectedText}"?`)) {
        alert(`Deleted flashcard "${selectedText}"`);
        // Here you would remove the flashcard and update the selector
    }
}

function exportFlashcard() {
    alert('Flashcard exported successfully!');
}

function removeFromFlashcard(word) {
    if (confirm(`Remove "${word}" from flashcard?`)) {
        alert(`Removed "${word}" from flashcard`);
        // Here you would remove the word from the flashcard and re-render
    }
}

function toggleSetting(element) {
    element.classList.toggle('active');
    const setting = element.dataset.setting;
    const isActive = element.classList.contains('active');
    console.log(`Setting ${setting} is now ${isActive ? 'enabled' : 'disabled'}`);
    // Here you would save the setting state
}

function clearData() {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
        alert('All data has been cleared!');
        // Here you would clear all stored data
        historyWordList.innerHTML = '<div class="empty-state">No words found</div>';
        flashcardWordList.innerHTML = '<div class="empty-state">No words in this flashcard</div>';
    }
}

function exportAllData() {
    alert('All data exported successfully!');
    // Here you would export all data to a file
}

// Utility functions for extension integration
const TransCard = {
    // Add word to history
    addWordToHistory: function(word, translation, date = new Date()) {
        // Implementation for adding word to history
        console.log('Adding word to history:', word, translation);
    },
    
    // Get words by date
    getWordsByDate: function(date) {
        // Implementation for getting words by date
        console.log('Getting words for date:', date);
        return sampleHistoryWords;
    },
    
    // Create new flashcard
    createNewFlashcard: function(name) {
        // Implementation for creating new flashcard
        console.log('Creating flashcard:', name);
    },
    
    // Add word to flashcard
    addWordToFlashcard: function(flashcardName, word, translation) {
        // Implementation for adding word to flashcard
        console.log('Adding word to flashcard:', flashcardName, word, translation);
    },
    
    // Get flashcard words
    getFlashcardWords: function(flashcardName) {
        // Implementation for getting flashcard words
        console.log('Getting words for flashcard:', flashcardName);
        return sampleFlashcardWords;
    },
    
    // Save settings
    saveSetting: function(key, value) {
        // Implementation for saving settings
        console.log('Saving setting:', key, value);
    },
    
    // Get settings
    getSetting: function(key) {
        // Implementation for getting settings
        console.log('Getting setting:', key);
        return false;
    },
    
    // Export data
    exportData: function(type, data) {
        // Implementation for exporting data
        console.log('Exporting data:', type, data);
    }
};

// Make TransCard available globally for extension integration
window.TransCard = TransCard;