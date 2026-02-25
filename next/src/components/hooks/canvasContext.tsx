import { createContext, useCallback, useContext, useRef, useMemo, useEffect } from "react";
import * as THREE from 'three';
import { useAppContext } from "@components/hooks/appContext";

import { renderGraphToScene, clearGraphFromScene } from '@components/utils/graphRenderer';
import { Graph } from '@grpc/shared/graph_pb';


interface ICanvasContext {
    add: (mesh: THREE.Mesh) => void;
    rem: (mesh: THREE.Mesh) => void;
    mod: (mesh: THREE.Mesh, update: (m: THREE.Mesh) => void) => void;
    renderGraph: (graph: Graph) => void;
    clearGraph: () => void;
}

const CanvasContext = createContext<ICanvasContext | undefined>(undefined);

export const useCanvasContext = () => {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error("Canvas Context should be used within a Canvas Provider");
    }

    return context;
}

interface CanvasProviderProps {

}

type PropsWithChildren = React.PropsWithChildren<CanvasProviderProps>;

export const CanvasProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const isPlayingRef = useRef<boolean>(true);
    const sceneObjectsRef = useRef<Array<THREE.Mesh>>([]);
    const pointCloudRef = useRef<THREE.Points | null>(null);



    const appContext = useAppContext();

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 15);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 10, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // Resize handler
        const handleResize = () => {
            if (!mountRef.current || !camera || !renderer) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(
                mountRef.current.clientWidth,
                mountRef.current.clientHeight
            );
        };
        window.addEventListener('resize', handleResize);

        // Mouse orbit
        let isDragging = false;
        let prev = { x: 0, y: 0 };
        const onMouseDown = (e: MouseEvent) => { isDragging = true; prev = { x: e.clientX, y: e.clientY }; };
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging || !camera) return;
            const dx = e.clientX - prev.x;
            const dy = e.clientY - prev.y;
            prev = { x: e.clientX, y: e.clientY };
            // Simple orbit around origin
            const spherical = new THREE.Spherical().setFromVector3(camera.position);
            spherical.theta -= dx * 0.005;
            spherical.phi -= dy * 0.005;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
            camera.position.setFromSpherical(spherical);
            camera.lookAt(0, 0, 0);
        };
        const onMouseUp = () => { isDragging = false; };
        const onWheel = (e: WheelEvent) => {
            if (!camera) return;
            camera.position.multiplyScalar(1 + e.deltaY * 0.001);
        };
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('wheel', onWheel);

        // Animation loop
        let animFrameId: number;
        const animate = () => {
            animFrameId = requestAnimationFrame(animate);
            if (sceneRef.current && cameraRef.current && rendererRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('wheel', onWheel);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // add/rem/mod — operate on sceneObjectsRef
    const add = useCallback((mesh: THREE.Mesh) => {
        sceneRef.current?.add(mesh);
        sceneObjectsRef.current.push(mesh);
    }, []);

    const rem = useCallback((mesh: THREE.Mesh) => {
        sceneRef.current?.remove(mesh);
        sceneObjectsRef.current = sceneObjectsRef.current.filter(m => m !== mesh);
    }, []);

    const mod = useCallback((mesh: THREE.Mesh, update: (m: THREE.Mesh) => void) => {
        update(mesh);
    }, []);

    // Add to refs inside CanvasProvider:
    const graphGroupRef = useRef<THREE.Group | null>(null);

    // Add renderGraph and clearGraph callbacks:
    const clearGraph = useCallback(() => {
        if (sceneRef.current && graphGroupRef.current) {
            clearGraphFromScene(sceneRef.current, graphGroupRef.current);
            graphGroupRef.current = null;
        }
    }, []);

    const renderGraph = useCallback((graph: Graph) => {
        if (!sceneRef.current) return;

        // Clear previous graph first
        clearGraph();

        const { group } = renderGraphToScene(graph, sceneRef.current);
        graphGroupRef.current = group;

        // Reposition camera to frame the graph
        if (cameraRef.current) {
            const nodeCount = graph.getNodesList().length;
            const distance = Math.max(10, nodeCount * 1.5);
            cameraRef.current.position.set(0, 0, distance);
            cameraRef.current.lookAt(0, 0, 0);
        }
    }, [clearGraph]);

    // Add to contextValue:
    const contextValue = useMemo((): ICanvasContext => ({
        add, rem, mod, renderGraph, clearGraph
    }), [add, rem, mod, renderGraph, clearGraph]);

    return (
        <CanvasContext.Provider value={contextValue}>
            {/* Mount point fills remaining space after left panel */}
            <div
                ref={mountRef}
                style={{
                    position: 'absolute',
                    top: 0, left: 64,   // offset past icon bar
                    right: 0, bottom: 0,
                    overflow: 'hidden',
                }}
            />
            {children}
        </CanvasContext.Provider>
    );
}    