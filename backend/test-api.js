const http = require("http");

async function testBackend() {
    console.log("--- Testing Backend Endpoints (Cruises + Trains) ---");

    // 1. Test Cruises Search with advanced filters
    try {
        const res = await fetch("http://localhost:3000/api/cruises?cruiseType=mediterráneo,caribe&services=piscina,spa&maxDuration=14&company=MSC");
        const data = await res.json();
        console.log(`[GET /api/cruises] Status: ${res.status}`);
        console.log(`Cruises Found: ${data.count}`);
        if (res.status !== 200) {
            console.error("Cruises Search Failed:", data);
        }
    } catch (err) {
        console.error("Error fetching cruises", err.message);
    }

    // 2. Test Trains Search with advanced filters
    try {
        const res = await fetch("http://localhost:3000/api/trains?trainClass=estándar,preferente&company=Renfe,Ouigo&direct=true&maxDuration=180");
        const data = await res.json();
        console.log(`[GET /api/trains] Status: ${res.status}`);
        console.log(`Trains Found: ${data.count}`);
        if (res.status !== 200) {
            console.error("Trains Search Failed:", data);
        }
    } catch (err) {
        console.error("Error fetching trains", err.message);
    }

    console.log("--- End of Cruises + Trains API tests ---");
}

testBackend();
