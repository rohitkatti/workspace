import * as jspb from 'google-protobuf'

import * as shared_common_pb from '../shared/common_pb'; // proto import: "shared/common.proto"
import * as shared_graph_pb from '../shared/graph_pb'; // proto import: "shared/graph.proto"


export class GeometryMeta extends jspb.Message {
  getFilePath(): string;
  setFilePath(value: string): GeometryMeta;

  getFileKind(): GeometryFileKind;
  setFileKind(value: GeometryFileKind): GeometryMeta;

  getSessionId(): string;
  setSessionId(value: string): GeometryMeta;

  getGoal(): string;
  setGoal(value: string): GeometryMeta;

  getHintsList(): Array<shared_common_pb.Property>;
  setHintsList(value: Array<shared_common_pb.Property>): GeometryMeta;
  clearHintsList(): GeometryMeta;
  addHints(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeometryMeta.AsObject;
  static toObject(includeInstance: boolean, msg: GeometryMeta): GeometryMeta.AsObject;
  static serializeBinaryToWriter(message: GeometryMeta, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeometryMeta;
  static deserializeBinaryFromReader(message: GeometryMeta, reader: jspb.BinaryReader): GeometryMeta;
}

export namespace GeometryMeta {
  export type AsObject = {
    filePath: string,
    fileKind: GeometryFileKind,
    sessionId: string,
    goal: string,
    hintsList: Array<shared_common_pb.Property.AsObject>,
  }
}

export class GeometryChunk extends jspb.Message {
  getMeta(): GeometryMeta | undefined;
  setMeta(value?: GeometryMeta): GeometryChunk;
  hasMeta(): boolean;
  clearMeta(): GeometryChunk;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): GeometryChunk;

  getPayloadCase(): GeometryChunk.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeometryChunk.AsObject;
  static toObject(includeInstance: boolean, msg: GeometryChunk): GeometryChunk.AsObject;
  static serializeBinaryToWriter(message: GeometryChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeometryChunk;
  static deserializeBinaryFromReader(message: GeometryChunk, reader: jspb.BinaryReader): GeometryChunk;
}

export namespace GeometryChunk {
  export type AsObject = {
    meta?: GeometryMeta.AsObject,
    data: Uint8Array | string,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    META = 1,
    DATA = 2,
  }
}

export class GeometryStats extends jspb.Message {
  getVertexCount(): number;
  setVertexCount(value: number): GeometryStats;

  getFaceCount(): number;
  setFaceCount(value: number): GeometryStats;

  getPointCount(): number;
  setPointCount(value: number): GeometryStats;

  getBoundingBox(): BoundingBox | undefined;
  setBoundingBox(value?: BoundingBox): GeometryStats;
  hasBoundingBox(): boolean;
  clearBoundingBox(): GeometryStats;

  getExtraList(): Array<shared_common_pb.Property>;
  setExtraList(value: Array<shared_common_pb.Property>): GeometryStats;
  clearExtraList(): GeometryStats;
  addExtra(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeometryStats.AsObject;
  static toObject(includeInstance: boolean, msg: GeometryStats): GeometryStats.AsObject;
  static serializeBinaryToWriter(message: GeometryStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeometryStats;
  static deserializeBinaryFromReader(message: GeometryStats, reader: jspb.BinaryReader): GeometryStats;
}

export namespace GeometryStats {
  export type AsObject = {
    vertexCount: number,
    faceCount: number,
    pointCount: number,
    boundingBox?: BoundingBox.AsObject,
    extraList: Array<shared_common_pb.Property.AsObject>,
  }
}

export class BoundingBox extends jspb.Message {
  getMinX(): number;
  setMinX(value: number): BoundingBox;

  getMinY(): number;
  setMinY(value: number): BoundingBox;

  getMinZ(): number;
  setMinZ(value: number): BoundingBox;

  getMaxX(): number;
  setMaxX(value: number): BoundingBox;

  getMaxY(): number;
  setMaxY(value: number): BoundingBox;

  getMaxZ(): number;
  setMaxZ(value: number): BoundingBox;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoundingBox.AsObject;
  static toObject(includeInstance: boolean, msg: BoundingBox): BoundingBox.AsObject;
  static serializeBinaryToWriter(message: BoundingBox, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoundingBox;
  static deserializeBinaryFromReader(message: BoundingBox, reader: jspb.BinaryReader): BoundingBox;
}

export namespace BoundingBox {
  export type AsObject = {
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number,
  }
}

export class ProcessGeometryResponse extends jspb.Message {
  getGeometryId(): string;
  setGeometryId(value: string): ProcessGeometryResponse;

  getStats(): GeometryStats | undefined;
  setStats(value?: GeometryStats): ProcessGeometryResponse;
  hasStats(): boolean;
  clearStats(): ProcessGeometryResponse;

  getSceneGraph(): shared_graph_pb.Graph | undefined;
  setSceneGraph(value?: shared_graph_pb.Graph): ProcessGeometryResponse;
  hasSceneGraph(): boolean;
  clearSceneGraph(): ProcessGeometryResponse;

  getSuggestionsList(): Array<AlgorithmSuggestion>;
  setSuggestionsList(value: Array<AlgorithmSuggestion>): ProcessGeometryResponse;
  clearSuggestionsList(): ProcessGeometryResponse;
  addSuggestions(value?: AlgorithmSuggestion, index?: number): AlgorithmSuggestion;

  getWarningsList(): Array<string>;
  setWarningsList(value: Array<string>): ProcessGeometryResponse;
  clearWarningsList(): ProcessGeometryResponse;
  addWarnings(value: string, index?: number): ProcessGeometryResponse;

  getMeta(): shared_common_pb.ResponseMeta | undefined;
  setMeta(value?: shared_common_pb.ResponseMeta): ProcessGeometryResponse;
  hasMeta(): boolean;
  clearMeta(): ProcessGeometryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProcessGeometryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ProcessGeometryResponse): ProcessGeometryResponse.AsObject;
  static serializeBinaryToWriter(message: ProcessGeometryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProcessGeometryResponse;
  static deserializeBinaryFromReader(message: ProcessGeometryResponse, reader: jspb.BinaryReader): ProcessGeometryResponse;
}

export namespace ProcessGeometryResponse {
  export type AsObject = {
    geometryId: string,
    stats?: GeometryStats.AsObject,
    sceneGraph?: shared_graph_pb.Graph.AsObject,
    suggestionsList: Array<AlgorithmSuggestion.AsObject>,
    warningsList: Array<string>,
    meta?: shared_common_pb.ResponseMeta.AsObject,
  }
}

export class GeometryResultRequest extends jspb.Message {
  getGeometryId(): string;
  setGeometryId(value: string): GeometryResultRequest;

  getSessionId(): string;
  setSessionId(value: string): GeometryResultRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeometryResultRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GeometryResultRequest): GeometryResultRequest.AsObject;
  static serializeBinaryToWriter(message: GeometryResultRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeometryResultRequest;
  static deserializeBinaryFromReader(message: GeometryResultRequest, reader: jspb.BinaryReader): GeometryResultRequest;
}

export namespace GeometryResultRequest {
  export type AsObject = {
    geometryId: string,
    sessionId: string,
  }
}

export class GeometryResultChunk extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): GeometryResultChunk;

  getWarning(): string;
  setWarning(value: string): GeometryResultChunk;

  getIsFinal(): boolean;
  setIsFinal(value: boolean): GeometryResultChunk;

  getSequence(): number;
  setSequence(value: number): GeometryResultChunk;

  getPayloadCase(): GeometryResultChunk.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeometryResultChunk.AsObject;
  static toObject(includeInstance: boolean, msg: GeometryResultChunk): GeometryResultChunk.AsObject;
  static serializeBinaryToWriter(message: GeometryResultChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeometryResultChunk;
  static deserializeBinaryFromReader(message: GeometryResultChunk, reader: jspb.BinaryReader): GeometryResultChunk;
}

export namespace GeometryResultChunk {
  export type AsObject = {
    data: Uint8Array | string,
    warning: string,
    isFinal: boolean,
    sequence: number,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    DATA = 1,
    WARNING = 2,
  }
}

export class SuggestGeometryAlgorithmsRequest extends jspb.Message {
  getGeometryId(): string;
  setGeometryId(value: string): SuggestGeometryAlgorithmsRequest;

  getStats(): GeometryStats | undefined;
  setStats(value?: GeometryStats): SuggestGeometryAlgorithmsRequest;
  hasStats(): boolean;
  clearStats(): SuggestGeometryAlgorithmsRequest;

  getGoal(): string;
  setGoal(value: string): SuggestGeometryAlgorithmsRequest;

  getSessionId(): string;
  setSessionId(value: string): SuggestGeometryAlgorithmsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SuggestGeometryAlgorithmsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SuggestGeometryAlgorithmsRequest): SuggestGeometryAlgorithmsRequest.AsObject;
  static serializeBinaryToWriter(message: SuggestGeometryAlgorithmsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SuggestGeometryAlgorithmsRequest;
  static deserializeBinaryFromReader(message: SuggestGeometryAlgorithmsRequest, reader: jspb.BinaryReader): SuggestGeometryAlgorithmsRequest;
}

export namespace SuggestGeometryAlgorithmsRequest {
  export type AsObject = {
    geometryId: string,
    stats?: GeometryStats.AsObject,
    goal: string,
    sessionId: string,
  }
}

export class SuggestGeometryAlgorithmsResponse extends jspb.Message {
  getSuggestionsList(): Array<AlgorithmSuggestion>;
  setSuggestionsList(value: Array<AlgorithmSuggestion>): SuggestGeometryAlgorithmsResponse;
  clearSuggestionsList(): SuggestGeometryAlgorithmsResponse;
  addSuggestions(value?: AlgorithmSuggestion, index?: number): AlgorithmSuggestion;

  getMeta(): shared_common_pb.ResponseMeta | undefined;
  setMeta(value?: shared_common_pb.ResponseMeta): SuggestGeometryAlgorithmsResponse;
  hasMeta(): boolean;
  clearMeta(): SuggestGeometryAlgorithmsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SuggestGeometryAlgorithmsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SuggestGeometryAlgorithmsResponse): SuggestGeometryAlgorithmsResponse.AsObject;
  static serializeBinaryToWriter(message: SuggestGeometryAlgorithmsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SuggestGeometryAlgorithmsResponse;
  static deserializeBinaryFromReader(message: SuggestGeometryAlgorithmsResponse, reader: jspb.BinaryReader): SuggestGeometryAlgorithmsResponse;
}

export namespace SuggestGeometryAlgorithmsResponse {
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

  getDomain(): GeometryDomain;
  setDomain(value: GeometryDomain): AlgorithmSuggestion;

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
    domain: GeometryDomain,
    parametersList: Array<shared_common_pb.Property.AsObject>,
  }
}

export class ExecutePipelineRequest extends jspb.Message {
  getGeometryId(): string;
  setGeometryId(value: string): ExecutePipelineRequest;

  getPipeline(): shared_graph_pb.Graph | undefined;
  setPipeline(value?: shared_graph_pb.Graph): ExecutePipelineRequest;
  hasPipeline(): boolean;
  clearPipeline(): ExecutePipelineRequest;

  getSessionId(): string;
  setSessionId(value: string): ExecutePipelineRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutePipelineRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExecutePipelineRequest): ExecutePipelineRequest.AsObject;
  static serializeBinaryToWriter(message: ExecutePipelineRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecutePipelineRequest;
  static deserializeBinaryFromReader(message: ExecutePipelineRequest, reader: jspb.BinaryReader): ExecutePipelineRequest;
}

export namespace ExecutePipelineRequest {
  export type AsObject = {
    geometryId: string,
    pipeline?: shared_graph_pb.Graph.AsObject,
    sessionId: string,
  }
}

export class PipelineResultChunk extends jspb.Message {
  getStepResult(): PipelineStepResult | undefined;
  setStepResult(value?: PipelineStepResult): PipelineResultChunk;
  hasStepResult(): boolean;
  clearStepResult(): PipelineResultChunk;

  getWarning(): string;
  setWarning(value: string): PipelineResultChunk;

  getSummary(): PipelineSummary | undefined;
  setSummary(value?: PipelineSummary): PipelineResultChunk;
  hasSummary(): boolean;
  clearSummary(): PipelineResultChunk;

  getIsFinal(): boolean;
  setIsFinal(value: boolean): PipelineResultChunk;

  getSequence(): number;
  setSequence(value: number): PipelineResultChunk;

  getPayloadCase(): PipelineResultChunk.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PipelineResultChunk.AsObject;
  static toObject(includeInstance: boolean, msg: PipelineResultChunk): PipelineResultChunk.AsObject;
  static serializeBinaryToWriter(message: PipelineResultChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PipelineResultChunk;
  static deserializeBinaryFromReader(message: PipelineResultChunk, reader: jspb.BinaryReader): PipelineResultChunk;
}

export namespace PipelineResultChunk {
  export type AsObject = {
    stepResult?: PipelineStepResult.AsObject,
    warning: string,
    summary?: PipelineSummary.AsObject,
    isFinal: boolean,
    sequence: number,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    STEP_RESULT = 1,
    WARNING = 2,
    SUMMARY = 3,
  }
}

export class PipelineStepResult extends jspb.Message {
  getAlgorithmId(): string;
  setAlgorithmId(value: string): PipelineStepResult;

  getSuccess(): boolean;
  setSuccess(value: boolean): PipelineStepResult;

  getDurationMs(): number;
  setDurationMs(value: number): PipelineStepResult;

  getOutputsList(): Array<shared_common_pb.Property>;
  setOutputsList(value: Array<shared_common_pb.Property>): PipelineStepResult;
  clearOutputsList(): PipelineStepResult;
  addOutputs(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PipelineStepResult.AsObject;
  static toObject(includeInstance: boolean, msg: PipelineStepResult): PipelineStepResult.AsObject;
  static serializeBinaryToWriter(message: PipelineStepResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PipelineStepResult;
  static deserializeBinaryFromReader(message: PipelineStepResult, reader: jspb.BinaryReader): PipelineStepResult;
}

export namespace PipelineStepResult {
  export type AsObject = {
    algorithmId: string,
    success: boolean,
    durationMs: number,
    outputsList: Array<shared_common_pb.Property.AsObject>,
  }
}

export class PipelineSummary extends jspb.Message {
  getStepsCompleted(): number;
  setStepsCompleted(value: number): PipelineSummary;

  getStepsFailed(): number;
  setStepsFailed(value: number): PipelineSummary;

  getTotalDurationMs(): number;
  setTotalDurationMs(value: number): PipelineSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PipelineSummary.AsObject;
  static toObject(includeInstance: boolean, msg: PipelineSummary): PipelineSummary.AsObject;
  static serializeBinaryToWriter(message: PipelineSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PipelineSummary;
  static deserializeBinaryFromReader(message: PipelineSummary, reader: jspb.BinaryReader): PipelineSummary;
}

export namespace PipelineSummary {
  export type AsObject = {
    stepsCompleted: number,
    stepsFailed: number,
    totalDurationMs: number,
  }
}

export enum GeometryFileKind { 
  GEOMETRY_FILE_KIND_UNSPECIFIED = 0,
  GEOMETRY_FILE_KIND_OBJ = 1,
  GEOMETRY_FILE_KIND_STL = 2,
  GEOMETRY_FILE_KIND_GLTF = 3,
  GEOMETRY_FILE_KIND_LAS = 4,
  GEOMETRY_FILE_KIND_LAZ = 5,
  GEOMETRY_FILE_KIND_COPC = 6,
  GEOMETRY_FILE_KIND_GEOJSON = 7,
  GEOMETRY_FILE_KIND_WKT = 8,
  GEOMETRY_FILE_KIND_SHAPEFILE = 9,
  GEOMETRY_FILE_KIND_TIFF = 10,
}
export enum GeometryDomain { 
  GEOMETRY_DOMAIN_UNSPECIFIED = 0,
  GEOMETRY_DOMAIN_MESH = 1,
  GEOMETRY_DOMAIN_POINT_CLOUD = 2,
  GEOMETRY_DOMAIN_GIS_2D = 3,
  GEOMETRY_DOMAIN_GIS_3D = 4,
}
