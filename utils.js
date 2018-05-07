function FormatTime(timeStamp){
	this.time = new Date(timeStamp);
};

FormatTime.prototype.getDayName = function(timeStamp){
	let time = new Date(timeStamp),
		days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	return days[ time.getDay() ];
};

const formatTime = new FormatTime();
