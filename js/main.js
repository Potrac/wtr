var opts = {
  lines: 9, // The number of lines to draw
  length: 18, // The length of each line
  width: 8, // The line thickness
  radius: 22, // The radius of the inner circle
  corners: 0.9, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb
  speed: 1.4, // Rounds per second
  trail: 50, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 150, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
var target = document.getElementById('load');
var spinner = new Spinner(opts).spin(target);

(function($){
	$('html').removeClass('no-js').addClass('js');
	var app = $('#app'),
		coords = new Array(),
		loader = $('#load');

	function getLocation()
	{
		if (navigator.geolocation){
		 	navigator.geolocation.getCurrentPosition(showPosition);
		}
		else{app.innerHTML="La géolocation n'est pas supportée par votre navigateur";}
	}

	function showPosition(position){
		
		var	pos = [position.coords.latitude, position.coords.longitude];

		url = 'http://api.worldweatheronline.com/free/v1/weather.ashx?q='
		+pos[0]+
		'+'
		+pos[1]+
		'&format=json&num_of_days=2&includelocation=yes&key=rsdb67zhy9gg2tga5k53faad'; 
		
		//Get the json
		$.getJSON(url + '&callback=?', function(json){
			var data = json.data;

			//Set the json's data
			var temp_c = data.current_condition[0].temp_C,
				cloud = data.current_condition[0].cloudcover,
				humidity = data.current_condition[0].humidity,
				obs_t = data.current_condition[0].observation_time,
				windKMH = data.current_condition[0].windspeedKmph,
				iconDflt = data.current_condition[0].weatherIconUrl[0].value
				whereCi = data.nearest_area[0].areaName[0].value,
				whereCo = data.nearest_area[0].country[0].value,
				wtrCode = data.current_condition[0].weatherCode;
			
			//Load the correct icon
			var iconLoaded = '';
			function icon(code){

				if(code == '395' || code == '392' 
				|| code == '389' || code == '386'
				|| code == '200')
				{iconLoaded='climacon lightning';}

				if(code == '377' || code == '374'
				|| code == '365' || code == '362'
				|| code == '350' || code == '320'
				|| code == '317' || code == '182')
				{iconLoaded='climacon hail';}

				if(code == '371'|| code == '368' 
				|| code == '338' || code == '335'
				|| code == '332' || code == '329' 
				|| code == '326' || code == '323'
				|| code == '227' || code == '179')
				{iconLoaded='climacon flurries';}
				
				if(code == '359' || code == '356'
				|| code == '353' || code == '314'
				|| code == '311' || code == '308'
				|| code == '305' || code == '302'
				|| code == '299' || code == '296'
				|| code == '293' || code == '176')
				{iconLoaded='climacon rain';}

				if(code == '284' || code == '281' 
				|| code == '266' || code == '260'
				|| code == '248' || code == '230'
				|| code == '185' || code == '143')
				{iconLoaded='climacon haze';}	

				if(code == '122'){iconLoaded='climacon cloud';}

				if(code == '116'){iconLoaded='climacon cloud sun';}

				if(code == '113'){iconLoaded='climacon sun';}

				return iconLoaded;
			};	
			icon(wtrCode);

			//Next days
			var nextL = json.data.weather.length,
				nextUl = $('#tmrw'),
				d = new Date,
				today = d.getDay();

			for(var i in json.data.weather){
				var days = ['Mon.', 'Tues.','Wed.','Thurs.','Fri.','Sat.','Sun.'],
					day = json.data.weather[i],
					tMax = day.tempMaxC,
					tMin = day.tempMinC,
					wtr = day.weatherCode;

				icon(wtr);
				today++;
				nextUl.append('<li class="nextItem"><p class="day">'+ days[today-1] +'</p><p class="'+ iconLoaded +'"></p><span class="nextT">Max. </span><span>'+ tMax +'°c</span> | <span class="nextT">Min. </span><span>'+ tMin +'°c</span></li>');
			}

			//Change title
			document.title = whereCi + ' | Wet-hour';
			
			//Define the app's var
			var appIcon = $('#weather'),
				appTemp = $('#temp'),
				appLoc = $('#loc'),
				appWindS = $('#windS'),
				appCloudCover = $('#cloudCover'),
				appHumidity = $('#humidity'),
				appTime = $('#sub');

			//Set the app !
			appIcon.addClass(iconLoaded);
			appTime.text('at ' + obs_t);
			appTemp.text(temp_c + '°c');
			appWindS.text(windKMH + ' km/h');
			appCloudCover.text(cloud + '%');
			appHumidity.text(humidity + '%');
			appLoc.text(whereCi +', '+ whereCo);

			//Hide the loader and display the app
			loader.fadeOut(400);
			$('body').addClass('loaded');

		});

	}
	
	getLocation();

})(jQuery);
