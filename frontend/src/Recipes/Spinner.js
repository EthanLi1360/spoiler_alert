import React, { useState, useEffect, useRef } from 'react';
import styles from './Spinner.module.css';
import axios from 'axios';
import { getCachedBackendUrl } from '../Util';

const Spinner = ({ setCurrentFridge }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [centerOffset, setCenterOffset] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [newFridgeName, setNewFridgeName] = useState('');
  const username = localStorage.getItem('username');
  const [Fridges, setFridges] = useState([{ name: 'Loading...' }]);
  const [backendUrl, setBackendUrl] = useState('');

  // Initialize backend URL
  useEffect(() => {
    const initBackendUrl = async () => {
      try {
        const url = await getCachedBackendUrl();
        setBackendUrl(url);
      } catch (error) {
        console.error('Failed to get backend URL:', error);
        setBackendUrl('http://localhost:5000'); // fallback
      }
    };
    initBackendUrl();
  }, []);

  const refreshFridges = async () => {
    if (!backendUrl) return;

    const username = localStorage.getItem('username');
    try {
      const response = await axios.get(
        `${backendUrl}/get_fridges?username=${username}`,
      );
      console.log('AAAA');
      console.log(response);
      if (response.data.success) {
        setFridges(response.data.fridges);
      }
    } catch (error) {
      console.error('Error fetching fridges:', error);
    }
  };

  useEffect(() => {
    const fetchFridges = async () => {
      try {
        if (backendUrl) {
          await refreshFridges();
        }
      } catch (error) {
        console.error('Error fetching fridges:', error);
      }
    };

    if (backendUrl) {
      fetchFridges();
    }

    if (!sliderRef.current) return;

    const sliderWindow = sliderRef.current;
    const sliderWindowHeight = sliderWindow.offsetHeight;
    setCenterOffset(sliderWindowHeight / 2);
  }, [sliderRef, backendUrl]);

  const handleClick = (itemIndex) => {
    setCurrentIndex(itemIndex);
  };

  const createFridge = async (newFridge) => {
    if (!backendUrl) return;

    try {
      const response = await axios.post(`${backendUrl}/add_fridge`, {
        username: localStorage.getItem('username'),
        name: newFridge,
      });

      if (response.data.success) {
        await refreshFridges();
      }
    } catch (error) {
      console.error('Error creating fridge:', error);
    }
  };

  const toggleIsCreating = () => setIsCreating((prev) => !prev);

  const calculateOffset = () => {
    if (!sliderRef.current) return 0;
    const sliderItems = sliderRef.current.children;
    let offset = 0;

    for (let i = 0; i < currentIndex; i++) {
      offset += sliderItems[i].offsetHeight;
      offset += 10; //include gap
    }

    return offset;
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWindow}>
        <div
          className={styles.sliderTrack}
          ref={sliderRef}
          style={{
            transform: `translateY(calc(${centerOffset}px - ${calculateOffset()}px))`,
          }}>
          {Fridges.length > 0 ? (
            Fridges.map((item, index) => (
              <div
                key={index}
                className={styles.sliderItem}
                style={{
                  transform: `scale(${
                    1 - Math.abs(currentIndex - index) * 0.15
                  })`,
                  opacity: Math.max(
                    1 - Math.abs(currentIndex - index) * 0.2,
                    0,
                  ),
                }}
                onClick={() => handleClick(index)}>
                {item.name}
              </div>
            ))
          ) : (
            <>
              <p style={{ color: '#aaa', fontSize: '15px' }}>
                You have no fridges
              </p>
            </>
          )}
        </div>
      </div>
      {!isCreating ? (
        <>
          <div className={styles.createFridge} onClick={toggleIsCreating}>
            Create New Fridge
          </div>
          <div
            className={styles.createFridge}
            onClick={() => {
              if (Fridges.length > 0) {
                setCurrentFridge(Fridges[currentIndex]);
              }
            }}>
            Select Current Fridge
          </div>
        </>
      ) : (
        <>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="textInput"
              placeholder="Name"
              value={newFridgeName}
              onChange={(e) => setNewFridgeName(e.target.value)}
              className={styles.inputFridgeName}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className={styles.inputFridgeButton}
                onClick={() => {
                  createFridge(newFridgeName);
                  toggleIsCreating();
                }}>
                Create
              </button>
              <button
                className={styles.inputFridgeButton}
                onClick={toggleIsCreating}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Spinner;
