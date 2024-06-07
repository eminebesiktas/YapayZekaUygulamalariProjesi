// Yavaş kaydırma işlevi
function smoothScrollTo(targetId, duration) {
    var target = document.getElementById(targetId);
    var targetPosition = target.getBoundingClientRect().top;
    var startPosition = window.pageYOffset;
    var startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, startPosition, targetPosition, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Butona tıklandığında yavaş kaydırma işlemini tetikle
document.getElementById('scrollButton').addEventListener('click', function(event) {
    event.preventDefault(); // Sayfa yenilenmesini önle
    smoothScrollTo('analysis', 1200);
});
