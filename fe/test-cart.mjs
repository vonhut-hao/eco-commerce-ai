import axios from 'axios';

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:8080/v1/auth/login', {
      username: 'haonee',
      password: '12345678'
    });
    const token = loginRes.data.data.accessToken;
    
    // Add to cart with quantity > stock
    const cartRes = await axios.post('http://localhost:8080/v1/catalog/cart', {
      productId: 5,
      quantity: 68,
      userId: 2
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Cart Add Success:', cartRes.data);
  } catch (e) {
    if (e.response) {
      console.log('Error status:', e.response.status);
      console.log('Error data:', JSON.stringify(e.response.data, null, 2));
    } else {
      console.log(e.message);
    }
  }
}
run();
