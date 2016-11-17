// script to automatically update dependencies
/* eslint no-console:0 */
// example: node deps impl-microcred upgrade ut
// argv[2] - all/ut - whether to update all dependencies or only ut modules (dafault 'ut')
// argv[3] - update/upgrade - what to update the version according to instruction (e.g. ^/~) or to upgrade to latest (dafault 'upgrade')
var tester = process.argv[2] === 'all' ? /.*/ : /^ut\-/;
var matcher = /(~|\^)?(.*)/;
var version = process.argv[3] === 'update' ? 'wanted' : 'latest';
var exec = require('child_process').exec;
var newLines = /\r?\n|\r|^\s/g;
var spaces = /\s\s+/g;
var fs = require('fs');
exec('npm outdated', function(error, stdout, stderr) {
    if (error) {
        console.log(error);
    } else {
        var arr = stdout.split(newLines);
        var keys = arr.shift().toLowerCase().split(spaces);
        var outdated = arr.filter(val => val)
            .reduce((all, val) => {
                var o = val.split(spaces)
                    .reduce((obj, cur, i) => {
                        obj[keys[i]] = cur;
                        return obj;
                    }, {});
                all[o.package] = {
                    wanted: o.wanted,
                    latest: o.latest
                };
                return all;
            }, {});
        var packageJson = require('./package.json');
        var summary = {};
        ['dependencies', 'devDependencies'].forEach(function(type) {
            var deps = packageJson[type];
            if (deps) {
                summary[type] = [];
                Object.keys(deps).forEach(function(dep) {
                    var cur = deps[dep];
                    var last = outdated[dep][version];
                    if (cur !== '*' && !cur.endsWith(last) && outdated[dep] && tester.test(dep)) {
                        var summaryRecord = {dep: dep, cur: cur};
                        deps[dep] = cur.replace(cur.match(matcher).pop(), last);
                        summaryRecord.last = deps[dep];
                        summary[type].push(summaryRecord);
                    }
                });
            }
        });
        fs.writeFile('package.json', JSON.stringify(packageJson, null, 2) + '\n', function(err) {
            if (err) {
                console.error(err);
            } else {
                var output = '\nUpdate script finished!\n\n';
                Object.keys(summary).forEach(function(collection) {
                    output += collection + '\n------------------\n';
                    if (summary[collection].length) {
                        summary[collection].forEach(function(record) {
                            output += (record.dep + '                    ').slice(0, -(record.dep.length)) +
                                      ('                    ' + record.cur).slice(-20) +
                                      ' --> ' + record.last + '\n';
                        });
                        output += '\n';
                    } else {
                        output += 'nothing to update\n\n';
                    }
                });
                console.log(output);
            }
        });
    }
});
