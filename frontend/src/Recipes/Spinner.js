import React, { useState, useEffect, useRef } from 'react';
import styles from './Spinner.module.css';
import axios from 'axios';
import { getCachedBackendUrl } from '../Util';

/**
 * Spinner component
 * - Lists user's fridges in a vertical slider with center focus effect
 * - Allows creating a new fridge
 * - Lets the user select the highlighted fridge
 */
const Spinner = ({ setCurrentFridge }) => {
  // Index of the currently highlighted fridge in the list
  const [currentIndex, setCurrentIndex] = useState(0);
  // Ref for the visible window to compute vertical centering
  const windowRef = useRef(null);
  // Ref for the track that contains the list of fridges
  const trackRef = useRef(null);
  // Pixel value to vertically center the current item
  const [centerOffset, setCenterOffset] = useState(0);
  // UI state for create-fridge mode
  const [isCreating, setIsCreating] = useState(false);
  const [newFridgeName, setNewFridgeName] = useState('');
  // Fridge list and backend base URL
  const [Fridges, setFridges] = useState([{ name: 'Loading...' }]);
  const [backendUrl, setBackendUrl] = useState('');

  // Initialize backend URL once
  useEffect(() => {
    const initBackendUrl = async () => {
      try {
        const url = await getCachedBackendUrl();
        setBackendUrl(url);
      } catch (error) {
        console.error('Failed to get backend URL:', error);
        // Fallback in case discovery fails
        setBackendUrl('http://localhost:5000');
      }
    };
    // Fire and forget
    initBackendUrl();
  }, []);

  // Fetch user's fridges from backend
  const refreshFridges = async () => {
    if (!backendUrl) {
      return;
    }
    const username = localStorage.getItem('username');
    try {
      const response = await axios.get(
        `${backendUrl}/get_fridges?username=${username}`,
      );
      if (
        response.data &&
        response.data.success === true &&
        Array.isArray(response.data.fridges)
      ) {
        setFridges(response.data.fridges);
      }
    } catch (error) {
      console.error('Error fetching fridges:', error);
    }
  };

  // On backend URL ready: fetch fridges and compute centering offset
  useEffect(() => {
    const run = async () => {
      if (backendUrl) {
        await refreshFridges();
      }
      if (windowRef.current) {
        const h = windowRef.current.offsetHeight;
        setCenterOffset(h / 2);
      }
    };
    run();
  }, [backendUrl]);

  // Click handler to highlight an item
  const handleClick = (itemIndex) => {
    setCurrentIndex(itemIndex);
  };

  // Create a new fridge with the provided name
  const createFridge = async (newFridge) => {
    if (!backendUrl || newFridge.trim().length === 0) {
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/add_fridge`, {
        username: localStorage.getItem('username'),
        name: newFridge.trim(),
      });

      if (response.data && response.data.success === true) {
        await refreshFridges();
        setNewFridgeName('');
      }
    } catch (error) {
      console.error('Error creating fridge:', error);
    }
  };

  const toggleIsCreating = () => setIsCreating((prev) => !prev);

  // Calculate the Y offset so the current item is centered in the window
  const calculateOffset = () => {
    if (!trackRef.current) {
      return 0;
    }
    const sliderItems = trackRef.current.children;
    let offset = 0;
    for (let i = 0; i < currentIndex; i++) {
      const el = sliderItems[i];
      if (el) {
        offset += el.offsetHeight;
        // include the gap between items if defined via CSS
        offset += 10;
      }
    }
    return offset;
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.sliderContainer}>
        <div className={styles.sliderWindow} ref={windowRef}>
          <div
            className={styles.sliderTrack}
            ref={trackRef}
            style={{
              transform: `translateY(calc(${centerOffset}px - ${calculateOffset()}px))`,
            }}>
            {Fridges.length > 0 ? (
              Fridges.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
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
              <p style={{ color: '#aaa', fontSize: '15px' }}>
                You have no fridges
              </p>
            )}
          </div>
        </div>

        {!isCreating ? (
          <>
            <div className={styles.createFridge} onClick={toggleIsCreating}>
              Create New Fridge
            </div>
            <div
              className={`${styles.createFridge} ${styles.secondaryBtn}`}
              onClick={() => {
                if (Fridges.length > 0) {
                  setCurrentFridge(Fridges[currentIndex]);
                }
              }}>
              Select Current Fridge
            </div>
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Spinner;
