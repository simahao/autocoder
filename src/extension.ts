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
	let disposable = vscode.commands.registerCommand('extension.autocoder', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		Utils.parseClasses(editor)
			.then(javaClass => {
				let snippet = '';
				snippet += addSetterGetter(javaClass);
			}).catch(err => {
				console.log(err);
			});
	});

	context.subscriptions.push(disposable);
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
	for (let i = 0; i < javaClass.getFields().length; i++) {
		if (javaClass.getFields()[i].isStaticField()) {
			continue;
		}
	}
	javaClass.getFields().forEach(field => {
		//if type is boolean, get method is isXxx()
		if (field.isPriBool()) {
			//if isXxx() is not exist
			if (javaClass.getMethods().indexOf(`is${Utils.upperFirstChar(field.getFieldName())}`) === -1) {
				ret += `\n${indent()}public ${field.getFieldType()} is${Utils.upperFirstChar(field.getFieldName())}() \
				{\n${indent()}${indent()}return this.${field.getFieldName()};\n${indent()}}\n`;
			}
		}
	})
	return ret;
}
// this method is called when your extension is deactivated
export function deactivate() {}
