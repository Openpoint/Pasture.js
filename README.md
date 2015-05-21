# Pasture.js
Pasture is a framework for distributed, browser based computing systems.

![pasture_master](https://cloud.githubusercontent.com/assets/998947/7757711/528b78c6-fffc-11e4-868a-4bab7857b964.png)

It is a modular JS framework built on top of Node.js and Socket.io. These establish web sockets between HTML5 browser clients and your node server. Pasture provides a common language to pass instructions bi-directionaly between your server, the browser JS Window and browser Web Workers. 

##Terminology:

**Shepherd**    -Your node server

**Sheepdog**    -Any client browser that is connected to your website

**Sheep**       -Any web worker that is created in a Sheepdog

Each module you create represents a server side (shepherd) and client side(sheepdog + sheep) logic.
Shepherds are responsible for packaging tasks and instructing the sheepdogs to execute them.
Sheepdogs are responsible for further dissemination of tasks to sheep, listening to sheep and sending feedback to the shepherd.

Shepherds run on the node.js server and are in the form of:

```javascript
var module_name='tea';
var ontheside=['milk','cookies','sugar'];
talk().emit('sheepdog.tea','set','ontable',ontheside,true);
talk().emit('sheep.tea.kettle','do','boil',['water'],true);
talk().emit('sheepdog.tea','set','guests_are','waiting for tea',true);
talk().process(); 
tea.served=function(guest){
	if(guest.satisfied){
		talk().reply('sheepdog.tea','set','guests_are','waiting for another tea',true);
		talk().emit('sheep.tea.waitor','do','addtobill',[guest.name],true);
		talk().reply('sheep.tea.kettle','do','boil',['water'],true);		
		talk().broadcast('sheepdog.tea','do','promotion',[guest.name+' had a nice cup of tea'],true);
		talk().process();
	}else{
		talk().reply('sheepdog.tea','set','guests_are','waiting for a better cup of tea',true);		
		ontheside.push(getnewtreat());
		talk().reply('sheepdog.tea','set','totable',ontheside,true);
		talk().reply('sheep.tea.kettle','do','boil',['milk'],true);		
		talk().process();	
	}
}
```
Sheepdogs run in js browser Window and are in the form of:
 	
```javascript
var module_name='tea';
var guest={satisfied:false,name:socket.id};
var sides=0;
tea.isready=function(cuppa){
	console.log('Guests are '+tea.guests_are);
	if(tea.ontable[sides]){
		guest.satisfied=true;
		sides++;
		talk().back('shepherd.tea','do','served',[guest]);
	}else if(tea.guests_are !=='waiting for a better cup of tea'){
		cuppa.problem='Out of sides';
		guest.satisfied=false;
		sides=0;
		talk().back('shepherd.lab','do','analyse',[cuppa,sides,guest]);
		talk().back('shepherd.tea','do','served',[guest]);
	}else{
		talk().back('shepherd.bossman','do','askfornewjob',['Two bad cups in a row',guest]);
	}
}
tea.promotion=function(message){
	$('#promo').html(message);
}
```

Sheep run in Web Workers and are in the form of:
 	
```javascript
var sheep_name='kettle';
function  maketea(){
	return <some CPU or network heavy work for making a cup of tea>
}
kettle.boil=function(liquid){
	var cuppa={type:liquid,problem:false,madeby:socket.id,magic:null};
	cuppa.magic= maketea(); 
	talk.back('sheepdog.tea','do','isready',[cuppa]);
}
```

##Quick Start:

Pasture is developed on Ubuntu 14.04, and should be compatible with any Unix type system.

####Prerequisites:
Install Node.js, Node Package Manager (NPM) and optionally MongoDB. Ensure that these are in your PATH.
Download and copy Pasture into your project root and do `<your_project>$ npm install`

Adjust  <your_project>/settings.js to suite your environment

####Starting Pasture:

At the command prompt, do `<your_project>$ node ./pasture.js`

Cntr_C will gracefully shut it down.

In any HTML5 browser, go to the URL and port you specified in settings.js - eg `http://<your_domain>:8080`
If you have node running on port 80, no need to specify the port in the browser. 

####Creating Pasture modules:

Everyting you need to create Pasture modules are in `<your_container>/pasture/user`. The 'readme' there contains detailed usage instructions. There is also a 'template' module folder which contains, as you would expect, templates.
To create your own single page application, just modify `<your_project>/index.html` and `<your_project>/settings.js` accordingly. Add custom page css and js in `<your_project>/public/<css or js>` and link in (top of) the head of index.html. 
