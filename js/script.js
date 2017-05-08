(function ($, root, undefined) {$(function () {'use strict'; // on ready start
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////
//        general
///////////////////////////////////////

  // css tricks snippet - http://css-tricks.com/snippets/jquery/smooth-scrolling/
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 500);
          return false;
        }
      }
    });
  });

  // inserts current year
  $('.js-year').html(new Date().getFullYear());

  // detects touch device
  if ("ontouchstart" in document.documentElement){
    $('html').addClass('touch');
  }


///////////////////////////////////////
//        Navigation
///////////////////////////////////////

  // mobile nav toggle open & close
  $('.js-toggle-mobile-nav').on('click', function(e) {
    $('.mobile-nav').toggleClass('is-open').toggleClass('is-closed');
  });

  // current page nav highlight
  var currentPage = $('body').data('current-page');
  $('.' + currentPage + ' .site-nav__item--' + currentPage).addClass('site-nav__item--current');


///////////////////////////////////////
//      SVG image swap
///////////////////////////////////////

  // finds image with class and swaps .png with .svg in img source string
  if (Modernizr.svgasimg) {
    var svgSwap = $('img.js-svg-swap');
    svgSwap.each( function() {
      var currentSrc = $(this).attr('src'),
          newSrc = currentSrc.replace('.png', '.svg');
      $(this).attr('src', newSrc);
    });
  }


///////////////////////////////////////
//      Parallax
//      [ example: <div class="parallax" data-parallax-speed="0.2"> ]
///////////////////////////////////////

  // $(document).scroll(function(){
  //   var scrolled = $(document).scrollTop();
  //   $('.parallax').each(function(){
  //     var speed = $(this).attr('data-parallax-speed');
  //     var offset = $(this).offset();
  //     var parallax = -(scrolled - offset.top) * speed ;
  //     $(this).css('background-position', 'center ' + parallax + 'px');
  //   });
  // });


///////////////////////////////////////
//    Generic modal
///////////////////////////////////////

  var modal          = $('.js-modal'),
      modalLaunchBtn = $('.js-open-modal'),
      modalCloseBtn  = $('.js-close-modal');

    // opens modal
    function modalOpen(event){
      event.preventDefault();
      // disable scrolling on background content (doesn't work iOS)
      $('body').addClass('disable-scroll');
      // // open modal
      modal.fadeIn('250', function(){
        $(this).removeClass('is-closed').addClass('is-open');
      });
    }

    // closes modal
    function modalClose(event){
      event.preventDefault();
      // enable scrolling
      $('body').removeClass('disable-scroll');
      // close modal with fade
      modal.fadeOut('250', function(){
        $(this).removeClass('is-open').addClass('is-closed');
      });
    }

    // launches modal when offer is clicked
    modalLaunchBtn.on('click', function(event) {
      modalOpen(event);
    });

    // closes modal on close icon click
    modalCloseBtn.on('click', function(event) {
      modalClose(event);
    });

    // closes modal on background click
    modal.on('click', function(event) {
      if (event.target !== this){
        return;
      }
      modalClose(event);
    });

    // closes modal on escape key press
    $(document).keyup(function(event) {
       if (event.keyCode == 27) {
         modalClose(event);
        }
    });


///////////////////////////////////////
//      Youtube thumbnails
///////////////////////////////////////

  // stopped on touch devices
  if ( $('html.touch').length === 0 ) {

    // Loops through all videos on page
    $('.js-youtube-thumbnail').each(function(index, el) {
      var video             = $(this).find('.video__iframe'),
          videoSrc          = video.attr('src'),
          thumbnailImg      = $(this).data('thumbnail-img'),
          thumbnailElement  = '<div class="video__thumbnail" style="background-image: url(\'' + thumbnailImg + '\')"><div class="video__play js-play-video"></div></div>';

      // hide video, but keep aspect ratio
      video.css('visibility', 'hidden');

      // Add thumbnail element to hold image & play button
      $(this).prepend(thumbnailElement);
      var thumbnail   = $(this).find('.video__thumbnail'),
          playButton  = $(this).find('.js-play-video');

      // play button event
        playButton.on('click', function(e) {
          e.preventDefault();
          // add auto play query to iframe
          video.attr('src', videoSrc + '&autoplay=1');
          // fade out iframe and show video
          thumbnail.fadeOut( 175, function() {
            video.css('visibility', 'visible');
          });
        });

    });

  }


///////////////////////////////////////
//       Banner
///////////////////////////////////////

function bannerfade(){
	var st = $(document).scrollTop();
	var wh = $(window).height();

	$('.banner__overlay').css({
    "opacity": st / (wh*0.75)
	});

}

$(document).scroll(function() {
	bannerfade();
});


///////////////////////////////////////
//       Game
///////////////////////////////////////


$('.game__answer').click(function(e){
  e.preventDefault();

  var parent = $('.game'),
      questions = $('.game'),
      question_number = $(this).attr('data-question'),
      question_answer = $(this).attr('data-answer'),
      question_answer_description = $(this).attr('data-answer-description'),
      result = $('#result');

  result.attr("data-question-" + question_number, question_answer);

  // form result description
  $('#result-answer-'+question_number).html(question_answer_description);

  // next question
  var current_question = questions.find('.game__question--active');
  var next_question = current_question.next('.game__question');
  current_question.removeClass('game__question--active');
  next_question.addClass('game__question--active');

  if( next_question.length == 0 ) {
    $('.game').addClass('game--complete');

    // answers
    var resultanswer1 = result.attr('data-question-1'),
        resultanswer2 = result.attr('data-question-2'),
        resultanswer3 = result.attr('data-question-3'),
        resultanswer4 = result.attr('data-question-4'),
        resultanswer5 = result.attr('data-question-5'),
        resultanswer6 = result.attr('data-question-6');

    $('.offer').each(function(){
      if( $(this).attr('data-q1') == resultanswer1 ){
        $(this).addClass('offer--selected');
      }
    });

  }

});


///////////////////////////////////////////////////////////////////////////////
});})(jQuery, this); // on ready end