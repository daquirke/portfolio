/* skills bar */


$(window).scroll(function() {
  var hT = $('#skill-bar-wrapper').offset().top,
    hH = $('#skill-bar-wrapper').outerHeight(),
    wH = $(window).height(),
    wS = $(this).scrollTop();
  if (wS > (hT+hH-1.4*wH)){
    jQuery(document).ready(function(){
      jQuery('.skillbar-container').each(function(){
        jQuery(this).find('.skills').animate({
          width:jQuery(this).attr('data-percent')
        }, 2000); // 3 seconds
      });
    });
  }
});

/* TYPING HEADER */

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }

  // ANIMATE CSS ONHOVER

  function animationHover(element, animation){
    element = $(element);
    element.hover(
      function() {
        element.addClass('animated ' + animation);
      },
      function(){
        //wait for animation to finish before removing classes
        window.setTimeout( function(){
          element.removeClass('animated ' + animation);
        }, 2000);
      });
  }

  $(document).ready(function(){
    $('#cool').each(function() {
      animationHover(this, 'bounce');
    });
  });


  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
}

/* contact form */

$('input').on('focusin', function() {
  $(this).parent().find('label').addClass('active');
});

$('input').on('focusout', function() {
  if (!this.value) {
    $(this).parent().find('label').removeClass('active');
  }
});

// WORK CAROUSEL

(function($){

  // Main code
  $(document).ready(function(){

    // Initialize the object on dom load
    var navigator = new Navigator({
      carousel: '#carousel',
      nextButton: '.arrow.next',
      prevButton: '.arrow.prev',
      shuffle: true
    });

    navigator.init();

  });


  // A Navigator "class" responsible for navigating through the carousel.
  function Navigator(config) {

    this.carousel = $(config.carousel); //the carousel element
    this.nextButton = $(config.nextButton); //the next button element
    this.prevButton = $(config.prevButton); //the previous button element
    this.chunkSize = config.chunkSize || 3; //how many items to show at a time (maximum)
    this.shuffle = config.shuffle || false; //should the list be shuffled first? Default is false.

    //private variables
    this._items = $(config.carousel + ' li'); //all the items in the carousel
    this._chunks = []; //the li elements will be split into chunks.
    this._visibleChunkIndex = 0; //identifies the index from the this._chunks array that is currently being shown


    this.init = function () {

      //Shuffle the array if neccessary
      if (this.shuffle) {
        //remove visible tags
        this._items.removeClass('visible');

        //shuffle list
        this._items.sort(function() { return 0.5 - Math.random() });

        //add visible class to first "chunkSize" items
        this._items.slice(0, this.chunkSize).addClass('visible');
      }

      //split array of items into chunks
      this._chunks = this._splitItems(this._items, this.chunkSize);

      var self = this;

      //Set up the event handlers for previous and next button click
      self.nextButton.on('click', function(e) {
        self.handleNextClick(e);
      }).show();

      self.prevButton.on('click', function(e) {
        self.handlePrevClick(e);
      });

      // Showing the carousel on load
      self.carousel.addClass('active');
    }

    //handle all code when previous button is clicked
    this.handlePrevClick = function (e) {

      e.preventDefault();

      //as long as there are some items before the current visible ones, show the previous ones
      if (this._chunks[this._visibleChunkIndex - 1] !== undefined) {
        this.showPrevItems();
      }
    };

    //handle all code when next button is clicked
    this.handleNextClick = function(e) {

      e.preventDefault();

      //as long as there are some items after the current visible ones, show the next ones
      if (this._chunks[this._visibleChunkIndex + 1] !== undefined) {
        this.showNextItems();
      }
    };

    //show the next 3 items
    this.showNextItems = function() {

      //remove visible class from current visible chunk
      $(this._chunks[this._visibleChunkIndex]).removeClass('visible');

      //add visible class to the next chunk
      $(this._chunks[this._visibleChunkIndex + 1]).addClass('visible');

      //update the current visible chunk
      this._visibleChunkIndex++;

      //see if the end of the list has been reached.
      this._checkForEnd();

    };

    //show the previous 3 items
    this.showPrevItems = function() {

      //remove visible class from current visible chunk
      $(this._chunks[this._visibleChunkIndex]).removeClass('visible');

      //add visible class to the previous chunk
      $(this._chunks[this._visibleChunkIndex - 1]).addClass('visible');

      //update the current visible chunk
      this._visibleChunkIndex--;

      //see if the beginning of the carousel has been reached.
      this._checkForBeginning();

    };


    //Determine if the previous button should be shown or not.
    this._checkForBeginning = function() {
      this.nextButton.show(); //the prev button was clicked, so the next button can show.

      if (this._chunks[this._visibleChunkIndex - 1] === undefined) {
        this.prevButton.hide();
      }
      else {
        this.prevButton.show();
      }
    };

    //Determine if the next button should be shown or not.
    this._checkForEnd = function() {
      this.prevButton.show(); //the next button was clicked, so the previous button can show.

      if (this._chunks[this._visibleChunkIndex + 1] === undefined) {
        this.nextButton.hide();
      }
      else {
        this.nextButton.show();
      }
    };


    //This function takes an array "items" and splits it into subArrays each with a maximum length of "chunk".
    this._splitItems = function(items, chunk) {

      var splitItems = [],
        i = 0;

      while (items.length > 0) {
        splitItems[i] = items.splice(0, chunk);
        i++;
      }

      return splitItems;

    };

  }

})(jQuery);
