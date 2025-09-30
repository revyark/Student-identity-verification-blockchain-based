import mongoose from 'mongoose';
import { Credential } from '../models/credential.models.js';

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

// Check issued credentials in database
const checkIssuedCredentials = async () => {
  try {
    console.log('🔍 Checking issued credentials in database...');
    
    // Get all issued credentials
    const issuedCredentials = await Credential.find({});
    console.log(`📊 Found ${issuedCredentials.length} issued credentials in database`);
    
    if (issuedCredentials.length === 0) {
      console.log('❌ No issued credentials found in database');
      return;
    }
    
    // Display each credential
    for (const cred of issuedCredentials) {
      console.log(`\n📄 Issued Credential:`);
      console.log(`   ID: ${cred._id}`);
      console.log(`   Name: ${cred.credentialName}`);
      console.log(`   Student Wallet: ${cred.studentWalletAddress}`);
      console.log(`   Issuer Wallet: ${cred.isssuerWalletAddress}`);
      console.log(`   Content Hash: ${cred.contentHash}`);
      console.log(`   Credential Hash: ${cred.credentialHash}`);
      console.log(`   Issue Date: ${cred.issueDate}`);
      console.log(`   Status: ${cred.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking issued credentials:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await checkIssuedCredentials();
  
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
