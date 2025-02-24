import { handleInput, handleSubmit, renderPage } from './modules/handlers.js';
import cities from '../assets/cities.json';

const input = document.getElementById('search');
const dropdown = document.getElementById('dropdown');
const button = document.getElementById('submit');

async function main() {
  renderPage();
}

main();

input.addEventListener('input', () => handleInput());

input.addEventListener('keyup', (e) => e.key === 'Enter' && handleSubmit());

button.addEventListener('click', () => handleSubmit());

export { input, dropdown, cities, renderPage };
