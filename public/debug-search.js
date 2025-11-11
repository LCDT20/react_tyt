// Debug script per verificare la configurazione della ricerca
console.log('🔍 Debug Search Configuration');

// Test della configurazione API
const API_BASE = 'https://search.takeyourtrade.com';

async function debugSearch() {
    console.log('Testing API configuration...');
    
    try {
        // Test autocomplete
        console.log('1. Testing autocomplete...');
        const autocompleteResponse = await fetch(`${API_BASE}/api/v1/search/autocomplete?q=black&limit=3`);
        const autocompleteData = await autocompleteResponse.json();
        console.log('Autocomplete response structure:', Object.keys(autocompleteData));
        console.log('Autocomplete results count:', autocompleteData.results?.length || 0);
        console.log('First result:', autocompleteData.results?.[0]);
        
        // Test search
        console.log('2. Testing search...');
        const searchResponse = await fetch(`${API_BASE}/api/v1/search?q=black&page=1&per_page=3`);
        const searchData = await searchResponse.json();
        console.log('Search response structure:', Object.keys(searchData));
        console.log('Search results count:', searchData.results?.length || 0);
        console.log('Search pagination:', searchData.pagination);
        console.log('First result:', searchData.results?.[0]);
        
        console.log('✅ API tests completed successfully');
        
    } catch (error) {
        console.error('❌ API test failed:', error);
    }
}

// Esegui il test
debugSearch();

// Test della configurazione frontend
console.log('3. Testing frontend configuration...');
console.log('Current URL:', window.location.href);
console.log('User agent:', navigator.userAgent);

// Verifica se siamo in modalità sviluppo
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('Environment: Development (localhost detected)');
    console.log('Dev mode: true');
} else {
    console.log('Environment: Production');
    console.log('Dev mode: false');
}
