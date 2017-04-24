(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 100
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 50
        }
    })

})(jQuery); // End of use strict

$(function() {
    $('.spritespin').spritespin({
        // generate an array of image urls.
        // this is a helper function that takes a {frame} placeholder
        source: SpriteSpin.sourceArray('img/360/threesixty_{frame}.jpg', {
            // this ramge of numbers is interpolated into the {frame} placeholder
            frame: [1, 180],
            // the frame placeholder will be padded with leading '0' up to the number of 'digits'
            digits: 1
        }),
        // Specify the display width and height of the frame.
        // Optionally the size of the container can be defined with CSS.
        width: 265,
        height: 465,
        // Sense controls the direction and speed of the animation for mouse/touch interactions.
        // Here a negative value is chosen to invert the rotation, so the animation 'follows' the drag direction.
        // Values towards 0 will slow the animation down.
        sense: -1,
        frameTime: 2 * 12
    });
    // $(".spritespin").spritespin({
    //     source     : '/img/360view.jpg',
    //     module     : 'panorama', // activates panorama module
    //     width      : 265,        // window width
    //     height     : 465,        // window height
    //     frames     : 2091,       // image width, so its 1 pixel per frame
    //     sense      : 2,          // 2 rotations when dragging from side to side
    //     animate    : true,
    //     loop       : true
    // });
});

var spinDemo = function() {
    var spinAPI = $('.spritespin').spritespin('api');
    if (spinAPI.data.animate) {
        spinAPI.stopAnimation();
    } else {
        spinAPI.startAnimation();
    }
};

var openBingo = function() {
    var resurl = location.href.replace(/\?.*$/, "");
    if (resurl.substr(resurl.length - 1, 1) === '#') {
        resurl = resurl.substr(0, resurl.length - 1);
    }
    resurl += 'bingo/';

    window.location.href = resurl;
};

var openAI = function() {
    var resurl = location.href.replace(/\?.*$/, "");
    if (resurl.substr(resurl.length - 1, 1) === '#') {
        resurl = resurl.substr(0, resurl.length - 1);
    }
    resurl += 'ai/';

    window.location.href = resurl;
};

var test = function() {
    $.ajax({
        url: 'api/test',
        type: 'GET',
        data: {data: "something"},
        dataType: 'json',
        timeout: 120000,
        success: function(result) {
            console.log("result:" + JSON.stringify(result));
        }
    });
};
