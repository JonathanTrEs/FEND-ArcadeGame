/* 
 * Timer from https://codepen.io/mythicalpizza/pen/WvdeJG
 * With some modificaitons
 */
let min, sec, ms, count, malt, salt, msalt;

function refreshTimer(time) {
    timer = time;
}

function startTimer() {
    ms = 0;
    sec = 0;
    min = 0;
    count = setInterval(function() {
        if (ms == 100) {
            ms = 0;
            if (sec == 60) {
                sec = 0;
                min++;
            } else {
                sec++;
            }
        } else {
            ms++;
        }

        malt = padTimer(min);
        salt = padTimer(sec);
        msalt = padTimer(ms);

        refreshTimer(malt + ":" + salt + ":" + msalt);
    }, 10);
}

function padTimer(time) {
    var temp;
    if (time < 10) {
        temp = "0" + time;
    } else {
        temp = time;
    }
    return temp;
}

function resetTimer() {
    timer = "00:00:00";
}

function stopTimer() {
    clearInterval(count);
}