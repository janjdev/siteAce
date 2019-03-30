
  //routing....

  Router.configure({
    layoutTemplate: 'ApplicationLayout'
  });

  Router.route('/', function () {
  this.render('welcome', {
    to: 'main'
  });
});
    

   Router.route('/website_list', function () {
     this.render('navBar',{ to: 'navbar'});
     this.render('website_list', { to: 'main'});
   });

  Router.route('/website_details', function () {
    this.render('navBar', {to: 'navbar' });    
    this.render('website_details', {to: 'main'});
   });

Router.route('/user_Profile', function() {
    this.render('navBar', {to: 'navbar'});
   if (! Meteor.userId()) {
     this.render('register', {to: 'main'});
   } 
   else{ 
     this.render('user_Profile', {to: 'main'});
    }
});

Router.route('/edit_user_profile', function() {
     this.render('navBar',{ to: 'navbar'});
    if (! Meteor.userId()) {
     this.render('register', {to: 'main'});
   } 
   else{  
     this.render('edit_user_profile', { to: 'main'});
   }
});

  /// accounts config

Accounts.ui.config({
passwordSignupFields: "USERNAME_AND_EMAIL"
});


/// infiniscroll

Session.set("siteLimit", 8);
lastScrollTop = 0; 
$(window).scroll(function(event){
// test if we are near the bottom of the window
if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
  // where are we in the page? 
  var scrollTop = $(this).scrollTop();
  // test if we are going down
  if (scrollTop > lastScrollTop){
    // yes we are heading down...
   Session.set("imageLimit", Session.get("imageLimit") + 4);
  }

  lastScrollTop = scrollTop;
}
    
});

 
////
  // template helpers 
  /////
    Template.body.helpers({username:function(){
    if (Meteor.user()){
      return Meteor.user().username;
    }
    else {
      return "anonymous";
      }
    }
  });     
   Template.website_item.helpers({username:function(){
    if (Meteor.user()){
      return Meteor.user()._id;
    }
    else {
      return "";
    }
  }
});
  // helper function that returns all available websites
  Template.website_list.helpers({
    websites:function(){
      if (Session.get("siteFilter")){ //filtering
         var keyword  = Session.get("siteFilter");
         var results;
         for(var i = 0; i < keyword.length; i++ ){         
          var query = new RegExp("[^,]*"+keyword+"[^,]*",'ig');
          results = Websites.find( { $or: [{'title': query},
                                              {'description': query}
                                                  ]}, 
                                             {sort:{upVotes:-1, createdOn: -1}, limit:Session.get("siteLimit")});
              }   
          return results;
            }      
        else {
          return Websites.find({}, {sort:{upVotes:-1, createdOn: -1}, limit:Session.get("siteLimit")});         
        }
      },
      filtering_sites:function(){
        if (Session.get("siteFilter")){// filter set
          return true;
        } 
        else {
          return false;
        }
       
      },
      tags:function(){if(Session.get('tags')){var ar = Session.get('tags'); return ar.toString();}
      }
  }); 
   Template.website_details_form.helpers({username:function(){
    if (Meteor.user()){
      return Meteor.user().username;
    }
    else {
      return "anonymous";
      }
    },
      ID:function(){ var siteID = Session.get('site'); return siteID._id;
    }
  });
 
  Template.website_details.helpers({site: function(){
        return Session.get('site');          
      }     
  });

  Template.website_details_item.helpers({
    title: function(){ var t = Session.get('site'); return t.title;
    },
      url: function(){ var url = Session.get('site'); return url.url; 
    },
      description: function(){ var des = Session.get('site'); return des.description; 
    },
      comments: function(){ var post = Session.get('site'); return post.comments;
    },
      poster: function(){ var poster = Session.get('site'); return poster.postedBy;
    },
    filtering_sites:function(){
        if (Session.get("siteFilter")){// filter set
          return true;
        } 
        else {
          return false;
        }       
      },
       tags:function(){var ar = Session.get('tags'); var ars = ar.join(' '); return ars;
      }
});

Template.user_Profile.helpers({
  postcount:function(){
    if(Websites.find({postedBy: Meteor.user().username})){
      return Websites.find({postedBy: Meteor.user().username}).count();
    }
    else{
      return 0;
    }

  },
   commentsCount:function(){
      var count = 0;
      var c = Websites.find().fetch();
      for (var i = 0; i<c.length; i++){
      var b = c[i].comments; 
        for(var j = 0; j<b.length; j++){
          if(b[j].user === Meteor.user().username){
            count+=1;
          }
        }
      }
    return count;
  }    
});

Template.reccomendations.helpers({
   reccomendations:function(){
    if(Session.get('tags')){
     var results;
     var a = Session.get('tags');
   for(var k = 0; k < a.length; k++ ){  var query = new RegExp("[^,]*"+a[k]+"[^,]*",'ig');        
       results = Websites.find( { $or: [{'title': query},
                  {'description': query}
                    ]}, 
                  {sort:{upVotes:-1, createdOn: -1}, limit:Session.get("siteLimit")}).fetch();
        }
        return results;  
      }
    } 
});
  var nowords = 'and is was this where when what how why too much the of in to for with on at from by about as into like through after over between out against during without before under around among I you he they we she who them me him one her us something nothing anything himself everything someone themselves everyone itself anyone myself be have do say get make go know take see come think look want give use find tell ask work seem feel try leave call up so out just now how then more also here well only very even back there down still in as too when never really most';
  var no = nowords.split(" ");
  var no_l = no.length;
  /////
  // template events 
  /////
  Template.reccomendations.events({
    "click .js-recc":function(event){
      var id  = this.id;
      console.log(id);
    }
  });
  Template.website_item.events({
    "click .js-upvote":function(event){      
      var website_id = this._id;
      var tt = [];
      tt.push((this.title));
      tt.push(this.description);
      var ss = tt.toString().toLowerCase();
      var tags = ss.split(/[\s,]+/);
      for(var i = 0; i < no_l;){ for(var j = 0; j < tags.length; j++){ if(no[i] === tags[j]){ var newar = tags.splice(j, 1); } } i++;}
      Session.set('tags', tags);
      if (Meteor.user()){  
         var user = Meteor.user().username;  
        Websites.update({_id:website_id}, {$inc: {votes: 1}});
        Websites.update({_id:website_id}, {$inc:{upVotes: 1 }});
        Websites.update({_id:website_id}, {$addToSet:{voted:[{user: user}]}});
      }
      else{
        swal("Please sign in to vote!", "Oops...", "error");
      }
        var resp;
        if( window.innerWidth > 767){
             resp = '33.3%';
              }
              else{
                 resp = '0';
               }
       setTimeout(function(){
        $('.reccomendations').animate({left: resp});
       }, 5000);
       setTimeout(function(){
              $('.reccomendations').animate({left: '100%'});
       }, 10000);
        event.preventDefault(); // prevent the button from reloading the page
    }, 
    "click .js-downvote":function(event){
      var website_id = this._id;
      console.log("Down voting website with id "+website_id);
      // console.log(Meteor.user()); 
      if (Meteor.user()){  
          var user = Meteor.user().username;         
          Websites.update({_id:website_id}, {$inc: {votes: 1}});      
          Websites.update({_id:website_id}, {$inc:{downVotes: -1 }});
          Websites.update({_id:website_id}, {$addToSet:{voted: user}});
        }
        else{
          swal("Please sign in to vote!", "Oops...", "error");
        }
      
      event.preventDefault(); // prevent the button from reloading the page
   },
    "click .btn-primary":function(event){
      var id = this._id;
      Session.set('site', Websites.findOne({_id:id}));
      }     
  });
Template.website_details_form.events({
      "submit .js-add-comment":function(event){
      var i = document.getElementsByClassName('js-add-comment');
      var theID = i[0].getAttribute('id');
      var post = event.target.post.value;
           
      if(Meteor.user()){     
          var user = Meteor.user().username;
          if (post != ""){
          Websites.update({_id: theID}, {$addToSet:{comments:{user:user, comment:post}}});
          Session.set('site', Websites.findOne({_id:theID})); 
          $('input#post').removeClass('error');
          $('input#post').val('');
        }
        else{
          $('input#post').addClass('error');   
        }
      }       
        else{
          swal("Please sign in to post!", "Oops...", "error");
      }      
        event.preventDefault();
    }
});

Template.website_form.events({
"click .js-toggle-website-form":function(event){
  $("#website_form").toggle('slow');    
},
 "click .js-auto-pop":function(event){      
  var postURL = $('input#url').val();
if(postURL != ""){
     $('input#url').removeClass('error');
      Meteor.call("autoPop", postURL, function(error, data){
        if (error) {
         swal('Cant autoPop...Did you put "http(s)//"... enter manually  ', 'or try again...', 'error');
        }
      else{
        var html = $.parseHTML( data.content );
       var title, description;
      for (var i = 0, len = html.length; i < len; i++) {
          if(html[i].tagName === 'TITLE'){
                  title = html[i].innerHTML;             
                  }
                  else if
                     (html[i].tagName ==="META"){
                       if(html[i].getAttribute("name") === "description"){
                         description = html[i].getAttribute("content");
                      }
                    }
                  }       
      document.getElementById('title').value = title;
      document.getElementById('description').value = description;
      swal('Populate...' , 'Not bad', 'success');
      }  
  });          
}
else{
  $('input#url').addClass('error'); 
  }
    event.preventDefault();
},
 "mouseenter .js-auto-pop":function(event){
  $('.js-auto-pop').mouseenter(function(){
    $(this).popover('show');
  });
 },
  "submit .js-save-website-form":function(event){
    var url, title, description;
  // here is an example of how to get the url out of the form:
   url = event.target.url.value;
  console.log("The url they entered is: "+url);
  title = event.target.title.value;
  console.log("The title they entered is: "+title);
  description = event.target.description.value;
  console.log("The description they entered is: "+description);
  //  put your website saving code in here! 
  var pop_title, pop_desc;
  pop_title = $('input#title').val();
  pop_desc =  $('input#description').val();
  
    if (Meteor.user()){
      var user = Meteor.user().username;
              
    if(title !="" && url != "" && description != ""){
      if(pop_title != 'undefined' && pop_title != null && pop_desc != null && pop_desc != 'undefined'){ 
    Websites.insert({
      url:url, 
      title:title, 
      description:description,
      createdOn:moment().format('MM DD YYYY'),
      createdBy:Meteor.user()._id,
      postedBy: user,
      votes: 0,
      upVotes: 0,
      downVotes: 0,
      voted: [],
       comments: []
      });
    swal("Site added!", 'Nice.', 'success');
    }
    else{
        swal('Sorry Cant autoPop description or title...', 'enter manually...', 'error');
    }
  }
    else{
      swal("Please fill in the form.", "Or Autopop...", "warning");     
        }
  }
  else{
       swal("Please sign in to add sites!", "Oops...", "error");
      }
$("#website_form").toggle('slow');
  return false;// stop the form submit from reloading the page
    }
});

Template.website_search.events({
  'keyup input#siteSearch': function (evt) {
   Session.set("siteFilter", evt.currentTarget.value);
    }, 
   "submit .js-search":function(event){
    var str = $('input#siteSearch').val();
    var params = str.split(" ")
    console.log(params);
    Session.set("siteFilter", params);
    event.preventDefault();
  }
});
    
Template.website_list.events({
  'click a.js-unset-site-filter':function(event){
    Session.set("siteFilter", undefined);
  }
});
Template.website_details.events({
  'click a.js-unset-site-filter':function(event){
    Session.set("siteFilter", undefined);
  }
});
Template.user_Profile.events({

});

Template.register.events({
  "keyup input#passVerify":function(event){
    var pass = $('#passVerify').val();
    var passf = $('#passfirst').val();
    if(pass != passf ){
       $('#passVerify').removeClass('success');
      $('#passVerify').addClass('error');
    }
    else{
      $('#passVerify').removeClass('error');      
      $('#passVerify').addClass('success');
    }
  },
    "keyup input#passfirst":function(event){
    var passV = $('#passVerify').val();
    var passf = $('#passfirst').val();
    if(passf != passV ){
       $('#passVerify').removeClass('success');
      $('#passVerify').addClass('error');
    }
    else{
      $('#passVerify').removeClass('error');      
      $('#passVerify').addClass('success');
    }
  },
   "keyup input#username":function(event){
    var username = event.currentTarget.value;
    if(username != "" && username.length > 2 ){
      $('#username').removeClass('error');      
      $('#username').addClass('success');
    }
    else{      
       $('#username').removeClass('success');
      $('#username').addClass('error');
    }
  },
  "keyup input#email":function(event){
    var email = event.currentTarget.value;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email != "" && re.test(email) ){
      $('#email').removeClass('error');      
      $('#email').addClass('success'); 
    }
    else{     
      $('#email').removeClass('success');
      $('#email').addClass('error');
    }
  },
   "submit form#registration":function(event){
    event.preventDefault();
    var username = event.target.username.value;
    var email = event.target.email.value;
    var passVerify = event.target.passVerify.value;
    var passfirst = event.target.passfirst.value;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(username != ""){  
      $('#username').addClass('success');
        if(email != "" || re.test(email) ){
          $('#email').addClass('success');
          if(passVerify === passfirst && passVerify != ""){
            $('#passVerify').addClass('success');
              Accounts.createUser({
                  username: username,
                  email: email,
                  password: passVerify
               });
              swal("welcome " + username + "!", 'Nice.', 'success');
              Meteor.loginWithPassword(email, passVerify);
               
            }
        else{
          $('#passVerify').addClass('error');        
            }
        }
        else{    
        $('#email').addClass('error');
          }
       }   
        else{
          $('#username').addClass('error');
          }       
      }
}); 
 