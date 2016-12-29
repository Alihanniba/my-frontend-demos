var fs = require('fs');
var rp = require('request-promise')
var config = require(__dirname + '/../config/cps')

var dataSource = Object.keys(config)

dataSource.map(function(key){
    var uri = config[key]
    if(!/^http/.test(uri)){
        return
    }
    var options = {
        uri: uri,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    rp(options)
        .then(function (data) {
            if (data) {
                var file = __dirname + '/../data/'+ key +'.json'
                var source
                try{
                    source = fs.readFileSync(file,  'utf-8')
                    source = JSON.parse(source)
                }catch(e){}
                // file does not exist
                if(!source){
                    console.log('============ %s file not exist=================', key);
                    return  fs.writeFile(file, JSON.stringify(data))
                }
                var prev = source.jsonGraph.version
                var current = data.jsonGraph.version
                // version diffrent
                if(prev != current){
                    fs.writeFile(file, JSON.stringify(data))
                    return console.log('type: %s\tprevious version: %s\tcurrent version: %s', key, prev, current);

                }
                console.log('Do nothing, previous version: %s\tcurrent version: %s', prev, current)
            }
        })
        .catch(function (err) {
            console.log(err);
            console.log('============req fails=================');
        });
})