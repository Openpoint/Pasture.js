exports.Settings={
	usermodules:[
		'template'
	],

	nodeurl:'http://94.23.205.140',
	nodeport:8080,

	usemongoose:false,
	mongoose:{
		datapath:'mongo', //specify a data directory relative to your app base directory
		port:'27017'	
	}	
}
