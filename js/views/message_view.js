var app = app || {};

app.MessageView = Backbone.View.extend({
	el: "#messages",
  events:{
    "click #searchUsers": "searchuser",
    "click #refreshmgs": "getMSGS",
  },

  template: "#message-view",

	initialize: function() {
		this.render();
	},

  render: function() {
    var template = app.TemplateCache.get(this.template);
    this.$el.html(template);
    var div = document.getElementById('msgs');
    div.innerHTML=
      '<button id="refreshmgs" class="btn">Refresh Messages</button>'+
      '<div id="msg1">'+
      '</div>'+
      '<div id="msg2">'+
      '<form class="search-form" role="form">'+
        '<div class="form-group">'+
            ''+
        '</div>'+
      '</form>'+
      '</div>';
    this.init_msg();
    document.getMSGS();
    document.searchuser();
  },

  init_msg: function(){
    document.getMSGS = function(){
      var url="http://localhost:4568/deku/api/messages/"+app.user.id;
      var values="";
      $.get(url,values,function(data,textStatus,jqXHR){
        var todiv = "";
        for(var i=0; i < data['messages'].length; i++){
          message = data['messages'][i];
          todiv += '<a onclick="alert(\'no function yet\')">'+message.timestamp+'<BR \>'+message.from+': '+message.message+'</a><br \>';
        }
        document.getElementById('msg1').innerHTML=todiv;
      }).fail(function(){
      });
    }

    document.searchuser = function(){
      var url="http://localhost:4568/deku/api/users";
      var values="";
      var that = this;
      $.get(url,values,function(data,textStatus,jqXHR){
        var todiv = "<br><a>Click Users Below to send message</a><br>";
        for(var i=0; i < data['users'].length; i++){
          user = data['users'][i];
          todiv += '<a onclick="document.touser(' + user.id + ',\''+user.firstName+' '+user.lastName+'\');">'+user.firstName+' '+user.lastName+'</a><BR \>';
        }
        document.getElementById('msg2').innerHTML=todiv;
      }).fail(function(){
      });
    }

    document.sendMSG = function(to_id){
      var that=this;
      var url="http://localhost:4568/deku/api/messages/"+to_id;
      message = $('#themessage').val();
      values = {
        poster_id: app.user.id,
        message: message
      }
      $.post(url,values,function(data,textStatus,jqXHR){
        var todiv = "";
        document.getElementById('msg2').innerHTML =
          '<form class="search-form" role="form">'+
            '<div class="form-group">'+
                ''+
            '</div>'+
          '</form>'+
          '</div>';
        document.searchuser();
        document.getMSGS();

      }).fail(function(){
      });
    }

    document.touser=function(user_id,name){
      todiv=
      '<form class="search-form" role="form">'+
        '<div class="form-group">'+
            '<input type="text" id="themessage" name="searchuser" placeholder="Send to '+name+'">'+
            '<button id="sendMSG" class="btn" onclick="document.sendMSG('+user_id+');">Send</button>'+
            ''+
        '</div>'+
      '</form>';
      document.getElementById('msg2').innerHTML=todiv;
    }
  }

});
