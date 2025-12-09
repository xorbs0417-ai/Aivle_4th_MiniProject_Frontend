// src/pages/BookModifyPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Typography, Button, Paper, Stack, Chip, Divider,
    TextField, Box, Alert,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import api from "../app/axios";

const API_HOST = "http://localhost:8080"; // 정적 이미지: http://localhost:8080/images/{file}
const DEFAULT_COVER = "book5.png"; // public 폴더에 기본 표지 배치

export default function BookModifyPage() {
    const { id } = useParams(); // /books/modify/:id
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // 폼 상태
    const [form, setForm] = useState({
        bookId: null,
        title: "",
        authorName: "",
        category: "",
        description: "",
    });

    // 표지 상태
    const [coverUrl, setCoverUrl] = useState(""); // 현재 표시/업데이트 대상 URL
    const [localFileUrl, setLocalFileUrl] = useState(""); // modifiedFileName → 정적 URL
    const [sasUrl, setSasUrl] = useState(""); // originFileName(긴 URL) 보조 소스

    // ====== 도서 로드 ======
    useEffect(() => {
        const controller = new AbortController();

        async function fetchBook() {
            try {
                setLoading(true);
                setError("");

                const res = await api.get(`/books/${id}`, { signal: controller.signal });
                const raw = res?.data?.data ?? res?.data ?? null;
                if (!raw) {
                    setError("도서 정보를 불러오지 못했습니다.");
                    return;
                }

                // 폼 바인딩
                setForm({
                    bookId: raw?.bookId ?? raw?.id ?? Number(id),
                    title: raw?.title ?? "",
                    authorName: raw?.authorName ?? raw?.author ?? "",
                    category: raw?.category ?? "",
                    description: raw?.description ?? "",
                });

                // 이미지 URL 생성 (우선순위: 로컬 정적 > SAS)
                const fileName = raw?.image?.originFileName || "";
                const localUrl = fileName ? `${API_HOST}/images/${fileName}` : "";
                const originUrl = raw?.image?.originFileName || raw?.imageUrl || "";

                setLocalFileUrl(localUrl);
                setSasUrl(originUrl);

                // 현재 표시 URL(프론트 미리보기 기준)
                setCoverUrl(localUrl || originUrl || "");
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

    // ====== 입력 핸들러 ======
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ====== 도서 정보 저장(수정) ======
    const handleSaveInfo = useCallback(async () => {
        if (!form.title?.trim() || !form.authorName?.trim()) {
            alert("제목과 저자를 입력하세요.");
            return;
        }

        try {
            setSaving(true);
            const payload = {
                bookId: form.bookId,             // 백엔드에 맞춰 id 키가 다르면 조정
                title: form.title.trim(),
                authorName: form.authorName.trim(),
                author: form.authorName.trim(),  // 서버가 author를 기대하는 경우까지 커버
                category: form.category?.trim() || null,
                description: form.description?.trim() || null,
            };

            const res = await api.put("/books", payload);
            alert(res?.data?.message || "도서 정보가 수정되었습니다.");
            // 수정 후 상세 페이지로 이동
            navigate(`/books/${form.bookId}`);
        } catch (e) {
            console.error("[PUT /books] error =", e?.response?.data || e);
            alert(e?.response?.data?.message || e?.message || "수정 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    }, [form, navigate]);

    // ====== 표지 저장(선택) ======
    const handleSaveCover = useCallback(async () => {
        if (!form.bookId) {
            alert("도서 ID를 확인하지 못했습니다.");
            return;
        }
        if (!coverUrl?.trim()) {
            alert("저장할 표지 URL을 입력하세요.");
            return;
        }

        try {
            setSaving(true);

            // 파일명 추출(긴 URL → 짧은 파일명, 255자 보호)
            const originFileName = getFileNameFromUrl(coverUrl);
            const modifiedFileName = `book_${form.bookId}_${Date.now()}.png`; // 서버 규약에 맞게 조정 가능

            // 서버 DTO에 맞춰 키 이름을 조정하세요.
            const body = {
                imageUrl: coverUrl,       // 전체 URL (긴 URL 보관용 컬럼이 있으면 사용)
                originFileName,           // 파일명만 저장하는 컬럼
                modifiedFileName,         // 저장 시 생성/갱신할 파일명
            };

            const res = await api.put(`/books/${form.bookId}/cover-url`, body);
            alert(res?.data?.message || "표지 이미지가 저장되었습니다.");

            // 반영된 modifiedFileName을 응답으로 내려준다면 해당 값으로 다시 표시
            const updated = res?.data?.data || {};
            const newFile = updated?.image?.modifiedFileName || modifiedFileName;
            const newLocal = `${API_HOST}/images/${newFile}`;

            setLocalFileUrl(newLocal);
            setCoverUrl(newLocal); // 로컬 우선으로 교체
        } catch (e) {
            console.error("[PUT /books/{id}/cover-url] error =", e?.response?.data || e);
            alert(e?.response?.data?.message || e?.message || "표지 저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    }, [coverUrl, form.bookId]);

    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 20 }}>{error}</div>;
    if (!form.bookId) return <div style={{ padding: 20 }}>책을 찾을 수 없습니다.</div>;

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
                <Stack spacing={3}>
                    <Typography variant="h4" fontWeight={800}>
                        도서 정보 수정
                    </Typography>

                    {/* 표지 미리보기 */}
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={700}>현재 표지</Typography>
                        { (localFileUrl || sasUrl) ? (
                            <img
                                src={localFileUrl || sasUrl}
                                alt="도서 표지"
                                style={{
                                    width: "100%",
                                    height: 280,
                                    objectFit: "cover",
                                    borderRadius: 12,
                                    border: "1px solid #e5e7eb",
                                }}
                                onError={(e) => { e.currentTarget.src = DEFAULT_COVER; }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    height: 280,
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
                    </Stack>

                    <Divider />

                    {/* 폼 입력 */}
                    <Stack spacing={2}>
                        <TextField
                            label="도서 제목"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="저자"
                            name="authorName"
                            value={form.authorName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="카테고리"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="내용 소개"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Stack>

                    {/* 표지 URL 변경 섹션 */}
                    <Divider />
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={700}>표지 URL 교체 (선택)</Typography>
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            교체할 이미지의 공개 URL(예: OpenAI / CDN / 서버 정적 경로)을 입력하고 &ldquo;표지 저장&rdquo;을 누르세요.
                            서버는 파일명을 분리하여 안전하게 저장합니다.
                        </Alert>
                        <TextField
                            label="새 표지 URL"
                            placeholder="https://... (이미지 주소)"
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            fullWidth
                        />
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <Button variant="outlined" onClick={() => setCoverUrl(localFileUrl || sasUrl || "")}>
                                현재 이미지 URL 불러오기
                            </Button>
                            <Button variant="contained" onClick={handleSaveCover} disabled={saving}>
                                {saving ? "저장 중..." : "표지 저장"}
                            </Button>
                        </Stack>
                    </Stack>

                    <Divider />

                    {/* 액션 버튼 */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button variant="contained" onClick={handleSaveInfo} disabled={saving}>
                            {saving ? "저장 중..." : "정보 저장"}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate(`/books/${form.bookId}`)}>
                            상세로 돌아가기
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => navigate("/books")}>
                            목록으로
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}

// ====== 유틸: 긴 URL에서 파일명만 추출(255자 보호) ======
function getFileNameFromUrl(url) {
    try {
        const u = new URL(url);
        const last = (u.pathname || "").split("/").filter(Boolean).pop() || "cover.png";
        return last.split("?")[0].slice(0, 255);
    } catch {
        return "cover.png";
    }
}