![header](https://cloud.githubusercontent.com/assets/998947/7785206/d2701322-017c-11e5-8546-cd1b149cef8e.jpg)

Pasture provides the plumbing that connects your server with the CPU's of every visitor to your website. This enables you to stay focused on the business logic of your distributed computing project.

It has a modular structure built on top of Node.js and Socket.io. These establish Web Sockets between HTML5 clients and a Node server. Pasture creates the "talk()" syntax for passing instructions bi-directionally between the server, browser Window and Web Workers.

The server is the **Shepherd**, Browser Windows are **Sheepdogs** and Web Workers are **Sheep**  

##Easy syntax

The "talk()" syntax is central to Pasture and extends an otherwise normal javascript workflow.

- **talk().emit(**_instruction_**)** - signals all connected sheepdogs
- **talk().reply(**_instruction_**)** - replies to one specific sheepdog
- **talk().broadcast(**_instruction_**)** - replies to all except specific sheepdog
- **talk().back(**_instruction_**)** - bridges between sheep, sheepdogs and the shepherd from the remote side

_instruction_ follows a syntax of **('target','action','value','arguments')**,so:
```javascript
talk().emit('sheep.search.scraper','do','scrape',['pasture','wikipedia.com']);
```			
will tell all 'scraper' sheep in the 'search' module to:
```javascript
scraper.scrape('pasture','wikipedia.com');
```			

talk() Is further extended to allow the system to communication in asynchronous server scopes, so:
```javascript
talk(id).reply('sheep.search.scraper','do','scrape',['pasture','wikipedia.com']);				
```			
will use the 'id' variable from the asynchronous scope to communicate.

Further methods for chaining and batching instructions are described in the bundled documentation. Pasture does NOT use eval(). No, not for anything - ever.

##Modular Development

Pasture works out of the box on Unix type servers. Install:

- Node.js
- NPM
- and optionally MongoDB

Clone pasture from GIT, browse to the project root and adjust 'settings.js' for your environment. Then do:

- $npm install
- $node ./pasture.js

You will have an instance of this website running at your specified URL and port. You can adjust the index.html in the project root to your needs. Static resources are in the 'public' directory.

All module development is done in the '_projectroot_/pasture/user' directory. There you will see a readme and the 'template' directory. 'Template' is the module that this website is running. Copy it, rename it to 'your_module_name' and announce it in 'settings.js'.

A module has at minimum 3 files:

- your_module_name.shepherd.js
- your_module_name.sheepdog.js
- sheep/your_module_name.your_sheep_name.js

##Module example

Below is a fictional, simplified module example. It illustrates a Pasture module's code structure, syntax and logic by representing a tea room serving customers while gauging customer satisfaction. It has hooks for promotions, product quality analysis and HR modules.

The **shepherd** is code running in your node.js server and looks like this:

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

A **sheepdog** is code running in a HTML5 browser Window scope and looks like this:

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
        cuppa.madeby=socket.id;
        cuppa.problem='Out of sides';
        guest.satisfied=false;       
        talk().back('shepherd.lab','do','analyse',[cuppa,sides,guest]);
        sides=0;
        talk().back('shepherd.tea','do','served',[guest]);
    }else{
        talk().back('shepherd.bossman','do','askfornewjob',['Two bad cups in a row',guest]);
    }
}
tea.promotion=function(message){
    $('#promo').html(message);
}				
```			

A **sheep** is code running in a HTML5 Web Worker and looks like this:

```javascript
var sheep_name='kettle';
function  maketea(){
    return //result of some CPU or network heavy work for making a cup of tea
}
kettle.boil=function(liquid){
    var cuppa={type:liquid,problem:false,madeby:null,magic:null};
    cuppa.magic= maketea(); 
    talk().back('sheepdog.tea','do','isready',[cuppa]);
    talk().back('shepherd.lab','do','totalcupsadd',[1]);
}			
```			

##What next?

- Integrate socket.io's 'rooms' concept to create 'talk(group).emit(_instruction_)'
- Explore WEBRTC and projects like +Peerserver further.
- Explore the feasibility of a 'talk(subject).sideways(_instruction_)'.


Enjoy Pasture responsibly.
