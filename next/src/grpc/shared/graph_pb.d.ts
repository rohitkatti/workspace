import * as jspb from 'google-protobuf'

import * as shared_common_pb from '../shared/common_pb'; // proto import: "shared/common.proto"


export class GraphNode extends jspb.Message {
  getId(): string;
  setId(value: string): GraphNode;

  getLabel(): string;
  setLabel(value: string): GraphNode;

  getKind(): NodeKind;
  setKind(value: NodeKind): GraphNode;

  getPropertiesList(): Array<shared_common_pb.Property>;
  setPropertiesList(value: Array<shared_common_pb.Property>): GraphNode;
  clearPropertiesList(): GraphNode;
  addProperties(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  getPosition(): NodePosition | undefined;
  setPosition(value?: NodePosition): GraphNode;
  hasPosition(): boolean;
  clearPosition(): GraphNode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GraphNode.AsObject;
  static toObject(includeInstance: boolean, msg: GraphNode): GraphNode.AsObject;
  static serializeBinaryToWriter(message: GraphNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GraphNode;
  static deserializeBinaryFromReader(message: GraphNode, reader: jspb.BinaryReader): GraphNode;
}

export namespace GraphNode {
  export type AsObject = {
    id: string,
    label: string,
    kind: NodeKind,
    propertiesList: Array<shared_common_pb.Property.AsObject>,
    position?: NodePosition.AsObject,
  }
}

export class GraphEdge extends jspb.Message {
  getId(): string;
  setId(value: string): GraphEdge;

  getSourceId(): string;
  setSourceId(value: string): GraphEdge;

  getTargetId(): string;
  setTargetId(value: string): GraphEdge;

  getKind(): EdgeKind;
  setKind(value: EdgeKind): GraphEdge;

  getWeight(): number;
  setWeight(value: number): GraphEdge;

  getPropertiesList(): Array<shared_common_pb.Property>;
  setPropertiesList(value: Array<shared_common_pb.Property>): GraphEdge;
  clearPropertiesList(): GraphEdge;
  addProperties(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GraphEdge.AsObject;
  static toObject(includeInstance: boolean, msg: GraphEdge): GraphEdge.AsObject;
  static serializeBinaryToWriter(message: GraphEdge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GraphEdge;
  static deserializeBinaryFromReader(message: GraphEdge, reader: jspb.BinaryReader): GraphEdge;
}

export namespace GraphEdge {
  export type AsObject = {
    id: string,
    sourceId: string,
    targetId: string,
    kind: EdgeKind,
    weight: number,
    propertiesList: Array<shared_common_pb.Property.AsObject>,
  }
}

export class NodePosition extends jspb.Message {
  getX(): number;
  setX(value: number): NodePosition;

  getY(): number;
  setY(value: number): NodePosition;

  getZ(): number;
  setZ(value: number): NodePosition;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodePosition.AsObject;
  static toObject(includeInstance: boolean, msg: NodePosition): NodePosition.AsObject;
  static serializeBinaryToWriter(message: NodePosition, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodePosition;
  static deserializeBinaryFromReader(message: NodePosition, reader: jspb.BinaryReader): NodePosition;
}

export namespace NodePosition {
  export type AsObject = {
    x: number,
    y: number,
    z: number,
  }
}

export class Graph extends jspb.Message {
  getId(): string;
  setId(value: string): Graph;

  getNodesList(): Array<GraphNode>;
  setNodesList(value: Array<GraphNode>): Graph;
  clearNodesList(): Graph;
  addNodes(value?: GraphNode, index?: number): GraphNode;

  getEdgesList(): Array<GraphEdge>;
  setEdgesList(value: Array<GraphEdge>): Graph;
  clearEdgesList(): Graph;
  addEdges(value?: GraphEdge, index?: number): GraphEdge;

  getMetaList(): Array<shared_common_pb.Property>;
  setMetaList(value: Array<shared_common_pb.Property>): Graph;
  clearMetaList(): Graph;
  addMeta(value?: shared_common_pb.Property, index?: number): shared_common_pb.Property;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Graph.AsObject;
  static toObject(includeInstance: boolean, msg: Graph): Graph.AsObject;
  static serializeBinaryToWriter(message: Graph, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Graph;
  static deserializeBinaryFromReader(message: Graph, reader: jspb.BinaryReader): Graph;
}

export namespace Graph {
  export type AsObject = {
    id: string,
    nodesList: Array<GraphNode.AsObject>,
    edgesList: Array<GraphEdge.AsObject>,
    metaList: Array<shared_common_pb.Property.AsObject>,
  }
}

export enum NodeKind { 
  NODE_KIND_UNSPECIFIED = 0,
  NODE_KIND_CONCEPT = 1,
  NODE_KIND_ENTITY = 2,
  NODE_KIND_SCENARIO = 3,
  NODE_KIND_ALGORITHM = 4,
}
export enum EdgeKind { 
  EDGE_KIND_UNSPECIFIED = 0,
  EDGE_KIND_INFLUENCES = 1,
  EDGE_KIND_DEPENDS_ON = 2,
  EDGE_KIND_ADJACENT = 3,
  EDGE_KIND_CONTAINS = 4,
  EDGE_KIND_CONFLICTS = 5,
  EDGE_KIND_SUPPORTS = 6,
}
