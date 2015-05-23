/* This template is part of Pasture.
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
 * 
 * This file is part of <your module name>
 * 
 * <Your module name> Copyright (C) <year> <your name>
 * <Your module name> inherits all licensing and terms from Pasture
 * 
 * <your contact details>
 * 
 * */

"use strict";

var module_name='template';  //name must be used as the universal namespace for all variables and functions that are going to be available to sheepdogs or sheep

// ----------------------------------------------------------------------------------------------------------------do not change
global[module_name]={'a':{}};
global[module_name].a.test=function(x){
	console.log('shepherd.'+module_name+' returns : '+x)
}
global[module_name].talk={}
global[module_name].setSocket=function(sock){ //sets the socket context
	socket=sock
}
var talk=function(x){ //pulls the talk function into the socket context
	if(!x){
		dotalk.socket=socket;
	}else{
		dotalk.socket=x
	}
	return dotalk;
}
var path;
var fs;
var socket;
var io;
var dotalk;
var errorhandler;
var ping=function(mess){
	var time=Date.now();
	talk().emit('sheepdog','do','ping',[mess,time]);
}

var schema={}; //set up namespaces for the mongo database using mongoose library. Use these as the database local namespaces throughout for consistency.
var data={};

exports[module_name] = function(pat,f,tal,i,mongoose,errhand){
	errorhandler=errhand	
	path=pat;
	fs=f;
	io=i;
	dotalk=tal;	
	if(mongoose){
// -------------------------------------------------------------------------------------------------------------end do not change



		/*-----------Start custom database schemes-------------*/
		
		schema.template=mongoose.Schema({
			name: Number,
			data: Array
		})
		data.template = mongoose.model('template', schema.prime);
		console.log('-----------------------------------------------------------------------------------------');
		console.log('template sample data scheme is set');
		console.log('-----------------------------------------------------------------------------------------\n');
		
		
		/*-----------End custom database schemes-------------*/
		
		
		
		
// -----------------------------------------------------------------------------------------------------------------do not change
	}	
	return global[module_name];
}
// -------------------------------------------------------------------------------------------------------------end do not change


/*-------------------------------------------Add custom logic to connect / disconnect events-----------------------------------*/
global[module_name].onConnect=function(){

	//add desired logic to run on new sheepdog connection initialisation here
	
	talk().broadcast('sheepdog.template','do','console',[socket+' has connected'],true)
	talk().emit('sheepdog.template','do','connected',[io.sockets.sockets.length],true)
	talk().process();

		
}
global[module_name].onDisconnect=function(){
	
	//add desired logic to run on a sheepdog disconnection here
	
	talk().broadcast('sheepdog.template','do','console',[socket+' has disconnected'],true)
	talk().emit('sheepdog.template','do','connected',[io.sockets.sockets.length],true)
	talk().process();
}

/*-------------------------------------------Add custom logic below here-----------------------------------*/
var abitoffun=[
	'Buy more wool',
	'Obey the dogs',
	'They know who you are',
	'Vote for bigger pastures',
	'Herd growth is essential',
	'You are an unique little lamb',
	'Eat better grass',
	'Exercise',
	'Get out of the woods',
	'Graze more',
	'You need a smartcoat',
	'You need a smartcollar',
	'You need smartblinkers',
	'Beware the wolves',
	'Socialise with the other sheep',
	'Democratise the farmyard',
	'Consume less meat',
	'Mutton is not lamb',
	'Judge not',
	'Follow me'
];
var count=0;
function samplePinger(){
	setTimeout(function(){
		ping('Template pings: '+abitoffun[count]);
		talk().emit('sheepdog.template','do','console',['The shepherd says: '+abitoffun[count]])
		if(count < abitoffun.length-1){
			count++;
		}else{
			count=0;
		}
		samplePinger();
	},10000)
}
samplePinger();

template.bleat=function(id,time){
	talk().broadcast('sheep.template.sheep1','do','bleat',[id,time]);
}
template.bark=function(id,time){
	talk().broadcast('sheepdog.template','do','barkback',[id,time]);
}
template.bleatbark=function(id,mess,time){
	talk(id).reply('sheepdog.template','do','console',[mess,time])
}
