import { Mode } from '../types/global';
export declare const requestLog: (mode: Mode, paramVerbosity: number, limitVerbosity: number, ...s: any) => void;
export declare const queryWarn: (mode: Mode, paramVerbosity: number, limitVerbosity: number, ...s: any) => void;
export declare const queryError: (...s: any) => void;
