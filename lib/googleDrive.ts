/**
 * Utility functions for Google Drive image URLs
 */

/**
 * Converts a Google Drive sharing link to a direct image URL
 * @param sharingLink - The Google Drive sharing link
 * @returns Direct image URL that can be used in <img> tags
 */
export function convertDriveLinkToDirect(sharingLink: string): string {
  // Extract file ID from various Google Drive link formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/, // Standard sharing link
    /id=([a-zA-Z0-9_-]+)/, // Alternative format
    /\/d\/([a-zA-Z0-9_-]+)/, // Short format
  ];

  for (const pattern of patterns) {
    const match = sharingLink.match(pattern);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }

  // If no pattern matches, return the original link
  // (might already be a direct link)
  return sharingLink;
}

/**
 * Validates if a URL is a valid Google Drive image URL
 * @param url - The URL to validate
 * @returns True if the URL appears to be a valid Google Drive image URL
 */
export function isValidDriveUrl(url: string): boolean {
  return (
    url.includes('drive.google.com') ||
    url.includes('googleusercontent.com') ||
    url.startsWith('https://') ||
    url.startsWith('http://')
  );
}

