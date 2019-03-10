//add the event listener for the searched city
$(".btn-search").click(function() {
  var query = $(".search-query").val();
  $(".search-query").val('');
  currentWeatherFetch(query);
  forecastFetch(query);


  // var searchModel = CurrentCityModel({ :, :})
  //
  // var template = Handlebars.compile($("").html());
  //
  // var searchView = CurrentCityView(searchModel, template);
  //
  // searchModel.change(function(){
  //   seachView.render();
  // })
});
