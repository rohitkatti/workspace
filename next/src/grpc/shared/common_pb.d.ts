import * as jspb from 'google-protobuf'



export class ResponseMeta extends jspb.Message {
  getRequestUid(): string;
  setRequestUid(value: string): ResponseMeta;

  getTimestampMs(): number;
  setTimestampMs(value: number): ResponseMeta;

  getSessionId(): string;
  setSessionId(value: string): ResponseMeta;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResponseMeta.AsObject;
  static toObject(includeInstance: boolean, msg: ResponseMeta): ResponseMeta.AsObject;
  static serializeBinaryToWriter(message: ResponseMeta, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResponseMeta;
  static deserializeBinaryFromReader(message: ResponseMeta, reader: jspb.BinaryReader): ResponseMeta;
}

export namespace ResponseMeta {
  export type AsObject = {
    requestUid: string,
    timestampMs: number,
    sessionId: string,
  }
}

export class Error extends jspb.Message {
  getCode(): ErrorCode;
  setCode(value: ErrorCode): Error;

  getMessage(): string;
  setMessage(value: string): Error;

  getDetail(): string;
  setDetail(value: string): Error;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Error.AsObject;
  static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
  static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Error;
  static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
}

export namespace Error {
  export type AsObject = {
    code: ErrorCode,
    message: string,
    detail: string,
  }
}

export class Property extends jspb.Message {
  getKey(): string;
  setKey(value: string): Property;

  getStringPayload(): string;
  setStringPayload(value: string): Property;

  getIntPayload(): number;
  setIntPayload(value: number): Property;

  getFloatPayload(): number;
  setFloatPayload(value: number): Property;

  getBooleanPayload(): boolean;
  setBooleanPayload(value: boolean): Property;

  getBytesPayload(): Uint8Array | string;
  getBytesPayload_asU8(): Uint8Array;
  getBytesPayload_asB64(): string;
  setBytesPayload(value: Uint8Array | string): Property;

  getJsonPayload(): string;
  setJsonPayload(value: string): Property;

  getValueCase(): Property.ValueCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Property.AsObject;
  static toObject(includeInstance: boolean, msg: Property): Property.AsObject;
  static serializeBinaryToWriter(message: Property, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Property;
  static deserializeBinaryFromReader(message: Property, reader: jspb.BinaryReader): Property;
}

export namespace Property {
  export type AsObject = {
    key: string,
    stringPayload: string,
    intPayload: number,
    floatPayload: number,
    booleanPayload: boolean,
    bytesPayload: Uint8Array | string,
    jsonPayload: string,
  }

  export enum ValueCase { 
    VALUE_NOT_SET = 0,
    STRING_PAYLOAD = 2,
    INT_PAYLOAD = 3,
    FLOAT_PAYLOAD = 4,
    BOOLEAN_PAYLOAD = 5,
    BYTES_PAYLOAD = 6,
    JSON_PAYLOAD = 7,
  }
}

export enum ErrorCode { 
  ERROR_CODE_UNSPECIFIED = 0,
  ERROR_CODE_INVALID_INPUT = 1,
  ERROR_CODE_LLM_FAILURE = 2,
  ERROR_CODE_COMPUTATION_FAILURE = 3,
  ERROR_CODE_NOT_FOUND = 4,
}
