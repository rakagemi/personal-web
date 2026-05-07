/* eslint-disable @typescript-eslint/no-explicit-any */
- src / global.d.ts
export { };

declare module '*.glb';
declare module '*.png';
declare module '*.css';

declare module 'meshline' {
    export const MeshLineGeometry: any;
    export const MeshLineMaterial: any;
}

import { ThreeElements } from '@react-three/fiber'

declare global {
    namespace React {
        namespace JSX {
            interface IntrinsicElements extends ThreeElements {
                meshLineGeometry: any;
                meshLineMaterial: any;
            }
        }
    }
}

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "meshLineGeometry": any;
            "meshLineMaterial": any;
        }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            meshLineGeometry: any;
            meshLineMaterial: any;
        }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            meshLineGeometry: ReactThreeFiber.Object3DNode<any, any>
            meshLineMaterial: ReactThreeFiber.Object3DNode<any, any>
        }
    }
}
- src / vite - env.d.ts
/// <reference types="vite/client" />
declare module '*.glb';
declare module '*.png';
declare module '*.css';
declare module '*.pdf';
declare module '@/../public/assets/cv/cv_raka_2026_ats.pdf' {
  const content: ArrayBuffer;
  export default content;
}