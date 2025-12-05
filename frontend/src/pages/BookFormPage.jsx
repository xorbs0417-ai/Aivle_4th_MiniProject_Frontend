import { Container, TextField, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BookFormPage() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        // 원래는 여기서 입력한 데이터를 서버로 보내야 합니다(POST 요청).
        // 지금은 그냥 알림창만 띄우고 목록으로 돌아가겠습니다.
        alert("도서가 성공적으로 등록되었습니다! (가짜)");
        navigate('/books');
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                신규 도서 등록
            </Typography>

            <Stack spacing={3}>
                <TextField
                    label="도서 제목"
                    variant="outlined"
                    fullWidth
                    required
                />
                <TextField
                    label="내용 소개"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4} // 여러 줄 입력 가능하게
                />

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                    >
                        등록하기
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={() => navigate('/books')} // 취소하면 목록으로
                    >
                        취소
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
}