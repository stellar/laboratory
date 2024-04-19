/* tslint:disable */
/* eslint-disable */
/**
* Returns a list of XDR types.
* @returns {(string)[]}
*/
export function types(): (string)[];
/**
* Returns the JSON Schema for an XDR type.
*
* JSON Schema version Draft 7 is returned.
* @param {string} type_variant
* @returns {string}
*/
export function schema(type_variant: string): string;
/**
* Identifies which XDR types the given XDR can decode to completely.
*
* Supports single XDR values only, not arrays, streams, or framed streams.
* @param {string} xdr_base64
* @returns {(string)[]}
*/
export function guess(xdr_base64: string): (string)[];
/**
* Decodes the XDR into JSON.
*
* Accepts a XDR base64 string.
*
* Returns a JSON string.
*
* Unstable: The API of this function is unstable and will likely be changed to
* return a JsValue instead of a JSON string.
* @param {string} type_variant
* @param {string} xdr_base64
* @returns {string}
*/
export function decode(type_variant: string, xdr_base64: string): string;
/**
* Encodes to XDR from JSON.
*
* Accepts a JSON string.
*
* Returns an XDR base64 string.
*
* Unstable: The API of this function is unstable and will likely be changed to
* accept a JsValue instead of a JSON string.
* @param {string} type_variant
* @param {string} json
* @returns {string}
*/
export function encode(type_variant: string, json: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly types: (a: number) => void;
  readonly schema: (a: number, b: number, c: number) => void;
  readonly guess: (a: number, b: number, c: number) => void;
  readonly decode: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly encode: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_0: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_1: (a: number, b: number) => number;
  readonly __wbindgen_export_2: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
