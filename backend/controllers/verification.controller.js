import { asyncHandler } from "../utils/asyncHandler.js";
import { certificates, web3, instituteAccount } from "../config/web3config.js";
import { SubmittedCredential } from "../models/submittedCredential.models.js";
import { Credential } from "../models/credential.models.js";
import { Student } from "../models/user.models.js";

// Verify a credential using blockchain
const verifyCredential = asyncHandler(async (req, res) => {
  console.log(`[verifyCredential] Request received:`, req.body);
  
  const { credentialId, studentWalletAddress, credentialHash } = req.body;

  if (!credentialId || !studentWalletAddress || !credentialHash) {
    console.log(`[verifyCredential] Missing required fields:`, { credentialId, studentWalletAddress, credentialHash });
    res.status(400);
    throw new Error("credentialId, studentWalletAddress, and credentialHash are required");
  }

  // Validate wallet address format
  if (!studentWalletAddress.startsWith('0x') || studentWalletAddress.length !== 42) {
    res.status(400);
    throw new Error("Invalid student wallet address format");
  }

  try {
    console.log(`[verifyCredential] Verifying credential ${credentialId} for student ${studentWalletAddress}`);
    
    // Check if the submitted credential exists in our database
    const submittedCredential = await SubmittedCredential.findById(credentialId);
    if (!submittedCredential) {
      res.status(404);
      throw new Error("Submitted credential not found");
    }

    // Verify the credential hash matches
    if (submittedCredential.credentialHash !== credentialHash) {
      res.status(400);
      throw new Error("Credential hash mismatch");
    }

    // Verify the student wallet address matches
    if (submittedCredential.studentWalletAddress !== studentWalletAddress) {
      res.status(400);
      throw new Error("Student wallet address mismatch");
    }

    // Find the matching issued credential using content hash
    console.log(`[verifyCredential] Looking for issued credential with contentHash:`, submittedCredential.contentHash);
    const issuedCredential = await Credential.findOne({ 
      contentHash: submittedCredential.contentHash 
    });

    if (!issuedCredential) {
      console.log(`[verifyCredential] No issued credential found in database, checking blockchain directly...`);
      
      // Check blockchain directly using the content hash
      try {
        const blockchainResult = await certificates.methods
          .verifyCertificate(studentWalletAddress, submittedCredential.contentHash)
          .call();
        
        console.log(`[verifyCredential] Blockchain verification result:`, blockchainResult);
        
        if (blockchainResult[0]) { // Certificate is valid on blockchain
          const verificationResponse = {
            success: true,
            data: {
              credentialId,
              studentWalletAddress,
              credentialHash,
              contentHash: submittedCredential.contentHash,
              verification: {
                isValid: true,
                isRevoked: blockchainResult[3],
                issuedBy: blockchainResult[1],
                issuedAt: new Date(Number(blockchainResult[2]) * 1000).toISOString(),
                verifiedAt: new Date().toISOString()
              },
              student: {
                walletAddress: studentWalletAddress
              },
              submittedCredential: {
                submissionDate: submittedCredential.submissionDate,
                cloudinaryUrl: submittedCredential.cloudinaryUrl,
                fileSize: submittedCredential.fileSize,
                mimeType: submittedCredential.mimeType
              }
            }
          };
          
          console.log(`[verifyCredential] ✅ Credential verified via blockchain (no database record)`);
          return res.json(verificationResponse);
        }
      } catch (blockchainError) {
        console.error(`[verifyCredential] Blockchain verification failed:`, blockchainError.message);
      }
      
      return res.status(404).json({
        success: false,
        message: "No issued credential found with matching content. The document may not have been issued by an institute yet.",
        data: {
          credentialId,
          studentWalletAddress,
          credentialHash,
          contentHash: submittedCredential.contentHash,
          verification: {
            isValid: false,
            isRevoked: false,
            issuedBy: null,
            issuedAt: null,
            verifiedAt: new Date().toISOString()
          }
        }
      });
    }

    console.log(`[verifyCredential] Found matching issued credential:`, issuedCredential._id);

    // Call the smart contract to verify the certificate using the issued credential's hash
    console.log(`[verifyCredential] Calling smart contract verifyCertificate...`);
    console.log(`[verifyCredential] Parameters:`, { 
      studentWalletAddress: issuedCredential.studentWalletAddress, 
      credentialHash: issuedCredential.credentialHash 
    });
    
    let verificationResult;
    try {
      verificationResult = await certificates.methods
        .verifyCertificate(issuedCredential.studentWalletAddress, issuedCredential.credentialHash)
        .call();
    } catch (contractError) {
      console.error(`[verifyCredential] Smart contract call failed:`, contractError);
      throw new Error(`Smart contract verification failed: ${contractError.message}`);
    }

    console.log(`[verifyCredential] Raw smart contract result:`, verificationResult);
    console.log(`[verifyCredential] Result type:`, typeof verificationResult);
    console.log(`[verifyCredential] Is array:`, Array.isArray(verificationResult));

    // Handle both array and object responses
    let isValid, issuedBy, issuedAt, isRevoked;
    
    if (Array.isArray(verificationResult)) {
      [isValid, issuedBy, issuedAt, isRevoked] = verificationResult;
    } else if (verificationResult && typeof verificationResult === 'object') {
      // Handle object response (some Web3 versions return objects)
      isValid = verificationResult[0] || verificationResult.isValid;
      issuedBy = verificationResult[1] || verificationResult.issuedBy;
      issuedAt = verificationResult[2] || verificationResult.issuedAt;
      isRevoked = verificationResult[3] || verificationResult.isRevoked;
    } else {
      console.error(`[verifyCredential] Unexpected result type:`, typeof verificationResult);
      console.error(`[verifyCredential] Result value:`, verificationResult);
      throw new Error(`Invalid verification result format from smart contract. Type: ${typeof verificationResult}`);
    }

    console.log(`[verifyCredential] Smart contract result:`, {
      isValid,
      issuedBy,
      issuedAt: issuedAt ? new Date(issuedAt * 1000).toISOString() : null,
      isRevoked
    });

    // Check if credential exists on blockchain
    if (!isValid && issuedBy === '0x0000000000000000000000000000000000000000') {
      console.log(`[verifyCredential] Credential not found on blockchain`);
      return res.status(404).json({
        success: false,
        message: "Credential not found on blockchain. It may not have been issued yet.",
        data: {
          credentialId,
          studentWalletAddress,
          credentialHash,
          verification: {
            isValid: false,
            isRevoked: false,
            issuedBy: null,
            issuedAt: null,
            verifiedAt: new Date().toISOString()
          }
        }
      });
    }

    // Get student details
    const student = await Student.findOne({ walletAddress: issuedCredential.studentWalletAddress });
    
    // Get issuer details (assuming it's an institute)
    let issuerDetails = null;
    if (issuedBy && issuedBy !== '0x0000000000000000000000000000000000000000') {
      // You might want to add an Institute model lookup here
      issuerDetails = {
        walletAddress: issuedBy,
        name: "Verified Institution" // This could be looked up from Institute model
      };
    }

    const verificationResponse = {
      success: true,
      data: {
        credentialId,
        studentWalletAddress,
        credentialHash,
        contentHash: submittedCredential.contentHash,
        verification: {
          isValid: isValid && !isRevoked,
          isRevoked,
          issuedBy,
          issuedAt: issuedAt ? new Date(issuedAt * 1000).toISOString() : null,
          verifiedAt: new Date().toISOString()
        },
        student: student ? {
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          username: student.Username
        } : null,
        issuer: issuerDetails,
        issuedCredential: {
          credentialId: issuedCredential._id,
          credentialName: issuedCredential.credentialName,
          credentialType: issuedCredential.credentialType,
          issueDate: issuedCredential.issueDate,
          expiryDate: issuedCredential.expiryDate,
          status: issuedCredential.status
        },
        submittedCredential: {
          submissionDate: submittedCredential.submissionDate,
          cloudinaryUrl: submittedCredential.cloudinaryUrl,
          fileSize: submittedCredential.fileSize,
          mimeType: submittedCredential.mimeType
        }
      }
    };

    // Log the verification result
    if (isValid && !isRevoked) {
      console.log(`[verifyCredential] ✅ Credential verified successfully`);
    } else if (isRevoked) {
      console.log(`[verifyCredential] ⚠️ Credential is revoked`);
    } else {
      console.log(`[verifyCredential] ❌ Credential verification failed`);
    }

    res.status(200).json(verificationResponse);

  } catch (error) {
    console.error(`[verifyCredential] ❌ Verification failed:`, error.message);
    console.error(`[verifyCredential] Error stack:`, error.stack);
    
    // Handle specific blockchain errors
    if (error.message.includes("execution reverted")) {
      res.status(400);
      throw new Error("Credential not found on blockchain or verification failed");
    }
    
    // Handle JSON parsing errors
    if (error.message.includes("JSON.parse")) {
      res.status(500);
      throw new Error("Server response parsing error");
    }
    
    throw error;
  }
});

// Get verification history for a verifier
const getVerificationHistory = asyncHandler(async (req, res) => {
  const { verifierWalletAddress } = req.params;

  if (!verifierWalletAddress) {
    res.status(400);
    throw new Error("Verifier wallet address is required");
  }

  try {
    // Get all submitted credentials for this verifier
    const submittedCredentials = await SubmittedCredential.find({ 
      verifierWalletAddress 
    }).sort({ submissionDate: -1 });

    // For each credential, check if it's verified on blockchain
    const verificationHistory = await Promise.all(
      submittedCredentials.map(async (cred) => {
        try {
          const verificationResult = await certificates.methods
            .verifyCertificate(cred.studentWalletAddress, cred.credentialHash)
            .call();

          // Handle both array and object responses
          let isValid, issuedBy, issuedAt, isRevoked;
          
          if (Array.isArray(verificationResult)) {
            [isValid, issuedBy, issuedAt, isRevoked] = verificationResult;
          } else if (verificationResult && typeof verificationResult === 'object') {
            // Handle object response (some Web3 versions return objects)
            isValid = verificationResult[0] || verificationResult.isValid;
            issuedBy = verificationResult[1] || verificationResult.issuedBy;
            issuedAt = verificationResult[2] || verificationResult.issuedAt;
            isRevoked = verificationResult[3] || verificationResult.isRevoked;
          } else {
            throw new Error("Invalid verification result format from smart contract");
          }

          return {
            credentialId: cred._id,
            studentWalletAddress: cred.studentWalletAddress,
            credentialHash: cred.credentialHash,
            submissionDate: cred.submissionDate,
            verification: {
              isValid: isValid && !isRevoked,
              isRevoked,
              issuedBy,
              issuedAt: issuedAt ? new Date(issuedAt * 1000).toISOString() : null
            },
            cloudinaryUrl: cred.cloudinaryUrl
          };
        } catch (error) {
          console.error(`Error verifying credential ${cred._id}:`, error.message);
          return {
            credentialId: cred._id,
            studentWalletAddress: cred.studentWalletAddress,
            credentialHash: cred.credentialHash,
            submissionDate: cred.submissionDate,
            verification: {
              isValid: false,
              isRevoked: false,
              issuedBy: null,
              issuedAt: null,
              error: "Verification failed"
            },
            cloudinaryUrl: cred.cloudinaryUrl
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      data: {
        verifierWalletAddress,
        verificationHistory,
        totalCount: verificationHistory.length
      }
    });

  } catch (error) {
    console.error("Error fetching verification history:", error);
    res.status(500);
    throw new Error("Failed to fetch verification history");
  }
});

export { verifyCredential, getVerificationHistory };
