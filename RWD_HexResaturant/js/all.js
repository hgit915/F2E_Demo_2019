$(document).ready(function () {

    $('.top a').click(function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 1000);

    });

    $('.menu .menu-bar').click(function (e) {
        e.preventDefault();
        $('.topmenu').toggleClass('show');


    });



});