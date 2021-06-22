const sqlite3 = require('sqlite3').verbose();

module.exports = {
    db: new sqlite3.Database(
        'wfp.sqlite',
        function(err) {
            if (err)
                console.log(err);
        })
};