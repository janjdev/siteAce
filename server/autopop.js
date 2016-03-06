	
Meteor.methods({
	autoPop:function(postURL)
	{	
	    var result = HTTP.call( 'GET', postURL);
	    return result;
	}	   
      
 });
