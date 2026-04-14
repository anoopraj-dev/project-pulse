import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

let instance = null;

export const getSegmentation = () => {
  if (!instance) {
    instance = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    instance.setOptions({ modelSelection: 1 });
  }

  return instance;
};