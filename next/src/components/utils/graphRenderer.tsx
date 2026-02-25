import * as THREE from 'three';
import { Graph } from '@grpc/shared/graph_pb';
import { computeLayout } from './graphLayout';

// ── Constants ────────────────────────────────────────────────────────────────
const NODE_RADIUS = 0.35;
const EDGE_POSITIVE = 0x4ade80; // green
const EDGE_NEGATIVE = 0xf87171; // red
const EDGE_NEUTRAL = 0x9ca3af; // gray
const NODE_COLOR = 0x3b82f6; // blue
const NODE_HOVER_COLOR = 0xfbbf24; // yellow
const LABEL_SCALE = 0.018;

export interface GraphRenderResult {
    group: THREE.Group;
    meshes: Map<string, THREE.Mesh>;
}

export function renderGraphToScene(
    graph: Graph,
    scene: THREE.Scene,
): GraphRenderResult {
    const group = new THREE.Group();
    const meshes = new Map<string, THREE.Mesh>();

    const nodes = graph.getNodesList();
    const edges = graph.getEdgesList();
    const layout = computeLayout(nodes);

    // ── Node spheres ────────────────────────────────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(NODE_RADIUS, 32, 32);

    nodes.forEach((node) => {
        const pos = layout.get(node.getId());
        if (!pos) return;

        const mat = new THREE.MeshPhongMaterial({
            color: NODE_COLOR,
            emissive: new THREE.Color(NODE_COLOR).multiplyScalar(0.2),
            shininess: 80,
        });
        const mesh = new THREE.Mesh(sphereGeo, mat);
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.userData = { nodeId: node.getId(), label: node.getLabel() };

        group.add(mesh);
        meshes.set(node.getId(), mesh);
    });

    // ── Edges as lines ──────────────────────────────────────────────────────
    edges.forEach((edge) => {
        const srcPos = layout.get(edge.getSourceId());
        const dstPos = layout.get(edge.getTargetId());
        if (!srcPos || !dstPos) return;

        const weight = edge.getWeight();
        const color = weight > 0.1
            ? EDGE_POSITIVE
            : weight < -0.1
                ? EDGE_NEGATIVE
                : EDGE_NEUTRAL;

        const points = [
            new THREE.Vector3(srcPos.x, srcPos.y, srcPos.z),
            new THREE.Vector3(dstPos.x, dstPos.y, dstPos.z),
        ];

        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
            color,
            opacity: Math.max(0.3, Math.abs(weight)),
            transparent: true,
            linewidth: 1,
        });
        const line = new THREE.Line(geo, mat);
        line.userData = { edgeId: edge.getId(), weight };
        group.add(line);

        // Arrowhead at target end
        const arrowDir = new THREE.Vector3(
            dstPos.x - srcPos.x,
            dstPos.y - srcPos.y,
            dstPos.z - srcPos.z,
        ).normalize();

        const arrowOrigin = new THREE.Vector3(
            dstPos.x - arrowDir.x * (NODE_RADIUS + 0.3),
            dstPos.y - arrowDir.y * (NODE_RADIUS + 0.3),
            dstPos.z - arrowDir.z * (NODE_RADIUS + 0.3),
        );

        const arrow = new THREE.ArrowHelper(
            arrowDir,
            arrowOrigin,
            0.5,
            color,
            0.3,
            0.15,
        );
        group.add(arrow);
    });

    // ── Floating labels ─────────────────────────────────────────────────────
    nodes.forEach((node) => {
        const pos = layout.get(node.getId());
        if (!pos) return;

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, 256, 64);
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.getLabel(), 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
        });
        const sprite = new THREE.Sprite(labelMat);
        sprite.position.set(pos.x, pos.y + NODE_RADIUS + 0.5, pos.z);
        sprite.scale.set(
            LABEL_SCALE * canvas.width,
            LABEL_SCALE * canvas.height,
            1,
        );
        group.add(sprite);
    });

    scene.add(group);
    return { group, meshes };
}

export function clearGraphFromScene(
    scene: THREE.Scene,
    group: THREE.Group | null,
): void {
    if (!group) return;

    // Dispose all geometries and materials to avoid memory leaks
    group.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
                obj.material.forEach((m) => m.dispose());
            } else {
                obj.material.dispose();
            }
        }
        if (obj instanceof THREE.Sprite) {
            obj.material.map?.dispose();
            obj.material.dispose();
        }
    });

    scene.remove(group);
}