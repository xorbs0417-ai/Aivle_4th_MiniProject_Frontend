// src/pages/BookDetailPage.jsx

// src/pages/BookDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Stack, Chip, Divider, Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import api from "../app/axios";

const API_HOST = "http://localhost:8080"; // 백엔드 호스트/포트 (정적 /images 경로 제공)

export default function BookDetailPage() {
    const { id } = useParams(); // /books/:id
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchBook() {
            try {
                setLoading(true);
                setError("");
                const res = await api.get(`/books/${id}`, { signal: controller.signal });

                // 서버 응답: { status, message, data: { ...book } }
                const raw = res?.data?.data ?? res?.data ?? null;
                if (!raw) {
                    setError("도서 정보를 불러오지 못했습니다.");
                    setBook(null);
                    return;
                }

                // modifiedFileName(로컬 저장) → /images/{file} 로 변환
                const fileName = raw?.image?.originFileName || "";
                const localImageUrl =
                    fileName ? `${API_HOST}/images/${fileName}` : "";

                // originFileName(SAS URL)도 보조 소스로 사용
                const sasUrl = raw?.image?.originFileName || raw?.imageUrl || "";

                // 최종 coverUrl 우선순위: 로컬(영구) > SAS(만료 가능)
                const coverUrl = fileName || sasUrl || "";

                const mapped = {
                    bookId: raw?.bookId ?? raw?.id ?? Number(id),
                    title: raw?.title ?? "",
                    author: raw?.authorName ?? raw?.author ?? "",
                    category: raw?.category ?? "카테고리 미정",
                    description: raw?.description ?? "",
                    coverUrl,
                };

                setBook(mapped);
            } catch (e) {
                if (e.name !== "CanceledError") {
                    setError(e?.response?.data?.message || e?.message || "불러오기 중 오류가 발생했습니다.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchBook();
        return () => controller.abort();
    }, [id]);

    const handleDelete = useCallback(async () => {
        const ok = window.confirm("정말 삭제하시겠습니까?");
        if (!ok) return;
        try {
            setDeleting(true);
            await api.delete(`/books/${book.bookId}`);
            alert("삭제되었습니다.");
            navigate("/books"); // 목록으로
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "삭제 실패";
            alert(msg);
        } finally {
            setDeleting(false);
        }
    }, [book, navigate]);

    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 20 }}>{error}</div>;
    if (!book) return <div style={{ padding: 20 }}>책을 찾을 수 없습니다.</div>;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                    backgroundColor: "#fff",
                }}
            >
                <Stack spacing={2}>
                    {/* 이미지 섹션 */}
                    {book.coverUrl ? (
                        <img
                            src={book.coverUrl}
                            alt="도서 표지"
                            style={{
                                width: "100%",
                                height: 320,
                                objectFit: "cover",
                                borderRadius: 12,
                                border: "1px solid #e5e7eb",
                            }}
                            onError={(e) => {
                                // 로드 실패 시 기본 이미지로 폴백
                                e.currentTarget.src = "/default-cover.png"; // TODO: 실제 기본 표지 경로
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                height: 320,
                                display: "grid",
                                placeItems: "center",
                                background: "linear-gradient(180deg, #e3f2fd 0%, #f7fbff 100%)",
                                color: "#1e88e5",
                                fontWeight: 700,
                                letterSpacing: 0.5,
                                borderRadius: 2,
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            No Cover
                        </Box>
                    )}

                    {/* 타이틀/저자/카테고리 */}
                    <Typography variant="h4" fontWeight={800}>
                        {book.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" color="text.secondary">
                            {book.author || "저자 정보 없음"}
                        </Typography>
                        <Chip
                            label={book.category ?? "카테고리 미정"}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </Stack>

                    <Divider />

                    {/* 설명 */}
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {book.description || "등록된 설명이 없습니다."}
                    </Typography>

                    {/* 액션 버튼 */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button variant="contained" onClick={() => navigate("/books")}>
                            목록으로
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/books/modify/${book.bookId}`)}
                        >
                            수정
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "삭제 중…" : "삭제"}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/books/${book.bookId}`)}
                        >
                            새로고침
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}
