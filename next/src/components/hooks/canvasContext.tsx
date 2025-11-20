import { createContext, useCallback, useContext, useRef, useMemo, useEffect } from "react";
import * as THREE from 'three';
import { useAppContext } from "@components/hooks/appContext";

interface ICanvasContext {
    add: () => void,
    rem: () => void,
    mod: () => void
};

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

    const appContext = useAppContext();

    useEffect(() => {
        if (!mountRef.current) {
            return;
        }

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);   // RK_TODO: Retrieve from theme?
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // attach renderer to mount
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLighting = new THREE.AmbientLight(0x404040, 0.6); // RK_TODO: Retrieve from theme?
        scene.add(ambientLighting);

        // Directional Lighting
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // RK_TODO: Retrieve from theme?
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const handleResize = (): void => {
            if (!camera || !renderer)
                return;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Controls
        isPlayingRef.current = false;
        sceneObjectsRef.current = [];

        return () => {
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            renderer.dispose();
        };
    }, []);

    const add = useCallback(() => {

    }, [sceneObjectsRef.current]);

    const rem = useCallback(() => {

    }, [sceneObjectsRef.current]);

    const mod = useCallback(() => {

    }, [sceneObjectsRef.current]);

    const contextValue = useMemo((): ICanvasContext => ({
        add, rem, mod
    }), []);

    return (
        <CanvasContext.Provider value={contextValue}>
            {children}
        </CanvasContext.Provider>
    )
}    