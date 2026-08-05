import axios from 'axios';

async function run() {
  try {
    const res = await axios.post('http://localhost:8080/v1/catalog/cart', {
      productId: 1,
      quantity: 1,
      userId: 1
    });
    console.log(res.data);
  } catch (e) {
    if (e.response) {
      console.log('Error status:', e.response.status);
      console.log('Error data:', e.response.data);
    } else {
      console.log(e.message);
    }
  }
}
run();
