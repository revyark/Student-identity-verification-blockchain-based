import crypto from "crypto";
import fs from "fs";

/**
 * Generate a content-only hash from file content
 * This ensures the same document will have the same hash regardless of who uploads it
 * 
 * @param {string} filePath - Path to the file to hash
 * @returns {string} SHA256 hash of the file content only
 */
export const generateContentHash = (filePath) => {
  try {
    // Read file content
    const fileBuffer = fs.readFileSync(filePath);
    
    // Generate hash from file content only
    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");
    
    return hash;
  } catch (error) {
    console.error("Error generating content hash:", error);
    throw new Error("Failed to generate content hash");
  }
};

/**
 * Generate a credential hash from file content and wallet addresses
 * This creates a unique hash for each upload (institute vs student)
 * 
 * @param {string} filePath - Path to the file to hash
 * @param {string} studentWalletAddress - Student's wallet address
 * @param {string} issuerWalletAddress - Issuer's wallet address (institute or verifier)
 * @returns {string} SHA256 hash of the file content + wallet addresses
 */
export const generateCredentialHash = (filePath, studentWalletAddress, issuerWalletAddress) => {
  try {
    // Read file content
    const fileBuffer = fs.readFileSync(filePath);
    
    // Generate hash from file content + wallet addresses
    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .update(studentWalletAddress)
      .update(issuerWalletAddress)
      .digest("hex");
    
    return hash;
  } catch (error) {
    console.error("Error generating credential hash:", error);
    throw new Error("Failed to generate credential hash");
  }
};

/**
 * Generate a unique credential ID for database storage
 * This is different from the credential hash and is used for internal tracking
 * 
 * @param {string} credentialHash - The credential hash
 * @param {number} timestamp - Optional timestamp (defaults to current time)
 * @returns {string} MD5 hash for unique ID
 */
export const generateCredentialId = (credentialHash, timestamp = Date.now()) => {
  return crypto
    .createHash("md5")
    .update(credentialHash + timestamp)
    .digest("hex");
};
