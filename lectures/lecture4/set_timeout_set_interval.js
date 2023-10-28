for (var i = 0; i < 5; ++i) {
    // setTimeout(function (j) {
    //     console.log(j);
    // }, 0, i);

    // setTimeout(function (i) {
    //     return function() {
    //         console.log(i);
    //     }
    // }(i));

    (function (j) {
        setTimeout(function (){
            console.log(j);
        });
    })(i);
}

var counter = 0;
setInterval(() => { // Scheduled Function
    console.log(counter++);
}, 1000);