# Credential Hash Consistency Solution

## Problem
The original implementation had inconsistent credential hash generation between:
1. **Institute Credential Issuance**: Used Cloudinary `public_id` directly as credential hash
2. **Student Document Upload**: Generated SHA256 hash from multiple fields including timestamp

This meant the same document uploaded by an institute vs. a student would have completely different credential hashes, making it impossible to match them.

## Solution
Implemented a **content-based hash generation strategy** that ensures consistency across both flows.

### Key Changes

#### 1. Created Shared Utility (`backend/utils/hashGenerator.js`)
- `generateCredentialHash()`: Generates SHA256 hash from file content + wallet addresses
- `generateCredentialId()`: Generates unique MD5 ID for database storage
- Ensures same document + wallet addresses = same credential hash

#### 2. Updated Institute Flow (`IssueCredentialForm.js` + `Credentials.controller.js`)
- Frontend now sends `studentWalletAddress` and `issuerWalletAddress` in upload request
- Backend generates hash from file content before Cloudinary upload
- Returns `credentialHash` in upload response
- Frontend uses returned hash instead of Cloudinary `public_id`

#### 3. Updated Student Flow (`Studentupload.js` + `submittedCredential.controller.js`)
- Backend now generates hash from file content (not Cloudinary metadata)
- Uses same hash generation algorithm as institute flow
- Ensures consistency when same document is uploaded by student

### Hash Generation Algorithm
```javascript
const hash = crypto
  .createHash("sha256")
  .update(fileBuffer)           // File content
  .update(studentWalletAddress) // Student's wallet
  .update(issuerWalletAddress)  // Issuer's wallet (institute/verifier)
  .digest("hex");
```

### Benefits
1. **Consistency**: Same document + wallet addresses = same hash
2. **Traceability**: Can match documents across different upload flows
3. **Security**: Hash includes file content, preventing tampering
4. **Uniqueness**: Includes wallet addresses to prevent collisions

### Usage Example
If an institute issues a credential for student `0x123...` with wallet `0x456...`, and later the same student uploads the same document to a verifier with wallet `0x789...`, the credential hashes will be:
- Institute: `hash(file_content + 0x123... + 0x456...)`
- Student: `hash(file_content + 0x123... + 0x789...)`

The hashes will be different (as expected) because the issuer wallet addresses are different, but the same document uploaded by the same student to the same issuer will always produce the same hash.

### API Changes
- **Upload endpoints** now require `studentWalletAddress` and `issuerWalletAddress` in request body
- **Upload responses** now include `credentialHash` field
- **Frontend** updated to send required fields and use returned hash

### Testing
To verify consistency:
1. Upload same document via institute flow
2. Upload same document via student flow to same verifier
3. Compare credential hashes - they should be identical
4. Upload to different verifier - hash should be different (due to different issuer wallet)
