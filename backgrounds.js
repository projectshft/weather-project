var backgrounds = {
  
  default: 'https://cloudcomputing-news.net/wp-content/uploads/sites/2/2020/03/flying-over-the-clouds-picture-id854657640.jpg',

  clear: 'https://www.langleyadvancetimes.com/wp-content/uploads/2020/02/20629626_web1_Langley-Weather-Sun-Clear-Sky-Skies.jpg',

  clouds: 'http://www.peoplesbudget.eu/wp/wp-content/uploads/16103534130_ec2dec6864_o.jpg',

  snow: 'https://images.unsplash.com/photo-1612719983096-39505900b5c5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8c25vdyUyMGZhbGxpbmd8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80',

  rain: 'https://s7d2.scene7.com/is/image/TWCNews/heavy_rain_jpg-2',
  
  renderStyles: (weather)=>{
    switch (weather) {
      case 'Clear':
        $('body').css('background-image', 'url(' + backgrounds.clear + ')')
        break;

      case 'Clouds':
        $('body').css('background-image', 'url(' + backgrounds.clouds + ')')
        break;
      
      case 'Rain':
        $('body').css('background-image', 'url(' + backgrounds.rain + ')')
        break;

      case 'Snow':
        $('body').css('background-image', 'url(' + backgrounds.snow + ')')
        break;
    
      default:
        $('body').css('background-image', 'url(' + backgrounds.default + ')')
        break;
    }
  }
}