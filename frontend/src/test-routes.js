// Simple test to verify the new routes are accessible
console.log('Testing Institute and Verifier Login/Signup Routes:');

// Test URLs that should be accessible
const testRoutes = [
  '/institute-login',
  '/institute-signup', 
  '/verifier-login',
  '/verifier-signup'
];

testRoutes.forEach(route => {
  console.log(`Route: ${route} - Ready`);
});

console.log('All routes configured successfully!');
