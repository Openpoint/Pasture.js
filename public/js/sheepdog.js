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
 
var socket;
var modules;
var talk;
var translate;
var sheep={};
var exports={};
var sheepdog={d:{}};
sheepdog.d.head = document.getElementsByTagName('head')[0];
sheepdog.d.make=function(src){
	var script = document.createElement('script');	
	script.type = 'text/javascript';
	script.src = src;
	return script;	
}

//load the dependencies
sheepdog.d.boot1=function(){
	sheepdog.d.required=[
		'js/modules/system/settings.js',
		'js/modules/system/es6-promise.js',
		'js/modules/system/translate.js',			
	];
	sheepdog.d.d2=0;	
	for(var i=0;i<sheepdog.d.required.length;++i){
		var script=new sheepdog.d.make(sheepdog.d.required[i])
		script.onload=function(){
			sheepdog.d.d2++
		}		
		sheepdog.d.head.appendChild(script);

		
	}

	//proceed to boot level2 after depencency injection
	function proceed(){
		setTimeout(function(){
			if(sheepdog.d.d2===sheepdog.d.required.length){
				sheepdog.d.boot2();
			}else{
				proceed()
			}
		},1)
	}
	proceed();
		
}

//load the user modules
sheepdog.d.boot2=function(){
	modules=exports.Settings.usermodules;
	socket=exports.Settings.nodeurl+':'+exports.Settings.nodeport	
	sheepdog.reserved=['talk','sheepdog','sheep','socket','exports','modules'];
	
	for(var i=0;i<modules.length;++i){
		if(sheepdog.reserved.indexOf(modules[i])===-1){
			var mod=modules[i];			
			self[mod]={a:{}};		
			
			
			//----create built in methods for each module
			
			//create a test call response
			self[mod].a.test=function(x){
				console.log('sheepdog.'+mod+' returns : '+x)
				talk().back('shepherd.prime','do','test',['back']);
			}

			//create an instance of all available sheep
			self[mod].a.startsheep=function(){ 
				for(var i=0;i<self[mod].sheep.length;++i){
					sheepdog.new_sheep(mod+'.'+self[mod].sheep[i]);
				}
			}
			//kill all modules sheep
			self[mod].a.killsheep=function(){ 
				for(var i=0;i<self[mod].sheep.length;++i){
					sheepdog.kill_sheep(mod+'.'+self[mod].sheep[i]);
				}
			}
			//reset all modules sheep
			self[mod].a.resetsheep=function(){ 
				for(var i=0;i<self[mod].sheep.length;++i){
					sheepdog.reset_sheep(mod+'.'+self[mod].sheep[i]);
				}
			}
			
			//----end built in methods			
			
			//inject the module's script
			var script=sheepdog.d.make('js/modules/user/'+mod+'/'+mod+'.sheepdog.js')		
			if(i===modules.length-1){
				sheepdog.d.d3=true;
			}
			sheepdog.d.head.appendChild(script);
		}else{
			throw new Error("'"+modules[i]+"' is a reserved word and cannot be used as a module name");
		}
	}	
}

//load and open the web socket
sheepdog.d.boot3=function(){
		
	var script=sheepdog.d.make(socket+'/socket.io/socket.io.js')
	sheepdog.d.head.appendChild(script);
	
	//connect and continue to run after the socket is loaded
	function connected(){
		if(typeof io === 'undefined'){
			setTimeout(function(){
				connected()
			},1)
		}else{
			delete sheepdog.d;
			socket = io.connect(socket);
			talk=function(){
				return exports.talk(io);
			}
			sheepdog.run();
		}
	}
	connected();		
}

//initialise the boot sequence
sheepdog.d.boot1();



/*-------------------------------------------Proceed after all javascript has been injected-----------------------------------*/
sheepdog.run = function() {

	
	translate=exports.translate;
	/*-------------------------------------------Listen to shepherd-----------------------------------*/
	socket.on('sheepdog',function(data){		
		for(var i=0; i<data.length; ++i){	
			sheepdog.action(data[i]);
		}
	})
};
/*-------------------------------------------reload the page after the shepherd has been restarted-----------------------------------*/
sheepdog.init=function(reset){
	
	//console.log('init '+reset); //todo - how to refresh after server is restarted only		
	if(sheepdog.running){
		//if(reset){
			for(var i=0;i<modules.length;++i){
				self[modules[i]].a.killsheep();
			}
			location.reload();
		//}
	}else{
		sheepdog.running=true;
		socket.emit('running');
	}	
}

/*-------------------------------------------Action on incoming-----------------------------------*/
sheepdog.action=function(data){
	var key=Object.keys(data)[0];
	var arr=key.split('.');
	var instr=Object.keys(data[key])[0];
	var dat=data[key][instr];
	if(key==='sheepdog'){	
		exports.translate(instr,dat,sheepdog,'sheepdog');
	}else if(arr[0]==='sheepdog' && modules.indexOf(arr[1])>-1){
		exports.translate(instr,dat,self[arr[1]],key);
	}else if(arr[0]==='sheep'){
		talk().sheep(data);				
	}else if(key==='shepherd'||(arr[0]==='shepherd' && modules.indexOf(arr[1])>-1)){
		talk().shepherd(data);	
	}else{
		console.warn("'"+key+"' is not a variable or a command")
	}		
}


/*-------------------------------------------Listen to sheep-----------------------------------*/

sheepdog.listen_sheep=function(data) {		
	var data=JSON.parse(data);
	sheepdog.action(data);
}

/*-------------------------------------------Built in methods-----------------------------------*/
sheepdog.ping=function(mess,time){
	console.log('ping : '+mess);
	talk().back('shepherd','do','pingback',['pingback from : '+socket.id,time]);
}
sheepdog.kill_sheep=function(shee){
	var x=getworker(shee)
	x.terminate();
	x.running=false;	
}
sheepdog.new_sheep=function(shee){		
	if(!getworker(shee).running){
		make(shee);
	}	
}
sheepdog.reset_sheep=function(shee){
	var x=getworker(shee);		
	x.terminate();
	x.running=false;
	sheepdog.new_sheep(shee);	
}
sheepdog.test=function(x){
	console.log('sheepdog returns : '+x)
}
//write to localstorage
sheepdog.write=function(key,data){ 
	localStorage.setItem(key, JSON.stringify(data));
}
//read from localstorage
sheepdog.read=function(key,module){
	var val=JSON.parse(localStorage.getItem(key));
	//console.log('sheep.'+module,'set','promises.'+key,val);
	talk().back('sheep.'+module,'set','promises.'+key,val);
}
//helpers for built in methods
function getworker(name){
	name = name.split('.');
	if(typeof sheep[name[0]]==='undefined'){
		sheep[name[0]]={}
	}
	if(typeof sheep[name[0]][name[1]]==='undefined'){
		sheep[name[0]][name[1]]={}
	}
	return sheep[name[0]][name[1]];
}
function make(name){
	var sname = name.split('.');
	var makesheep=getworker(name);		
	if(!makesheep.running){
		makesheep = new Worker('js/modules/user/'+sname[0]+'/sheep/'+name+'.js');
		makesheep.postMessage = makesheep.webkitPostMessage || makesheep.postMessage;
		//create a listener for all sheep
		makesheep.addEventListener('message', function(e) {
			sheepdog.listen_sheep(e.data);
		}, false);
		makesheep.running=true;
	}else{
		console.warn("sheep '"+name+"'is already running.");
	}
	sheep[sname[0]][sname[1]]=makesheep;
}
