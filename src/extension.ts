// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { JavaClass } from './javaClass';
import { Utils } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let setAndGet = vscode.commands.registerCommand('extension.autoCoderSetAndGet', () => {
        // The code you place here will be executed every time your command is executed
        let editor = vscode.window.activeTextEditor!;
        Utils.parseClasses(editor)
            .then(javaClass => {
                let snippet = '';
                snippet += addSetterGetter(javaClass);
                if (snippet !== '') {
                    addSnippet(snippet, editor, javaClass);
                }
            }).catch(err => {
                console.log(err);
            });
    });

    let all = vscode.commands.registerCommand('extension.autoCoderAll', () => {
        let editor = vscode.window.activeTextEditor!;
        Utils.parseClasses(editor)
            .then(javaClass => {
                let snippet = '';
                snippet += addSetterGetter(javaClass);
                snippet += addToString(javaClass);
                if (snippet !== '') {
                    addSnippet(snippet, editor, javaClass);
                }
            }).catch(err => {
                console.log(err);
            });

    });

    let builder = vscode.commands.registerCommand('extension.autoCoderBuilder', () => {

    });
    context.subscriptions.push(setAndGet);
    context.subscriptions.push(all);
    context.subscriptions.push(builder);
}
function findPos(javaClass: JavaClass, editor: vscode.TextEditor): number {
    let lineNum = editor.selection.end.line;
    let lastField = javaClass.getFields()[javaClass.getFields().length - 1].getFieldName();
    let lines: string[] = editor.document.getText().split("\n");
    let classLine: number = 0;
    let pattern = new RegExp(javaClass.getClassName().concat("( |{)"));
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].search(pattern) !== -1) {
            classLine = i;
            break;
        }
    }
    for (let j = classLine; j < lines.length; j++) {
        if (lines[j].indexOf(lastField) !== -1) {
            return j + 1;
        }
    }
    return lineNum + 1;
}
function addSnippet(snippet: string, editor: vscode.TextEditor, javaClass: JavaClass): void {
    editor.insertSnippet(new vscode.SnippetString(snippet), new vscode.Position(findPos(javaClass, editor), 0));
}
function indent(): string {
    if (vscode.workspace.getConfiguration('autocoder').has('indent')) {
        let ret = vscode.workspace.getConfiguration('autocoder').get('indent');
        if (ret === "tab") {
            return '\t';
        } else {
            return '    ';
        }
    } else {
        return '    ';
    }
}
function addSetterGetter(javaClass: JavaClass): string {
    let ret = '';
    javaClass.getFields().forEach(field => {
        //public void setXxx(String value)
        if (!field.isFinalField()) {
            if (javaClass.getMethods().indexOf(`set${Utils.upperFirstChar(field.getFieldName())}`) === -1) {
                ret += `\n${indent()}public void set${Utils.upperFirstChar(field.getFieldName())}(${field.getFieldType()} ${field.getFieldName()}) \
{\n${indent()}${indent()}this.${field.getFieldName()} = ${field.getFieldName()};\n${indent()}}`;
            }
        }
        //if type is boolean, get method is isXxx()
        if (field.isPriBool()) {
            //if isXxx() is not exist
            if (javaClass.getMethods().indexOf(`is${Utils.upperFirstChar(field.getFieldName())}`) === -1) {
                ret += `\n${indent()}public ${field.getFieldType()} is${Utils.upperFirstChar(field.getFieldName())}() \
{\n${indent()}${indent()}return this.${field.getFieldName()};\n${indent()}}`;
            }
        } else {
            if (javaClass.getMethods().indexOf(`get${Utils.upperFirstChar(field.getFieldName())}`) === -1) {
                ret += `\n${indent()}public ${field.getFieldType()} get${Utils.upperFirstChar(field.getFieldName())}() \
{\n${indent()}${indent()}return this.${field.getFieldName()};\n${indent()}}`;
            }
        }
    });
    ret += "\n";
    return ret;
}
/*
    public String toString() {
        return "{" +
            " tradeDate='" + getTradeDate() + "'" +
            ", price='" + getPrice() + "'" +
            "}";
    }
*/
function addToString(javaClass: JavaClass): string {
    let ret = '';
    ret = `${indent()}public String toString() {\n${indent()}${indent()}return "{" +`;

    javaClass.getFields().forEach(field => {
        if (field.getFieldType() === "String") {
            ret += `\n${indent()}${indent()}${indent()}",${field.getFieldName()}='" + this.${field.getFieldName()} + "'" +`;
        } else {
            ret += `\n${indent()}${indent()}${indent()}",${field.getFieldName()}=" + this.${field.getFieldName()} +`;
        }
    });
    ret += `\n${indent()}${indent()}${indent()}"}";\n${indent()}}\n`;
    //replace first ","
    return ret.replace(',', '');
}
// this method is called when your extension is deactivated
export function deactivate() {}
