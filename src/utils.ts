'use strict';
//import { parse } from 'java-ast';

export function lowerFirstChar(properties: string): string {
    return properties.charAt(0).toLowerCase() + properties.slice(1);
}
export function upperFirstChar(properties: string): string {
    return properties.charAt(0).toUpperCase() + properties.slice(1);
}