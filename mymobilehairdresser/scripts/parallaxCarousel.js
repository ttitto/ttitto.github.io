$('.carousel').on('slide.bs.carousel', function () {
    animationRecall(".sliding-bigger");
    animationRecall(".sliding-italic");
    animationRecall(".sliding-bold");
});

function animationRecall(className) {
    var slidingEls = $(className);
    for (var i = 0; i < slidingEls.length; i++) {

        var oldEl = slidingEls[i];
        var newEl = oldEl.cloneNode(true);
        oldEl.parentNode.replaceChild(newEl, oldEl);
    }
}

$(document).ready(function () {
    $('#slide-menu-caller').sidr()
});

$(document).ready(function () {
    $('.carousel').carousel({
        interval: 6000, cycle: true
    })
});

