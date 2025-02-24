const input = document.getElementById('search');
const dropdown = document.getElementById('dropdown');

function renderDropdown(filtered) {
  filtered.forEach((city) => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    tr.setAttribute('style', 'cursor:pointer');
    td.textContent = city.name;
    tr.appendChild(td);
    tr.addEventListener('click', () => {
      input.value = city.name;
      dropdown.classList.add('d-none');
    });
    dropdown.appendChild(tr);
  });
  dropdown.classList.remove('d-none');
}

function filter(cities, query) {
  return cities
    .filter((city) => {
      return city.name.toLowerCase().includes(query);
    })
    .slice(0, 10);
}

export { renderDropdown, filter };
