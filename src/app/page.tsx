"use client";

import '@tensorflow/tfjs';
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import * as mobilenet from "@tensorflow-models/mobilenet";

const loadModel = async () => {
  try {
    const model = await mobilenet.load({ version: 2, alpha: 0.5 });
    return model;
  } catch (error) {
    console.error("Error loading the model:", error);
    throw error;
  }
};

const loadImage = async (file: File) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => resolve(img);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
  })
};

export default function Home() {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const loadedModel = await loadModel();
        console.log("loadedModel", loadedModel);
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading the model:', error)
      }
    })();
  }, []);

  const handleFileChange = async (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
    setFile(event.target.files[0]);
  };

  const handleAnalyze = async () => {
    console.log('Analyzing the image...');
    try {
      const image = await loadImage(file);
      console.log('image', image);
      const predictions = await model.classify(image)
      setPredictions(predictions)
    } catch (error) {
      console.error('Error analyzing the image:', error)
    }
  };

  console.log('predictions', predictions);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>What pup?</h1>
        <p>An interesting breed detection and bark translation app</p>
        {image && 
          <div>
            <img src={image} width={300} />
            <br/>
            <button onClick={() => handleAnalyze()}>what breed am i?</button>
          </div>
        }
        {!image && <div>
            <label htmlFor='fileSelect'>
                Upload an image
            </label>
            <input
                id='fileSelect'
                type='file'
                onChange={(event) => handleFileChange(event)}
                hidden
            />
        </div>}
      </main>
    </div>
  );
}
