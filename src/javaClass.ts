export class JavaClass {
    private className: string;
    private fields: Field[];
    private methods: string[];
    constructor(className: string, fields: Field[], methods: string[]) {
        this.className = className;
        this.methods = methods;
        this.fields = fields;
    } 
    setClassName(value: string) {
        this.className = value;
    }
    getClassName() {
        return this.className;
    }
    setFields(value: Field[]) {
        this.fields = value;
    }
    getFields() {
        return this.fields;
    }
    setMethods(value: string[]) {
        this.methods = value;
    }
    getMethods() {
        return this.methods;
    }
}
export class Field {
    private fieldType: string;
    private fieldName: string;
    private finalField: boolean;
    private initedFinalField: boolean;
    private finalValue: any;
    private staticField: boolean;
    private primitive: boolean;
    constructor(fieldType: string, fieldName: string, finalField: boolean, initedfinalField: boolean, finalValue: any, staticField: boolean) {
        this.fieldType = fieldType;
        this.fieldName = fieldName;
        this.finalField = finalField;
        this.initedFinalField = initedfinalField;
        this.finalValue = finalValue;
        this.staticField = staticField;
        this.primitive = fieldType ? (['short', 'int', 'long', 'float', 'double', 'char', 'boolean', 'byte'].indexOf(this.fieldType) !== -1) : false;
    }
    setFieldType(value: string) {
        this.fieldType = value;
    }
    getFieldType(): string {
        return this.fieldType;
    }
    setFieldName(value: string) {
        this.fieldName = value;
    }
    getFieldName(): string {
        return this.fieldName;
    }
    setFinalField(value: boolean) {
        this.finalField = value;
    }
    isFinalField(): boolean {
        return this.finalField;
    }
    setInitedFinalField(value: boolean) {
        this.initedFinalField = value;
    }
    isInitedFinalField() {
        return this.initedFinalField;
    }
    setFinalValue(value: any) {
        this.finalValue = value;
    }
    getFinalValue() {
        return this.finalValue;
    }
    setStaticField(value: boolean) {
        this.staticField = value;
    }
    isStaticField(): boolean {
        return this.staticField;
    }
    setPrimitive(value: boolean) {
        this.primitive = value;
    }
    isPrimitive(): boolean {
        return this.primitive;
    }
}