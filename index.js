$(document).ready(function(){
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 113) {
            $('.arrow').fadeIn(200);
        } else {
            $('.arrow').fadeOut(200);
        }
    });

    $('.arrow').click(function () {
        $("html, body").animate({scrollTop: 0}, 300);
    })
});