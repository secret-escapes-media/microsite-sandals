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
  //    Generic modal
  ///////////////////////////////////////

  var modal          = $('.js-modal'),
      modalLaunchBtn = $('.js-open-modal'),
      modalCloseBtn  = $('.js-close-modal'),
      modalCloseAreas  = $('.modal__wrap, .js-modal');

  modalLaunchBtn.click(function(){

    var targetModal = $(this).attr('data-modal');
    var modalItem = $(this).attr('data-modal-item');

    if(modalItem){
      $('.modal__item').addClass('modal__item-inactive');
      $('#modal__item-' + modalItem ).removeClass('modal__item-inactive');
    }

    // disable scrolling on background content (doesn't work iOS)
    $('body').addClass('disable-scroll');
    // // open modal
    $('#modal-' + targetModal).fadeIn('250', function(){
      $(this).removeClass('is-closed').addClass('is-open');
    });

    $('#modal-' + targetModal).find('.decoration').addClass('animate');

  });

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

  // closes modal on close icon click
  modalCloseBtn.on('click', function(event) {
    modalClose(event);
  });

  // closes modal on background click
  modalCloseAreas.on('click', function(event) {
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


  function GetQueryStringParams(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam){
        return sParameterName[1];
      }
    }
  }​


  // launches modal if query string
  var modalQuery = GetQueryStringParams('modal');

  if (modalQuery) {
    var targetModal = modalQuery;
    $('body').addClass('disable-scroll');
    $('#modal-' + targetModal).fadeIn('250', function(){
      $(this).removeClass('is-closed').addClass('is-open');
    });
  }

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
      questions = $('.game__questions'),
      question_number = $(this).attr('data-question'),
      question_answer = $(this).attr('data-answer'),
      question_answer_description = $(this).attr('data-answer-description'),
      result = $('.game__result');


  /* SAVE RESULTS */
  // save results from the questions onto the #result element
  result.attr("data-question-" + question_number, question_answer);


  /* RESULT STRING */
  // form result description sentence
  $('.game__complete-text .q'+question_number).html(question_answer_description);


  /* GO TO NEXT Q */
  var current_question = questions.find('.game__question--active');
  var next_question = current_question.next('.game__question');
  current_question.fadeOut().removeClass('game__question--active');
  next_question.fadeIn().addClass('game__question--active');


  /* REVEAL OFFER RESULTS */
  // if last question answered, find resulting offers
  if( next_question.length == 0 ) {
    parent.addClass('game--complete');

    // answers
    var resultanswer1 = result.attr('data-question-1'),
        resultanswer2 = result.attr('data-question-2'),
        resultanswer3 = result.attr('data-question-3'),
        resultanswer4 = result.attr('data-question-4'),
        resultanswer5 = result.attr('data-question-5'),
        resultanswer6 = result.attr('data-question-6');

    /* OFFER FILTER */
    // if (correct answer, or pass this question)
    $('.offer').each(function(){
      if(
        ($(this).attr('data-q1') == resultanswer1 || $(this).attr('data-q1') == 'pass') &&
        ($(this).attr('data-q2') == resultanswer2 || $(this).attr('data-q2') == 'pass') &&
        ($(this).attr('data-q3') == resultanswer3 || $(this).attr('data-q3') == 'pass') &&
        ($(this).attr('data-q4') == resultanswer4 || $(this).attr('data-q4') == 'pass') &&
        ($(this).attr('data-q5') == resultanswer5 || $(this).attr('data-q5') == 'pass')
      ){
        $(this).addClass('offer--selected');
      }else{
        $(this).addClass('offer--eliminated');
      }
    });

  }

});

/* RESET GAME */
$('.game__reset').click(function(e){
  e.preventDefault();

  var parent = $('.game'),
      questions = $('.game__questions'),
      result = $('.game__result');

  var current_question = questions.find('.game__question--active');
  var first_question = $('.game__question').first();
  current_question.removeClass('game__question--active');
  first_question.show().addClass('game__question--active');

  result.removeAttr('data-question-1');
  result.removeAttr('data-question-2');
  result.removeAttr('data-question-3');
  result.removeAttr('data-question-4');
  result.removeAttr('data-question-5');

  $('.offer').removeClass('offer--selected');
  $('.offer').removeClass('offer--eliminated');

  parent.removeClass('game--complete');
  parent.removeClass('game--viewoffers');
});

/* VIEW ALL OFFERS */
$('.game__viewoffers').click(function(e){
  e.preventDefault();

  var parent = $('.game'),
      questions = $('.game__questions'),
      result = $('.game__result');

  $('.game__question--active').removeClass('game__question--active').hide();
  $('.game__question').first().addClass('game__question--active').show();

  result.removeAttr('data-question-1');
  result.removeAttr('data-question-2');
  result.removeAttr('data-question-3');
  result.removeAttr('data-question-4');
  result.removeAttr('data-question-5');

  $('.offer').removeClass('offer--selected');
  $('.offer').removeClass('offer--eliminated');

  parent.addClass('game--complete');
  parent.addClass('game--viewoffers');
});


///////////////////////////////////////
//       UGC Tiles
///////////////////////////////////////


$('.ugc__content').slideUp();

function ugcExpand(target){


  if( $(target).hasClass('active') ){

    $(target).removeClass('active');
    $(target).find('.ugc__content').slideUp(250);
    $(target).addClass('inactive');

  }else{

    $('.ugc.active .ugc__content').slideUp(250);
    $('.ugc.active').removeClass('active').addClass('inactive');

    $(target).removeClass('inactive');
    $(target).addClass('active');
    $(target).find('.ugc__content').slideDown(250);
  }

}

$('.ugc').click(function(){
  ugcExpand(this);
});




///////////////////////////////////////////////////////////////////////////////
});})(jQuery, this); // on ready end