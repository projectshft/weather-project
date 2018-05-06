var dateTime = function(){
  let dayOfWeek = [
    'Sun','Mon','Tues','Wed','Thurs','Fri','Sat'
  ] /* library of days */
  console.log(fiveDayForecast[0].list[0].dt_txt);
  let timeData = fiveDayForecast[0].list[0].dt_txt.split('')
  console.log(timeData);
  let year = timeData.slice(0,4).join('');
  console.log("year: "+year);
  let month = timeData.slice(5,7).join('');
  console.log("month: "+ month)
  let date = timeData.slice(8,10).join('');
  console.log("day: "+ date)
  let hour = timeData.slice(11,13).join('');
  console.log("hour: "+ hour)
  let minutes = timeData.slice(14,16).join('');
  console.log("minutes: "+ minutes)
  let today = String(new Date().getDate());
  if(today.length == 1){
    today = 0 + today;
  }
  console.log("today: "+ today)

  let index = 0;

  fiveDayForecast[0].list.forEach(function(item){
    /* If the date time stamp's hour is noon, then render the API data */

    if(item.dt_txt.split('').slice(11,13).join('')==12){
      /* find day in dayOfWeek array. if index ever gets above 6, subtract 7 to start over in the array dayOfWeek */
      index++;
      if(index>6){
        index-=7;
      }
      var day = dayOfWeek[new Date().getDay()+index];
      console.log(day);
      console.log(item.dt_txt.split('').slice(8,10).join(''));
      console.log(item.dt_txt.split('').slice(11,13).join(''));


      let tempature = (Number(item.main.temp)*9/5-459.67).toFixed(0);
      console.log(tempature+'°');
      let description = item.weather[0].main;
      console.log(description);
      console.log('\n')

      let weatherIcon = "http://openweathermap.org/img/w/"+item.weather[0].icon+".png"

      var source = $('#forecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template({
        temp:tempature,
        day:day,
        description:description,
        imageURL:weatherIcon,
      })
      $(newHTML).appendTo($('.forecast'));

    }

  })
}
