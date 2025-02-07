'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';

import { loadModel } from '@/utils/loadModel';
import { loadImage } from '@/utils/loadImage';

import { UploadImage } from '@/components/uploadImage';

export default function Home() {
  const [model, setModel] = useState({});
  const [image, setImage] = useState('');
  const [audio, setAudio] = useState(null);
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<
    Record<string, string | number>[]
  >([]);
  const [barkPrediction, setBarkPrediction] = useState(null);

  // TODO - should really be an api route...
  const key = process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY;

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

  const classifyImage = async () => {
    try {
      const image = await loadImage(file as File);
      // @ts-expect-error - model is not typed
      const predictions = await model.classify(image);
      setPredictions(predictions);
    } catch (error) {
      console.error('Error analyzing the image:', error);
    }
  };

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    setAudio(file);
  };

  const classifyBark = async () => {
    const formData = new FormData();
    formData.append('file', audio);
    formData.append('model', 'whisper-1');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    setBarkPrediction(response.data.text);
  };

  console.log({ audio, barkPrediction });

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
                onClick={() => classifyImage()}
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

        {!audio && (
          <div>
            <label htmlFor='barkSelect' className={styles.uploadButtonLabel}>
              Upload a bark
            </label>
            <input
              type='file'
              id='barkSelect'
              accept='audio/*'
              onChange={handleAudioUpload}
              hidden
            />
          </div>
        )}
        {audio && (
          <button onClick={classifyBark} className={styles.uploadButtonLabel}>
            Classify Bark
          </button>
        )}
        {barkPrediction && (
          <p className='text-lg font-semibold'>
            Bark Analysis: {barkPrediction}
          </p>
        )}
      </main>
    </div>
  );
}
