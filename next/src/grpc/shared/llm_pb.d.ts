import * as jspb from 'google-protobuf'

import * as shared_common_pb from '../shared/common_pb'; // proto import: "shared/common.proto"
import * as shared_graph_pb from '../shared/graph_pb'; // proto import: "shared/graph.proto"


export class StructureRequest extends jspb.Message {
  getRawInput(): string;
  setRawInput(value: string): StructureRequest;

  getTarget(): StructureTarget;
  setTarget(value: StructureTarget): StructureRequest;

  getSessionId(): string;
  setSessionId(value: string): StructureRequest;

  getHintsList(): Array<shared_common_pb.Property>;
  setHintsList(value: Array<shared_common_pb.Property>): StructureRequest;
  clearHintsList(): StructureRequest;
  addHints(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StructureRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StructureRequest): StructureRequest.AsObject;
  static serializeBinaryToWriter(message: StructureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StructureRequest;
  static deserializeBinaryFromReader(message: StructureRequest, reader: jspb.BinaryReader): StructureRequest;
}

export namespace StructureRequest {
  export type AsObject = {
    rawInput: string,
    target: StructureTarget,
    sessionId: string,
    hintsList: Array<shared_common_pb.Property.AsObject>,
  }
}

export class StructureResponse extends jspb.Message {
  getGraph(): shared_graph_pb.Graph | undefined;
  setGraph(value?: shared_graph_pb.Graph): StructureResponse;
  hasGraph(): boolean;
  clearGraph(): StructureResponse;

  getConfidence(): number;
  setConfidence(value: number): StructureResponse;

  getWarningsList(): Array<string>;
  setWarningsList(value: Array<string>): StructureResponse;
  clearWarningsList(): StructureResponse;
  addWarnings(value: string, index?: number): StructureResponse;

  getMeta(): shared_common_pb.ResponseMeta | undefined;
  setMeta(value?: shared_common_pb.ResponseMeta): StructureResponse;
  hasMeta(): boolean;
  clearMeta(): StructureResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StructureResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StructureResponse): StructureResponse.AsObject;
  static serializeBinaryToWriter(message: StructureResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StructureResponse;
  static deserializeBinaryFromReader(message: StructureResponse, reader: jspb.BinaryReader): StructureResponse;
}

export namespace StructureResponse {
  export type AsObject = {
    graph?: shared_graph_pb.Graph.AsObject,
    confidence: number,
    warningsList: Array<string>,
    meta?: shared_common_pb.ResponseMeta.AsObject,
  }
}

export class StructureChunk extends jspb.Message {
  getNode(): shared_graph_pb.GraphNode | undefined;
  setNode(value?: shared_graph_pb.GraphNode): StructureChunk;
  hasNode(): boolean;
  clearNode(): StructureChunk;

  getEdge(): shared_graph_pb.GraphEdge | undefined;
  setEdge(value?: shared_graph_pb.GraphEdge): StructureChunk;
  hasEdge(): boolean;
  clearEdge(): StructureChunk;

  getWarning(): string;
  setWarning(value: string): StructureChunk;

  getIsFinal(): boolean;
  setIsFinal(value: boolean): StructureChunk;

  getConfidence(): number;
  setConfidence(value: number): StructureChunk;

  getMeta(): shared_common_pb.ResponseMeta | undefined;
  setMeta(value?: shared_common_pb.ResponseMeta): StructureChunk;
  hasMeta(): boolean;
  clearMeta(): StructureChunk;

  getPayloadCase(): StructureChunk.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StructureChunk.AsObject;
  static toObject(includeInstance: boolean, msg: StructureChunk): StructureChunk.AsObject;
  static serializeBinaryToWriter(message: StructureChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StructureChunk;
  static deserializeBinaryFromReader(message: StructureChunk, reader: jspb.BinaryReader): StructureChunk;
}

export namespace StructureChunk {
  export type AsObject = {
    node?: shared_graph_pb.GraphNode.AsObject,
    edge?: shared_graph_pb.GraphEdge.AsObject,
    warning: string,
    isFinal: boolean,
    confidence: number,
    meta?: shared_common_pb.ResponseMeta.AsObject,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    NODE = 1,
    EDGE = 2,
    WARNING = 3,
  }
}

export class AlgorithmSuggestionRequest extends jspb.Message {
  getContext(): shared_graph_pb.Graph | undefined;
  setContext(value?: shared_graph_pb.Graph): AlgorithmSuggestionRequest;
  hasContext(): boolean;
  clearContext(): AlgorithmSuggestionRequest;

  getGoal(): string;
  setGoal(value: string): AlgorithmSuggestionRequest;

  getModule(): ModuleKind;
  setModule(value: ModuleKind): AlgorithmSuggestionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AlgorithmSuggestionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AlgorithmSuggestionRequest): AlgorithmSuggestionRequest.AsObject;
  static serializeBinaryToWriter(message: AlgorithmSuggestionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AlgorithmSuggestionRequest;
  static deserializeBinaryFromReader(message: AlgorithmSuggestionRequest, reader: jspb.BinaryReader): AlgorithmSuggestionRequest;
}

export namespace AlgorithmSuggestionRequest {
  export type AsObject = {
    context?: shared_graph_pb.Graph.AsObject,
    goal: string,
    module: ModuleKind,
  }
}

export class AlgorithmSuggestionResponse extends jspb.Message {
  getSuggestionsList(): Array<AlgorithmSuggestion>;
  setSuggestionsList(value: Array<AlgorithmSuggestion>): AlgorithmSuggestionResponse;
  clearSuggestionsList(): AlgorithmSuggestionResponse;
  addSuggestions(value?: AlgorithmSuggestion, index?: number): AlgorithmSuggestion;

  getMeta(): shared_common_pb.ResponseMeta | undefined;
  setMeta(value?: shared_common_pb.ResponseMeta): AlgorithmSuggestionResponse;
  hasMeta(): boolean;
  clearMeta(): AlgorithmSuggestionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AlgorithmSuggestionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AlgorithmSuggestionResponse): AlgorithmSuggestionResponse.AsObject;
  static serializeBinaryToWriter(message: AlgorithmSuggestionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AlgorithmSuggestionResponse;
  static deserializeBinaryFromReader(message: AlgorithmSuggestionResponse, reader: jspb.BinaryReader): AlgorithmSuggestionResponse;
}

export namespace AlgorithmSuggestionResponse {
  export type AsObject = {
    suggestionsList: Array<AlgorithmSuggestion.AsObject>,
    meta?: shared_common_pb.ResponseMeta.AsObject,
  }
}

export class AlgorithmSuggestion extends jspb.Message {
  getAlgorithmId(): string;
  setAlgorithmId(value: string): AlgorithmSuggestion;

  getName(): string;
  setName(value: string): AlgorithmSuggestion;

  getRationale(): string;
  setRationale(value: string): AlgorithmSuggestion;

  getConfidence(): number;
  setConfidence(value: number): AlgorithmSuggestion;

  getParametersList(): Array<shared_common_pb.Property>;
  setParametersList(value: Array<shared_common_pb.Property>): AlgorithmSuggestion;
  clearParametersList(): AlgorithmSuggestion;
  addParameters(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AlgorithmSuggestion.AsObject;
  static toObject(includeInstance: boolean, msg: AlgorithmSuggestion): AlgorithmSuggestion.AsObject;
  static serializeBinaryToWriter(message: AlgorithmSuggestion, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AlgorithmSuggestion;
  static deserializeBinaryFromReader(message: AlgorithmSuggestion, reader: jspb.BinaryReader): AlgorithmSuggestion;
}

export namespace AlgorithmSuggestion {
  export type AsObject = {
    algorithmId: string,
    name: string,
    rationale: string,
    confidence: number,
    parametersList: Array<shared_common_pb.Property.AsObject>,
  }
}

export enum StructureTarget { 
  STRUCTURE_TARGET_UNSPECIFIED = 0,
  STRUCTURE_TARGET_CONCEPT = 1,
  STRUCTURE_TARGET_ENTITY = 2,
  STRUCTURE_TARGET_SCENARIO = 3,
  STRUCTURE_TARGET_ALGORITHM = 4,
}
export enum ModuleKind { 
  MK_UNSPECIFIED = 0,
  MK_GEOMETRY = 1,
  MK_REASONING = 2,
}
