export default api = "5de1b63f3ad7c2600e3f33f10036d1ec";

//   for (let i = 0; i < dayOneData.length; i++) {
//     dayOneAvg += dayOneData[i].temp / dayOneData.length;
//   }
//   for (let i = 0; i < dayTwoData.length; i++) {
//     dayTwoAvg += dayTwoData[i].temp / dayTwoData.length;
//   }
//   for (let i = 0; i < dayThreeData.length; i++) {
//     dayThreeAvg += dayThreeData[i].temp / dayThreeData.length;
//   }
//   for (let i = 0; i < dayFourData.length; i++) {
//     dayFourAvg += dayFourData[i].temp / dayFourData.length;
//   }
//   for (let i = 0; i < dayFiveData.length; i++) {
//     dayFiveAvg += dayFiveData[i].temp / dayFiveData.length;
//   }

//   Moving the averages and day into the 5-day forecast as separate objects PER DAY. Please note that I am pulling the descripton and icon from the MIDDLE of the array to roughly correspond with mid-day (thus, the [4] since the arrays are generally 7-8 long)

//   forecast.push(
//     {
//       temp: Math.round(dayOneAvg),
//       day: moment().add(1, "days").format("dddd"),
//       imageURL: `http://openweathermap.org/img/wn/${dayOneData[4].icon}@2x.png`,
//       description: dayOneData[4].description,
//       date: moment().add(1, "days").format("MMMM D"),
//     },
//     {
//       temp: Math.round(dayTwoAvg),
//       day: moment().add(2, "days").format("dddd"),
//       imageURL: `http://openweathermap.org/img/wn/${dayTwoData[4].icon}@2x.png`,
//       description: dayTwoData[4].description,
//       date: moment().add(2, "days").format("MMMM D"),
//     },
//     {
//       temp: Math.round(dayThreeAvg),
//       day: moment().add(3, "days").format("dddd"),
//       imageURL: `http://openweathermap.org/img/wn/${dayThreeData[4].icon}@2x.png`,
//       description: dayThreeData[4].description,
//       date: moment().add(3, "days").format("MMMM D"),
//     },
//     {
//       temp: Math.round(dayFourAvg),
//       day: moment().add(4, "days").format("dddd"),
//       imageURL: `http://openweathermap.org/img/wn/${dayFourData[4].icon}@2x.png`,
//       description: dayFourData[4].description,
//       date: moment().add(4, "days").format("MMMM D"),
//     },
//     {
//       temp: Math.round(dayFiveAvg),
//       day: moment().add(5, "days").format("dddd"),
//       imageURL: `http://openweathermap.org/img/wn/${dayFiveData[4].icon}@2x.png`,
//       description: dayFiveData[4].description,
//       date: moment().add(5, "days").format("MMMM D"),
//     }
//   );
