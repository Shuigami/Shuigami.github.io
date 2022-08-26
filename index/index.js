$(document).ready(function(){
    $('main').scroll(function () {
        var y = $(this).scrollTop();
        console.log(y);
        if (y > 1) {
            $('.arrow').fadeIn(200);
        } else {
            $('.arrow').fadeOut(200);
        }
    });

    $('.arrow').click(function () {
        $("html, body").animate({scrollTop: 0}, 300);
    });
});