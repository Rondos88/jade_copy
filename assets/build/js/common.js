$(document).ready(function () {
  $(".hamburger").click(function(){
    $(this).toggleClass('is-active');
    $('.main-menu-line').toggleClass('open');
    $('.cabinet-sidebar').toggleClass('open');
    $('.cabinet-content').toggleClass('shift');
  });

  $('.cabinet-sidebar .btn-close').click(function(){
    $('.hamburger').removeClass('is-active');
    $('.cabinet-sidebar').removeClass('open');
    $('.cabinet-content').removeClass('shift');
  });

  $('.referrals-btn').click(function() {
    $(this).toggleClass('shift')
    $('.referral-block').toggleClass('open');
  });

  $(window).click(function () {
    $('.referral-block').removeClass('open');
    $('.referrals-btn').removeClass('shift');
  });

  $('.referrals-btn').click(function (event) {
    event.stopPropagation();
  });

    $(".referral-block-content, .cabinet-sidebar-content").niceScroll({
        cursorborder:"",
        cursorcolor:"#f67f00",
        cursorwidth: 2,
        cursorborderradius: 0,
        autohidemode: false,
    });

  //accordion
  (function ($) {
    $('.accordion > li:eq(0) .accordion-title').addClass('active').next().slideDown().parent().addClass('active');
    $('.accordion .accordion-title').click(function (j) {
      var dropDown = $(this).closest('li').find('.question-block');
      $(this).closest('.accordion').find('.question-block').not(dropDown).slideUp();
      if ($(this).hasClass('active')) {
        $(this).removeClass('active').parent().removeClass('active');
      } else {
        $(this).closest('.accordion').find('.accordion-title.active').removeClass('active').parent().removeClass('active');
        $(this).addClass('active').parent().addClass('active');
      }
      dropDown.stop(false, true).slideToggle();
      j.preventDefault();
    });
  })(jQuery);

  //placeholder
  $('input,textarea').focus(function () {
    $(this).data('placeholder', $(this).attr('placeholder'));
    $(this).attr('placeholder', '');
  });
  $('input,textarea').blur(function () {
    $(this).attr('placeholder', $(this).data('placeholder'));
  });

  //focus input
  $('.js-focus').focus(function() {
    $(this).parent().addClass('focused');
  });

  $('.js-focus').blur(function() {
    $(this).parent().removeClass('focused');
  });

  //tabs
  $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
    $(this).addClass('active').siblings().removeClass('active').closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
  });

  //table-responsive
  $(function () {
    $('table.responsive').ngResponsiveTables();
  });



  //popup-certificate
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

  //video popup
  $('.popup-youtube').magnificPopup({
    disableOn: 300,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    gallery: {
      // options for gallery
      enabled: true
    },
    fixedContentPos: false
  });

  $('.str').liMarquee({
    direction: 'right', //Указывает направление движения содержимого контейнера (left | right | up | down)
    loop: -1, //Задает, сколько раз будет прокручиваться содержимое. "-1" для бесконечного воспроизведения движения
    scrolldelay: 0, //Величина задержки в миллисекундах между движениями
    scrollamount: 50, //Скорость движения контента (px/sec)
    circular: true, //Если "true" - строка непрерывная
    drag: true, //Если "true" - включено перетаскивание строки
    runshort: true, //Если "true" - короткая строка тоже "бегает", "false" - стоит на месте
    hoverstop: false, //true - строка останавливается при наведении курсора мыши, false - строка не останавливается
    inverthover: false //false - стандартное поведение. Если "true" - строка начинает движение только при наведении курсора
  });



  AOS.init(
    {
      // Global settings
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
      initClassName: 'aos-init', // class applied after initialization
      animatedClassName: 'aos-animate', // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll

      // Settings that can be overriden on per-element basis, by `data-aos-*` attributes:
      offset: 0, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 1200, // values from 0 to 3000, with step 50ms
      easing: 'ease-in-out', // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
    }
  );

  //slider sliderUi home.page
  function sliderUi1() {
    $('#slider-range').slider({
      range: "min",
      value: 10,
      min: 10,
      max: 1000,
      slide: function slide(event, ui) {
        updateSliderUi(1,ui.value);
      }
    });

    updateSliderUi();

    $("#amount").on('click keyup', function() {
      $("#slider-range").slider("value", $(this).val());
      $("#custom-handle").text($(this).val());
    });

    function updateSliderUi(slider,val) {
      var amount = slider == 1 ? val : $("#amount").val();
      $( "#amount" ).val(amount);
      $("#custom-handle").text(amount);
    }
  }

  sliderUi1();

  //slider sliderUi investors.page
  function sliderUi2() {
    var handle = $('#custom-handle2');
    $('#slider-range2').slider({
      range: "min",
      value: 10,
      min: 10,
      max: 100000,
      create: function create() {
        handle.text($(this).slider("value"));
      },
      slide: function slide(event, ui) {
        handle.text(ui.value);
      }
    });
  }

  sliderUi2();

  //scroll up
  $('.scroll-up').click(function () {
    $("html, body").animate({scrollTop: 0}, 600);
    return false;
  });

  //circle-progress
  function animateElements() {
    $('.progressbar-around').each(function () {
      var elementPos = $(this).offset().top;
      var topOfWindow = $(window).scrollTop();
      var percent = $(this).find('.circle-progress').attr('data-percent');
      var animate = $(this).data('animate');
      if (elementPos < topOfWindow + $(window).height() - 30 && !animate) {
        $(this).data('animate', true);
        $(this).find('.circle-progress').circleProgress({
          startAngle: -Math.PI / 4 * 2,
          value: percent / 100,
          size: 280,
          thickness: 30,
          emptyFill: "#EBEBEB",
          animation: {duration: 3000,},
          fill: {
            color: "#FE8A0D"
          }
        }).stop();
      }
    });
  }

  // Show animated elements
  animateElements();
  $(window).scroll(animateElements);

  //progress referrals activity
  $("#ref-active").circliful({
      animationStep: 5,
      foregroundBorderWidth: 10,
      backgroundBorderWidth: 0,
      percent: 80,
      halfCircle: 1,
      foregroundColor: '#f67f00',
      fontColor: '#ffffff',
      percentageTextSize: 24
  });

    $(window).resize(function() {
        $width = $(window).width();
        if ($width > 1770) {
            $('.cabinet-sidebar').addClass('open');
            $('.cabinet-content').addClass('shift');
        } else {
            $('.cabinet-sidebar').removeClass('open');
            $('.cabinet-content').removeClass('shift');
        }
    });

    $(window).load(function () {
        $width = $(window).width();
        if ($width > 1770) {
            $('.cabinet-sidebar').addClass('open');
            $('.cabinet-content').addClass('shift');
        } else {
            $('.cabinet-sidebar').removeClass('open');
            $('.cabinet-content').removeClass('shift');
        }
    });

});




//local-time
function cityTime() {

  var Russian = moment();

  var time_moscow = moment.tz("Europe/Moscow").format('HH:mm');
  var time_moscowRussian = Russian.tz("Europe/Moscow").format('DD MMMM YYYY');

  $('#time').text(time_moscow);
  $('#date').text(time_moscowRussian);
}

$(document).ready(function () {
  setInterval('cityTime()', 1000);
});

