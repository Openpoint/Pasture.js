var fs={};
fs.pasture=new Image();
fs.pasture.src="../images/pasture_master.png"; 
fs.shepherd=new Image();
fs.shepherd.src="../images/shepherd.png"; 
fs.sheepdog=new Image(); 
fs.sheepdog.src="../images/sheepdog.png"; 
fs.sheep=new Image();
fs.sheep.src="../images/sheep.png"   




function logo(x){
	window.scrollTo(0,0);
	$('#logo').html(x);
	$('#logo img').css('background','teal').stop().animate({'backgroundColor':'none'},500)
}
