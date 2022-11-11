 //WEATHER API HERE

//Global variables
var WEATHER_API_URL = 'https://api.openweathermap.org';
var WEATHER_API_KEY = 'd91f911bcf2c0f925fb6535547a5ddc9';

var searchButton = document.getElementById('search');
var recentLocations = [];

console.log(recentLocations)

//takes location name from user input 
var getLocation = () => {

  var locationInput = document.getElementById('location')
  var userLocation = locationInput.value;
  console.log("saved locations", userLocation)

  lookupLocation(userLocation);
  addLocation(userLocation);

}

//stores searched location to localStorage
var addLocation = (selectedLocation) => {
  recentLocations.push(selectedLocation);
  console.log(recentLocations)

  localStorage.setItem("recentLocations", JSON.stringify(recentLocations));
}

//fetch the lon,lat data from LocationInput
var lookupLocation = (search) => {
  var apiURL = `${WEATHER_API_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;
  fetch(apiURL)
      .then(response => response.json())
      .then(data => {

      var location = data[0];
      displayWeather(location)

      console.log(location);
  })
};

//displays location name
var displayWeather = (weatherData) => {
  document.getElementById('location-name').textContent = (weatherData.name) + ', '+ (weatherData.state)
  getWeather(weatherData.lat, weatherData.lon)
};

//fetch data for location from API
var getWeather = (lat, lon) => {
  var apiUrl = `${WEATHER_API_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          console.log('Weather Data', data)

        const main = data.current.weather[0].main
        console.log(main)
        //replaces troublesome search terms
        if(main == 'clouds') {
          youtubeAPI('cloudy+mood')
        }

        if(main == 'clear skies') {
          youtubeAPI('cloudy+mood')
        }
        
        displayCurrent(data);
        //calls the youtubeAPI function with weather description search term
        youtubeAPI(main)          
      })
}

// fetches the individual values for weather metrics
var displayCurrent = (weatherData) => {

  var currentData = weatherData.current

    //icon data from API
    var iconCode = currentData.weather[0].icon;
    var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

  var temp = Math.floor((currentData.temp - 32) * 5 / 9)

  //var temp = currentData.temp
  var windSpeed = currentData.wind_speed
  var humidity = currentData.humidity;
  var weatherDesc = currentData.weather[0].description; 
  console.log("description:", weatherDesc)


  var weatherIcon = document.getElementById('weather-icon');
  weatherIcon.innerHTML = `<img src="${iconURL}" alt="${weatherDesc}"></img>`
  
  //weather description data
  document.getElementById('desc').textContent = weatherDesc
  
  document.getElementById('temp-value').textContent = temp + ' °C'
  document.getElementById('wind-value').textContent = windSpeed + ' mph'
  document.getElementById('humid-value').textContent = humidity + ' %'
  }
  
searchButton.addEventListener('click', getLocation);
//WEATHER API END


//YOUTUBE API HERE//
const API_URL = 'https://www.googleapis.com/youtube/v3'
const API_KEY = 'AIzaSyBrcSLe2BDt-9iUh6lzXLy1Ncg17_sLdX4'


var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

var player;
var videoId = '';


function youtubeAPI(description) {

  var apiURL = `${API_URL}/search?key=${API_KEY}&type=video&part=snippet&q=${description}+weather+music`

  fetch(apiURL)
    .then(response => response.json())
    .then(result => loadYoutubeVideo(result))
    .catch(error => console.log('error', error));

  function loadYoutubeVideo(result) {
    console.log("DATA", result)


    //generates a random number
    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    videoID = result.items[random(0,4)].id.videoId
    console.log(videoID)

    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  }
}

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
function onYouTubeIframeAPIReady() {
  console.log('onYouTubeIframeAPIReady')
  player = new YT.Player('player', {
    height: '350',
    width: '574',
    videoId: videoID,
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}


// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}

//YOUTUBE API END