export type CameraInstance = {
  draw: (cb: any) => void;
  on: (eventName: any, callback: any) => void;
  off: (eventName: any, callback: any) => void;
  taint: () => void;
  resize: () => void;
};

export type Cameras = Record<string, CameraInstance>;
