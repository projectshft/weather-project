/*
This function is not actually used all for the project. I just wanted to save it, but also show how I figured out how to extract information from the dt_txt file to get year, month, date, hour, minutes.

you can call the function in the Chrome console to see the logs.
*/
var dateTime = function(){
  /* First is the log of the dx_txt data */
  console.log(fiveDayForecast[0].list[0].dt_txt);
  /* Then we split the data into an array */
  let timeData = fiveDayForecast[0].list[0].dt_txt.split('')
  console.log(timeData);
  /* Then we slice the array to only take the information that represents the value of the variable we want to define */
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
}
