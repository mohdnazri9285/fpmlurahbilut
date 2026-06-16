// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://ipagjpoiesnkiqxexpqp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwYWdqcG9pZXNua2lxeGV4cHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1ODk5NjksImV4cCI6MjA5NzE2NTk2OX0.Wn1ZxTMY3q0k8IdTiZPzMsxPgXtQC-x7xg3XRkS8GRc';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Make available globally
window.supabase = supabaseClient;

// Helper function untuk format number
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return Number(num).toFixed(2);
}

// Helper function untuk format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

console.log('✅ Supabase client initialized');
