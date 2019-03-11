//make a function with many if statements to return the desired background url (could avoid the if statements severral
//ways but the fact the icon value comes with a leading number makes it weird)
var iconToBG = function(icon){
  if (icon == '01d' || icon == '01n'){
    return 'assets/backgroundImages/clearSkyBG.png';
  } else if (icon == '02d' || icon == '02n'){
    return 'assets/backgroundImages/fewCloudsBG.png';
  } else if (icon == '03d' || icon == '03n'){
    return 'assets/backgroundImages/scatteredCloudsBG.png';
  } else if (icon == '04d' || icon == '04n'){
    return 'assets/backgroundImages/brokenCloudsBG.png';
  } else if (icon == '09d' || icon == '09n' || icon == '10d' || icon == '10n' || icon == '50d' || icon == '50n'){
    return 'assets/backgroundImages/rainBG.png';
  } else if (icon == '11d' || icon == '11n'){
    return 'assets/backgroundImages/thunderstormBG.png';
  } else if (icon == '13d' || icon == '13n'){
    return 'assets/backgroundImages/snowBG.png';
  };
};
//do the same with the forecast templates
var iconToTemplates = function(icon){
  if (icon == '01d' || icon == '01n'){
    return 'assets/dayTemplates/clearSkyDayTemplate.png';
  } else if (icon == '02d' || icon == '02n'){
    return 'assets/dayTemplates/fewCloudsDayTemplate.png';
  } else if (icon == '03d' || icon == '03n'){
    return 'assets/dayTemplates/scatteredCloudsDayTemplate.png';
  } else if (icon == '04d' || icon == '04n'){
    return 'assets/dayTemplates/brokenCloudsDayTemplate.png';
  } else if (icon == '09d' || icon == '09n' || icon == '10d' || icon == '10n' || icon == '50d' || icon == '50n'){
    return 'assets/dayTemplates/rainDayTemplate.png';
  } else if (icon == '11d' || icon == '11n'){
    return 'assets/dayTemplates/thunderstormDayTemplate.png';
  } else if (icon == '13d' || icon == '13n'){
    return 'assets/dayTemplates/snowDayTemplate.png';
  };
};
