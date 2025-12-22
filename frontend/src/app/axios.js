import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://18.140.234.181/api/v1', // 백앤드와 맞추기
    withCredentials: true, // 쿠키 기반 인증 사용 시
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); // 실제 저장 키명에 맞추세요
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
