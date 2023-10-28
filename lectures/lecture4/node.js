var fs = require('fs');

// var file = fs.readFileSync('set_timeout_set_interval.js');
// fs.writeFileSync('test.txt', 'Hello Batka!');
// console.log(file);

fs.readFile('set_timeout_set_interval.js', {encoding: 'utf-8'},
    function afterReadHandler(err, data) {
        if (err) {
            console.error(err);
            return;
        }

        fs.appendFile('test.txt', '\n\n' + data, function afterAppendHandler(err) {
            if (err) {
                console.error(err);
                return;
            }

            console.log('Data written successfully');
        });

        console.log('Data Read successfully');
        console.log('Begin Write Operation');
    }
);

console.log('Begin Read Operation');
