#!/usr/bin/env node

/**
 * Test Verification Script
 * 
 * This script helps test the verification system and debug smart contract responses
 * 
 * Usage: node backend/scripts/test-verification.js
 */

import { certificates, web3, instituteAccount } from "../config/web3config.js";

async function testVerification() {
  try {
    console.log("🧪 Testing verification system...");
    console.log("📋 Using institute account:", instituteAccount.address);
    console.log("📋 Certificate contract:", certificates.options.address);
    
    // Test with a dummy student address and hash
    const testStudentAddress = "0x1234567890123456789012345678901234567890";
    const testCredentialHash = "test_hash_123";
    
    console.log("\n🔍 Testing smart contract call...");
    console.log("Parameters:", { testStudentAddress, testCredentialHash });
    
    try {
      const result = await certificates.methods
        .verifyCertificate(testStudentAddress, testCredentialHash)
        .call();
      
      console.log("✅ Smart contract call successful!");
      console.log("Raw result:", result);
      console.log("Result type:", typeof result);
      console.log("Is array:", Array.isArray(result));
      
      if (Array.isArray(result)) {
        console.log("Array length:", result.length);
        console.log("Array contents:", result);
      } else if (result && typeof result === 'object') {
        console.log("Object keys:", Object.keys(result));
        console.log("Object values:", Object.values(result));
      }
      
    } catch (error) {
      console.error("❌ Smart contract call failed:", error.message);
      console.error("Error details:", error);
    }
    
    // Test with a real student if available
    console.log("\n🔍 Testing with real data...");
    
    // You can modify this to test with actual student data
    const realStudentAddress = "0x184eD92dC0B2B65aD7a606D7814004AD8e18D489"; // Replace with actual student address
    const realCredentialHash = "real_hash_123"; // Replace with actual hash
    
    try {
      const result = await certificates.methods
        .verifyCertificate(realStudentAddress, realCredentialHash)
        .call();
      
      console.log("✅ Real data test successful!");
      console.log("Raw result:", result);
      console.log("Result type:", typeof result);
      console.log("Is array:", Array.isArray(result));
      
    } catch (error) {
      console.error("❌ Real data test failed:", error.message);
    }
    
    console.log("\n🎉 Test completed!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testVerification().then(() => {
  console.log("✅ Test script completed successfully");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Test script failed:", error);
  process.exit(1);
});
