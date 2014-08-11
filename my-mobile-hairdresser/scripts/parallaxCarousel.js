/**
 * Created by ttitto on 14-8-11.
 */

$('.carousel').on('slid.bs.carousel', function () {
    animationRecall(".sliding");
});

function animationRecall(className) {
    var slidingEls = $(className);
    for (var i=0;i<slidingEls.length; i++) {
        var oldEl = slidingEls[i];
        var newEl=oldEl.cloneNode(true);
        oldEl.parentNode.replaceChild(newEl, oldEl);
    }
}