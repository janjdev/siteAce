
Meteor.users.allow({
	insert:function(userId){
		if(Meteor.user()){ //logged in			
				return true;
			}			
		else{
			return false;
		}
	},
	update:function(userId, doc){	
		if(Meteor.user()){ //logged in			
				return true;
			}			
		else{
			return false;
		}
	},

});

//Create a collection of websites
Websites = new Mongo.Collection("websites");

//Set up app security
Websites.allow({
	insert:function(userId, doc){
		if(Meteor.user()){ //logged in			
				return true;
			}			
		else{
			return false;
		}
	},
	update:function(userId, doc){	
		if(Meteor.user()){ //logged in			
				return true;
			}			
		else{
			return false;
		}
	},
	remove:function(userId, doc){
		if(Meteor.user()){ //logged in
			if(userId != createdBy){ //not their account
				return false;
			}
			else{ //user is logged in and  account is theirs
				return true;
			}		
		}
		else{
			return false;
		}
	}
});


// ProfileImage = new Mongo.Collection("propic")
// //FS.Collection(“propic”) {
//  stores: [imageStore]
// };

// ProfileImage.allow({
// 	insert:function(userId){
// 		if(Meteor.user()){
// 			return true;
// 		}
// 		else{
// 			return false;
// 		}
// 	},
// 	update:function(userId, doc){
// 		if(Meteor.user()){
// 			if(userId != upLoadedby){
// 				return false;
// 			}else{
// 				return true;
// 			}
// 		}
// 		else{
// 			return false;
// 		}
// 	},
// 	remove:function(userId, doc){
// 		if(Meteor.user()){
// 			if(userId != upLoadedby){
// 				return false;
// 			}
// 			else{
// 				return true;
// 			}
// 		}
// 		else{
// 			return false;
// 		}
// 	},
// 	download:function(){
// 		if(Meteor.user()){
// 			return true
// 		}else{
// 			return false;
// 		}
// 	}

// });