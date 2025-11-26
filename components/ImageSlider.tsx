'use client';

import { useState } from 'react';

interface ImageSliderProps {
  images: string[];
  productName: string;
}

// Convert Google Drive sharing link to direct image URL
function convertDriveUrl(url: string): string {
  if (!url) return url;
  
  // If it's already a direct link, return as is
  if (url.includes('drive.google.com/uc?export=view')) {
    return url;
  }
  
  // Extract file ID from sharing link
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  let fileId = '';
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      fileId = match[1];
      break;
    }
  }

  if (!fileId) return url;

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// Alternative: Get thumbnail URL
function getThumbnailUrl(url: string): string {
  const fileId = url.match(/[\/=]([a-zA-Z0-9_-]{25,})/)?.[1];
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
}

export default function ImageSlider({ images, productName }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [fallbackUrls, setFallbackUrls] = useState<Map<number, string>>(new Map());

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const convertedImages = images.map(img => convertDriveUrl(img));

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? convertedImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === convertedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (index: number, isThumbnail = false) => {
    // Try thumbnail URL as fallback for main image
    if (!isThumbnail && !fallbackUrls.has(index)) {
      const thumbnailUrl = getThumbnailUrl(images[index]);
      setFallbackUrls(prev => {
        const newMap = new Map(prev);
        newMap.set(index, thumbnailUrl);
        return newMap;
      });
      // Force re-render by updating loading state
      setImageLoading(true);
      return;
    }
    
    // If thumbnail also failed, mark as error
    setImageErrors(prev => new Set(prev).add(index));
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Get current image URL, with fallback to thumbnail if available
  const getCurrentImageUrl = () => {
    if (fallbackUrls.has(currentIndex)) {
      return fallbackUrls.get(currentIndex)!;
    }
    return convertedImages[currentIndex];
  };

  const currentImage = getCurrentImageUrl();
  const hasError = imageErrors.has(currentIndex);

  return (
    <div className="relative w-full">
      {/* Main Image */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg bg-gray-100">
        {imageLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-400">Loading image...</div>
          </div>
        )}
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-4">
            <p className="text-gray-500 mb-2 font-semibold">Image failed to load</p>
            <p className="text-xs text-gray-400 text-center mb-2">
              The image URL might be incorrect or the file is not publicly accessible.
            </p>
            <p className="text-xs text-gray-500 mb-2">Troubleshooting:</p>
            <ul className="text-xs text-gray-400 text-left list-disc list-inside space-y-1 mb-2">
              <li>Verify the image is set to "Anyone with the link can view"</li>
              <li>Check if the URL works when opened directly in a new tab</li>
              <li>Try using the direct image URL format</li>
            </ul>
            <p className="text-xs text-gray-400 mt-2 break-all px-4 text-center">
              URL: {currentImage}
            </p>
          </div>
        ) : (
          <img
            key={`${currentIndex}-${fallbackUrls.has(currentIndex) ? 'thumb' : 'direct'}`}
            src={currentImage}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={() => handleImageError(currentIndex)}
            onLoad={handleImageLoad}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
        
        {/* Navigation Arrows */}
        {convertedImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#73181F' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#73181F' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {convertedImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {convertedImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {convertedImages.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {convertedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setImageLoading(true);
                setImageErrors(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(index);
                  return newSet;
                });
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                index === currentIndex
                  ? 'border-opacity-100'
                  : 'border-gray-300 border-opacity-50 hover:border-opacity-75'
              }`}
              style={{
                borderColor: index === currentIndex ? '#73181F' : undefined,
              }}
            >
              {imageErrors.has(index) ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                  Error
                </div>
              ) : (
                <img
                  src={fallbackUrls.has(index) ? fallbackUrls.get(index)! : image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index, true)}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


