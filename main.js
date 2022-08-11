let API_KEY = 'ffcbd48c376466c1987f4185ae974876'
// let ICON_URL = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`
let STATIC_WEATHER = {
  "coord": {
  "lon": -78.6382,
  "lat": 35.7796
  },
  "weather": [
  {
  "id": 803,
  "main": "Clouds",
  "description": "broken clouds",
  "icon": "04d"
  }
  ],
  "base": "stations",
  "main": {
  "temp": 79.83,
  "feels_like": 79.83,
  "temp_min": 77,
  "temp_max": 82.74,
  "pressure": 1017,
  "humidity": 80
  },
  "visibility": 10000,
  "wind": {
  "speed": 9.22,
  "deg": 230
  },
  "clouds": {
  "all": 75
  },
  "dt": 1660227133,
  "sys": {
  "type": 2,
  "id": 2042838,
  "country": "US",
  "sunrise": 1660213816,
  "sunset": 1660262963
  },
  "timezone": -14400,
  "id": 4497286,
  "name": "Wake",
  "cod": 200
  }

let STATIC_FIVE_DAY_WEATHER = {
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
  {
  "dt": 1660165200,
  "main": {
  "temp": 95.09,
  "feels_like": 102.09,
  "temp_min": 95.09,
  "temp_max": 96.44,
  "pressure": 1017,
  "sea_level": 1017,
  "grnd_level": 1004,
  "humidity": 45,
  "temp_kf": -0.75
  },
  "weather": [
  {
  "id": 802,
  "main": "Clouds",
  "description": "scattered clouds",
  "icon": "03d"
  }
  ],
  "clouds": {
  "all": 48
  },
  "wind": {
  "speed": 9.13,
  "deg": 262,
  "gust": 12.55
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-10 21:00:00"
  },
  {
  "dt": 1660176000,
  "main": {
  "temp": 87.42,
  "feels_like": 91.53,
  "temp_min": 83.91,
  "temp_max": 87.42,
  "pressure": 1016,
  "sea_level": 1016,
  "grnd_level": 1004,
  "humidity": 54,
  "temp_kf": 1.95
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10d"
  }
  ],
  "clouds": {
  "all": 56
  },
  "wind": {
  "speed": 5.61,
  "deg": 217,
  "gust": 13.06
  },
  "visibility": 10000,
  "pop": 0.35,
  "rain": {
  "3h": 0.45
  },
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-11 00:00:00"
  },
  {
  "dt": 1660186800,
  "main": {
  "temp": 77.31,
  "feels_like": 78.03,
  "temp_min": 77.31,
  "temp_max": 77.31,
  "pressure": 1016,
  "sea_level": 1016,
  "grnd_level": 1005,
  "humidity": 70,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10n"
  }
  ],
  "clouds": {
  "all": 50
  },
  "wind": {
  "speed": 5.1,
  "deg": 252,
  "gust": 12.15
  },
  "visibility": 10000,
  "pop": 0.75,
  "rain": {
  "3h": 0.43
  },
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-11 03:00:00"
  },
  {
  "dt": 1660197600,
  "main": {
  "temp": 74.41,
  "feels_like": 75.25,
  "temp_min": 74.41,
  "temp_max": 74.41,
  "pressure": 1016,
  "sea_level": 1016,
  "grnd_level": 1005,
  "humidity": 79,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10n"
  }
  ],
  "clouds": {
  "all": 65
  },
  "wind": {
  "speed": 7.23,
  "deg": 257,
  "gust": 23.73
  },
  "visibility": 10000,
  "pop": 0.64,
  "rain": {
  "3h": 0.14
  },
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-11 06:00:00"
  },
  {
  "dt": 1660208400,
  "main": {
  "temp": 71.87,
  "feels_like": 72.84,
  "temp_min": 71.87,
  "temp_max": 71.87,
  "pressure": 1015,
  "sea_level": 1015,
  "grnd_level": 1004,
  "humidity": 87,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10n"
  }
  ],
  "clouds": {
  "all": 92
  },
  "wind": {
  "speed": 7.27,
  "deg": 239,
  "gust": 19.91
  },
  "visibility": 10000,
  "pop": 0.6,
  "rain": {
  "3h": 0.32
  },
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-11 09:00:00"
  },
  {
  "dt": 1660219200,
  "main": {
  "temp": 74.46,
  "feels_like": 75.51,
  "temp_min": 74.46,
  "temp_max": 74.46,
  "pressure": 1016,
  "sea_level": 1016,
  "grnd_level": 1004,
  "humidity": 83,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 94
  },
  "wind": {
  "speed": 7.43,
  "deg": 260,
  "gust": 16.64
  },
  "visibility": 10000,
  "pop": 0.4,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-11 12:00:00"
  },
  {
  "dt": 1660230000,
  "main": {
  "temp": 84.72,
  "feels_like": 87.62,
  "temp_min": 84.72,
  "temp_max": 84.72,
  "pressure": 1016,
  "sea_level": 1016,
  "grnd_level": 1005,
  "humidity": 56,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 100
  },
  "wind": {
  "speed": 6.71,
  "deg": 263,
  "gust": 9.37
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-11 15:00:00"
  },
  {
  "dt": 1660240800,
  "main": {
  "temp": 85.77,
  "feels_like": 88.39,
  "temp_min": 85.77,
  "temp_max": 85.77,
  "pressure": 1015,
  "sea_level": 1015,
  "grnd_level": 1004,
  "humidity": 53,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 100
  },
  "wind": {
  "speed": 9.82,
  "deg": 279,
  "gust": 12.66
  },
  "visibility": 10000,
  "pop": 0.06,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-11 18:00:00"
  },
  {
  "dt": 1660251600,
  "main": {
  "temp": 84.63,
  "feels_like": 87.48,
  "temp_min": 84.63,
  "temp_max": 84.63,
  "pressure": 1013,
  "sea_level": 1013,
  "grnd_level": 1002,
  "humidity": 56,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10d"
  }
  ],
  "clouds": {
  "all": 92
  },
  "wind": {
  "speed": 9.15,
  "deg": 287,
  "gust": 13.29
  },
  "visibility": 10000,
  "pop": 0.27,
  "rain": {
  "3h": 0.19
  },
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-11 21:00:00"
  },
  {
  "dt": 1660262400,
  "main": {
  "temp": 76.48,
  "feels_like": 77.4,
  "temp_min": 76.48,
  "temp_max": 76.48,
  "pressure": 1014,
  "sea_level": 1014,
  "grnd_level": 1002,
  "humidity": 76,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10d"
  }
  ],
  "clouds": {
  "all": 96
  },
  "wind": {
  "speed": 4.16,
  "deg": 292,
  "gust": 7.76
  },
  "visibility": 10000,
  "pop": 0.48,
  "rain": {
  "3h": 0.83
  },
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-12 00:00:00"
  },
  {
  "dt": 1660273200,
  "main": {
  "temp": 72.48,
  "feels_like": 73.62,
  "temp_min": 72.48,
  "temp_max": 72.48,
  "pressure": 1015,
  "sea_level": 1015,
  "grnd_level": 1003,
  "humidity": 89,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10n"
  }
  ],
  "clouds": {
  "all": 55
  },
  "wind": {
  "speed": 4.5,
  "deg": 220,
  "gust": 6.55
  },
  "visibility": 10000,
  "pop": 0.94,
  "rain": {
  "3h": 1.81
  },
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-12 03:00:00"
  },
  {
  "dt": 1660284000,
  "main": {
  "temp": 71.58,
  "feels_like": 72.72,
  "temp_min": 71.58,
  "temp_max": 71.58,
  "pressure": 1015,
  "sea_level": 1015,
  "grnd_level": 1003,
  "humidity": 91,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10n"
  }
  ],
  "clouds": {
  "all": 56
  },
  "wind": {
  "speed": 5.61,
  "deg": 227,
  "gust": 10.22
  },
  "visibility": 10000,
  "pop": 0.97,
  "rain": {
  "3h": 1.87
  },
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-12 06:00:00"
  },
  {
  "dt": 1660294800,
  "main": {
  "temp": 70.68,
  "feels_like": 71.82,
  "temp_min": 70.68,
  "temp_max": 70.68,
  "pressure": 1014,
  "sea_level": 1014,
  "grnd_level": 1002,
  "humidity": 93,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10n"
  }
  ],
  "clouds": {
  "all": 73
  },
  "wind": {
  "speed": 5.7,
  "deg": 246,
  "gust": 14.85
  },
  "visibility": 10000,
  "pop": 0.67,
  "rain": {
  "3h": 0.34
  },
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-12 09:00:00"
  },
  {
  "dt": 1660305600,
  "main": {
  "temp": 71.53,
  "feels_like": 72.66,
  "temp_min": 71.53,
  "temp_max": 71.53,
  "pressure": 1015,
  "sea_level": 1015,
  "grnd_level": 1003,
  "humidity": 91,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10d"
  }
  ],
  "clouds": {
  "all": 66
  },
  "wind": {
  "speed": 5.01,
  "deg": 27,
  "gust": 10.16
  },
  "visibility": 10000,
  "pop": 0.7,
  "rain": {
  "3h": 1.69
  },
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-12 12:00:00"
  },
  {
  "dt": 1660316400,
  "main": {
  "temp": 80.65,
  "feels_like": 80.78,
  "temp_min": 80.65,
  "temp_max": 80.65,
  "pressure": 1017,
  "sea_level": 1017,
  "grnd_level": 1005,
  "humidity": 44,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 98
  },
  "wind": {
  "speed": 11.12,
  "deg": 35,
  "gust": 13.91
  },
  "visibility": 10000,
  "pop": 0.05,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-12 15:00:00"
  },
  {
  "dt": 1660327200,
  "main": {
  "temp": 88,
  "feels_like": 86.49,
  "temp_min": 88,
  "temp_max": 88,
  "pressure": 1015,
  "sea_level": 1015,
  "grnd_level": 1004,
  "humidity": 34,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 802,
  "main": "Clouds",
  "description": "scattered clouds",
  "icon": "03d"
  }
  ],
  "clouds": {
  "all": 50
  },
  "wind": {
  "speed": 8.7,
  "deg": 34,
  "gust": 9.51
  },
  "visibility": 10000,
  "pop": 0.09,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-12 18:00:00"
  },
  {
  "dt": 1660338000,
  "main": {
  "temp": 80.85,
  "feels_like": 80.64,
  "temp_min": 80.85,
  "temp_max": 80.85,
  "pressure": 1016,
  "sea_level": 1016,
  "grnd_level": 1004,
  "humidity": 41,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 85
  },
  "wind": {
  "speed": 12.73,
  "deg": 8,
  "gust": 17.25
  },
  "visibility": 10000,
  "pop": 0.02,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-12 21:00:00"
  },
  {
  "dt": 1660348800,
  "main": {
  "temp": 73.87,
  "feels_like": 73.31,
  "temp_min": 73.87,
  "temp_max": 73.87,
  "pressure": 1016,
  "sea_level": 1016,
  "grnd_level": 1005,
  "humidity": 50,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 803,
  "main": "Clouds",
  "description": "broken clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 64
  },
  "wind": {
  "speed": 5.99,
  "deg": 37,
  "gust": 11.9
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-13 00:00:00"
  },
  {
  "dt": 1660359600,
  "main": {
  "temp": 70.57,
  "feels_like": 69.82,
  "temp_min": 70.57,
  "temp_max": 70.57,
  "pressure": 1017,
  "sea_level": 1017,
  "grnd_level": 1006,
  "humidity": 53,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01n"
  }
  ],
  "clouds": {
  "all": 2
  },
  "wind": {
  "speed": 5.41,
  "deg": 65,
  "gust": 11.34
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-13 03:00:00"
  },
  {
  "dt": 1660370400,
  "main": {
  "temp": 66.96,
  "feels_like": 65.98,
  "temp_min": 66.96,
  "temp_max": 66.96,
  "pressure": 1018,
  "sea_level": 1018,
  "grnd_level": 1006,
  "humidity": 56,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01n"
  }
  ],
  "clouds": {
  "all": 2
  },
  "wind": {
  "speed": 5.5,
  "deg": 43,
  "gust": 12.75
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-13 06:00:00"
  },
  {
  "dt": 1660381200,
  "main": {
  "temp": 64.92,
  "feels_like": 63.64,
  "temp_min": 64.92,
  "temp_max": 64.92,
  "pressure": 1018,
  "sea_level": 1018,
  "grnd_level": 1006,
  "humidity": 54,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01n"
  }
  ],
  "clouds": {
  "all": 0
  },
  "wind": {
  "speed": 5.41,
  "deg": 34,
  "gust": 8.39
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-13 09:00:00"
  },
  {
  "dt": 1660392000,
  "main": {
  "temp": 67.21,
  "feels_like": 65.88,
  "temp_min": 67.21,
  "temp_max": 67.21,
  "pressure": 1020,
  "sea_level": 1020,
  "grnd_level": 1008,
  "humidity": 48,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01d"
  }
  ],
  "clouds": {
  "all": 0
  },
  "wind": {
  "speed": 6.89,
  "deg": 29,
  "gust": 13.47
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-13 12:00:00"
  },
  {
  "dt": 1660402800,
  "main": {
  "temp": 80.13,
  "feels_like": 79.27,
  "temp_min": 80.13,
  "temp_max": 80.13,
  "pressure": 1020,
  "sea_level": 1020,
  "grnd_level": 1009,
  "humidity": 30,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01d"
  }
  ],
  "clouds": {
  "all": 2
  },
  "wind": {
  "speed": 7.31,
  "deg": 43,
  "gust": 9.35
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-13 15:00:00"
  },
  {
  "dt": 1660413600,
  "main": {
  "temp": 86.34,
  "feels_like": 83.5,
  "temp_min": 86.34,
  "temp_max": 86.34,
  "pressure": 1019,
  "sea_level": 1019,
  "grnd_level": 1008,
  "humidity": 25,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01d"
  }
  ],
  "clouds": {
  "all": 3
  },
  "wind": {
  "speed": 6.49,
  "deg": 28,
  "gust": 7.94
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-13 18:00:00"
  },
  {
  "dt": 1660424400,
  "main": {
  "temp": 87.46,
  "feels_like": 84.29,
  "temp_min": 87.46,
  "temp_max": 87.46,
  "pressure": 1017,
  "sea_level": 1017,
  "grnd_level": 1006,
  "humidity": 23,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01d"
  }
  ],
  "clouds": {
  "all": 1
  },
  "wind": {
  "speed": 5.01,
  "deg": 34,
  "gust": 5.23
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-13 21:00:00"
  },
  {
  "dt": 1660435200,
  "main": {
  "temp": 77.5,
  "feels_like": 76.55,
  "temp_min": 77.5,
  "temp_max": 77.5,
  "pressure": 1017,
  "sea_level": 1017,
  "grnd_level": 1006,
  "humidity": 34,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01d"
  }
  ],
  "clouds": {
  "all": 1
  },
  "wind": {
  "speed": 5.12,
  "deg": 80,
  "gust": 7.4
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-14 00:00:00"
  },
  {
  "dt": 1660446000,
  "main": {
  "temp": 70.7,
  "feels_like": 69.4,
  "temp_min": 70.7,
  "temp_max": 70.7,
  "pressure": 1018,
  "sea_level": 1018,
  "grnd_level": 1007,
  "humidity": 41,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01n"
  }
  ],
  "clouds": {
  "all": 0
  },
  "wind": {
  "speed": 6.31,
  "deg": 111,
  "gust": 13.15
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-14 03:00:00"
  },
  {
  "dt": 1660456800,
  "main": {
  "temp": 66.2,
  "feels_like": 64.87,
  "temp_min": 66.2,
  "temp_max": 66.2,
  "pressure": 1019,
  "sea_level": 1019,
  "grnd_level": 1007,
  "humidity": 50,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01n"
  }
  ],
  "clouds": {
  "all": 0
  },
  "wind": {
  "speed": 5.39,
  "deg": 155,
  "gust": 10.96
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-14 06:00:00"
  },
  {
  "dt": 1660467600,
  "main": {
  "temp": 64.53,
  "feels_like": 63.36,
  "temp_min": 64.53,
  "temp_max": 64.53,
  "pressure": 1018,
  "sea_level": 1018,
  "grnd_level": 1006,
  "humidity": 57,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01n"
  }
  ],
  "clouds": {
  "all": 0
  },
  "wind": {
  "speed": 4.99,
  "deg": 192,
  "gust": 7.52
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-14 09:00:00"
  },
  {
  "dt": 1660478400,
  "main": {
  "temp": 69.04,
  "feels_like": 68.47,
  "temp_min": 69.04,
  "temp_max": 69.04,
  "pressure": 1018,
  "sea_level": 1018,
  "grnd_level": 1007,
  "humidity": 60,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 800,
  "main": "Clear",
  "description": "clear sky",
  "icon": "01d"
  }
  ],
  "clouds": {
  "all": 2
  },
  "wind": {
  "speed": 5.48,
  "deg": 195,
  "gust": 10.58
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-14 12:00:00"
  },
  {
  "dt": 1660489200,
  "main": {
  "temp": 82.17,
  "feels_like": 81.72,
  "temp_min": 82.17,
  "temp_max": 82.17,
  "pressure": 1018,
  "sea_level": 1018,
  "grnd_level": 1007,
  "humidity": 41,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 803,
  "main": "Clouds",
  "description": "broken clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 60
  },
  "wind": {
  "speed": 7.72,
  "deg": 226,
  "gust": 10.47
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-14 15:00:00"
  },
  {
  "dt": 1660500000,
  "main": {
  "temp": 89.04,
  "feels_like": 87.04,
  "temp_min": 89.04,
  "temp_max": 89.04,
  "pressure": 1016,
  "sea_level": 1016,
  "grnd_level": 1005,
  "humidity": 31,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 803,
  "main": "Clouds",
  "description": "broken clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 72
  },
  "wind": {
  "speed": 8.19,
  "deg": 237,
  "gust": 9.98
  },
  "visibility": 10000,
  "pop": 0,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-14 18:00:00"
  },
  {
  "dt": 1660510800,
  "main": {
  "temp": 85.64,
  "feels_like": 84.83,
  "temp_min": 85.64,
  "temp_max": 85.64,
  "pressure": 1014,
  "sea_level": 1014,
  "grnd_level": 1003,
  "humidity": 39,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 100
  },
  "wind": {
  "speed": 6.62,
  "deg": 287,
  "gust": 10.85
  },
  "visibility": 10000,
  "pop": 0.12,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-14 21:00:00"
  },
  {
  "dt": 1660521600,
  "main": {
  "temp": 76.48,
  "feels_like": 76.46,
  "temp_min": 76.48,
  "temp_max": 76.48,
  "pressure": 1014,
  "sea_level": 1014,
  "grnd_level": 1003,
  "humidity": 56,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04d"
  }
  ],
  "clouds": {
  "all": 100
  },
  "wind": {
  "speed": 2.33,
  "deg": 32,
  "gust": 3.29
  },
  "visibility": 10000,
  "pop": 0.17,
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-15 00:00:00"
  },
  {
  "dt": 1660532400,
  "main": {
  "temp": 76.46,
  "feels_like": 76.24,
  "temp_min": 76.46,
  "temp_max": 76.46,
  "pressure": 1015,
  "sea_level": 1015,
  "grnd_level": 1003,
  "humidity": 52,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04n"
  }
  ],
  "clouds": {
  "all": 97
  },
  "wind": {
  "speed": 7.87,
  "deg": 165,
  "gust": 16.8
  },
  "visibility": 10000,
  "pop": 0.25,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-15 03:00:00"
  },
  {
  "dt": 1660543200,
  "main": {
  "temp": 74.23,
  "feels_like": 73.65,
  "temp_min": 74.23,
  "temp_max": 74.23,
  "pressure": 1014,
  "sea_level": 1014,
  "grnd_level": 1002,
  "humidity": 49,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04n"
  }
  ],
  "clouds": {
  "all": 97
  },
  "wind": {
  "speed": 11.05,
  "deg": 205,
  "gust": 28.74
  },
  "visibility": 10000,
  "pop": 0.22,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-15 06:00:00"
  },
  {
  "dt": 1660554000,
  "main": {
  "temp": 72.59,
  "feels_like": 71.85,
  "temp_min": 72.59,
  "temp_max": 72.59,
  "pressure": 1013,
  "sea_level": 1013,
  "grnd_level": 1001,
  "humidity": 49,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 804,
  "main": "Clouds",
  "description": "overcast clouds",
  "icon": "04n"
  }
  ],
  "clouds": {
  "all": 100
  },
  "wind": {
  "speed": 9.71,
  "deg": 216,
  "gust": 29.42
  },
  "visibility": 10000,
  "pop": 0.22,
  "sys": {
  "pod": "n"
  },
  "dt_txt": "2022-08-15 09:00:00"
  },
  {
  "dt": 1660564800,
  "main": {
  "temp": 72.32,
  "feels_like": 72.03,
  "temp_min": 72.32,
  "temp_max": 72.32,
  "pressure": 1013,
  "sea_level": 1013,
  "grnd_level": 1001,
  "humidity": 59,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10d"
  }
  ],
  "clouds": {
  "all": 100
  },
  "wind": {
  "speed": 10.58,
  "deg": 216,
  "gust": 30.96
  },
  "visibility": 10000,
  "pop": 0.36,
  "rain": {
  "3h": 0.15
  },
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-15 12:00:00"
  },
  {
  "dt": 1660575600,
  "main": {
  "temp": 74.08,
  "feels_like": 74.3,
  "temp_min": 74.08,
  "temp_max": 74.08,
  "pressure": 1012,
  "sea_level": 1012,
  "grnd_level": 1000,
  "humidity": 66,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 500,
  "main": "Rain",
  "description": "light rain",
  "icon": "10d"
  }
  ],
  "clouds": {
  "all": 100
  },
  "wind": {
  "speed": 11.01,
  "deg": 226,
  "gust": 27.58
  },
  "visibility": 10000,
  "pop": 0.87,
  "rain": {
  "3h": 0.7
  },
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-15 15:00:00"
  },
  {
  "dt": 1660586400,
  "main": {
  "temp": 77.79,
  "feels_like": 78.57,
  "temp_min": 77.79,
  "temp_max": 77.79,
  "pressure": 1011,
  "sea_level": 1011,
  "grnd_level": 999,
  "humidity": 70,
  "temp_kf": 0
  },
  "weather": [
  {
  "id": 501,
  "main": "Rain",
  "description": "moderate rain",
  "icon": "10d"
  }
  ],
  "clouds": {
  "all": 95
  },
  "wind": {
  "speed": 1.57,
  "deg": 235,
  "gust": 9.04
  },
  "visibility": 10000,
  "pop": 0.98,
  "rain": {
  "3h": 4.34
  },
  "sys": {
  "pod": "d"
  },
  "dt_txt": "2022-08-15 18:00:00"
  }
  ],
  "city": {}
  }

$('.search').on('click', function(){
  let searchBar = document.getElementById('search-query')
  let search = $('#search-query').val()
  // fetchLocation(search)
  searchBar.value = ''
  renderCurrentForecast(STATIC_WEATHER)
  // renderFiveDayForecast(STATIC_FIVE_DAY_WEATHER.list)
  collateFiveDayData(STATIC_FIVE_DAY_WEATHER.list)
})


let fetchLocation = function(query){
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${API_KEY}`,
    dataType: "json",
    success: function(data){
      
      let latitude = data[0].lat
      let longitude = data[0].lon
      
      // fetchFiveDayForecast(latitude, longitude)
      fetchCurrentForecast(latitude, longitude)
      
    },
    error: function(textStatus){
      console.log(textStatus)
    }
  })
  
}
let fetchFiveDayForecast = function(lat,lon){
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    dataType: 'json',
    success: function(data){
      console.log(data)
    },
    error: function(textStatus){
      console.log(textStatus)
    }
  })
}
let fetchCurrentForecast = function(lat, lon){
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
    dataType: 'json',
    success: function(data){
      // console.log(data)
      renderCurrentForecast(data)
    },
    error: function(textStatus){
      console.log(textStatus)
    }
  })
}

let renderCurrentForecast = function(weatherData){
  $('.currentWeather').empty()
  let currentWeatherObj = {
    currentForecastDegrees:  weatherData.main.temp,
    currentForecastCity: weatherData.name,
    currentForecastCondition: weatherData.weather[0].description,
    currentForecastIcon: weatherData.weather[0].icon
  }

  let source = $('#current-forecast-template').html()
  let template = Handlebars.compile(source)
  let newHTML = template(currentWeatherObj)
  $('.currentWeather').append(newHTML)
}

let renderFiveDayForecast = function(fiveDayArray){
  $('.fiveDayWeather').empty()
  let week = []
  
  fiveDayArray.forEach(day => {
    let highs = []
    let lows = []
    
    for (let i = 0; i < day.length; i++) {
      const element = day[i];
      highs.push(element.fiveDayForecastHigh)
      lows.push(element.fiveDayForecastLow)
      var singleDayOfFiveForecast = {
        fiveDayForecastCondition: element.fivedayForecastCondition,
        fiveDayForecastIcon: element.fiveDayForecastIcon,
        fiveDayForecastDay: element.fiveDayForecastDay,
        fiveDayForecastHigh: element.fiveDayForecastHigh,
        fiveDayForecastLow: element.fiveDayForecastLow
      }
      
      let high = highs.sort().reverse()
      let low = lows.sort()
      singleDayOfFiveForecast.fiveDayForecastHigh = high[0]
      singleDayOfFiveForecast.fiveDayForecastLow = low[0]
    }

    week.push(singleDayOfFiveForecast)
  })
  week.forEach(day=>{

    
    let source = $('#five-day-forecast-template').html()
    let template = Handlebars.compile(source)
    let newHTML = template(day)
    $('.fiveDayWeather').append(newHTML)
  })
  

}

let convertTime = function(utc){
  miliUtc = utc*1000
  let dayNum = parseInt(new Date(miliUtc).toLocaleString("en-US", {day: "numeric"}))
  let weekDay = new Date(miliUtc).toLocaleString("en-US", {weekday: "long"})
  return([dayNum, weekDay])
}

let collateFiveDayData = function(fiveDayData){
  let fiveDayWeatherObj = [[],[],[],[],[]]
  let today = (new Date().toLocaleString('en-US', {day:"numeric"}))
  let tomorrow = parseInt(today)
  for (let i = 0; i < fiveDayData.length; i++) {
    const element = fiveDayData[i];
    let daysOut = convertTime(element.dt)[0] - tomorrow
    if(daysOut >= 0){

      fiveDayWeatherObj[daysOut].push({
        fivedayForecastCondition: element.weather[0].description,
        fiveDayForecastHigh: element.main.temp_max,
        fiveDayForecastLow: element.main.temp_min,
        fiveDayForecastIcon: element.weather[0].icon,
        fiveDayForecastDay: convertTime(element.dt)[1]
        
      })
      
    }
    
  }
  // console.log(fiveDayWeatherObj)
  renderFiveDayForecast(fiveDayWeatherObj)
  
}



// collateFiveDayData(STATIC_FIVE_DAY_WEATHER.list)
// renderCurrentForecast(STATIC_WEATHER)
// convertTime(1660165200)