const axios = require('axios');

async function test() {
  const baseUrl = 'http://localhost:5000/api/auth';
  
  try {
    console.log('--- Testing Login ---');
    const loginRes = await axios.post(`${baseUrl}/login`, {
      username: 'Hxni',
      password: 'Hxni@786'
    });
    console.log('✅ Login Success:', loginRes.data.user);

    console.log('\n--- Testing Register ---');
    const registerRes = await axios.post(`${baseUrl}/register`, {
      username: 'TestUser' + Date.now(),
      password: 'testpassword123'
    });
    console.log('✅ Register Success:', registerRes.data.user);

  } catch (err) {
    console.error('❌ Test Failed:', err.response?.data || err.message);
  }
}

test();
