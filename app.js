const root = document.body;

const themeButtons = document.querySelectorAll('[data-theme]');
const themeLabel = document.querySelector('[data-theme-label]');

if (themeButtons.length) {
  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-theme');
      root.setAttribute('data-theme', theme);
      if (themeLabel) {
        themeLabel.textContent = theme === 'default' ? 'Pure Heaven' : theme === 'starry' ? 'Starry Night' : 'Rainbow Meadow';
      }
    });
  });
}

const paidToggle = document.querySelector('[data-paid-toggle]');
if (paidToggle) {
  paidToggle.addEventListener('change', (event) => {
    if (event.target.checked) {
      root.classList.add('is-paid');
    } else {
      root.classList.remove('is-paid');
    }
  });
}

const candleButton = document.querySelector('[data-candle-button]');
const candleCount = document.querySelector('[data-candle-count]');

if (candleButton && candleCount) {
  candleButton.addEventListener('click', () => {
    const current = Number(candleCount.textContent || '0');
    candleCount.textContent = String(current + 1);
  });
}
