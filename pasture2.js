/* This file is part of Pasture.
 * 
 * Pasture is a framework for distributed, browser based computing systems.
 * Copyright (C) 2015  Michael Jonker
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * michael@openpoint.ie
 * 
 * */


/* **********************************************************DO NOT CHANGE THIS FILE
 * 
 * All custom logic goes in: 
 * 'pasture/user/your_module_name/' 
 * 
 ******************************************************************************** */

"use strict";

console.log('\nPASTURE Copyright (C) 2015 Michael Jonker\nThis program comes with ABSOLUTELY NO WARRANTY.\nThis is free software, and you are welcome to redistribute it under certain conditions.\n');

/*-------------------------------------------Set global variables-----------------------------------*/
var shepherd={x:{}};
var modules={};
var module={};
var express = require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
var path=require('path');
var fs=require('fs');
var Settings=require('./settings.js').Settings;
modules.load_modules=Settings.usermodules;
var translate=require('./pasture/system/translate.js').translate;
var talk=require('./pasture/system/translate.js').talk(io);
var errorhandler=function(mess){
	throw new Error(mess);
}



//boot the main shepherd app
shepherd.x.boot=function(){	
	//router using express
	app.get('/', function(req, res){
		res.sendFile(__dirname + '/index.html');	
	});

	//set the publically accessible directory on the server
	app.use(express.static(__dirname + '/public'));
		

	var user_modules='./pasture/user/';

	
	//inject all modules code into the 'module' object
	for(var i=0;i<modules.load_modules.length;++i){
		var thismod=modules.load_modules[i];
		module[thismod]=require(user_modules+thismod+'/'+thismod+'.shepherd.js')[thismod](path,fs,talk,io,mongoose,errorhandler);
		
	}
	server.listen(Settings.nodeport);
}

//Start up a Mongo DB using Mongoose
var mongoose=false;
if(Settings.usemongoose){
	var db;
	mongoose = require('mongoose');
	shepherd.x.monpath=path.join(__dirname,Settings.mongoose.datapath)
	
	//start mongoose
	shepherd.x.bootmon=function(){
		var exec = require('child_process').exec;
		shepherd.x.mongoose=exec('mongod --dbpath='+shepherd.x.monpath+' --port '+Settings.mongoose.port);
		shepherd.x.mongoose.stderr.on('data', function(data) {
			throw new Error(data);
			return;
		});
		shepherd.x.mongoose.stdout.on('data', function(data) {
			if(!shepherd.x.monstarted){
				if(data.indexOf("waiting for connections on port") > -1){
					console.log('mongoose running');
					shepherd.x.monstarted=true;
					mongoose.connect('mongodb://localhost:'+Settings.mongoose.port+shepherd.x.monpath);
					db = mongoose.connection;
					db.on('error',function(error){ 
						throw new Error(error);
					});
					db.once('open', function (callback) {
						shepherd.x.boot();
					});					
				}
			}else{
				console.log('mongoose : '+data);
			}
		});
		
	}
	// create a mongo db directory if none and/else start mongoose
	fs.stat(shepherd.x.monpath, function(err,stats){
		if(err){
			if(!stats){
				fs.mkdir(shepherd.x.monpath, function(err){
					if(!err){
						shepherd.x.bootmon();
					}
				})
			}
			
		}else{
			shepherd.x.bootmon();
		}
		
	})

}else{
	//start shepherd if no db is required
	shepherd.x.boot();
}

//gracefully exit
process.on('SIGINT', function() {
	console.log('\n---------------------------------------------------------------------Goodbye from Pasture-----------------------------------------------------------------------------');
	if(Settings.usemongoose){
		shepherd.x.mongoose.kill();
	}
	process.exit();
})


/*-------------------------------------------Traffic Handler-----------------------------------*/

io.on('connection', function (socket) {

	socket.emit('sheepdog',[{'sheepdog':{'do':{'init':[]}}}]);		
	socket.on('running',function(){	
		
		if(!shepherd[socket.id]){
			shepherd[socket.id]={};
		}
		for(var i=0;i<modules.load_modules.length;++i){
			var thismod=modules.load_modules[i];
			module[thismod].setSocket(socket.id);
			module[thismod].onConnect();			
		}
	})
	
	//-------------------------------------------Listen to sheepdogs with reach to all modules
	socket.on('shepherd',function(data){
		var key=Object.keys(data)[0];
		var arr=key.split('.');
		var instr=Object.keys(data[key])[0];
		var dat=data[key][instr]
		if(key==='shepherd'){	
			translate(instr,dat,shepherd,'shepherd');
		}else if(modules.load_modules.indexOf(arr[1])!==-1){
			module[arr[1]].setSocket(socket.id);
			translate(instr,dat,module[arr[1]],key);	
		}else{
			throw new Error("'"+key+"' is not a variable or a command")
		}				
	})

	/*-------------------------------------------Load and set connection rules to modules  -----------------------------------*/


	socket.on('disconnect',function(){
		for(var i=0;i<modules.load_modules.length;++i){
			var thismod=modules.load_modules[i];
			module[thismod].setSocket(socket.id);
			module[thismod].onDisconnect();
				
		}
	})
	
});


shepherd.pingback=function(mess,time){
	time=Date.now()-time;
	console.log(mess+' in '+time+'ms');
}
shepherd.test=function(x){
	console.log('shepherd returns : '+x)
}
