'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

import { loadModel } from '@/utils/loadModel';
import { loadImage } from '@/utils/loadImage';

import { UploadImage } from '@/components/uploadImage';

export default function Home() {
  const [model, setModel] = useState({});
  const [image, setImage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<
    Record<string, string | number>[]
  >([]);

  useEffect(() => {
    async function initModel() {
      const loadedModel = await loadModel();
      setModel(loadedModel);
    }
    initModel();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPredictions([]);
    if (event.target?.files?.[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setFile(event.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    try {
      const image = await loadImage(file as File);
      // @ts-expect-error - model is not typed
      const predictions = await model.classify(image);
      setPredictions(predictions);
    } catch (error) {
      console.error('Error analyzing the image:', error);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>What pup?</h1>
        <p>An interesting breed detection and bark translation app</p>
        {image && (
          <div>
            <img
              src={image}
              width={300}
              alt='user uploaded'
              className={styles.userImage}
            />
            <br />
            {predictions.length <= 0 ? (
              <button
                onClick={() => handleAnalyze()}
                className={styles.uploadButtonLabel}
              >
                What breed am I?
              </button>
            ) : (
              <UploadImage handleFileChange={handleFileChange} />
            )}
          </div>
        )}
        {predictions.length > 0 && (
          <div>
            {predictions.map((prediction, index) => {
              return (
                <div key={`prediction-${index}`}>
                  <p>Prediction: {prediction?.className}</p>
                  <p>
                    Confidence:{' '}
                    {((prediction.probability as number) * 100).toFixed(2)}%
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {!image && <UploadImage handleFileChange={handleFileChange} />}
      </main>
    </div>
  );
}
