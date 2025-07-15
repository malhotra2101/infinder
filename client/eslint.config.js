/**
 * ESLint Configuration for React Frontend
 * 
 * This file configures ESLint for code quality and consistency.
 * It includes rules for React, hooks, and modern JavaScript features.
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Global ignores - files/directories to skip linting
  globalIgnores(['dist']),
  
  // Main configuration for JavaScript and JSX files
  {
    files: ['**/*.{js,jsx}'],
    
    // Extend recommended configurations
    extends: [
      js.configs.recommended, // Base JavaScript rules
      reactHooks.configs['recommended-latest'], // React Hooks rules
      reactRefresh.configs.vite, // Vite-specific React rules
    ],
    
    // Language options for parsing
    languageOptions: {
      ecmaVersion: 2020, // Use ES2020 features
      globals: globals.browser, // Browser globals (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest', // Latest ECMAScript features
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // Use ES modules
      },
    },
    
    // Custom rules
    rules: {
      // Allow unused variables that start with uppercase or underscore
      // Useful for React components and constants
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
