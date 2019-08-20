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
    // let setAndGet = vscode.commands.registerCommand('extension.AutoCoderSetAndGet', () => {
    //     // The code you place here will be executed every time your command is executed
    //     let editor = vscode.window.activeTextEditor!;
    //     Utils.parseClasses(editor)
    //         .then(javaClass => {
    //             // if (javaClass.getClassMode() === mode.builder) {
    //             //     vscode.window.showWarningMessage('this java bean is under builder mode, not support generate setter and getter, you can delete code except fields.');
    //             // } else if (javaClass.getClassMode() === mode.notSupport) {
    //             //     vscode.window.showErrorMessage('not support,please file an issue.');
    //             // } else {
    //             let snippet = '';
    //             snippet += addSetterGetter(javaClass);
    //             if (snippet !== '' && delSnippet(editor, javaClass)) {
    //                 addSnippet(snippet, editor, javaClass);
    //             }
    //             // }
    //         }).catch(err => {
    //             console.log(err);
    //         });
    // });

    let all = vscode.commands.registerCommand('extension.AutoCoderAll', () => {
        let editor = vscode.window.activeTextEditor!;
        Utils.parseClasses(editor)
            .then(javaClass => {
                let snippet = '';
                snippet += addEmptyConstructor(javaClass);
                snippet += addToString(javaClass);
                snippet += addBuilder(javaClass);
                snippet += addSetterGetter(javaClass);
                if (snippet !== '' && delSnippet(editor, javaClass)) {
                    addSnippet(snippet, editor, javaClass);
                }
            }).catch(err => {
                console.log(err);
            });

    });

    let builder = vscode.commands.registerCommand('extension.AutoCoderBuilder', () => {
        let editor = vscode.window.activeTextEditor!;
        Utils.parseClasses(editor)
            .then(javaClass => {
                let snippet = '';
                snippet += addBuilder(javaClass);
                if (snippet !== '' && delSnippet(editor, javaClass)) {
                    addSnippet(snippet, editor, javaClass);
                }
            }).catch(err => {
                console.log(err);
            });
    });
    // context.subscriptions.push(setAndGet);
    context.subscriptions.push(all);
    context.subscriptions.push(builder);
}

/**
 * find the class position
 * @param javaClass string 
 * @param lines string[] 
 */
function getClassPos(javaClass: string, lines: string[]): number {
    let patClass = new RegExp("^(\t| )*.*".concat(javaClass).concat(".*{"));
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].search(patClass) !== -1) {
            return i;
        }
    }
    return -1;
}

/**
 * find position for insert snippet.
 *  
 * @param javaClass 
 * @param editor 
 */
function getInsertPos(javaClass: JavaClass, editor: vscode.TextEditor): number {
    //current cursor position,default value if can not get insert position
    let lineNum = editor.selection.end.line;

    let lastField = javaClass.getFields()[javaClass.getFields().length - 1].getFieldName();
    let lines: string[] = editor.document.getText().split("\n");
    let classPos: number = getClassPos(javaClass.getClassName(), lines);
    if (classPos !== -1) {
        for (let i = classPos; i < lines.length; i++) {
            //private long abc;
            //private long abc = 
            if (lines[i].search(new RegExp(lastField.concat("(\t| )*(=|;)"))) !== -1) {
                return i + 1;
            }
        }
    }
    return lineNum + 1;
}

/**
 * delete toString under all and builder mode.
 * 
 * @param editor 
 * @param javaClass 
 * @param delFuncName 
 */
function delSnippet(editor: vscode.TextEditor, javaClass: JavaClass): boolean {
    // if (javaClass.getClassMode() === mode.init || javaClass.getClassMode() === mode.notSupport) {
    //     return true;
    // }
    let text = editor.document.getText();
    let lines = text.split('\n');
    console.log(javaClass.getClassName());
    let classPos = getClassPos(javaClass.getClassName(), lines);
    if (classPos !== -1) {
        let start = getInsertPos(javaClass, editor);
        let patEnd = new RegExp("(\t| )*\}(\t| )*");
        let end = lines.length - 2;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].search(patEnd) !== -1) {
                // console.log('*********' + lines[i]);
                end = i;
                break;
            }
        }
        console.log(start + ',' + end);
        if (start > 0 && end > start) {
            editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(new vscode.Position(start, 0), new vscode.Position(end, 0)));
            });
            return true;
        } else if (start > 0 && start === end) {
            return true;
        } else {
            vscode.window.showErrorMessage('delete snippet error, start position or end position is not found.');
            return false;
        }
    } else {
        vscode.window.showErrorMessage('delete snippet error, can not find class position,please file an issue.');
        return false;
    }
}

/**
 * 
 * @param snippet 
 * @param editor 
 * @param javaClass 
 * @param delFuncName delete this method before regenerate
 */
function addSnippet(snippet: string, editor: vscode.TextEditor, javaClass: JavaClass, delFuncName?: string): void {
    editor.insertSnippet(new vscode.SnippetString(snippet), new vscode.Position(getInsertPos(javaClass, editor), 0));
}

/**
 * @returns tab or space
 */
function indent(): string {
    if (vscode.workspace.getConfiguration('autocoder').has('indent')) {
        let indent = vscode.workspace.getConfiguration('autocoder').get('indent');
        if (indent === "tab") {
            return '\t';
        } else {
            if (vscode.workspace.getConfiguration('autocoder').has('space')) {
                let space = Number(vscode.workspace.getConfiguration('autocoder').get('space')!);
                let ret = '';
                for (let i = 0; i < space; i++) {
                    ret += ' ';
                }
                return ret;
            }
            return '    ';
        }
    } else {
        return '    ';
    }
}

/**
 * 
 * @param javaClass JavaClass 
 * @param addSet boolean if addSet is false, ignore setXxx method
 */
function addSetterGetter(javaClass: JavaClass, addSet: boolean = true): string {
    let ret = '';
    javaClass.getFields().forEach(field => {
        //public void setXxx(String value)
        if (addSet && !field.isFinalField()) {
            // if (javaClass.getMethods().indexOf(`set${Utils.upperFirstChar(field.getFieldName())}`) === -1) {
            ret += `\n${indent()}public void set${Utils.upperFirstChar(field.getFieldName())}(${recoveryCheckstyle(field.getFieldType())} ${field.getFieldName()}) \
{\n${indent()}${indent()}this.${field.getFieldName()} = ${field.getFieldName()};\n${indent()}}\n`;
            // }
        }
        //if type is boolean, get method is isXxx()
        if (field.isPriBool()) {
            //if isXxx() is not exist
            // if (javaClass.getMethods().indexOf(`is${Utils.upperFirstChar(field.getFieldName())}`) === -1) {
            ret += `\n${indent()}public ${field.getFieldType()} is${Utils.upperFirstChar(field.getFieldName())}() \
{\n${indent()}${indent()}return this.${field.getFieldName()};\n${indent()}}\n`;
            // }
        } else {
            // if (javaClass.getMethods().indexOf(`get${Utils.upperFirstChar(field.getFieldName())}`) === -1) {
            ret += `\n${indent()}public ${recoveryCheckstyle(field.getFieldType())} get${Utils.upperFirstChar(field.getFieldName())}() \
{\n${indent()}${indent()}return this.${field.getFieldName()};\n${indent()}}\n`;
            // }
        }
    });
    return ret;
}

/**
 * 
 * @param javaClass 
 */
function addToString(javaClass: JavaClass): string {
    let ret = '';
    ret = `\n${indent()}@Override\n${indent()}public String toString() {\n${indent()}${indent()}return "{" +`;

    javaClass.getFields().forEach(field => {
        if (field.getFieldType() === "String") {
            ret += `\n${indent()}${indent()}${indent()}",${field.getFieldName()}='" + get${Utils.upperFirstChar(field.getFieldName())}() + "'" +`;
        } else {
            if (field.isPriBool()) {
                ret += `\n${indent()}${indent()}${indent()}",${field.getFieldName()}=" + is${Utils.upperFirstChar(field.getFieldName())}() +`;
            } else {
                ret += `\n${indent()}${indent()}${indent()}",${field.getFieldName()}=" + get${Utils.upperFirstChar(field.getFieldName())}() +`;
            }
        }
    });
    ret += `\n${indent()}${indent()}${indent()}"}";\n${indent()}}\n`;
    //replace first ","
    return ret.replace(',', '');
}

/**
 * 
 * @param javaClass 
 */
function addBuilder(javaClass: JavaClass): string {
    let ret = '';
    ret += `\n${indent()}public static class Builder {\n\
${indent()}${indent()}private ${javaClass.getClassName()} buildObj = new ${javaClass.getClassName()}();\n`;

    javaClass.getFields().forEach(field => {
        if (!field.isFinalField()) {
            ret += `\n${indent()}${indent()}public Builder ${field.getFieldName()}(${recoveryCheckstyle(field.getFieldType())} ${field.getFieldName()}) {\n\
${indent()}${indent()}${indent()}buildObj.${field.getFieldName()} = ${field.getFieldName()};\n\
${indent()}${indent()}${indent()}return this;\n\
${indent()}${indent()}}\n`;
        }
    });
    ret += `\n${indent()}${indent()}public ${javaClass.getClassName()} build() {\n\
${indent()}${indent()}${indent()}return buildObj;\n\
${indent()}${indent()}}\n\
${indent()}}\n`;
    return ret;
}

/**
 * 
 * @param javaClass 
 */
function addEmptyConstructor(javaClass: JavaClass): string {
    let ret = '';
    ret += `\n${indent()}public ${javaClass.getClassName()}() {}\n`;
    return ret;
}

/**
 * 
 * @param type 
 */
function recoveryCheckstyle(type: string): string {
    let pat = new RegExp(",[a-zA-Z]");
    let ret = type;
    if (type.search(pat) !== -1) {
        ret = type.replace(",", ", ");
    }
    return ret;
}
// this method is called when your extension is deactivated
export function deactivate() {}
