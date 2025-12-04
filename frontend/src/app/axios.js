import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true, // 쿠키 기반 인증 사용 시
    timeout: 15000,
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        // 예: 로컬 스토리지/메모리에서 토큰을 꺼내 헤더에 추가
        const token = window.localStorage.getItem('accessToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 처리, 재발급 로직 등)
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const { response } = error || {};
        if (response?.status === 401) {
            // TODO: refresh token으로 재발급 시도 로직 (필요시 구현)
            // 예: await api.post('/auth/refresh'); 이후 재요청 등
        }
        return Promise.reject(error);
    }
);

export default api;
