// file api 
// suggested: "file:///storage/emulated/0/Android/data/FitGen/Workouts/suggested",
// personal: "file:///storage/emulated/0/Android/data/FitGen/Workouts/personal"
// private object
Workout.File = {
    config:{
        appPath: "Android/data/FitGen",
        appRoot: "file:///storage/emulated/0/Android/data/FitGen/",
        zip: "www/Workouts.zip",
        suggested: {},
        personal: {}
    },
    init: function(){
		// Workout.File.findDir(Workout.File.config.appRoot, function(data){			
		// 	if(data.code != undefined){
		// 		Workout.File.dir(cordova.file.externalRootDirectory, "Android/data/FitGen");
		// 	}else{
		// 		if(data.length > 1){
		// 			if(data[0].name == "Workout.zip" && data[1].name == "Workouts"){
		// 				Workout.File.readFiles("both")
		// 			}else{
		// 				Workout.File.ClearDirectory(Workout.File.config.appRoot, function(){
		// 					Workout.File.dir(cordova.file.externalRootDirectory, "Android/data/FitGen");
		// 				});
		// 			}
		// 		}else{
		// 			Workout.File.ClearDirectory(Workout.File.config.appRoot, function(){
		// 				Workout.File.dir(cordova.file.externalRootDirectory, "Android/data/FitGen");
		// 			});
		// 		}
		// 	}
				
		// });
    },
    display: function(element, data, limit, type){
    // init start check if fitgen exists 
	    if(Workout.File.config[element.substr(1)].length == 0){
			for (var i=0; i<data.length; i++) {
				var fileName = data[i];
				Create.workoutCard(element, fileName);
			}
		}else{
			document.getElementById(element.substr(1)).innerHTML = '';
			if(data.length > 0){
				for (var i=0; i<data.length; i++) {
					var fileName = data[i].name;
					Create.workoutCard(element, fileName);
				}
				Workout.File.config[element.substr(1)] = data;
			}else{
				Create.workoutCard(element, "No workouts");
			}
		}	    
    },
    rename: function(name, type){
    	string = name.split(",");

    	switch(type){
    		case "fullname": 
    		return name;
    			break;
    		case "time":
    		return string[0].slice(1, -1);
    			break;
    		case "name":
			string = string[1].replace("_", " ");
			string = string.slice(0,-5);
			return string;
    			break;
    	}
    },
    error: function(e){
    	console.log("error");
    	console.log(e);
    }
}


Workout.File.findDir = function (path, callback){
	window.resolveLocalFileSystemURL(path,
	  function(entry){
		lists = entry.createReader();
	    lists.readEntries(function(data){
	    	callback(data);
	    });
	},
	  function(evt){
	    callback(evt)}
	);
}

Workout.File.ClearDirectory = function(path, callback) {
	function fail(evt) {
        alert("FILE SYSTEM FAILURE" + evt.target.error.code);
    }
	window.resolveLocalFileSystemURL(path,
	  function(entry){
	  	  entry.removeRecursively(function(e) {
				console.log(e);
                console.log("Remove Recursively Succeeded");
                if(callback){callback()}                
            }, fail);
	},
	  function(evt){
	    callback(evt)}
	);
}

// check every 2 weeks that the file has been uupdated
// have option to check 
// downloads the new file and replaces old file as it unzips
Workout.File.dir = function(system, path){
	window.resolveLocalFileSystemURL(system, 
		function(fileSystem) {
		    fileSystem.getDirectory(path, {create: true, exclusive: true},
			    function(dirEntry) {
					if(path == Workout.File.config.appPath){				 					 	
 						Workout.File.findDir("file:////android_asset/www/", function(data){
					  		data[0].copyTo(dirEntry,"Workout.zip", 
						  		function(sucess){
						  			if(localStorage.getItem('zip')){
						  				console.log("nothing here!")// download latest version
						  			}
							  			zip.unzip(sucess.nativeURL, 
						  					cordova.file.externalRootDirectory + Workout.File.config.appPath,
											function(er){if(er > -1){console.log("zip worked");Workout.File.readFiles("both");}},
											function(progressEvent){console.log(progressEvent.loaded + "/" + progressEvent.total);}
						 			    );
							  	}, function(error){console.log("Problem with the zip");Workout.File.error(error)}
						  	) 
					  	})
					}
			    }, function(e){
			    	Workout.File.findDir(Workout.File.config.appRoot, function(data){
			    		if(data[0].name == "Workout.zip" && data[1].name == "Workouts"){		  			
		  					Workout.File.readFiles("both");
		  				}else{
		  					Workout.File.ClearDirectory(Workout.File.config.appRoot, function(){
		  						Workout.File.dir(cordova.file.externalRootDirectory, "Android/data/FitGen");
		  					})
		  				}
		  			});
			    } // go string tp readfiles 
		    );
		}, function(e){Workout.File.error(e)}
	);
};

Workout.File.readFiles = function(bool, limit){
	if(bool == "suggeted" || bool == "both"){
		Workout.File.findDir(Workout.File.config.appRoot+"Workouts/suggested", function(data){
			console.log("suggested read!");
			Workout.File.config.suggested["limit"] = 2;
			Workout.File.display("#suggested", data);
		});
	}
	if(bool == "personal" || bool == "both"){
		Workout.File.findDir(Workout.File.config.appRoot+"Workouts/personal", function(data){	
			console.log("personal read!");
			Workout.File.config.personal["limit"] = 5;
			Workout.File.display("#personal", data);
		});
	}
};

Workout.File.delete = function(path, filename, callback){
	window.resolveLocalFileSystemURL(path, function(dir) {
		dir.getFile(filename, {create:false}, function(fileEntry) {
	              fileEntry.remove(function(){
	                  callback();
	              },function(error){
	                 alert("Error deleting the file");
	              },function(){
	                 alert("The file doesn't exist");
	              });
		});
	});
}

Workout.File.writeToFile = function(dir, fileName, data) {
    data = JSON.stringify(data, null, '\t');
    window.resolveLocalFileSystemURL(dir, function (directoryEntry) {
        directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                	Workout.File.readFiles("personal");
                    // for real-world usage, you might consider passing a success callback
                    console.log('Write of file "' + fileName + '"" completed.');
                };

                fileWriter.onerror = function (e) {
                    // you could hook this up with our global error handler, or pass in an error callback
                    console.log('Write failed: ' + e.toString());
                };

                var blob = new Blob([data], { type: 'text/plain' });
                fileWriter.write(blob);
            },  function(error){Workout.File.error(error)});
        },  function(error){Workout.File.error(error)});
    },  function(error){Workout.File.error(error)});
};

Workout.File.readFromFile = function(dir ,fileName, cb) {
    var pathToFile = dir + fileName;
    
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    cb(e._result);
                };

                reader.readAsText(file);
            }, function(error){Workout.File.error(error)});
        }, function(error){Workout.File.error(error)});
};





//writeToFile("file:///storage/emulated/0/Android/data/FitGen/Workouts/suggested",'example.json', { foo: 'bar' });


// function createDir(rootDir, folders) {
//   rootDir.getDirectory(folders[0], {create: true}, function(dirEntry) {
//     if (folders.length) {
//       createDir(dirEntry, folders.slice(1));
//     }
//   }, errorHandler);
// };

// createDir(fs.root, 'Documents/Images/Nature/Sky/'.split('/'));


