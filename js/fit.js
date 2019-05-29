// Fit.js javascript || global Object!!
var Workout = Workout || {};

//document ready function - run
Workout.init = {
	config: {
		page: "home", // page for the app
		keys: [], // so home, workout, pro, timer
		appPages: false,
		date: ""
	},
	loadJsonFiles: function(){
		// Workouts in a list json file
		Workout.common.getJson("json/workout-data.json", function(e){
			Workout.build.data = e.response;
		});

		// template file
		Workout.common.getJson("json/template.json", function(e){
			Workout.init.template = e.response;
		});

		//create flash message - and load pages.json file
		Workout.init.getPageData(function(data){
			for (var i=0; i<data.pages.length; i++) {
				var page = data.pages[i];
				if(page.notify){
					Create.flash(0,false, page.notify.msg, page.notify.color, document.querySelector("#"+page.name));
				}
			};
		});

		// load navigation file and create side navigation
		Workout.common.getJson("json/sideNav.json", function(e){
			Workout.init.buildNav(e.response);
			document.querySelector("."+Workout.init.config.page).classList.add("active");
		});

	}, 
	docReady: function(event) { 
		//get todays date
		Workout.init.date();

		//set audio file
		Workout.media.init("/android_asset/www/tick.ogg");

		// load all Json files needed
		Workout.init.loadJsonFiles();
		
		// create timer for timer page 
		Create.timer("#timer","1","30",true);

		//unhide the main page visable to the user 
		Workout.common.sc("show", Workout.init.config.page, false);

		//load the bottom navigation
		Workout.bottomNav.display(Workout.init.config.page);

		//load all content within the my-workous
		Create.myWorkouts();

		// Sets the main events for the applicaiton 
		setEvents(event);
	},
	buildNav: function(e){
		this.config.nav = JSON.parse(e);
		for (var i=0; i<Workout.init.config["nav"].nav.length; i++) {
			var nav = Workout.init.config.nav.nav[i];
			Create.nav(nav.name, nav.title, nav.active, nav.hide);
		};
	},
	getPageData: function(fn){
		if(this.config.appPages){
			return fn(Workout.init.config.appPages);
		}else{
			Workout.common.getJson("json/app-pages.json", function(e){
				Workout.init.config.appPages = JSON.parse(e.response);
				if(!Workout.init.config.keys[0]){
					for (var i=0; i<Workout.init.config.appPages.pages.length; i++) {
						Workout.init.config.keys.push(Workout.init.config.appPages.pages[i].name);
					}
				}
				fn(Workout.init.config.appPages);
			});
		}
	},
	date: function(){
		var today = new Date();
		today = today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear();
		this.config.date = today;
		return today;
	}
};

// builds workout page 
Workout.build = {
	data: {}, // workout json list information - don't change - string
	result: {}, // random generated workout 
	page: false, // workout elements page 
	create: function (){
		this.result = this.generate(Workout.list.data);
		this.page = Create.workoutPage(Workout.list.data, this.result);
	},
	display: function(){
		document.body.appendChild(this.page);
	}
};


// common javascript functions
Workout.common = {
	addEvent: function(target, option, fn){
		((typeof target) == "string") ? document.getElementById(target).addEventListener(option, fn) : target.addEventListener(option, fn);
	},
	sc: function(action, target, bool, speed){
		var bool = (typeof bool !== 'undefined') ?  bool : true;
		var fade = (action == "show") ? "fadeIn" : "fadeOut";
		var display = (action == "show") ? "block" : "none";

		if(typeof target === 'string'){
			var target = document.getElementById(target);
		}

		if(bool){
			Velocity(target, "stop", true);
			if(speed){
				Velocity(target, fade, {duration: speed});
			}else{
				Velocity(target, fade, {duration: 350});
			}
			
		}else{
			target.style.display = display;
		}
	},
	getJson: function(file, callback, error) {   
	    var request = new XMLHttpRequest();
	    var bool = false;
	    request.overrideMimeType("application/json");
	    request.open('GET', file, true); 
	    request.onload = function () {
	          if (request.readyState == 4 && request.status == "200" || (request.responseURL.indexOf("file://") > -1)) {
	           if(callback){
	            callback(request);
	           }else{
	            console.log("callback needed");
	           }
	          }else{
	            (error) ? error(request) : console.log("We reached our target server, but it returned an error" + " status:"+request.status);
	          }
	    };

	    request.onerror = function() {
	        (error) ? error(request) : console.log("There was a connection error of some sort"+ " status:"+request.status);
	    };

	    request.send(null);
	    return request;
	},
	checkFileName: function(string){
	 	var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-="
	    for(i = 0; i < specialChars.length;i++){
	        if(string.indexOf(specialChars[i]) > -1){
	            return false;
	        }
	    }
	    return string;
	}
};

// sound events
Workout.media = {
	playing: false,
	myMedia: "",
	init: function(file){
		// this.myMedia =  new Media(file);
		// this.myMedia.setStreamType = "notification";
	},
	play: function(){
		// this.myMedia.setVolume(0.3);
		// if (this.playing) {
		// 	this.myMedia.stop(); 
		// }
		// this.myMedia.play(); 
	}
};

// changes page and hold the current page name 
Workout.page = {
	view:  Workout.init.config.page,
	next: function(page, next){
		this.view = next;
		Workout.common.sc("close", page);
		Workout.common.sc("show", next);
		Workout.bottomNav.display(next);

		if(this.view == "home"){
			document.getElementById("nav-menu").querySelector("p").innerHTML = "WORKOUTS TO <strong>GO</strong>"
		}else{
			document.getElementById("nav-menu").querySelector("p").innerHTML = this.view.toUpperCase();
		}
	}
};

function closeNameTab(){
	Workout.common.sc("close","nameCover");
	document.getElementById("bottom-nav").classList.remove("bottom-overide");	
	document.body.classList.remove('noscroll');
}

// holds the list data titles 
// clears list titles 
// runs the workout through build every list click
Workout.list = {
	data: [], // this holds the list titles 
	currentWorkout: {"not":"empty"}, // get the current workout 
	clear: function(){
		var data = this.data;
		setTimeout(function(){
			for(x=0;x<data.length;x++){
				var elm = document.getElementById(data[x]);
				if(elm){
					elm.classList.remove("workout-li-click");
					elm.children[0].classList.remove("tick-icon");
					elm.children[0].classList.add("x-icon");
				}
			}
		}, 300);
		this.currentWorkout =  {"pointers": this.data, "results": Workout.build.result};
		this.data = [];
	},
	add:function(value){
	  this.data.push(value);
	  Workout.build.create();
	},
	remove: function(value){
	    if(this.data != ""){
	      var i = this.data.indexOf(value);
	      (i > -1) ? this.data.splice(i, 1) : null;
	      Workout.build.create();
	    }
	},
	saveWorkout: function(workout, name, order){
		var workout = (workout) ? workout : this.currentWorkout;
		// flie api save
		workout["type"] = order;
		var fileName = Workout.init.config.date + "," +  name + ".json";
		Workout.File.writeToFile(Workout.File.config.appRoot+"Workouts/personal", fileName, workout);
		Create.flash(4000,"my-workouts","Workout Saved!", "dark-green", "#"+Workout.page.view, "fixed-top");	
		// run phone gap file api functions
		Workout.common.sc("close", "option");
		closeNameTab();
		this.currentWorkout = {};
	}
}

// sets all the magor events and click events
function setEvents(e){

	var close = document.getElementById('side-close');
	var sideNav = document.getElementById('side-nav');

	var mc = new Hammer(document.body, {
	    touchAction: 'pan-y'
	});
	mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

	mc.on("swiperight", function () { 
		var element = document.getElementById("nav-open");
		var event = new Event('click', { bubbles: false });
		element.dispatchEvent(event);
	}); 
	mc.on("swipeleft", function () { 
		close.click("fast");
	});

	// body event
	Workout.common.addEvent(document,"click", function(e){
		if(Workout.page.view == "build-Workout"){
			if(!((e.target.parentElement  != null) ? e.target.parentElement.classList.contains("dropdown-content") : false)){
				var menus = document.querySelectorAll(".dropdown-content");
				for(var i=0; i < menus.length; i++ ){
					menus[i].style.display = "none";
				}
			}
		}
	}.bind(this));

	// list click events - changes the tick and borser added to the workout list
	Workout.common.addEvent("workout-list","click", function(e){
		Workout.media.play();
		if(e.target && e.target.nodeName == "LI" || e.target.nodeName == "SPAN" || e.target.nodeName == "P") {
		    var elm = (e.target.nodeName == "LI") ? e.target : e.target.parentElement;
		    var classList = elm.children[0].classList;
		    var x = (classList.contains("x-icon"));
		    (x) ? (elm.classList.add("workout-li-click")) : (elm.classList.remove("workout-li-click"));
		    (x) ? (Workout.list.add(elm.id) || classList.remove("x-icon") || classList.add("tick-icon"))  : (Workout.list.remove(elm.id) || classList.add("x-icon") || classList.remove("tick-icon"));
		}
	});
	
	// start button
	Workout.common.addEvent("start", "click", function(e){
		Workout.media.play();
		if(Workout.list.data.length == 0){
			alert("try again");
		}else{	
			if(elm = document.getElementById("workout")){
				elm.remove();
			}
			Workout.build.display();
			document.querySelector("."+Workout.page.view).classList.remove("active");
			var elm = document.querySelector(".workout");
			elm.classList.add("active");
			elm.classList.remove("hide");
			Workout.list.clear();
			Workout.page.next(Workout.page.view, "workout");
		}
	});

	// opens the navigation on top left
	Workout.common.addEvent("nav-open", "click", function(e, bubbles){
		var speed = (e.bubbles) ? 350 : 300;
		Workout.media.play();
		Workout.common.sc("show", close);
		Velocity(sideNav, {marginLeft: "0%",}, {duration: speed});
	});

	//side navigation on click
	close.addEventListener("click", function(e){
		Workout.media.play();
		Velocity(close, "stop", true);
		Velocity(sideNav, "stop", true);

		if(e.target.id == "side-close"){
			Workout.common.sc("close", close);
			Velocity(sideNav, {marginLeft: "-70%",}, {duration: 350});
		}

		if(e.target.nodeName == "A"  || e.target.nodeName == "SPAN" || e.target.nodeName == "LI"){
			next = (e.target.nodeName == "LI") ? e.target.classList[0] : e.target.parentElement.classList[0];
			var page = Workout.page.view;

			if(page != next){
				(e.target.nodeName == "LI") ? e.target.classList.add("active") : e.target.parentElement.classList.add("active");

				if(document.querySelector("."+page)){
					document.querySelector("."+page).classList.remove("active");
				}
				
				Workout.common.sc("close", close);
				Velocity(sideNav, {marginLeft: "-70%",}, {duration: 350});
				Workout.page.next(page, next);
			}else{
				Workout.common.sc("close", close);
				Workout.page.next(page, page);
				Velocity(sideNav, {marginLeft: "-70%",}, {duration: 350});
			}
		}
	});

	//name input box hide
	Workout.common.addEvent("nameCover","click", function(e){
		Workout.media.play();
		if(e.target.classList.contains("x-white-icon") || e.target.classList.contains("white-box")) {
			closeNameTab();
		}
	});
			
	// bottom nav click event
	Workout.common.addEvent("option","click", function(){
		Workout.media.play();							
		// css effect
		var elm = this;
		this.classList.add('tap');
		setTimeout(function(){elm.classList.remove('tap');}, 300);
		
		switch(Workout.page.view){
			case "build-Workout":

				Workout.common.sc("show", document.getElementById("workoutType"), false); 
				Workout.bottomNav[Workout.bottomNav.pageObject.elements.bottomNav.action](false);
				break;
			case "workout":
				var nameCover = document.getElementById("nameCover");
				Workout.common.sc("hide", document.getElementById("workoutType"), false); 		
				if(nameCover.style.display == "none"){
					Workout.common.sc("show", nameCover); 					
					document.body.classList.add('noscroll');
					document.getElementById("bottom-nav").classList.add("bottom-overide");			
					//document.getElementById("workoutName").focus();
				}else{
					var val = Workout.common.checkFileName(document.getElementById("workoutName").value.trim());
					if(val == ""){
						alert("input a value!");
					}else{
						Workout.list[Workout.bottomNav.pageObject.elements.bottomNav.action](nameCover.value, val, "grouped");	
						document.getElementById("workoutName").value = "";
					}
				}			
				break;
			default:
				Workout.bottomNav[Workout.bottomNav.pageObject.elements.bottomNav.action](this);
		}

	});

}

//document.addEventListener('deviceready', Workout.init.docReady, false);
document.addEventListener('DOMContentLoaded', Workout.init.docReady, false);

Workout.bottomNav = {
	pageObject: {},
	display: function(page){
		// figure out what page and what allows the bottom nav
		// this is all defined in app-pages
		Workout.init.getPageData(function(app){
			Workout.bottomNav.pageObject = app.pages[Workout.init.config.keys.indexOf(Workout.page.view)];
			var nav = document.getElementById("bottom-nav");
			nav.style.display = "none";
			var option = document.getElementById("option");
			if(Workout.bottomNav.pageObject.elements.bottomNav){
				var display = true;
				if(Workout.page.view == "workout"){
					if(isEmpty(Workout.list.currentWorkout)){
						Workout.bottomNav.hideNav(option);
					}else{
						Workout.bottomNav.displayNav(option);
					}
				}else{
					Workout.bottomNav.displayNav(option);
				}

				var i = 1;
				// check for icon to swap
				if (option.classList.contains("tap")) i = 2;

				var rm = option.classList[option.classList.length-i];
				option.classList.remove(rm);
				option.classList.add(Workout.bottomNav.pageObject.elements.bottomNav.icon+"-icon");
				
				//display bottom nav
				nav.style.display = "block";
				
			}
		});
	},
	addTimer: function(elm){
		window.location.hash = "";
		window.location.hash = '#' + Create.timer("#timer","1","30",true).id;
	},
	hideNav: function(option){
		if(!option){
			var option = document.getElementById("option");
		}
		option.style.opacity = 0;
		option.style.display = "none";
	},
	addWorkout: function(bool){
		var elm = document.querySelector(".build-Workout");
		var instance = Create.workoutBuilder(document.getElementById("build-Workout"));
		if(bool){	// always true unless build-workout page
			//	create page
			elm.classList.remove("hide");
			elm.click();
		}else{ // time to save
			var errors = 0;
			// destroy page 
			// save workout 
			// hide nav
			var errors = instance.save();
			if(errors == 0){
				instance.destroy();
				elm.classList.add("hide");
				document.querySelector(".my-workouts").click();
			}else if(errors == 1){
				alert("there was a problem");
			}
		}
	},
	displayNav: function(option){
		if(!option){
			var option = document.getElementById("option");
		}
		option.style.opacity = 1;
		option.style.display = "block";
	}
}