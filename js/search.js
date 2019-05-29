//*[contains(title, "the")]
//var reds = JSON.search(obj, '//*[color="red"]');

var Search = Search || {};

var Search = {
	json: function(value, data){
		console.clear();
		console.log(data);
		var results = JSON.search(data, '//*[contains(name, "'+ value +'")]');
		console.log(results);
		if(results.length > 0 ){
			Workout.common.sc("close", document.getElementById("buildList"), false);
			var list = document.getElementById("searchList");
			Workout.common.sc("show", list, false);
			list.innerHTML = "";
			var l = (results.length > 4) ? 4 : results.length;
			for (var i = l - 1; i >= 0; i--) {
				var a = Create.createELm(false, false, "LI", ["animated", "slideInDown"], list); 
			    var b = Create.createELm(results[i].name, false, "p", [], a);
			    Create.createELm(false, false, "span", ["add-black-icon","sm-icon","block","pull-right"], a);

			    Workout.common.addEvent(a, "click", function(e){
			    	var config = Create.workoutList.config;
					var icon = 0;
					var exc = 0;
					var name = e.target.innerText;

					var c = 0;
					for(d in config.parts){
					 
					  for(j in config.parts[d]){
						if(config.parts[d][j].name == name){
							icon = c;
							exc = j -1;
					    }
					  }
					c++;

					}

			    	var data = Create.workoutList.getData(Create.workoutList.config.pointers, Create.workoutList.config.parts, icon, exc, true);
					Create.workoutList.render(false, document.getElementById("build-container"), data, document.getElementById("workout-content"));
			    });
			}
		}

	}
}

