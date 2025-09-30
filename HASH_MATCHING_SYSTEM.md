# Hash Matching System for Credential Verification

## Overview
The hash matching system ensures that students can upload the same document that was issued by an institute, and the system can match them for verification purposes.

## 🔍 **How Hash Generation Works**

### **Two Types of Hashes**

#### 1. **Content Hash** (for matching)
```javascript
const contentHash = crypto
  .createHash("sha256")
  .update(fileBuffer)  // Only file content
  .digest("hex");
```
- **Purpose**: Match the same document across different uploads
- **Generated from**: File content only
- **Same for**: Same file uploaded by anyone (institute or student)

#### 2. **Credential Hash** (for blockchain)
```javascript
const credentialHash = crypto
  .createHash("sha256")
  .update(fileBuffer)           // File content
  .update(studentWalletAddress) // Student's wallet
  .update(issuerWalletAddress)  // Issuer's wallet
  .digest("hex");
```
- **Purpose**: Unique identifier for blockchain storage
- **Generated from**: File content + wallet addresses
- **Different for**: Same file uploaded by different parties

## 📋 **What Students Need to Upload**

### ✅ **For Successful Matching:**
1. **Exact Same File**: The identical file that the institute used
2. **Same File Content**: Every byte must be identical
3. **Same File Format**: PDF, DOC, etc. - must match exactly
4. **Same File Size**: Must be exactly the same size

### ❌ **What Will NOT Match:**
- Different file versions
- Files with different content
- Scanned vs. original documents
- Files with different metadata
- Files saved in different formats
- Files with different compression
- Files with different timestamps

## 🔄 **Complete Flow Example**

### **Step 1: Institute Issues Credential**
```javascript
// Institute uploads: "degree_certificate.pdf" (1,024,000 bytes)
// File content hash: "abc123def456..." (contentHash)
// Student wallet: "0x123..."
// Institute wallet: "0x456..."
// Credential hash: "xyz789uvw012..." (for blockchain)
```

### **Step 2: Student Uploads Same File**
```javascript
// Student uploads: "degree_certificate.pdf" (1,024,000 bytes) - SAME FILE
// File content hash: "abc123def456..." (contentHash) - SAME!
// Student wallet: "0x123..." - SAME
// Verifier wallet: "0x789..." - DIFFERENT
// Credential hash: "def456ghi789..." (different due to different verifier wallet)
```

### **Step 3: Verification Process**
```javascript
// System can match using contentHash: "abc123def456..."
// Both uploads have the same contentHash
// Verification can proceed using the blockchain credentialHash
```

## 🛠️ **Technical Implementation**

### **Database Schema Updates**

#### **Credential Model**
```javascript
{
  contentHash: String,      // For matching same documents
  credentialHash: String,   // For blockchain storage
  // ... other fields
}
```

#### **SubmittedCredential Model**
```javascript
{
  contentHash: String,      // For matching same documents
  credentialHash: String,   // For blockchain storage
  // ... other fields
}
```

### **API Response Updates**

#### **Upload Response**
```json
{
  "url": "https://cloudinary.com/...",
  "contentHash": "abc123def456...",
  "credentialHash": "xyz789uvw012...",
  // ... other fields
}
```

## 🎯 **Verification Process**

### **1. Student Uploads Document**
- System generates `contentHash` and `credentialHash`
- Stores both in database
- `contentHash` is used for matching

### **2. Verifier Verifies Document**
- System looks up submitted credential by `credentialHash`
- Uses `contentHash` to find matching issued credentials
- Queries blockchain using the issued credential's `credentialHash`

### **3. Hash Matching Logic**
```javascript
// Find matching issued credential by contentHash
const issuedCredential = await Credential.findOne({ 
  contentHash: submittedCredential.contentHash 
});

// Use issued credential's credentialHash for blockchain verification
const verificationResult = await certificates.methods
  .verifyCertificate(
    issuedCredential.studentWalletAddress, 
    issuedCredential.credentialHash
  )
  .call();
```

## 📊 **Hash Comparison Examples**

### **Same File, Different Uploaders**
| Uploader | File | Content Hash | Credential Hash |
|----------|------|--------------|-----------------|
| Institute | degree.pdf | `abc123...` | `xyz789...` |
| Student | degree.pdf | `abc123...` | `def456...` |
| **Match**: ✅ | **Match**: ✅ | **Match**: ✅ | **Different**: ❌ |

### **Different Files**
| Uploader | File | Content Hash | Credential Hash |
|----------|------|--------------|-----------------|
| Institute | degree.pdf | `abc123...` | `xyz789...` |
| Student | degree_copy.pdf | `def456...` | `ghi789...` |
| **Match**: ❌ | **Match**: ❌ | **Match**: ❌ | **Match**: ❌ |

## 🔧 **Implementation Files Updated**

### **Backend Changes**
1. **`backend/utils/hashGenerator.js`**
   - Added `generateContentHash()` function
   - Kept existing `generateCredentialHash()` function

2. **`backend/models/credential.models.js`**
   - Added `contentHash` field

3. **`backend/models/submittedCredential.models.js`**
   - Added `contentHash` field

4. **`backend/controllers/Credentials.controller.js`**
   - Generate both hashes during upload
   - Store both hashes in database

5. **`backend/controllers/submittedCredential.controller.js`**
   - Generate both hashes during student upload
   - Store both hashes in database

### **Frontend Changes**
1. **`frontend/src/components/Institution/IssueCredentialForm.js`**
   - Send both hashes to backend

## 🧪 **Testing the System**

### **Test Case 1: Same File Upload**
1. Institute uploads `test.pdf`
2. Note the `contentHash` from response
3. Student uploads the same `test.pdf`
4. Verify both have the same `contentHash`
5. Verify they have different `credentialHash`

### **Test Case 2: Different File Upload**
1. Institute uploads `test.pdf`
2. Student uploads `test_copy.pdf` (different content)
3. Verify they have different `contentHash`
4. Verify they have different `credentialHash`

### **Test Case 3: Verification Matching**
1. Institute issues credential with `contentHash: "abc123"`
2. Student uploads same file, gets `contentHash: "abc123"`
3. Verifier verifies - should find matching issued credential
4. Blockchain verification should succeed

## 🚀 **Benefits**

1. **Accurate Matching**: Same documents are correctly identified
2. **Flexible Verification**: Works across different uploaders
3. **Blockchain Integration**: Maintains unique blockchain identifiers
4. **Data Integrity**: Ensures file content hasn't been tampered with
5. **Scalable**: Can handle multiple uploads of the same document

## ⚠️ **Important Notes**

1. **File Integrity**: Students must upload the exact same file
2. **Hash Uniqueness**: Each upload gets a unique `credentialHash`
3. **Matching Logic**: Use `contentHash` for matching, `credentialHash` for blockchain
4. **Database Migration**: Existing records will need `contentHash` field added
5. **Backward Compatibility**: System handles both old and new hash formats

This system ensures that students can successfully upload the same documents that institutes have issued, enabling proper verification through the blockchain system.
