const renderMap = (lat, lon) => {
  const MAP_API_KEY = 'AIzaSyBCNbEnV7RZIRMyO9vgfOD-evXXlu6C2yU';

  document.querySelector(".google-maps").replaceChildren();

  const template= `<iframe width="100%" height="450" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/view?key=${MAP_API_KEY}&center=${lat},${lon}&zoom=10"></iframe>`;
  document.querySelector(".google-maps").insertAdjacentHTML("beforeend", template);
};

export default renderMap;