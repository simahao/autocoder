let line = "public class Value1 {\r";

let pat = new RegExp("Value" + "( )*{");

console.log(line.search(pat));