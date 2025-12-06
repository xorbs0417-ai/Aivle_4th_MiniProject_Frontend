// src/pages/BookFormPage.jsx
import {
    Container,
    TextField,
    Button,
    Typography,
    Stack,
    Paper,
    Divider,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../app/axios";

export default function BookFormPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        author: "",
        category: "",
        description: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.title || !form.author) {
            alert("제목과 저자는 필수입니다.");
            return;
        }

        try {
            setSubmitting(true);

            const userId = localStorage.getItem("userId") || "TEMP_USER_ID"; // 나중에 로그인 연동
            const res = await api.post("/books", {
                userId,
                ...form,
            });

            alert(res.data?.message || "도서가 성공적으로 등록되었습니다.");
            navigate("/books"); // 또는 상세 페이지로 이동하고 싶으면 `/books/${res.data.data.bookId}`
        } catch (e) {
            const msg = e.response?.data?.message || "도서 등록 중 오류가 발생했습니다.";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
                    backgroundColor: "#fff",
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h4" fontWeight={800}>
                        신규 도서 등록
                    </Typography>
                    <Typography color="text.secondary">
                        도서 정보를 입력하면 목록에 자동으로 추가됩니다. 제목과 저자 정보를 잊지 말고 입력해 주세요.
                    </Typography>
                    <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ borderRadius: 3, background: "linear-gradient(135deg, #f8fbff, #eef2ff)" }}
                    >
                        아래 순서대로 입력하면 바로 등록할 수 있어요.
                    </Alert>
                    <Paper
                        variant="outlined"
                        sx={{
                            borderRadius: 3,
                            p: 2.5,
                            backgroundColor: "rgba(248, 250, 252, 0.65)",
                            borderColor: "#e5e7eb",
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                            등록 절차 요약
                        </Typography>
                        <List dense sx={{ pt: 0 }}>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="필수 항목 입력"
                                    secondary="도서 제목과 저자명을 먼저 채워 주세요. 미입력 시 등록이 진행되지 않습니다."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="카테고리/내용 소개 추가"
                                    secondary="찾기 쉽도록 카테고리를 지정하고, 짧은 소개나 메모를 적어두면 좋아요."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="등록하기 버튼 클릭"
                                    secondary="입력이 완료되면 등록하기를 눌러 주세요. 성공하면 목록으로 이동해 추가된 책을 확인할 수 있습니다."
                                />
                            </ListItem>
                        </List>
                    </Paper>
                    <Divider />
                </Stack>

                <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                        label="도서 제목"
                        name="title"
                        variant="outlined"
                        fullWidth
                        required
                        value={form.title}
                        onChange={handleChange}
                        helperText="필수 입력. 도서 표지나 카탈로그에 적힌 정식 제목을 입력하세요."
                    />
                    <TextField
                        label="저자"
                        name="author"
                        variant="outlined"
                        fullWidth
                        required
                        value={form.author}
                        onChange={handleChange}
                        helperText="필수 입력. 여러 명일 경우 쉼표로 구분하거나 주요 저자만 적어도 됩니다."
                    />
                    <TextField
                        label="카테고리"
                        name="category"
                        variant="outlined"
                        fullWidth
                        value={form.category}
                        onChange={handleChange}
                        helperText="예: 소설, 자기계발, 기술, 여행 등 (미입력 가능)"
                    />
                    <TextField
                        label="내용 소개"
                        name="description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="줄거리, 특징, 메모 등을 자유롭게 작성하세요."
                        helperText="200~400자 내외로 간단히 적으면 가독성이 좋아요."
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? "등록 중..." : "등록하기"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={() => navigate("/books")}
                        >
                            취소
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}
