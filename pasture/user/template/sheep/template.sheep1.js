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

var sheep_name='sheep1'; //name must be used for all variables and functions in the universal namespace


// do not change

importScripts('/js/modules/system/sheep.js');

// end do not change

/*-------------------------------------------Custom logic goes below here-----------------------------------*/

sheep1.bleat=function(id,time){
	talk().back('shepherd.template','do','bleatbark',[id,'A sheep replies: Meeeehhheeeeeee....',time]);
}
