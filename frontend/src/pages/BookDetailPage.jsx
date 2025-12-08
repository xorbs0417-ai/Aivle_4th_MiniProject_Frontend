// src/pages/BookDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Stack, Chip, Divider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import api from "../app/axios";

export default function BookDetailPage() {
    const { id } = useParams(); // /books/:id
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        async function fetchBook() {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get(`/books/${id}`, { signal: controller.signal });
                console.log(res);
                setBook(res.data?.data ?? res.data); // 응답 형태에 맞게 조정
            } catch (e) {
                if (e.name !== "CanceledError") setError(e);
            } finally {
                setLoading(false);
            }
        }



        fetchBook();
        return () => {
            mounted = false;
            controller.abort();
        };
    }, [id]);

    const handleDelete = useCallback(async () => {
        const ok = window.confirm('정말 삭제하시겠습니까?');
        if (!ok) return;

        try {
            setDeleting(true);
            await api.delete(`/books/${book.bookId}`);
            alert('삭제되었습니다.');
            navigate('/books'); // 삭제 후 목록으로
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || '삭제 실패';
            alert(msg);
        } finally {
            setDeleting(false);
        }
    }, [id]);



    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
    if (!book) return <div style={{ padding: 20 }}>책을 찾을 수 없습니다.</div>;


    return (
        <Container sx={{ py: 3 }}>
            {book.coverUrl ? (
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{ width: 240, height: "auto", borderRadius: 4 }}
                />
            ) : null}

            <Typography variant="h4" sx={{ mt: 2 }}>
                {book.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
                {book.author}
            </Typography>
            <Typography sx={{ mt: 2 }}>
                {book.description ?? "등록된 설명이 없습니다."}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button variant="contained" onClick={() => navigate("/books")}>
                    목록으로
                </Button>
                <Button variant="outlined" onClick={() => navigate(`/books/modify/${book.bookId}`)}>
                    수정
                </Button>
                <Button variant="outlined" color="error"
                        onClick={handleDelete}
                        disabled={deleting}
                >
                    {deleting ? '삭제 중…' : '삭제'}
                </Button>

                <Button variant="outlined" onClick={() => navigate(`/books/${book.bookId}`)}>
                    새로고침
                </Button>
            </Stack>
        </Container>
    );

}
