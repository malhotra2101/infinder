#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Supabase Environment Setup');
console.log('=============================\n');

console.log('Please follow these steps:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project (or create a new one)');
console.log('3. Go to Settings → API');
console.log('4. Copy your Project URL and anon public key\n');

rl.question('Enter your Supabase Project URL (e.g., https://your-project-id.supabase.co): ', (url) => {
  rl.question('Enter your Supabase anon public key (starts with eyJ...): ', (key) => {
    const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=${url}
VITE_SUPABASE_ANON_KEY=${key}

# API Configuration
VITE_API_URL=http://localhost:5052/api
`;

    fs.writeFileSync('.env', envContent);
    
    console.log('\n✅ .env file created successfully!');
    console.log('Now restart your development server:');
    console.log('npm run dev');
    
    rl.close();
  });
}); 