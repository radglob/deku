var app = app || {};

app.InfoView = Backbone.View.extend({
  el: '#container',

  template: _.template( $('#info-form').html() ),

  events: {
		"submit #info": "getLogin"
	},

  initialize: function() {
    this.listenTo(app.user, 'change', this.destroyView);
    this.render(); 
  },

  render: function() {
    this.$el.html(this.template).fadeIn(350);
  },

	formErrors: function(values) {
		error = false;
    major_list = $('#major').children().map(function() { return this.value;}).get();
    year_list = $('#year').children().map(function() { return this.value;}).get();

		if (values.bio === '') {
			error = true;
			$('#bio').val('')
			.attr('placeholder', 'Please tell us something about yourself')
      .focus();
		}
		
    if (values.classes === '') {
			error = true;
			$('#classes').val('')
			.attr('placeholder', 'Please enter your classes this semester')
      .focus();
		}

		//Right now this only checks for an empty string.
		//Eventually it should compare against the possible list of options
		//and reject it if it does not match something in it.
		if (values.major === '' || $.inArray(values.major, major_list) === -1) {
			error = true;
			$('#major-list').val('')
			.attr('placeholder', 'Please select your major from the given list')
      .focus();
		}

		//eventually, we might want to consider adding an upper bound
		//to the grad year
		if (values.year === '' || $.inArray(values.year, year_list) === -1){
			error = true;
			$('#grad-year').val('')
			.attr('placeholder', 'Please enter a valid graduation year')
      .focus();
		}

		return error;
	},

  getLogin: function(event) {
    event.preventDefault();

    var that = this;
		
		values = {
			year: $('#grad-year').val(),
			major: $('#major-list').val(),
			classes: $('#classes').val().trim(),
			bio: $('#bio').val().trim()
		};

		if (!this.formErrors(values)) {
			this.$el.fadeOut(350, function() {new app.LoginView();});
		}
  },

  destroyView: function() {
    this.undelegateEvents();
    this.stopListening();
    return this;
  }
});
