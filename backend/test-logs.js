// Quick test to check activity logs
import axios from 'axios';

async function testLogs() {
    try {
        // First make a request to generate new logs
        console.log('Making request to generate new activity log...');
        try {
            await axios.post('http://localhost:8080/api/v1/auth/login', {
                email: 'test@example.com',
                matKhau: 'testpassword'
            });
        } catch(e) {
            // Expected to fail
        }
        
        // Wait a bit
        await new Promise(r => setTimeout(r, 500));
        
        // Now get logs
        const response = await axios.get('http://localhost:8080/api/v1/activities', {
            params: {
                limit: 10
            }
        });
        
        console.log('\n=== RECENT ACTIVITIES ===');
        if (response.data.data && response.data.data.data) {
            response.data.data.data.forEach((activity, index) => {
                console.log(`\n${index + 1}. ID: ${activity.id}`);
                console.log(`   Action: ${activity.action}`);
                console.log(`   Resource: ${activity.resource}`);
                console.log(`   Endpoint: ${activity.endpoint}`);
            });
        }
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testLogs();
