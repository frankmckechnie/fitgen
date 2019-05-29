// function for creating elements
var Create = Create || {};
 
var Create = {
	createELm: function(title,id,elm,clas,target){
		var elm = document.createElement(elm);
		(id) ? elm.setAttribute('id', id) : null; 
		var classes = "";
		for(i in clas){
			classes = classes + " " + clas[i];
		}
		elm.setAttribute('class', classes); 
		if(title) {elm.innerText = title}
		if(target != false){	
			((typeof target) == "string") ? document.querySelector(target).appendChild(elm) : target.appendChild(elm);
		}
	  	return elm;
	},
	myWorkouts: function(){
		var page = this.createELm(false, "my-workouts", "div", ["wrap-nav","noselect"], false);
		
		var suggested = this.createELm(false, false, "div", ["section"], page);
		suggested.style.backgroundColor = "#aaeac5";
		// changes the sectionHide
		var sHeader = this.createELm("Suggested Workouts", false, "H3", [], suggested);
		Workout.common.addEvent(sHeader, "click", function(e){
			if(this.parentElement.classList.contains("sectionHide")){
				this.parentElement.classList.remove("sectionHide");
				this.parentElement.classList.add("section");
			}else{
				this.parentElement.classList.add("sectionHide");
				this.parentElement.classList.remove("section");
			}
		});
		var sSpan = this.createELm(false, false, "SPAN", ["download-icon","block","large-icon"], sHeader);
		var sList = this.createELm(false, "suggested", "UL", ["my-workouts"], suggested);
		this.workoutCard(sList, "No workouts");

		var personal = this.createELm(false, false, "div", ["section"], page);
		personal.style.backgroundColor = "#ddf1ff";
		// changes the sectionHide
		var pHeader = this.createELm("Personal Workouts", false, "H3", [], personal);
		Workout.common.addEvent(pHeader, "click", function(e){
			Workout.media.play();
			if(this.parentElement.classList.contains("sectionHide")){
				this.parentElement.classList.remove("sectionHide");
				this.parentElement.classList.add("section");
			}else{
				this.parentElement.classList.add("sectionHide");
				this.parentElement.classList.remove("section");
			}
		});

		var pSpan = this.createELm(false, false, "SPAN", ["personal-icon","block","large-icon"], pHeader);
		var pList = this.createELm(false, "personal", "UL", ["my-workouts"], personal);	

		this.workoutCard(pList, "No workouts");
		document.body.appendChild(page);
		Workout.File.init(page);
	},
	workoutCard:function(apd, string){
		var li = this.createELm(false, false, "LI", ["container-shadow"], false);
		li.name = string;
		if(string != "No workouts"){
			string = Workout.File.rename(string, "name");
		}
		var p = this.createELm(string, false, "p", [], li);
		
		if(string != "No workouts"){
			var span = this.createELm(false, false, "SPAN", ["delete-icon","small-icon","block","small-icon","pull-right"], li); 
			Workout.common.addEvent(li, "click", function(e){
				Workout.media.play();
				if(e.target.nodeName == "LI" || e.target.nodeName == "P"){
					var target = (e.target.nodeName == "LI") ? e.target : e.target.parentElement;
					Workout.common.getJson("file:///storage/emulated/0/Android/data/FitGen/Workouts/" + target.parentElement.id + "/" + li.name, function (data) {			       
				        data = JSON.parse(data.response);
				        Workout.list.data = data.pointers;
				        Workout.build.page = Create.workoutPage(data.pointers, data.results, "Workout - "+string);
				        document.getElementById("start").click();			        
				        Workout.bottomNav.hideNav();
				    });
				}
				if(e.target.nodeName == "SPAN"){
					var answer = confirm("Delete?");
					if(answer){
						Workout.File.delete("file:///storage/emulated/0/Android/data/FitGen/Workouts/" + e.target.parentElement.parentElement.id , li.name, function(){
							li.remove();
						});					
					}
				}
			});
		}

		if(!apd){
			return card;
		}else{
			((typeof apd) == "string") ? document.querySelector(apd).appendChild(li) : apd.appendChild(li);
		}
	},
	//creating elements for page
	workoutPage: function (pointers, result, name){
		console.log(pointers, result);
		if(!isEmpty(result)){
			// main elements on screen created
			var page = this.createELm(false, "workout", "div", ["wrap-nav","noselect"], false);
			if(!name){
				var MessageSave = this.createELm("Generate again?", false, "div", ["button","flat-btn","msg-blue"], page);
				Workout.common.addEvent(MessageSave,"click", function(e){
					Workout.media.play();
					var answer = confirm("Are you sure?");
					if(answer){
						if(!isEmpty(Workout.list.currentWorkout)){
							for(var x=0;x<Workout.list.currentWorkout.pointers.length;x++){
								document.getElementById(Workout.list.currentWorkout.pointers[x]).click()
							}
							document.getElementById("start").click()
						}else{
							Workout.page.next(Workout.page.view, "home");
						}
					}
				});
			}else{
				var MessageSave = this.createELm(name, false, "div", ["button","flat-btn","msg-blue"], page);
			}
			var box = this.createELm(false, false, "div", ["black-box","noselect"], page);
			var timer = this.timer(box, 1, 30, true, true);
			timer.querySelector(".x-icon").style.display = "block";
			Workout.common.addEvent(box,"click", function(e){
				Workout.media.play();
				if(e.target.classList.contains("x-icon") || e.target.classList.contains("black-box")){
					Workout.common.sc("close", box);
					//document.body.classList.remove('noscroll');
					Timer.stop(timer.querySelector("p").id);
					timer.querySelector("p").innerText = "00:00";
					if(py = timer.querySelector(".pause-icon")){
						py.classList.remove("pause-icon");
						py.classList.add("play-icon");
					}	
				}
			});

			var whBox = this.createELm(false, false, "div", ["white-box","noselect"], page);
			var greyBox = this.createELm(false, false, "div", ["grey-box","noselect", "container-shadow"], page);
			var Card = this.createELm(false, false, "div", ["overlay-box","container-shadow"], whBox);
			var whx = this.createELm(false, false, "span", ["x-icon","right-span","pull-right","block","small-icon"], Card);
			var Header = this.createELm(false, false, "div", ["header"], Card);
			var TextHeader = this.createELm("yolo", false, "h1", [], Header);
			var pBox = this.createELm("asdasdsad", false, "p", [], Card);
			var view = this.createELm(false, false, "span", ["viewList-icon","hidden","midRight-span","block","sm-icon","container-shadow"], page);
			Workout.common.addEvent(view,"click", function(e){
				Workout.media.play();
				if(e.target.classList.contains("viewList-icon")){
					e.target.classList.remove("viewList-icon");
					e.target.classList.add("compact-icon");		
				    Velocity(page.querySelectorAll(".mid-span")[1], "stop", true);
					Workout.common.sc("close", page.querySelectorAll(".mid-span")[1]);
					Velocity(page.querySelectorAll(".left-span")[1], "stop", true);
					Workout.common.sc("close", page.querySelectorAll(".left-span")[1]);
					Velocity(e.target, {marginRight: "45%", height: 50, width:50, marginTop: "-25"}, {duration: "slow"});
					Workout.common.sc("close", "workout-content");
					Workout.common.sc("show", "list-content");
				}else{
					e.target.classList.remove("compact-icon");
					e.target.classList.add("viewList-icon"); //-20px 30% 0 auto;

					Workout.common.sc("show", page.querySelectorAll(".mid-span")[1]);
					Workout.common.sc("show", page.querySelectorAll(".left-span")[1]);
					Velocity(e.target, {marginRight: "30%", height: 40, width:40, marginTop: "-20"}, {duration: "slow"});
					Workout.common.sc("show", "workout-content");
					Workout.common.sc("close", "list-content");
				}
			});


			var expand = this.createELm(false, false, "span", ["closeMenu-icon","hidden","left-span","block","medium-icon","container-shadow"], page);
			Workout.common.addEvent(expand,"click", function(e){
				Workout.media.play();
				var parts = page.querySelectorAll(".part");
				if(e.target.classList.contains("closeMenu-icon")){
					e.target.classList.remove("closeMenu-icon");
					e.target.classList.add("openMenu-icon");
					for(c = 0; c < parts.length; c++){
						if(!parts[c].height)
						{
							parts[c].height = parts[c].offsetHeight;
						}	
						parts[c].style.overflow = "hidden";
						if(!parts[c].classList.contains("slideIn")){
							parts[c].classList.add("slideIn");
						}
						Velocity(parts[c], "stop", true);
						Velocity(parts[c], {height: "10px", opacity: 0.2}, {duration: "slow"});
					}
				}else{
					e.target.classList.add("closeMenu-icon");
					e.target.classList.remove("openMenu-icon");
					for(c = 0; c < parts.length; c++){
						parts[c].classList.remove("slideIn");
						Velocity(parts[c], "stop", true);
						Velocity(parts[c], {height: parts[c].height - 60, opacity: 1}, {duration: "slow"});
					}
				}
			});

			Workout.common.addEvent(whBox,"click", function(e){
				Workout.media.play();
				if(e.target.classList.contains("x-icon") || e.target.classList.contains("white-box")){
					Workout.common.sc("close", whBox);
					//document.body.classList.remove('noscroll');
				}
			});
			var list = this.createELm(false, "list-content", "div", ["absolute"], page);
			var ul = this.createELm(false, "planB", "ul", [], list);
			var comtainer = this.createELm(false, "workout-content", "div", ["absolute"], page);
			var colorCount = 0;
			for(var i=0;i<pointers.length;i++){
				if(result[pointers[i]]["exc"].length > 0){
					var subName = pointers[i].substring(5);
					var li = this.createELm(subName.toUpperCase(), false, "li", [], ul);
					var style = result[pointers[i]]["style"]; // background: #f9f9f9; background: #eee
					var exc = result[pointers[i]]["exc"];

					var partIcon = this.createELm(false, false, "span", [subName + "-icon","mid-span","block","medium-icon","container-shadow"], comtainer);
					Workout.common.addEvent(partIcon,"click", function(e){
						Workout.media.play();
						//page.querySelectorAll("div[sytle='opacity: 0']")
						if(this.nextElementSibling.style.height == "10px"){
							var h = this.nextElementSibling.height - 60;
							this.nextElementSibling.classList.remove("slideIn");
							Velocity(this.nextElementSibling, "stop", true);
							Velocity(this.nextElementSibling, {height: h, opacity: 1}, {duration: "slow"});
							if(comtainer.querySelectorAll(".slideIn").length == 0){
								expand.classList.remove("openMenu-icon");
								expand.classList.add("closeMenu-icon");
							}
						}else{
							this.nextElementSibling.height = this.nextElementSibling.offsetHeight;
							this.nextElementSibling.style.overflow = "hidden";
							this.nextElementSibling.classList.add("slideIn");
							Velocity(this.nextElementSibling, "stop", true);
							Velocity(this.nextElementSibling, {height: "10px", opacity: 0.2}, {duration: "slow"});	
							if(comtainer.querySelectorAll(".slideIn").length == comtainer.querySelectorAll(".part").length){
								expand.classList.remove("closeMenu-icon");
								expand.classList.add("openMenu-icon");
							}
						}
					});
				    var part = this.createELm(false, false, "div", [subName, "part"], false);
				    (colorCount % 2) ? part.style.background = "#eee": part.style.background = "#f9f9f9" ;
				    comtainer.appendChild(part)

				    for(var x=0; x<exc.length; x++){
				    	var ulLi = this.createELm(false, false, "ul", [], li);
				    	var liSub = this.createELm(exc[x].name, false, "li", ["set-title"], ulLi);
						liSub.style.borderLeft = "2px solid" + style["class"][0];
				    	var liSub = this.createELm(exc[x].sets+" sets of "+ exc[x].reps+" reps" + " Rest: "+exc[x].time+" secs", false, "li", ["set-rep"], ulLi);
						
						var card = this.createELm(false, false, "div", ["card","container-shadow"], part);
						var desc = this.createELm(exc[x].description, false, "div", ["desc", "hide"], card );
						card.style.color = style["class"][0];
						card.style.borderTop = "2px solid" + style["class"][0];
						var header = this.createELm(false, false, "div", ["header"], card),
						h = this.createELm(exc[x].name, false, "h1", [], header),
						icon = this.createELm(false, false, "div", ["icon"], card),
						info = this.createELm(false, false, "span", ["info-icon","large-icon","pull-right"], icon);
						Workout.common.addEvent(info,"click", function(){
							Workout.media.play();
							//document.body.classList.add('noscroll');
							Workout.common.sc("show", whBox);
							TextHeader.innerText = this.parentElement.parentElement.querySelector("h1").innerText;
							pBox.innerText = this.parentElement.parentElement.querySelector(".desc").innerText;
							Card.style.borderTop = this.parentElement.parentElement.style.borderTop;
						});
						var section = this.createELm(false, false, "div", ["section","pull-left"], card),
						span = this.createELm(false, false, "span", [subName+"-icon","large-icon","pull-left"], section), // switch back mayabe
						p = this.createELm(exc[x].sets+" sets of "+ exc[x].reps+" reps", false, "div", [], section),
						section = this.createELm(false, false, "div", ["section","pull-right"], card),
						span = this.createELm(false, false, "span", ["black-timer-icon","large-icon","pull-left"], section);
						Workout.common.addEvent(span,"click", function(){
							Workout.media.play();
							//document.body.classList.add('noscroll');
							Workout.common.sc("show", box);
							var ary = this.nextSibling.innerText.split(" ")[1].split(":");
							timer.querySelector(".minute").innerText = ary[0];
							timer.querySelector(".secound").innerText = ary[1];
						});
						var p = this.createELm("Rest: "+exc[x].time+" secs", false, "div", [], section);
				    }
				    colorCount ++
				}
			}
		    return page;
		}else{
			return null;
		}
	},
	workoutBuilder: function(page){
		var template = this.workoutList.config.template;
		if(!page){
			// main page content
			var page = this.createELm(false, "build-Workout", "div", ["wrap-nav","noselect"], false);	
			var container = this.createELm(false, "build-container", "div", ["container","container-shadow"], page);
			container.style.backgroundColor = "#58cf8b";

			var parts = JSON.parse(Workout.build.data);
			var result = this.createELm(false, "workout-build", "div", [], page);
			var excersises = {};
			var pointers = [];
			for(i in parts){
				pointers.push(i);
				excersises[i] = parts[i].compound.concat( parts[i].isolation ); 
			}
			var data = this.workoutList.getData(pointers, excersises, 0, 0);
			this.workoutList.render(true, container, data, result);
		
			var output = {pointers: [], results: {}};
			for(i in parts){
				output.pointers.push(i);
				output.results[i] = parts[i].compound.concat( parts[i].isolation ); 
				output.results[i].style = parts[i].style;
			}
			this.workoutList.config.original = output;

			// so 
			document.body.appendChild(page);
		}
		return {
			destroy: function(){
				page.remove(); 
			}, 
			save: function(){

				var count = 0;

				for(i in template.pointers){
					if(template.results[template.pointers[i]].exc.length > 0){
						count++;
					}
				}

				if(count == 0){
					return 1;
				}else{
					var nameCover = document.getElementById("nameCover");
					if(nameCover.style.display == "none"){
						Workout.common.sc("show", nameCover); 					
						document.body.classList.add('noscroll');
						document.getElementById("bottom-nav").classList.add("bottom-overide");			
						document.getElementById("workoutName").focus();
						count = 2;
					}else{
						var val = Workout.common.checkFileName(document.getElementById("workoutName").value.trim());
						var order = Workout.common.checkFileName(document.getElementById("workoutType").value.trim());
						if(val == "" || order == ""){
							alert("Please complete!");
							count = 1;
						}else{
						    Workout.list.saveWorkout(template, val, order);
							document.getElementById("workoutName").value = "";
							count = 0;
						}
					}			

					return count;
				}
			}
		};
	},
	workoutList: {
		config: {icon: 0, excerse: 0, data: "", template: "", listArray: []},
		getData: function(pointers, parts, icon, exc, bool){ // -1 -1
			this.config.pointers = pointers;
			this.config.parts = parts;
			
			var data = {};
			var limit = 3;
			var pointersLength = pointers.length; // 5
			var n = 0;
			if(bool == undefined) {
				if( (this.config.icon + icon) < 0 ){
					this.config.icon = pointersLength - 1;
				}else if((this.config.icon + icon) > (pointersLength - 1)){
					this.config.icon = 0;
				}else{
					this.config.icon = this.config.icon + icon;
				}

				data.type = pointers[this.config.icon];
				var excLength = parts[data.type].length;

				if( (this.config.excerse + exc) < 0 ){
					this.config.excerse = excLength - 1;
				}else if((this.config.excerse + exc) > (excLength - 1)){
					this.config.excerse = 0;
				}else{
					this.config.excerse = this.config.excerse + exc;
				}

				this.config.excerse = (icon == 0) ? this.config.excerse : 0;
			}else{
				this.config.icon = icon;
				this.config.excerse = exc;
				data.type = pointers[this.config.icon];
			}
			var output = [];

			var n = this.config.excerse;
			var c = 0;
			for(var i=0; i<3; i++){
				if(c == 0){
					output.push(parts[data.type][this.config.excerse]);
				}else{
					if((this.config.excerse + 1) > (excLength - 1)){
					    this.config.excerse = 0; 
					}else{
						this.config.excerse ++;
					}
					output.push(parts[data.type][this.config.excerse]);
					
				}
				c ++;
			}
			this.config.excerse = n;
			data.exercises = output;
			this.config.data = data;
			return data;

		},
		render: function(bool, container, data, result){
			if(bool){
				this.config.template = JSON.parse(Workout.init.template);
				this.config.listArray = [];
				// if(!bool){
				// 	document.getElementById("buildList").remove();
				// }
				var header = Create.createELm(false, false, "DIV", ["search-wk"], container);
				var headerInput =  Create.createELm(false, false, "INPUT", ["full"], header);
				headerInput.setAttribute("placeholder", "Select an exercise");
				var addWK = Create.createELm(false, false, "span", ["animated","add-black-icon","sm-icon","block","pull-right"], header);
				var search = Create.createELm(false, false, "span", ["animated","search-icon","sm-icon","block","pull-right"], header);
				var reOrder = Create.createELm(false, "reOrder", "span", ["reorder-icon","mid-left-span","medium-icon","block","pull-right","container-shadow"], container.parentElement);
		
				search.style.right = "50px";
				search.style.borderRight = "1px solid #fff";
				Workout.common.addEvent(search, "click", function(e){
					Workout.media.play();
					//animate("bounceIn", search, 400);
					headerInput.focus();
					search.style.right = "0px";
					search.style.borderRight = "1px solid #58cf8b";
					Workout.common.sc("close", addWK, false); 
				}.bind(this));

				Workout.common.addEvent(addWK, "click", function(e){
					Workout.media.play();
					animate("bounceIn", addWK, 400);
					Workout.common.sc("show", select, false); 
				    Workout.common.sc("show", editBox);
				   	WKtitle.removeAttribute("disabled");
					WKdesc.removeAttribute("disabled");		
					WKtitle.value = "";
					WKdesc.value = "";						
					WKsets.value =  "3";
					WKreps.value = "6";
					spanMin.innerText =  "1";
					spanSec.innerText =  "30";
					// now go and save the excersie 
				}.bind(this));			

				headerInput.addEventListener("focusout", function(){
					search.style.right = "50px";
					search.style.borderRight = "1px solid #fff";	
					Workout.common.sc("show", addWK, false);				
					animate("fade-for", addWK, 400);
					setTimeout(function(){
						Workout.common.sc("hide", document.getElementById("searchList"), false);
					    Workout.common.sc("show", ul, false);
					}.bind(this), 300)
					headerInput.value = "";
				});

				headerInput.addEventListener("focusin", function(){
					search.style.right = "0px";
					search.style.borderRight = "1px solid #58cf8b";
					Workout.common.sc("close", addWK, false); 
					if(document.getElementById("searchList").innerHTML != ""){
						Workout.common.sc("show", document.getElementById("searchList"), false);
						Workout.common.sc("hide", ul, false);
					}
				});

				headerInput.addEventListener("keyup", function(e){
					const value = headerInput.value.trim();
					if(value.length > 1){
						Search.json(value, this.config.parts);
					}else if(value.length == 0){
						Workout.common.sc("hide", document.getElementById("searchList"), false);
						Workout.common.sc("show", ul, false);
					}
					
				}.bind(this));

				Create.createELm(false, "searchList", "UL", ["my-workouts"], container);

				var ul = Create.createELm(false, "buildList", "UL", ["my-workouts"], container);
				
				var liTOP = Create.createELm(false, false, "LI", ["invisible"], ul);
				var iconUp = Create.createELm(false, false, "span", ["action-up-icon","small-icon","block","pull-left"], liTOP);
				var excUp = Create.createELm(false, false, "span", ["action-up-icon","small-icon","block","pull-right"], liTOP);

				var liMiddle = Create.createELm(false, false, "LI", ["container-shadow"], ul);
				var icon = Create.createELm(false, "iconDecider", "span", ["animated", "slideInDown","small-icon","block","pull-left", data.type.split("-")[1]+"-icon"], liMiddle);
				var plusIcon = Create.createELm(false, false, "span", ["add-icon","small-icon","block","pull-right"], liMiddle); // "animated", frank
				plusIcon.style.backgroundColor = "#000";

			    var liBottom  = Create.createELm(false, false, "LI", ["invisible"], ul);
				var iconDown = Create.createELm(false, false, "span", ["action-down-icon","small-icon","block","pull-left"], liBottom);
				var excDown = Create.createELm(false, false, "span", ["action-down-icon","small-icon","block","pull-right"], liBottom);

				var a = Create.createELm(data.exercises[0].name, "firstExc", "p", ["animated", "slideInDown"], liTOP);
				var b = Create.createELm(((data.exercises[1].name.length > 30) ? data.exercises[1].name.substring(0, 25) + "..." : data.exercises[1].name), "middleExc", "p", ["animated", "slideInDown"], liMiddle);
				var c = Create.createELm(data.exercises[2].name, "lastExc", "p", ["animated", "slideInDown"], liBottom);

				Workout.common.addEvent(iconUp, "click", function(e){
					Workout.media.play();
					animate("bounceIn", iconUp, 400);
					setTimeout(function(){
						var data = this.getData(this.config.pointers, this.config.parts, -1, 0);
						this.render(false, container, data, result);
						icon.classList.remove("slideInUp");
						icon.classList.add("slideInDown");
					}.bind(this), 100)
					icon.classList.remove("slideInDown");
				}.bind(this));

				Workout.common.addEvent(iconDown, "click", function(e){
					Workout.media.play();
					animate("bounceIn", iconDown, 400);
					setTimeout(function(){
						var data = this.getData(this.config.pointers, this.config.parts, 1, 0);
						this.render(false, container, data, result);
						icon.classList.remove("slideInDown");
						icon.classList.add("slideInUp");
					}.bind(this), 100)
					icon.classList.remove("slideInUp");
				}.bind(this));

				Workout.common.addEvent(excUp, "click", function(e){
					Workout.media.play();
					animate("bounceIn", excUp, 400);
					setTimeout(function(){
						var data = this.getData(this.config.pointers, this.config.parts, 0, -1);
						this.render(false, container, data, result);
						a.classList.remove("slideInUp");
						a.classList.add("slideInDown");
						b.classList.remove("slideInUp");
						b.classList.add("slideInDown");
						c.classList.remove("slideInUp");
						c.classList.add("slideInDown");
					}.bind(this), 100)
					a.classList.remove("slideInDown");
					b.classList.remove("slideInDown");
					c.classList.remove("slideInDown");					
				}.bind(this));

				Workout.common.addEvent(excDown, "click", function(e){
					Workout.media.play();
					animate("bounceIn", excDown, 400);
					setTimeout(function(){ 
						var data = this.getData(this.config.pointers, this.config.parts, 0, 1);
						this.render(false, container, data, result);
						a.classList.remove("slideInDown");
						a.classList.add("slideInUp");
						b.classList.remove("slideInDown");
						b.classList.add("slideInUp");
						c.classList.remove("slideInDown");
						c.classList.add("slideInUp");
					}.bind(this), 100)
					a.classList.remove("slideInUp");
					b.classList.remove("slideInUp");
					c.classList.remove("slideInUp");
				}.bind(this));


				var editBox = Create.createELm(false, false, "DIV", ["edit-box","noselect"], document.body);
				var ol = Create.createELm(false, false, "DIV", ["overlay-box","container-shadow"], editBox);
				ol.style.borderTop = "2px solid rgb(22, 160, 133)";

				var closeMenu = Create.createELm(false, false, "span", ["x-icon","right-span","pull-right","block","small-icon"], ol);

				Workout.common.addEvent(closeMenu,"click", function(){
					Workout.media.play();
					Workout.common.sc("close", editBox);
				}.bind(this));

				var cover = Create.createELm(false, false, "DIV", ["cover"], ol);
				var select = Create.createELm(false, false, "SELECT", ["full-select"], cover);
				var firstOP = Create.createELm("Please select the group", false, "OPTION", [""], select);
				firstOP.style.color = "#ddd";
				for(var j=0; j<this.config.pointers.length; j++){					
					var a = Create.createELm(capitalizeFirstLetter(this.config.pointers[j].split("-")[1]), false, "OPTION", [""], select);
					a.value = this.config.pointers[j].split("-")[1];
				}
				var hidden = Create.createELm(false, "wk-title", "INPUT", ["hide"], cover);
				var formGroup = Create.createELm(false, false, "DIV", ["form-group"], cover);
				var WKtitle = Create.createELm(false, "wk-title", "INPUT", ["full"], formGroup);
				WKtitle.setAttribute("placeholder", "Title");
				var formGroup = Create.createELm(false, false, "DIV", ["form-group"], cover);
				var WKdesc = Create.createELm(false, "wk-desc", "textarea", ["full"], formGroup);
				WKdesc.setAttribute("placeholder", "Description");

				Create.createELm(false, false, "span", ["settings-black-icon","mid-sm-span","block","medium-icon","container-shadow"], ol);
     			
				var SR =  Create.createELm(false, false, "DIV", ["bg-lightGrey"], ol); 
				SR.style.paddingTop = "20px";
				var formBox = Create.createELm(false, false, "DIV", ["form-box "], SR);
				var section = Create.createELm(false, false, "DIV", ["section", "pull-left","container-shadow"], formBox);
				var WKsets = Create.createELm(false, "wk-sets", "INPUT", ["fity"], section);
				WKsets.value = "3";
				Create.createELm("Sets", false, "LABEL", [], section);
			    var section = Create.createELm(false, false, "DIV", ["section", "pull-right","container-shadow"], formBox);
				var WKreps = Create.createELm(false, "wk-reps", "INPUT", ["fity"], section);
				WKreps.value = "6";
				Create.createELm("Reps", false, "LABEL", [], section);

			
				var timer =  Create.createELm(false, false, "DIV", ["bg-lightGrey"], ol); 
				timer.style.paddingTop = "40px";
				Create.createELm(false, false, "span", ["black-timer-icon","mid-sm-span","block","medium-icon","container-shadow"], timer);
				var takeAdd = Create.createELm(false, false, "div", ["timer-box","container-shadow"], timer);				
				var section = Create.createELm(false, false, "div", ["section","pull-left"], takeAdd);
				var take = Create.createELm("-", false, "span", ["take-minute"], section);
				var spanMin = Create.createELm("1", false, "span", ["minute"], section);
				var add = Create.createELm("+", false, "span", ["add-minute"], section);
				var section = Create.createELm(false, false, "div", ["section","pull-right"], takeAdd);
				var take = Create.createELm("-", false, "span", ["take-secound"], section);
				var spanSec = Create.createELm("30", false, "span", ["secound"], section);
				var add = Create.createELm("+", false, "span", ["add-secound"], section);

				var cover = Create.createELm(false, false, "DIV", ["cover"], timer);
				var btn = Create.createELm("Save", false, "DIV", ["button","large-btn","green","container-shadow"], cover);		


				Workout.common.addEvent(btn,"click", function(){
					Workout.media.play();
					var details = JSON.stringify(this.config.template["results"][hidden.value.split(",")[2]]["exc"][hidden.value.split(",")[0]]);
					details = JSON.parse(details);
					details.name = WKtitle.value;
					details.description = WKdesc.value;						
					details.sets = WKsets.value;
					details.reps = WKreps.value;
					details.time = spanMin.innerText + ":" + spanSec.innerText;
					this.config.template["results"][hidden.value.split(",")[2]]["exc"][hidden.value.split(",")[0]] = details;

					var elm = document.getElementById(hidden.value.split(",")[1]);
					var children = elm.querySelectorAll(".section")
					children[0].children[1].innerText = WKsets.value +" sets of " + WKreps.value + " reps";
					children[1].children[1].innerText = "Rest: " +spanMin.innerText + ":" + spanSec.innerText+ " secs";					
					Workout.common.sc("hide", editBox);
										
				}.bind(this));
			    

				Workout.common.addEvent(takeAdd, "click", function(e){
					Workout.media.play();
					if(e.target.nodeName == "SPAN"){
						var min = spanMin;
						var secound = spanSec;

						switch(e.target.classList[0]){
							case "take-minute":
								if(parseInt(min.innerText) == 0){min.innerText = 60}else{
								min.innerText = parseInt(min.innerText) - 1;}
								break;
							case "add-minute":
								if(parseInt(min.innerText) == 60){min.innerText = 0}else{
								min.innerText = parseInt(min.innerText) + 1;}
								break;
							case "take-secound":
								if(parseInt(secound.innerText) == 0){secound.innerText = 60}else{
								secound.innerText = parseInt(secound.innerText) - 1;}
								break;
							case "add-secound":
								if(parseInt(secound.innerText) == 60){secound.innerText = 0}else{
								secound.innerText = parseInt(secound.innerText) + 1;}
								break;
						}						
					}
				});

				var clicked = [];
				
				Workout.common.addEvent(result, "click",function(e){
					
					if(reOrder.classList.contains("tick-icon")){
						var elm = e.target.closest(".card-exc");

						if(elm.classList.contains("orange-bg")){
							elm.classList.remove("orange-bg");
							removeObjectArray(clicked, "id", elm.id);
						}else{
							elm.classList.add("orange-bg");
							clicked.push(elm);
						}

						if(clicked.length > 1){
							setTimeout(function(){
								var swaps = [];
								for(var i in clicked){
									clicked[i].classList.remove("orange-bg");

									//animate("green-bg", clicked[i], 300);
									
									var ary = locateObjectArray(this.config.listArray, "id", clicked[i].id);

									swaps.push(ary.key);
									
								}
								swapElement(this.config.listArray, swaps[0], swaps[1]);							

								result.innerHTML = null;

								for(j in this.config.listArray){
									result.append(this.config.listArray[j]);
								}
								
								clicked = [];
							}.bind(this), 400);
							// swap elements
						
						}
					}

				}.bind(this));

				Workout.common.addEvent(reOrder, "click", function(e){
					if(reOrder.classList.contains("reorder-icon")){		
						reOrder.classList.remove("reorder-icon");
						reOrder.classList.add("tick-icon");
						container.style.top = "-186px";
						document.getElementById("build-Workout").style.paddingTop = "60px";
					}else{
						clicked = [];
						document.getElementById("build-Workout").style.paddingTop = "290px";
						container.style.top = "50px";
						reOrder.classList.remove("tick-icon");
						reOrder.classList.add("reorder-icon");
					}
				});

				


				Workout.common.addEvent(plusIcon, "click", function(e){
					Workout.media.play();
					animate("square", plusIcon, 300);
										
					var exc = this.config.data.exercises[1];
					var dataType = this.config.data.type;

					var id = Math.random().toString(36).substring(7);
					exc["id"] = id;
					var cover = Create.createELm(false, id, "div", ['card-exc'], result);

				    var card = Create.createELm(false, false, "div", ["card","container-shadow"], cover);
				    animate("animation-duration", card, 1200);
					var desc = Create.createELm(this.config.data.exercises[1].description, false, "div", ["desc", "hide"], card );					
					card.style.color = this.config.original.results[this.config.data.type].style["class"][0];
					card.style.borderTop = "2px solid" +this.config.original.results[this.config.data.type].style["class"][0];
					var header = Create.createELm(false, false, "div", ["header"], card),
					h = Create.createELm(this.config.data.exercises[1].name, false, "h1", [], header),
					icon = Create.createELm(false, false, "div", ["icon"], card),
					menu = Create.createELm(false, false, "span", ["animated","menu-dots-icon","ml-icon","pull-right"], icon);
					var pos = this.config.template["results"][dataType]["exc"].push(exc);

					var dropdown = Create.createELm(false, false, "DIV", ["dropdown-content"], card);
					var itemDelete = Create.createELm("Delete", false, "a", [], dropdown);
					var itemEdit = Create.createELm("Edit", false, "a", [], dropdown);


					Workout.common.addEvent(menu,"click", function(){
						var menus = document.querySelectorAll(".dropdown-content");
						for(var i=0; i < menus.length; i++ ){
							menus[i].style.display = "none";
						}

						animate("bounceIn", menu, 400);
						Workout.media.play();
						Workout.common.sc("show", dropdown);
					}.bind(this));

					Workout.common.addEvent(itemDelete,"click", function(){
						Workout.media.play();
						cover.classList.add("fade-out");	
						removeObjectArray(this.config.listArray, "id", id);
						removeObjectArray(this.config.template["results"][dataType]["exc"], "id", id);
						setTimeout(function(){
							cover.remove()
						}, 400);

						if(this.config.listArray.length < 2){	
							document.getElementById("bottom-nav").style.zIndex = "3";
							reOrder.style.marginLeft = "31%";																
							reOrder.style.marginLeft = "45%";	
							document.getElementById("build-Workout").style.paddingTop = "290px";
							container.style.top = "50px";	
							reOrder.classList.remove("tick-icon");
							reOrder.classList.add("reorder-icon");
							
							setTimeout(function(){reOrder.style.display = "none";}, 1000);													
						}	

					}.bind(this));

					Workout.common.addEvent(itemEdit,"click", function(){
						Workout.media.play();
						Workout.common.sc("close", select, false); 
						WKtitle.setAttribute("disabled", "true");
						WKdesc.setAttribute("disabled","true");
						Workout.common.sc("show", editBox);
						
						var item = locateObjectArray(this.config.template["results"][dataType]["exc"], "id", id);
						hidden.value = item.key + "," + id + "," + dataType;


						WKtitle.value = item.details.name;
						WKdesc.value = item.details.description;						
						WKsets.value = item.details.sets;
						WKreps.value = item.details.reps;
						spanMin.innerText =  item.details.time.split(":")[0];
						spanSec.innerText =  item.details.time.split(":")[1];

					}.bind(this));

					var section = Create.createELm(false, false, "div", ["section","pull-left"], card),
					span = Create.createELm(false, false, "span", [this.config.data.type.split("-")[1]+"-icon","large-icon","pull-left"], section), // switch back mayabe
					p = Create.createELm(this.config.data.exercises[1].sets+" sets of "+ this.config.data.exercises[1].reps+" reps", false, "div", [], section),
					section = Create.createELm(false, false, "div", ["section","pull-right"], card),
					span = Create.createELm(false, false, "span", ["black-timer-icon","large-icon","pull-left"], section);
					var p = Create.createELm("Rest: "+this.config.data.exercises[1].time+" secs", false, "div", [], section);
					cover.scrollTop = cover.scrollHeight;

					window.location.hash = "";
					window.location.hash = '#' + id;	
					var aryItem = this.config.listArray.push(cover)
					console.log(this.config.listArray);
					//var reOrder = document.getElementById("reOrder");
					if(this.config.listArray.length > 1 ){	
						if(reOrder.style.display != "block"){									
							reOrder.style.display = "block";
							reOrder.style.marginLeft = "45%";	
							setTimeout(function(){																	
								reOrder.style.marginLeft = "30%";	
								
							}, 100);
						}			
					}else {
						if(reOrder.style.display != "none" && reOrder.style.display != ""){
							
							reOrder.style.marginLeft = "30%";					
							reOrder.style.marginLeft = "45%";	
							setTimeout(function(){reOrder.style.display = "none";}, 1000);
						}						
					}		
				}.bind(this));

			}else{ 
				var icon = document.getElementById("iconDecider");
				for(i in this.config.parts){
					icon.classList.remove(i.split("-")[1] +"-icon");
				}
				
				icon.classList.add(data.type.split("-")[1] +"-icon");

				var a =  document.getElementById("firstExc");
				var b =  document.getElementById("middleExc");
				var c =  document.getElementById("lastExc");

				a.innerText = data.exercises[0].name;
				b.innerText = (data.exercises[1].name.length > 30) ? data.exercises[1].name.substring(0, 25) + "..." : data.exercises[1].name;
				c.innerText = data.exercises[2].name;
			}
		
		}
	},
	nav: function(name,title,bool,hide){
		var ary = [name];
		(bool) ? ary.push("active") : null;
		(hide)? ary.push("hide") : null;
		var li = this.createELm(false, false, "li", ary, "#side-nav ul");
	    span = this.createELm(false, false, "span", [name+"-icon","sm-icon","pull-left"], li), 
		a = this.createELm(title, false, "a", [], li);
	},
	timer: function(apd, mins, secs, space, close){
		var n = Math.random().toString(36).substring(7);
		//var n = Math.floor((Math.random() * (mins * secs)) + 1);
		var timer = this.createELm(false, n, "div", ["timer-container"], false);
		var space = (space) ? this.createELm(false, false, "div", ["spacer"], timer) : null;
		var box = this.createELm(false, false, "div", ["timer-box","container-shadow"], timer);
		var x = this.createELm(false, false, "div", ["x-icon","right-span","absolute","small-icon"], box);
		(close) ? x.style.display = "none" : null ;
		var p = this.createELm("00:00", false, "p", ["time-count"], box);

		var reset = this.createELm(false, false, "span", ["reset-icon","left-span","block","ml-icon","container-shadow-blue"], timer);
		var play = this.createELm(false, false, "span", ["play-icon","mid-span","block","ml-icon","container-shadow-blue"], timer);
		var takeAdd = this.createELm(false, false, "div", ["timer-box","container-shadow"], timer);
		var section = this.createELm(false, false, "div", ["section","pull-left"], takeAdd);

		var take = this.createELm("-", false, "span", ["take-minute"], section);
		var spanMin = this.createELm(mins, false, "span", ["minute"], section);
		var add = this.createELm("+", false, "span", ["add-minute"], section);
		var section = this.createELm(false, false, "div", ["section","pull-right"], takeAdd);
		var take = this.createELm("-", false, "span", ["take-secound"], section);
		var spanSec = this.createELm(secs, false, "span", ["secound"], section);
		var add = this.createELm("+", false, "span", ["add-secound"], section);

		Workout.common.addEvent(takeAdd, "click", function(e){
			Workout.media.play();
			if(e.target.nodeName == "SPAN"){
				var min = spanMin;
				var secound = spanSec;

				switch(e.target.classList[0]){
					case "take-minute":
						if(parseInt(min.innerText) == 0){min.innerText = 60}else{
						min.innerText = parseInt(min.innerText) - 1;}
						break;
					case "add-minute":
						if(parseInt(min.innerText) == 60){min.innerText = 0}else{
						min.innerText = parseInt(min.innerText) + 1;}
						break;
					case "take-secound":
						if(parseInt(secound.innerText) == 0){secound.innerText = 60}else{
						secound.innerText = parseInt(secound.innerText) - 1;}
						break;
					case "add-secound":
						if(parseInt(secound.innerText) == 60){secound.innerText = 0}else{
						secound.innerText = parseInt(secound.innerText) + 1;}
						break;
				}
			}
		});

		Workout.common.addEvent(play, "click", function(e){
			Workout.media.play();
			if(play.classList.contains("play-icon")){
				var tme;
				if(p.innerText == "00:00"){
					tme = parseInt(spanMin.innerText) * 60 + parseInt(spanSec.innerText);
				}else{
					var split = p.innerText.split(":");
					tme = parseInt(split[0]) * 60 + parseInt(split[1]);
				}
				
				minutes = parseInt(tme / 60, 10)
				seconds = parseInt(tme % 60, 10);
				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;
				p.textContent = minutes + ":" + seconds;
				
				tme = tme - 1;
				Timer.start(tme, p, function(){
					console.log("done");
					play.classList.remove("pause-icon");
					play.classList.add("play-icon");
				});

				play.classList.remove("play-icon");
				play.classList.add("pause-icon");
			}else{
				play.classList.remove("pause-icon");
				play.classList.add("play-icon");
				Timer.stop(p.id);
			}
			
		});

		Workout.common.addEvent(reset, "click", function(e){
			Workout.media.play();
			Timer.stop(p.id);
			p.innerText = "00:00";

			if(play.classList.contains("pause-icon")){
				play.classList.remove("pause-icon");
				play.classList.add("play-icon");			
			}

		});

		if(!close){
			Workout.common.addEvent(x,"click", function(e){
				timer.classList.add("fade-out");
				Timer.stop(p.id);	
				setTimeout(function(){timer.remove()}, 400);	
			});
		}
		
		if(!apd){
			return timer;
		}else{
			((typeof apd) == "string") ? document.querySelector(apd).appendChild(timer) : apd.appendChild(timer);
			return timer;
		}
	},
	flash: function(timer,link, msg, color, target, absolute){ // allow it to take you some where 
		var flash = this.createELm(false, false, "div", ["flash-message", color, "container-shadow", absolute], false);
		var span = this.createELm(false, false, "span", ["important-icon","ml-icon","pull-left"], flash);
		var p = this.createELm(msg, false, "p", [], flash);
		var span = this.createELm(false, false, "span", ["x-icon","small-icon","pull-right"], flash);

		if(timer){
			setTimeout(function(){
				Workout.common.sc("close", flash);
			}, timer)
		}
		// alert - flash message event
		flash.addEventListener("click", function(e){
			Workout.media.play();
			if(e.target && e.target.nodeName == "SPAN"){
				Workout.common.sc("close", e.target.parentElement);
			}else if((e.target && e.target.nodeName == "DIV" || e.target.nodeName == "P") && link){
				if(link.indexOf("http") == -1){
					if(document.querySelector("."+Workout.page.view)){
						document.querySelector("."+Workout.page.view).classList.remove("active");
					}
					document.querySelector("."+link).classList.add("active");
					Workout.page.next(Workout.page.view, link);
				}else{
					window.location.href = link;
				}
				(e.target.nodeName == "P") ? Workout.common.sc("close", e.target.parentElement) : Workout.common.sc("close", e.target);
			}else{
				(e.target.nodeName == "DIV") ? Workout.common.sc("close", e.target) : Workout.common.sc("close", e.target.parentElement);
			}
		});

		if(!target){
			return flash;
		}else{
			((typeof target) == "string") ? document.querySelector(target).appendChild(flash) : target.insertBefore(flash, target.firstChild);
			return flash;
		}
	}
}