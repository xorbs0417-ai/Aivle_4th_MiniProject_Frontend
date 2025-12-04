import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light', // 'dark'로 바꿀 수 있음
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
    },
    typography: {
        fontFamily: [
            'system-ui',
            '-apple-system',
            'Segoe UI',
            'Roboto',
            'Noto Sans KR',
            'Helvetica',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiButton: {
            defaultProps: { variant: 'contained' },
        },
    },
});

export default theme;
