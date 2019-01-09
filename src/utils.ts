import { parse } from 'java-ast';
import * as vscode from 'vscode';
import { Field, JavaClass } from './javaClass';
export class Utils {
    public static lowerFirstChar(field: string): string {
        return field.charAt(0).toLowerCase() + field.slice(1);
    }
    public static upperFirstChar(field: string): string {
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
    public static async parseClasses(text?: string): Promise<JavaClass> {
        let classes: JavaClass[] = [];
        let javaText = 'package test; \
public class Value {\
    Value() {} \
    private final long aaaa = 5L;\
    private long clientId;\
    private Integer num;\
    private final String orderNo = \'1\';\
    private String matchTime;\
    public void fun() {}\
} \
class AAA {\
    private long two;\
    public void fun() {}\
}\
';
        if (text) {
            let parseCode;
            try {
                parseCode = parse(javaText);
                parseCode.typeDeclaration().forEach(type => {
                    let className: string = '';
                    // let hasConstructor: boolean = false;
                    let methods: string[] = [];
                    let fields: Field[] = []; 
                    try {
                        className = type.classDeclaration()!.IDENTIFIER()!.text;
                        type.classDeclaration()!.classBody()!.classBodyDeclaration().forEach(classBodyDeclaration => {
                            try {
                                if (classBodyDeclaration
                                    .memberDeclaration()!
                                    .constructorDeclaration()!
                                    .formalParameters()!
                                    .formalParameterList() === undefined) {
                                        // hasConstructor = true;
                                    }
                            } catch(err) {}
                            try {
                                if (classBodyDeclaration.memberDeclaration()!.methodDeclaration() !== undefined) {
                                    let methodName = classBodyDeclaration
                                                    .memberDeclaration()!
                                                    .methodDeclaration()!
                                                    .IDENTIFIER().text;
                                    // console.log(methodName);
                                    methods.push(methodName);
                                }
                            } catch(err) {}
                            try {
                                let isFinal: boolean = false;
                                let isInitedFinal: boolean = false;
                                let isStatic: boolean = false;
                                let finalValue: any | undefined;
                                classBodyDeclaration.modifier().forEach(modifier => {
                                    if (modifier.classOrInterfaceModifier()!.STATIC()) {
                                        isStatic = true;
                                    }
                                    if (modifier.classOrInterfaceModifier()!.FINAL()) {
                                        isFinal = true;
                                        try {
                                            finalValue = classBodyDeclaration
                                                            .memberDeclaration()!
                                                            .fieldDeclaration()!
                                                            .variableDeclarators()!
                                                            .variableDeclarator(0)!
                                                            .variableInitializer()!.text; 
                                            if (finalValue) {
                                                isInitedFinal = true;
                                            }
                                        } catch(err) {}
                                    }
                                });
                                const fieldType = classBodyDeclaration
                                                    .memberDeclaration()!
                                                    .fieldDeclaration()!
                                                    .typeType().text;
                                const fieldName = classBodyDeclaration
                                                    .memberDeclaration()!
                                                    .fieldDeclaration()!
                                                    .variableDeclarators()!
                                                    .variableDeclarator()[0]!
                                                    .variableDeclaratorId().text;
                                if (!isStatic) {
                                    fields.push(new Field(fieldType, fieldName, isFinal, isInitedFinal, finalValue, isStatic));
                                }
                            } catch(err) {}
                        });
                    } catch(err) {
                        console.log(err);
                    }
                    classes.push(new JavaClass(className, fields, methods));
                });
            } catch(err) {
                console.log('parse java class error!');
                return Promise.reject('parse java class error!');
            }
            console.log(classes);
            if (classes.length === 0) {
                console.log('javaClass.length == 0');
                vscode.window.showErrorMessage('there is not java class in editor');
                return Promise.reject('there is not java class in editor');
            } else if (classes.length === 1) {
                return classes[0];
            } else {
                let clazzes: vscode.QuickPickItem[] = [];
                classes.forEach(clazz => {
                    clazzes.push({
                        label: clazz.getClassName()
                    });
                });
                let pickName = await vscode.window.showQuickPick(clazzes, {
                    canPickMany: false,
                    placeHolder: 'please select one class'
                });
                classes.forEach(clazz => {
                    if (pickName && clazz.getClassName() === pickName.label) {
                        return clazz;
                    }
                });
                vscode.window.showErrorMessage('autocoder error!');
                return Promise.reject('autocoder error');
            }
        } else {
            console.log('actived editor have not any text to parse!');
            vscode.window.showErrorMessage('actived editor have not any text to parse!');
            return Promise.reject('actived editor have not any text to parse!');
        }
    }
}
