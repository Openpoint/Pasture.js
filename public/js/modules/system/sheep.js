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

importScripts('/js/modules/system/es6-promise.js');
importScripts('/js/modules/system/translate.js');

self[sheep_name]={};
self[sheep_name].promises={};
self[sheep_name].test=function(x){
	console.log('sheep.'+sheep_name+' returns : '+x);
	talk.back('shepherd','do','test',['ping back from sheep.'+sheep_name]);
}
var translate=exports.translate;
var talk=exports.talk;
/*-------------------------------------------listener for messages from sheepdog-----------------------------------*/

self.addEventListener('message', function(e) {
		var data=(JSON.parse(e.data));			
		var key=Object.keys(data)[0];
		translate(key,data[key],self[sheep_name],'sheep: '+sheep_name);
		
}, false);
