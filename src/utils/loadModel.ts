import '@tensorflow/tfjs';
import { load } from "@tensorflow-models/mobilenet";

const loadModel = async () => {
  try {
    const model = await load({ version: 2, alpha: 0.5 });
    return model;
  } catch (error) {
    console.error("Error loading the model:", error);
    throw error;
  }
};

export { loadModel };