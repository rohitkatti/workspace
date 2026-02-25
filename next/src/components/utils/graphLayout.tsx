import { GraphNode } from '@grpc/shared/graph_pb';

export interface NodePosition3D {
    id: string;
    x: number;
    y: number;
    z: number;
}

export function computeLayout(nodes: GraphNode[]): Map<string, NodePosition3D> {
    const positions = new Map<string, NodePosition3D>();
    const count = nodes.length;

    nodes.forEach((node, i) => {
        // Distribute nodes on a sphere surface
        const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i; // golden angle

        const radius = Math.max(4, count * 0.8);

        positions.set(node.getId(), {
            id: node.getId(),
            x: radius * Math.sin(phi) * Math.cos(theta),
            y: radius * Math.sin(phi) * Math.sin(theta),
            z: radius * Math.cos(phi),
        });
    });

    return positions;
}