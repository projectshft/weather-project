import { input, dropdown } from '../main.js';

function validateInput(data, query) {
  // renders data not loaded message
  if (!isLoaded(data)) {
    return false;
  }
  const cityFound = data.find((city) =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );
  // renders invalid message to user
  if (!cityFound) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    return false;
  }
  input.value = cityFound.name;
  return cityFound.name;
}

function isLoaded(data) {
  if (!data) {
    dropdown.classList.remove('d-none');
    dropdown.innerHTML = 'Data is not loaded yet. Please wait.';
    return false;
  }
  return true;
}

export { isLoaded, validateInput };
