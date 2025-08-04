// Remove typingSpeed references
const textInput = document.getElementById('text-input');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const readingTime = document.getElementById('reading-time');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const exportBtn = document.getElementById('export-btn');
const clearBtn = document.getElementById('clear-btn');

const WPM_AVERAGE = 200;

// Optional: typing sound effect setup
const typingSound = new Audio('https://actions.google.com/sounds/v1/keyboard/keyboard_typing_click.ogg');
typingSound.volume = 0.05;

// Load saved text from localStorage
const savedText = localStorage.getItem('wordCounterText') || '';
textInput.value = savedText;

function countWords(text) {
  const words = text.match(/\b[a-zA-Z0-9À-ž]+\b/g);
  return words ? words.length : 0;
}

function updateStats() {
  const text = textInput.value;

  // Characters (including whitespace)
  charCount.textContent = text.length;

  // Words count
  const words = countWords(text);
  wordCount.textContent = words;

  // Animate word count highlight
  wordCount.classList.add('highlight');
  setTimeout(() => wordCount.classList.remove('highlight'), 300);

  // Reading time in minutes, rounded up
  const timeMinutes = words > 0 ? Math.ceil(words / WPM_AVERAGE) : 0;
  readingTime.textContent = `${timeMinutes} min`;
}

// Save text on every input (autosave)
textInput.addEventListener('input', () => {
  localStorage.setItem('wordCounterText', textInput.value);
  updateStats();

  // Play typing sound (optional)
  // typingSound.play().catch(() => {}); // catch to avoid errors on browsers blocking autoplay
});

// Initial stats update on page load
updateStats();

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.textContent = '☀️';
  } else {
    darkModeToggle.textContent = '🌙';
  }
});

// Export as text file with button feedback
exportBtn.addEventListener('click', () => {
  const text = textInput.value;
  if (!text) {
    alert('Nothing to export! Please type something first.');
    return;
  }

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'word-counter-text.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Show export feedback
  exportBtn.textContent = '✅ Exported!';
  setTimeout(() => {
    exportBtn.textContent = '📁 Export Text';
  }, 2000);
});

// Clear button
clearBtn.addEventListener('click', () => {
  textInput.value = '';
  localStorage.removeItem('wordCounterText');
  updateStats();
});


