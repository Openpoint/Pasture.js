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
 * This file is part of the Pasture module <your module name>
 * 
 * <Your module name> Copyright (C) <year> <your name>
 * <Your module name> inherits all licensing and terms from Pasture
 * 
 * <your contact details>
 * 
 * */

var module_name='template'  //name must be used for all variables and functions in the universal namespace

self[module_name].sheep=[ //define the names of all your sheep under this sheepdog
	'sheep1',
]

// do not change

self[module_name].a.startsheep();
if(typeof sheepdog.d != 'undefined' && sheepdog.d.d3){ //proceed to boot level3 after all modules are injected
	sheepdog.d.boot3();
	
}
// end do not change

/*-------------------------------------------Custom module logic goes below here-----------------------------------*/

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

var connected;
function newwindow(){
	window.open(window.location.href);
}

template.console=function(message,time){
	
	if(time){
		time=Date.now()-time;
		message=message+' in '+time+'ms'
	}
	$('#console').prepend(message+'<br>');
}
template.connected=function(count){
	connected=count;
	if(count > 1){
		$('.connected.single').hide();
		$('.connected.many').show();
		$('.connected.many span').html(count);		
	}else{
		$('.connected.single').show();
		$('.connected.many').hide();		
	}
}
template.bleat=function(){
	if(connected > 1){
		$('#console').prepend('You bleat into the pasture and ^^^^^^^<br><br>');
		talk().back('shepherd.template','do','bleat',[socket.id,Date.now()]);
	}else{
		$('#console').prepend('<br>You bleat into the empty pasture and silence yells back at you.<br>Please open another browser window to populate the pasture.<br><br>');
	}
}
template.bark=function(){
	if(connected > 1){
		$('#console').prepend('You bark into the pasture and ^^^^^^^<br><br>');
		talk().back('shepherd.template','do','bark',[socket.id,Date.now()]);
	}else{
		$('#console').prepend('<br>You bark into the empty pasture and silence yells back at you.<br>Please open another browser window to populate the pasture.<br><br>');
	}	
}
template.barkback=function(id,time){
	talk().back('shepherd.template','do','bleatbark',[id,socket.id+' replies: Woof, woof....',time])
}
