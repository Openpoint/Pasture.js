##Pasture provides a common language bridge between a node.js server, browser windows and browser web workers.

There are two points of 'asynchronisity' in the network communication:

1. between node.js (shepherd) and the browser window (sheepdog)
2. between the  browser window (sheepdog) and the web workers (sheep)

Any system design should be aware of this at the start.

Pasture is a modular framework and all modules with associated files should be placed in this folder under their own subfolder, named as the module name.
Have a look at the 'templates' folder and follow the structural and naming logic for your own modules.


###Basic usage examples:

```javascript
talk().reply('sheepdog.makefudge','do','mix',['batch',sugar]);
```
Immediately responds to sheepdog 'makefudge' telling it to execute the function - mix('batch',sugar);

```javascript
talk().emit('sheep.makefudge.oven','set','temperature',145,true);
talk().emit('sheep.makefudge.refine','do','process',[raw_ingredients],true);
talk().emit('sheepdog.makefudge','do','waitforingredients',[raw_ingredients],true);
talk().process();
```

will deliver a batch of synchronous commands to all sheepdogs for further execution and instructing the sheep


###Universal namespacing:

All universally accessible functions and variables are namespaced by the module or sheep name, ie.
For a module called 'makefudge' with 2 sheep called 'oven' and 'refine' as follows;

**In shepherd and sheepdog:**

`makefudge.waitforingredients=function(){};`

`makefudge.somevalue=100;`

**In sheep:**

`oven.temperature=143;`

or

`refine.process=function(){};`
  
The universals can call globals from their own context, but you can only call universals from any context.


###Methods for shepherds:

- reply to a single sheepdog `talk(socket).reply(<instruction>);`		
- communicate with all sheepdogs except the originator `talk(socket).broadcast(<instruction>);` 	
- communicate with all sheepdogs `talk().emit(<instruction>);` 			
- process a chained queue of instructions `talk(socket).process();`			
- ping all sheep dogs, display the message in browser consoles and log response to server console `ping('message');`				



###Methods for sheepdogs and sheep:

- communicate with any shepherd, sheepdog or sheep `talk().back(<instruction>);` 		
- write to browser local storage (browser storage is normally limited to 5Mb) `talk.write('key',value);`		- read from browser local storage asynchronously `talk.read('key','module_name.sheep_name').then(function(data){});`
- terminate, reset or spawn sheep respectively				
```javascript
talk().back('sheepdog','do','kill_sheep',['module_name.sheep_name']);
talk().back('sheepdog','do','reset_sheep',['module_name.sheep_name']);
talk().back('sheepdog','do','new_sheep',['module_name.sheep_name']);
```

instruction takes the form of ('destination','action','target',<parameters>,chain)

**Destinations:** <**'destination'**,'action','target',<parameters>,chain>

- communicate with sheepdog root (only access built in methods) `'sheepdog'`
- communicate with sheepdog for specific module context `'sheepdog.module_name'`				
- communicate with specific sheep`'sheep.module_name.sheep_name'`				

**Actions:** <'destination',**'action'**,'target',<parameters>,chain>

-execute a function `'do'`										
-set a value `'set'`										


**Target:** <'destination','action',**'target'**,<parameters>,chain>

The name of the object in the destination, it can either be a variable or a function. eg:
To set the value of `oven.temperature` in the makefudge module, sheep named 'oven', the syntax will be: `'sheep.makefudge.oven','set','temperature',<value>`


**Parameters:** <'destination','action','target',**<parameters>**,chain>

For functions, use an array of parameters to pass: `['param1',some_var,'param3']` or empty `[]`
For variables, just pass the value to set. This can be any valid type - string, variable, array, object, etc

**Chain:** <'destination','action','target',<parameters>,**chain**>

A boolean value
If false or not specified, the instruction gets processed immediately. 
If true, the intruction gets queued and sent out in a single batch when `talk().process()` is called.

**Socket:** talk(**socket**).reply(<instruction>) 

The global variable `socket` identifies the active connection in synchronous excecution on the shepherd. It is important for 'reply' and 'broadcast' communication. 
`talk()` Will automatically apply the correct socket, until it is moved into an asynchronous context, such as `setTimeout`

In these cases, ensure you copy the active `socket` into the asynchronous scope and then call: 
`talk(async_socket_variable).reply();`
or  
`talk(async_socket_variable).broadcast();`
or
`talk(async_socket_variable).process();`

eg.
```javascript
function dolater(sock){
	var so=sock;
	setTimeout(function(){
		talk(so).reply('sheepdog.makefudge','do','mix',['batch',sugar])
	},5000);
}
dolater(socket);
```

This will reply to the intended sheepdog from the shepherd at a later time
