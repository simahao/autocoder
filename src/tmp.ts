

let patComment = new RegExp(/(\/\*{1,2}[\s\S]*?\*\/|\/\/[\s\S]*?)/);
let line = "/*asd\
fadsf\
*/";
console.log(line.search(patComment));