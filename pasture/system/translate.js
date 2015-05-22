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

if(typeof exports === 'undefined'){
	var exports={};
}

function locate(obj,path,put) {
	path = path.split('.');
	if(path.length===1 && put){
		obj[path[0]]=put;
		return;
	}	
	var newo=obj[path[0]];
	for (var i = 0; i < path.length; i++) {
		if(put){
			if(i<path.length-2){				
				newo=newo[path[i+1]]				
			}else if(i<path.length-1){								
				newo[path[i+1]]=put;
				return;								
			}				
		}else{
			if(typeof obj!=='undefined'){
				obj = obj[path[i]];
			}else{
				console.log('why is it undefined?');
				console.log(path);
				console.log(i);
			}
		}
	}
	return obj;
}

exports.translate=function(instr,data,ref,context){
	var fname=Object.keys(data)[0];			
	if(instr==='do'){
		var fn=locate(ref,fname)
		if(typeof fn==='function'){
			fn.apply(this,data[fname]);				
		}else{
			console.log(fname);
			throw new Error(fname+'() is not a function');
		}
	}else if(instr==='set'){
		locate(ref,fname,data[fname]);					
	}else{
		throw new Error('The '+context+' received a badly formatted instruction: "'+instr+'"');
	}
}

exports.talk=function(io){

	var talk={};
	var talkq;
	talkq={}	
	talkq.q=[]
	talkq.q2=[]

	function dotalk(data,q){
		var context=Object.keys(data)[0];
		if(!q){		
			if(context==='reply'){
				if(io.sockets.connected[talk.socket]){
					io.sockets.connected[talk.socket].emit('sheepdog',data.reply);
				}else{
					console.warn('socket was lost');
				}
			}else if(context==='emit'){
				io.emit('sheepdog',data.emit);
			}else if(context==='broadcast'){
				if(io.sockets.connected[talk.socket]){
					io.sockets.connected[talk.socket].broadcast.emit('sheepdog',data.broadcast);
				}else{
					io.emit('sheepdog',data.broadcast);
				}
			}else{
				console.warn('"'+t.context+'" : You need to specify a correct emission type');
			}
		}else{
			if(context==='reply'||context==='emit'||context==='broadcast'){
				talkq.q.push(data);			
			}else{
				console.warn('"'+t.context+'" : You need to specify a correct emission type');			
			}
		}	
	}

	talk.process=function(){
		var peg;
		var active={}
		for(var a=0;a<talkq.q.length;++a){
			var context=Object.keys(talkq.q[a])[0];
			
			if(!peg||peg===context){
				peg=context;
				if(!active[peg]){
					active[peg]=[]
				}
				active[peg].push(talkq.q[a][peg][0])
			}else{			
				talkq.q2.push(active);
				peg=context;
				active={};
				active[peg]=[]						
				active[peg].push(talkq.q[a][peg][0])
			}
			
		}
		talkq.q2.push(active);
		for(var a=0;a<talkq.q2.length;++a){
			dotalk(talkq.q2[a]);
		}
		talkq.q=[];
		talkq.q2=[];
	}

	talk.reply=function(module,action,name,values,q){
		var data={reply:[]};
		data.reply[0]={};
		data.reply[0][module]={};
		data.reply[0][module][action]={};
		data.reply[0][module][action][name]=values;
		dotalk(data,q)
	}
	talk.emit=function(module,action,name,values,q){
		var data={emit:[]};
		data.emit[0]={};
		data.emit[0][module]={};
		data.emit[0][module][action]={};
		data.emit[0][module][action][name]=values;
		dotalk(data,q)	
	}
	talk.broadcast=function(module,action,name,values,q){
		var data={broadcast:[]};
		data.broadcast[0]={};
		data.broadcast[0][module]={};
		data.broadcast[0][module][action]={};
		data.broadcast[0][module][action][name]=values;
		dotalk(data,q)	
	}
	talk.sheep=function(data){

		var k=Object.keys(data)[0];		
		var k2=k.split('.');
		var shee=getworker(k2[1]+'.'+k2[2]);
		if(shee.running){
			shee.postMessage(JSON.stringify(data[k]));
		}else{
			console.warn("'"+k+"' is not running");
		}		
	}
	talk.shepherd=function(data){
		socket.emit('shepherd',data);
	}

	talk.back=function(module,action,target,value){
		var data={};
		data[module]={};
		data[module][action]={};
		data[module][action][target]=value;
		if(typeof self.module_name === 'undefined'){
			self.postMessage(JSON.stringify(data));
		}else{
			sheepdog.action(data);
		}	
	}
	talk.write=function(key,data){
		talk.back('sheepdog','do','write',[key,data]);
	}
	/* need to put in a ie shim here for promises: https://github.com/jakearchibald/es6-promise#readme  */

	talk.read=function(key,module){
		console.log('reading');
		talk.back('sheepdog','do','read',[key,module]);
		var promise=new Promise(function(resolve,reject){
			self[sheep_name].promises[key]=null;
			var timer=0;
			function poll(){
				setTimeout(function(){
					timer++
					if(self[sheep_name].promises[key]){
						resolve(self[sheep_name].promises[key]);
						delete self[sheep_name].promises[key];
					}else if(timer > 200){
						reject('failed to load '+key+' from local storage');
					
					}else{
						poll();
					}
				},10)
			}
			poll();							
		});
		return promise;
	}

	return talk;
}


