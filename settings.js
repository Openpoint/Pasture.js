exports.Settings={
	usermodules:[
		'template'
	],

	nodeurl:'http://pasture.openpoint.ie',
	nodeport:8081,

	usemongoose:false,
	mongoose:{
		datapath:'mongo', //specify a data directory relative to your app base directory
		port:'27017'	
	}	
}
