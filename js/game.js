// game
function removeAry(ary,index){
	ary.indexOf(index);
	var a = (index > -1) ? ary.splice(index,1) : false;
	return a;
}

function removeObjectArray(myArray, pointer, item){
	for( i=myArray.length-1; i>=0; i--) {
	    if( myArray[i][pointer] == item) myArray.splice(i,1);
	}
}

function swapElement(array, indexA, indexB) {
	var tmp = array[indexA];
	array[indexA] = array[indexB];
	array[indexB] = tmp;
}

function locateObjectArray(myArray, pointer, item){
	for( i=myArray.length-1; i>=0; i--) {
	    if( myArray[i][pointer] == item) return {details:myArray[i], key: i};
	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function animate(classes, elm, speed){
	elm.classList.add(classes);
	setTimeout(function(){ 
		elm.classList.remove(classes);
	}.bind(this), speed)
}

var Timer = {
    timeInt: {},
    start: function(duration, display, fn) {
    	var n = Math.floor((Math.random() * duration) + 1);
    	display.id = n;
    	var timer = duration;
        this.timeInt[n] = setInterval(function() {
	        minutes = parseInt(timer / 60, 10)
	        seconds = parseInt(timer % 60, 10);

	        minutes = minutes < 10 ? "0" + minutes : minutes;
	        seconds = seconds < 10 ? "0" + seconds : seconds;

	        display.textContent = minutes + ":" + seconds;
	        if(minutes == 0 && seconds == 0){
	        	Timer.stop(display);
	        	fn();
	        }

	        if (--timer < 0) {
	            timer = duration;
	        }
        }, 1000);
    },
    stop: function(display) {
        window.clearTimeout(this.timeInt[display]);
        delete this.timeInt[display];
    }
};

Workout.build.getRandomizer = function(bottom, top) {
    return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

Workout.build.generate = function(result){
	var output, part, rules = null;
	var c = result.length;
	var parts = JSON.parse(Workout.build.data);
	var rules = {};
	var output = {};
	switch (c) {
	    case 5:
	        rules.exc = 2;
	        rules.compound = 0;
	        rules.isolation = 2;
	        break;
	    case 4:
	        rules.exc = 2;
	        rules.compound = 2;
	        rules.isolation = 1;
	    	break;
	    case 3:
	        rules.exc = 2;
	        rules.compound = 1;
	        rules.isolation = 1;
	    	break;
	    case 2:
	        rules.exc = 3;
	        rules.compound = 2;
	        rules.isolation = 1;
	    	break;
	    case 1:
	        rules.exc = 7;
	        rules.compound = 2;
	        rules.isolation = 4;
	    	break;
	}

	for(i=0; i<=result.length - 1; i++){
		output[result[i]] = {};
		output[result[i]]["exc"] = [];
		var part = parts[result[i]]; // list-shoulder > c - i
		output[result[i]]["style"] = parts[result[i]]["style"];
		//compond 
		for(var j=0; j<=rules.compound - 1; j++){
			var r = Workout.build.getRandomizer(0, part.compound.length - 1); 
			output[result[i]]["exc"].push(part.compound[r]);
			removeAry(part.compound ,r);
		}
		
		//isolation
		for(var e=0; e<=rules.isolation - 1; e++){
			var r = Workout.build.getRandomizer(0, part.isolation.length - 1); 
			output[result[i]]["exc"].push(part.isolation[r]);
			removeAry(part.isolation ,r);
		}

	}
	return output;
}