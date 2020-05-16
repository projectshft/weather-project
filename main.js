const weatherApp = () => {
  // We need to invoke the API with the search-button being clicked
  const searchLocation = (locationInput) => {
    console.log(locationInput);
  };

  // If someone presses enter in search field, we need to fire event
  const searchBarEnterKeyListener = () => {
    $('#search-input').on('keypress', function (event) {
      if (event.which == 13) {
        event.preventDefault();
        let locationInput = $('#search-input').val();
        searchLocation(locationInput);
        $('#search-input').val('');
      }
    });
  };

  // if someone clicks the button to search
  const searchButtonListener = () => {
    $('.search-location').click(function () {
      let locationInput = $('#search-input').val();
      searchLocation(locationInput);
      $('#search-input').val('');
    });
  };

  return {
    searchButtonListener,
    searchBarEnterKeyListener,
  };
};

let app = weatherApp();
app.searchBarEnterKeyListener();
app.searchButtonListener();
