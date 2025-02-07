"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

import { loadModel } from "@/utils/loadModel";
import { loadImage } from "@/utils/loadImage";

export default function Home() {
  const [model, setModel] = useState({});
  const [image, setImage] = useState('');
  const [file, setFile] = useState<File | null>(null);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files?.[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      console.log('file', event.target.files[0]);
      setFile(event.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    console.log('Analyzing the image...');
    try {
      const image = await loadImage(file as File);
      // @ts-expect-error - model is not typed
      const predictions = await model.classify(image);
      setPredictions(predictions);
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
            <img src={image} width={300} alt="user uploaded" />
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
