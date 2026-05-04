import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:53959/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function main() {
  console.log('Backend API:', API_BASE_URL);

  const healthResponse = await axios.get(`${API_ORIGIN}/health`);
  console.log('GET /health:', healthResponse.data);

  const statusResponse = await axios.get(`${API_ORIGIN}/`);
  console.log('GET /:', statusResponse.data);

  const loginResponse = await api.post('/login', {
    email: 'student@test.com',
    password: 'Password123!',
  });

  const token = loginResponse.data.token;
  console.log('POST /api/login:', {
    status: loginResponse.status,
    tokenPreview: `${token.slice(0, 24)}...`,
  });

  const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const meResponse = await authApi.get('/me');
  console.log('GET /api/me:', meResponse.data);

  const scheduleResponse = await authApi.get('/schedule/today', {
    params: {
      date: '2026-04-29',
    },
  });
  console.log('GET /api/schedule/today:', scheduleResponse.data);

  const ratingResponse = await authApi.get('/students/me/rating');
  console.log('GET /api/students/me/rating:', ratingResponse.data);
}

main().catch((error) => {
  console.error('Backend test failed:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
  });

  process.exit(1);
});
