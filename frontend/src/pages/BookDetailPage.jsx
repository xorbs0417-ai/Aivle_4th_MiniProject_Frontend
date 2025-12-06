// src/pages/BookDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Stack, Chip, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../app/axios";

export default function BookDetailPage() {
    const { id } = useParams(); // /books/:id
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchBook() {
        try {
            const res = await api.get(`/books/${id}`);
            setBook(res.data.data);
        } catch (e) {
            const msg = e.response?.data?.message || "도서 정보를 불러오지 못했습니다.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBook();
    }, [id]);

    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
    if (!book) return <div style={{ padding: 20 }}>책을 찾을 수 없습니다.</div>;

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 16px 38px rgba(15, 23, 42, 0.1)",
                }}
            >
                <Stack spacing={2.5}>
                    {book.coverUrl ? (
                        <img
                            src={book.coverUrl}
                            alt={book.title}
                            style={{ width: "100%", borderRadius: "12px" }}
                        />
                    ) : null}

                    <Stack spacing={1}>
                        <Chip
                            label={book.category || "카테고리 미정"}
                            color="primary"
                            variant="outlined"
                            sx={{ alignSelf: "flex-start" }}
                        />
                        <Typography variant="h4" fontWeight={800}>
                            {book.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {book.author}
                        </Typography>
                    </Stack>

                    <Divider />

                    <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-line" }}>
                        {book.description || "등록된 설명이 없습니다."}
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <Button variant="contained" onClick={() => navigate("/books")}>{
                            "목록으로"
                        }</Button>
                        <Button variant="outlined" onClick={() => navigate(`/books/${book.bookId}`)}>
                            새로고침
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}
