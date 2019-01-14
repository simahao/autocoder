let line = 'public static class Builder {\n\
        void setX(sss ss) {\n\
            xxx = xxx;\n\
        }\n\
    }'; 
console.log(line);
let lines = line.split('\n');
let stack: string[] = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("{") !== -1) {
        stack.push("{");
    } else if (lines[i].indexOf("}") !== -1) {
        stack.pop();
    }
    if (stack.length === 0) {
        console.log(i + 1);
    }
}