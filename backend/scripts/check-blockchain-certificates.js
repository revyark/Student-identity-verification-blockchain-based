import mongoose from 'mongoose';
import { certificates, web3 } from '../config/web3config.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI || 'mongodb://localhost:27017'}/credential`);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check certificates on blockchain
const checkBlockchainCertificates = async () => {
  try {
    console.log('🔍 Checking certificates on blockchain...');
    
    // Get the student wallet address from the submitted credential
    const studentWalletAddress = '0x184eD92dC0B2B65aD7a606D7814004AD8e18D489';
    
    console.log(`📊 Checking certificates for student: ${studentWalletAddress}`);
    
    // Call getCertificates function
    const certificatesResult = await certificates.methods.getCertificates(studentWalletAddress).call();
    
    console.log(`📊 Found ${certificatesResult.length} certificates on blockchain:`);
    
    if (certificatesResult.length === 0) {
      console.log('❌ No certificates found for this student on blockchain');
      return;
    }
    
    // Display each certificate
    for (let i = 0; i < certificatesResult.length; i++) {
      const cert = certificatesResult[i];
      console.log(`\n📄 Certificate ${i + 1}:`);
      console.log(`   Issued By: ${cert.issuedBy}`);
      console.log(`   Student: ${cert.student}`);
      console.log(`   IPFS Hash: ${cert.ipfsHash}`);
      console.log(`   Issued At: ${new Date(Number(cert.issuedAt) * 1000).toISOString()}`);
      console.log(`   Revoked: ${cert.revoked}`);
    }
    
    // Also try to verify the specific hash from the submitted credential
    const submittedCredentialHash = 'e8c43645553d8bf0be7d52b200b6b06d0286ddecb3d7f6a26fb5920acf9483e8';
    console.log(`\n🔍 Verifying specific hash: ${submittedCredentialHash}`);
    
    try {
      const verificationResult = await certificates.methods
        .verifyCertificate(studentWalletAddress, submittedCredentialHash)
        .call();
      
      console.log(`📊 Verification result:`, verificationResult);
      console.log(`   Valid: ${verificationResult[0]}`);
      console.log(`   Issued By: ${verificationResult[1]}`);
      console.log(`   Issued At: ${new Date(Number(verificationResult[2]) * 1000).toISOString()}`);
      console.log(`   Revoked: ${verificationResult[3]}`);
      
    } catch (verifyError) {
      console.error(`❌ Verification failed:`, verifyError.message);
    }
    
  } catch (error) {
    console.error('❌ Error checking blockchain certificates:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await checkBlockchainCertificates();
  
  console.log('\n🏁 Script completed');
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Run the script
main();
