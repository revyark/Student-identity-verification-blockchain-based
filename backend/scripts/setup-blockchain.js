#!/usr/bin/env node

/**
 * Blockchain Setup Script
 * 
 * This script helps set up the blockchain contracts by:
 * 1. Registering the configured account as a verified institution
 * 2. Registering students from the database
 * 
 * Usage: node backend/scripts/setup-blockchain.js
 */

import { verified_contract, student_registry, account, instituteAccount, web3 } from "../config/web3config.js";
import { Student } from "../models/user.models.js";
import { connectDB } from "../db/index.js";

async function setupBlockchain() {
  try {
    console.log("🚀 Starting blockchain setup...");
    console.log("📋 Using admin account:", account.address);
    console.log("📋 Using institute account:", instituteAccount.address);
    
    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");
    
    // 1. Register institute account as verified institution
    console.log("\n🏛️  Setting up institution verification...");
    const isVerified = await verified_contract.methods.checkVerification(instituteAccount.address).call();
    
    if (!isVerified) {
      console.log("📝 Registering institute account as verified institution...");
      const tx = await verified_contract.methods
        .setVerificationStatus(instituteAccount.address, true)
        .send({ from: account.address, gas: 500000 }); // admin account registers institute account
      
      console.log("✅ Institute account registered! Transaction:", tx.transactionHash);
    } else {
      console.log("✅ Institute account is already verified as institution");
    }
    
    // 2. Register students
    console.log("\n👥 Setting up student registrations...");
    const students = await Student.find({ walletAddress: { $exists: true, $ne: null } });
    console.log(`📊 Found ${students.length} students with wallet addresses`);
    
    let registeredCount = 0;
    let alreadyRegisteredCount = 0;
    let errorCount = 0;
    
    for (const student of students) {
      try {
        const isRegistered = await student_registry.methods.isRegistered(student.walletAddress).call();
        
        if (!isRegistered) {
          console.log(`📝 Registering student: ${student.firstName} ${student.lastName} (${student.walletAddress})`);
          
          const tx = await student_registry.methods
            .registerStudent(
              `${student.firstName} ${student.lastName}`,
              student.Username || "N/A",
              "N/A", // course not available in current schema
              student.email
            )
            .send({ from: instituteAccount.address, gas: 500000 });
          
          console.log(`✅ Student registered! Transaction: ${tx.transactionHash}`);
          registeredCount++;
        } else {
          console.log(`✅ Student already registered: ${student.firstName} ${student.lastName}`);
          alreadyRegisteredCount++;
        }
      } catch (error) {
        console.error(`❌ Error registering student ${student.firstName} ${student.lastName}:`, error.message);
        errorCount++;
      }
    }
    
    // 3. Summary
    console.log("\n📊 Setup Summary:");
    console.log(`✅ Institution: ${isVerified ? 'Already verified' : 'Registered'}`);
    console.log(`👥 Students registered: ${registeredCount}`);
    console.log(`👥 Students already registered: ${alreadyRegisteredCount}`);
    console.log(`❌ Registration errors: ${errorCount}`);
    
    // 4. Test verification
    console.log("\n🧪 Testing verification...");
    const finalVerification = await verified_contract.methods.checkVerification(instituteAccount.address).call();
    console.log(`🏛️  Institution verification: ${finalVerification ? '✅ Verified' : '❌ Not verified'}`);
    
    if (students.length > 0) {
      const testStudent = students[0];
      const testRegistration = await student_registry.methods.isRegistered(testStudent.walletAddress).call();
      console.log(`👤 Test student registration: ${testRegistration ? '✅ Registered' : '❌ Not registered'}`);
    }
    
    console.log("\n🎉 Blockchain setup completed!");
    
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

// Run the setup
setupBlockchain().then(() => {
  console.log("✅ Setup script completed successfully");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Setup script failed:", error);
  process.exit(1);
});
