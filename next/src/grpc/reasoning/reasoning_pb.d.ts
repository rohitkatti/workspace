import * as jspb from 'google-protobuf'

import * as shared_common_pb from '../shared/common_pb'; // proto import: "shared/common.proto"
import * as shared_graph_pb from '../shared/graph_pb'; // proto import: "shared/graph.proto"


export class BuildConceptGraphRequest extends jspb.Message {
  getRawInput(): string;
  setRawInput(value: string): BuildConceptGraphRequest;

  getSessionId(): string;
  setSessionId(value: string): BuildConceptGraphRequest;

  getHintsList(): Array<shared_common_pb.Property>;
  setHintsList(value: Array<shared_common_pb.Property>): BuildConceptGraphRequest;
  clearHintsList(): BuildConceptGraphRequest;
  addHints(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BuildConceptGraphRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BuildConceptGraphRequest): BuildConceptGraphRequest.AsObject;
  static serializeBinaryToWriter(message: BuildConceptGraphRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BuildConceptGraphRequest;
  static deserializeBinaryFromReader(message: BuildConceptGraphRequest, reader: jspb.BinaryReader): BuildConceptGraphRequest;
}

export namespace BuildConceptGraphRequest {
  export type AsObject = {
    rawInput: string,
    sessionId: string,
    hintsList: Array<shared_common_pb.Property.AsObject>,
  }
}

export class BuildConceptGraphResponse extends jspb.Message {
  getGraph(): shared_graph_pb.Graph | undefined;
  setGraph(value?: shared_graph_pb.Graph): BuildConceptGraphResponse;
  hasGraph(): boolean;
  clearGraph(): BuildConceptGraphResponse;

  getConfidence(): number;
  setConfidence(value: number): BuildConceptGraphResponse;

  getWarningsList(): Array<string>;
  setWarningsList(value: Array<string>): BuildConceptGraphResponse;
  clearWarningsList(): BuildConceptGraphResponse;
  addWarnings(value: string, index?: number): BuildConceptGraphResponse;

  getMeta(): shared_common_pb.ResponseMeta | undefined;
  setMeta(value?: shared_common_pb.ResponseMeta): BuildConceptGraphResponse;
  hasMeta(): boolean;
  clearMeta(): BuildConceptGraphResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BuildConceptGraphResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BuildConceptGraphResponse): BuildConceptGraphResponse.AsObject;
  static serializeBinaryToWriter(message: BuildConceptGraphResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BuildConceptGraphResponse;
  static deserializeBinaryFromReader(message: BuildConceptGraphResponse, reader: jspb.BinaryReader): BuildConceptGraphResponse;
}

export namespace BuildConceptGraphResponse {
  export type AsObject = {
    graph?: shared_graph_pb.Graph.AsObject,
    confidence: number,
    warningsList: Array<string>,
    meta?: shared_common_pb.ResponseMeta.AsObject,
  }
}

export class NodePerturbation extends jspb.Message {
  getNodeId(): string;
  setNodeId(value: string): NodePerturbation;

  getDirection(): PerturbationDirection;
  setDirection(value: PerturbationDirection): NodePerturbation;

  getMagnitude(): number;
  setMagnitude(value: number): NodePerturbation;

  getInitialValue(): number;
  setInitialValue(value: number): NodePerturbation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodePerturbation.AsObject;
  static toObject(includeInstance: boolean, msg: NodePerturbation): NodePerturbation.AsObject;
  static serializeBinaryToWriter(message: NodePerturbation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodePerturbation;
  static deserializeBinaryFromReader(message: NodePerturbation, reader: jspb.BinaryReader): NodePerturbation;
}

export namespace NodePerturbation {
  export type AsObject = {
    nodeId: string,
    direction: PerturbationDirection,
    magnitude: number,
    initialValue: number,
  }
}

export class RunScenarioRequest extends jspb.Message {
  getBaseGraph(): shared_graph_pb.Graph | undefined;
  setBaseGraph(value?: shared_graph_pb.Graph): RunScenarioRequest;
  hasBaseGraph(): boolean;
  clearBaseGraph(): RunScenarioRequest;

  getPerturbationsList(): Array<NodePerturbation>;
  setPerturbationsList(value: Array<NodePerturbation>): RunScenarioRequest;
  clearPerturbationsList(): RunScenarioRequest;
  addPerturbations(value?: NodePerturbation, index?: number): NodePerturbation;

  getSessionId(): string;
  setSessionId(value: string): RunScenarioRequest;

  getConfig(): ScenarioConfig | undefined;
  setConfig(value?: ScenarioConfig): RunScenarioRequest;
  hasConfig(): boolean;
  clearConfig(): RunScenarioRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RunScenarioRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RunScenarioRequest): RunScenarioRequest.AsObject;
  static serializeBinaryToWriter(message: RunScenarioRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RunScenarioRequest;
  static deserializeBinaryFromReader(message: RunScenarioRequest, reader: jspb.BinaryReader): RunScenarioRequest;
}

export namespace RunScenarioRequest {
  export type AsObject = {
    baseGraph?: shared_graph_pb.Graph.AsObject,
    perturbationsList: Array<NodePerturbation.AsObject>,
    sessionId: string,
    config?: ScenarioConfig.AsObject,
  }
}

export class ScenarioConfig extends jspb.Message {
  getMaxIterations(): number;
  setMaxIterations(value: number): ScenarioConfig;

  getConvergenceDelta(): number;
  setConvergenceDelta(value: number): ScenarioConfig;

  getDetectCycles(): boolean;
  setDetectCycles(value: boolean): ScenarioConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScenarioConfig.AsObject;
  static toObject(includeInstance: boolean, msg: ScenarioConfig): ScenarioConfig.AsObject;
  static serializeBinaryToWriter(message: ScenarioConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScenarioConfig;
  static deserializeBinaryFromReader(message: ScenarioConfig, reader: jspb.BinaryReader): ScenarioConfig;
}

export namespace ScenarioConfig {
  export type AsObject = {
    maxIterations: number,
    convergenceDelta: number,
    detectCycles: boolean,
  }
}

export class NodeState extends jspb.Message {
  getNodeId(): string;
  setNodeId(value: string): NodeState;

  getValue(): number;
  setValue(value: number): NodeState;

  getDelta(): number;
  setDelta(value: number): NodeState;

  getIsPerturbed(): boolean;
  setIsPerturbed(value: boolean): NodeState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeState.AsObject;
  static toObject(includeInstance: boolean, msg: NodeState): NodeState.AsObject;
  static serializeBinaryToWriter(message: NodeState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeState;
  static deserializeBinaryFromReader(message: NodeState, reader: jspb.BinaryReader): NodeState;
}

export namespace NodeState {
  export type AsObject = {
    nodeId: string,
    value: number,
    delta: number,
    isPerturbed: boolean,
  }
}

export class RunScenarioResponse extends jspb.Message {
  getNodeStatesList(): Array<NodeState>;
  setNodeStatesList(value: Array<NodeState>): RunScenarioResponse;
  clearNodeStatesList(): RunScenarioResponse;
  addNodeStates(value?: NodeState, index?: number): NodeState;

  getWarningsList(): Array<string>;
  setWarningsList(value: Array<string>): RunScenarioResponse;
  clearWarningsList(): RunScenarioResponse;
  addWarnings(value: string, index?: number): RunScenarioResponse;

  getIterations(): number;
  setIterations(value: number): RunScenarioResponse;

  getConverged(): boolean;
  setConverged(value: boolean): RunScenarioResponse;

  getMeta(): shared_common_pb.ResponseMeta | undefined;
  setMeta(value?: shared_common_pb.ResponseMeta): RunScenarioResponse;
  hasMeta(): boolean;
  clearMeta(): RunScenarioResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RunScenarioResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RunScenarioResponse): RunScenarioResponse.AsObject;
  static serializeBinaryToWriter(message: RunScenarioResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RunScenarioResponse;
  static deserializeBinaryFromReader(message: RunScenarioResponse, reader: jspb.BinaryReader): RunScenarioResponse;
}

export namespace RunScenarioResponse {
  export type AsObject = {
    nodeStatesList: Array<NodeState.AsObject>,
    warningsList: Array<string>,
    iterations: number,
    converged: boolean,
    meta?: shared_common_pb.ResponseMeta.AsObject,
  }
}

export class ScenarioPropagationChunk extends jspb.Message {
  getNodeStatesList(): Array<NodeState>;
  setNodeStatesList(value: Array<NodeState>): ScenarioPropagationChunk;
  clearNodeStatesList(): ScenarioPropagationChunk;
  addNodeStates(value?: NodeState, index?: number): NodeState;

  getIteration(): number;
  setIteration(value: number): ScenarioPropagationChunk;

  getIsFinal(): boolean;
  setIsFinal(value: boolean): ScenarioPropagationChunk;

  getConverged(): boolean;
  setConverged(value: boolean): ScenarioPropagationChunk;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScenarioPropagationChunk.AsObject;
  static toObject(includeInstance: boolean, msg: ScenarioPropagationChunk): ScenarioPropagationChunk.AsObject;
  static serializeBinaryToWriter(message: ScenarioPropagationChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScenarioPropagationChunk;
  static deserializeBinaryFromReader(message: ScenarioPropagationChunk, reader: jspb.BinaryReader): ScenarioPropagationChunk;
}

export namespace ScenarioPropagationChunk {
  export type AsObject = {
    nodeStatesList: Array<NodeState.AsObject>,
    iteration: number,
    isFinal: boolean,
    converged: boolean,
  }
}

export class AnalyzeGraphRequest extends jspb.Message {
  getBaseGraph(): shared_graph_pb.Graph | undefined;
  setBaseGraph(value?: shared_graph_pb.Graph): AnalyzeGraphRequest;
  hasBaseGraph(): boolean;
  clearBaseGraph(): AnalyzeGraphRequest;

  getKindsList(): Array<AnalysisKind>;
  setKindsList(value: Array<AnalysisKind>): AnalyzeGraphRequest;
  clearKindsList(): AnalyzeGraphRequest;
  addKinds(value: AnalysisKind, index?: number): AnalyzeGraphRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnalyzeGraphRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AnalyzeGraphRequest): AnalyzeGraphRequest.AsObject;
  static serializeBinaryToWriter(message: AnalyzeGraphRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnalyzeGraphRequest;
  static deserializeBinaryFromReader(message: AnalyzeGraphRequest, reader: jspb.BinaryReader): AnalyzeGraphRequest;
}

export namespace AnalyzeGraphRequest {
  export type AsObject = {
    baseGraph?: shared_graph_pb.Graph.AsObject,
    kindsList: Array<AnalysisKind>,
  }
}

export class NodeMetric extends jspb.Message {
  getNodeId(): string;
  setNodeId(value: string): NodeMetric;

  getMetric(): string;
  setMetric(value: string): NodeMetric;

  getValue(): number;
  setValue(value: number): NodeMetric;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeMetric.AsObject;
  static toObject(includeInstance: boolean, msg: NodeMetric): NodeMetric.AsObject;
  static serializeBinaryToWriter(message: NodeMetric, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeMetric;
  static deserializeBinaryFromReader(message: NodeMetric, reader: jspb.BinaryReader): NodeMetric;
}

export namespace NodeMetric {
  export type AsObject = {
    nodeId: string,
    metric: string,
    value: number,
  }
}

export class CycleResult extends jspb.Message {
  getNodeIdsList(): Array<string>;
  setNodeIdsList(value: Array<string>): CycleResult;
  clearNodeIdsList(): CycleResult;
  addNodeIds(value: string, index?: number): CycleResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CycleResult.AsObject;
  static toObject(includeInstance: boolean, msg: CycleResult): CycleResult.AsObject;
  static serializeBinaryToWriter(message: CycleResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CycleResult;
  static deserializeBinaryFromReader(message: CycleResult, reader: jspb.BinaryReader): CycleResult;
}

export namespace CycleResult {
  export type AsObject = {
    nodeIdsList: Array<string>,
  }
}

export class AnalyzeGraphResponse extends jspb.Message {
  getMetricsList(): Array<NodeMetric>;
  setMetricsList(value: Array<NodeMetric>): AnalyzeGraphResponse;
  clearMetricsList(): AnalyzeGraphResponse;
  addMetrics(value?: NodeMetric, index?: number): NodeMetric;

  getCyclesList(): Array<CycleResult>;
  setCyclesList(value: Array<CycleResult>): AnalyzeGraphResponse;
  clearCyclesList(): AnalyzeGraphResponse;
  addCycles(value?: CycleResult, index?: number): CycleResult;

  getWarningsList(): Array<string>;
  setWarningsList(value: Array<string>): AnalyzeGraphResponse;
  clearWarningsList(): AnalyzeGraphResponse;
  addWarnings(value: string, index?: number): AnalyzeGraphResponse;

  getMeta(): shared_common_pb.ResponseMeta | undefined;
  setMeta(value?: shared_common_pb.ResponseMeta): AnalyzeGraphResponse;
  hasMeta(): boolean;
  clearMeta(): AnalyzeGraphResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnalyzeGraphResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AnalyzeGraphResponse): AnalyzeGraphResponse.AsObject;
  static serializeBinaryToWriter(message: AnalyzeGraphResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnalyzeGraphResponse;
  static deserializeBinaryFromReader(message: AnalyzeGraphResponse, reader: jspb.BinaryReader): AnalyzeGraphResponse;
}

export namespace AnalyzeGraphResponse {
  export type AsObject = {
    metricsList: Array<NodeMetric.AsObject>,
    cyclesList: Array<CycleResult.AsObject>,
    warningsList: Array<string>,
    meta?: shared_common_pb.ResponseMeta.AsObject,
  }
}

export enum PerturbationDirection { 
  PERTURBATION_DIRECTION_UNSPECIFIED = 0,
  PERTURBATION_DIRECTION_INCREASE = 1,
  PERTURBATION_DIRECTION_DECREASE = 2,
  PERTURBATION_DIRECTION_SET = 3,
}
export enum AnalysisKind { 
  ANALYSIS_KIND_UNSPECIFIED = 0,
  ANALYSIS_KIND_CENTRALITY = 1,
  ANALYSIS_KIND_CYCLES = 2,
  ANALYSIS_KIND_INFLUENCE = 3,
  ANALYSIS_KIND_SHORTEST_PATH = 4,
}
