import * as jspb from 'google-protobuf'



export class ORequest extends jspb.Message {
  getAction(): Action;
  setAction(value: Action): ORequest;

  getObjectName(): string;
  setObjectName(value: string): ORequest;
  hasObjectName(): boolean;
  clearObjectName(): ORequest;

  getStringPayload(): string;
  setStringPayload(value: string): ORequest;

  getNumberPayload(): number;
  setNumberPayload(value: number): ORequest;

  getBooleanPayload(): boolean;
  setBooleanPayload(value: boolean): ORequest;

  getBytesPayload(): Uint8Array | string;
  getBytesPayload_asU8(): Uint8Array;
  getBytesPayload_asB64(): string;
  setBytesPayload(value: Uint8Array | string): ORequest;

  getJsonPayload(): string;
  setJsonPayload(value: string): ORequest;

  getPayloadCase(): ORequest.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ORequest.AsObject;
  static toObject(includeInstance: boolean, msg: ORequest): ORequest.AsObject;
  static serializeBinaryToWriter(message: ORequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ORequest;
  static deserializeBinaryFromReader(message: ORequest, reader: jspb.BinaryReader): ORequest;
}

export namespace ORequest {
  export type AsObject = {
    action: Action,
    objectName?: string,
    stringPayload: string,
    numberPayload: number,
    booleanPayload: boolean,
    bytesPayload: Uint8Array | string,
    jsonPayload: string,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    STRING_PAYLOAD = 3,
    NUMBER_PAYLOAD = 4,
    BOOLEAN_PAYLOAD = 5,
    BYTES_PAYLOAD = 6,
    JSON_PAYLOAD = 7,
  }

  export enum ObjectNameCase { 
    _OBJECT_NAME_NOT_SET = 0,
    OBJECT_NAME = 2,
  }
}

export class OResponse extends jspb.Message {
  getStatus(): boolean;
  setStatus(value: boolean): OResponse;

  getMessage(): string;
  setMessage(value: string): OResponse;

  getStringResult(): string;
  setStringResult(value: string): OResponse;

  getNumberResult(): number;
  setNumberResult(value: number): OResponse;

  getBooleanResult(): boolean;
  setBooleanResult(value: boolean): OResponse;

  getBytesResult(): Uint8Array | string;
  getBytesResult_asU8(): Uint8Array;
  getBytesResult_asB64(): string;
  setBytesResult(value: Uint8Array | string): OResponse;

  getJsonResult(): string;
  setJsonResult(value: string): OResponse;

  getResultCase(): OResponse.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OResponse.AsObject;
  static toObject(includeInstance: boolean, msg: OResponse): OResponse.AsObject;
  static serializeBinaryToWriter(message: OResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OResponse;
  static deserializeBinaryFromReader(message: OResponse, reader: jspb.BinaryReader): OResponse;
}

export namespace OResponse {
  export type AsObject = {
    status: boolean,
    message: string,
    stringResult: string,
    numberResult: number,
    booleanResult: boolean,
    bytesResult: Uint8Array | string,
    jsonResult: string,
  }

  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    STRING_RESULT = 3,
    NUMBER_RESULT = 4,
    BOOLEAN_RESULT = 5,
    BYTES_RESULT = 6,
    JSON_RESULT = 7,
  }
}

export enum Action { 
  CREATE = 0,
  READ = 1,
  UPDATE = 2,
  DELETE = 3,
}
