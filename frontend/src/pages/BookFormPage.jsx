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
    FormControlLabel,
    Switch,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../app/axios";

export default function BookFormPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        authorName: "",
        category: "",
        description: "",
    });
    const [submitting, setSubmitting] = useState(false);

    // ===== 표지 생성 관리 (React → OpenAI) =====
    const [autoGenerateCover, setAutoGenerateCover] = useState(false);
    const [userApiKey, setUserApiKey] = useState(""); // ⚠️ 노출 위험. 실습용만.
    const [coverPrompt, setCoverPrompt] = useState("");
    const [coverSize, setCoverSize] = useState("1024x1024");
    const [coverLoading, setCoverLoading] = useState(false);
    const [coverError, setCoverError] = useState(null);
    const [coverUrl, setCoverUrl] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 프롬프트 자동 생성: 폼 메타데이터 기반
    function buildCoverPrompt({ title, authorName, category, description }) {
        return `
        다음 도서 정보를 반영한 표지 이미지를 생성해줘.
        - 제목: ${title || "(미입력)"}
        - 저자: ${authorName || "(미입력)"}
        - 카테고리: ${category || "(미입력)"}
        - 소개/특징: ${description || "(없음)"}
        
        요구사항:
        - 텍스트는 최소화(가능하면 텍스트 없이 상징/개념적 비주얼)
        - 과장된 광고 톤 금지, 정보 중심, 정제된 스타일
        - 인상적이고 고품질의 일러스트/디지털 아트
        - 해상도: ${coverSize}
        `.trim();
    }

    // ===== useEffect: 프롬프트 변화/토글에 따라 자동 표지 생성 =====
    useEffect(() => {
        if (!autoGenerateCover) return;
        if (!userApiKey?.trim()) {
            setCoverError(new Error("OpenAI API 키를 입력하세요."));
            return;
        }
        if (!form.title?.trim() || !form.authorName?.trim()) {
            setCoverError(new Error("제목과 저자를 입력해야 표지를 생성할 수 있어요."));
            return;
        }

        // 디바운스 & 취소
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                setCoverLoading(true);
                setCoverError(null);
                setCoverUrl("");

                // 프롬프트가 비어 있으면 자동 생성
                const prompt = coverPrompt?.trim() ? coverPrompt : buildCoverPrompt(form);

                // React → OpenAI: 이미지 생성 요청
                const res = await fetch("https://api.openai.com/v1/images/generations", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${userApiKey}`, // ⚠️ 브라우저 노출
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "dall-e-3",
                        prompt,
                        size: coverSize, // 예: "1024x1024"
                    }),
                    signal: controller.signal,
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`OpenAI HTTP ${res.status}: ${text}`);
                }

                const json = await res.json();
                const url = json?.data?.[0]?.url ?? "";
                if (!url) throw new Error("OpenAI 응답에 image URL(data[0].url)이 없습니다.");

                // OpenAI → React: URL 수신
                setCoverUrl(url);
            } catch (e) {
                if (e.name !== "CanceledError") setCoverError(e);
            } finally {
                setCoverLoading(false);
            }
        }, 600);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [autoGenerateCover, userApiKey, coverPrompt, coverSize, form.title, form.authorName, form.category, form.description]);


    // ===== 제출: 도서 생성 → 표지 URL 저장 (React → Spring Boot) =====
    function extractBookId(res) {
        const id =
            res?.data?.data?.bookId ??
            res?.data?.data?.id ??
            res?.data?.bookId ??
            res?.data?.id;
        return typeof id === "number" ? id : undefined;
    }

    // ===== 제출: 도서 생성 → 표지 URL 저장 (React → Spring Boot) =====
    const handleSubmit = async () => {
        if (!form.title || !form.authorName) {
            alert("제목과 저자는 필수입니다.");
            return;
        }
        try {
            setSubmitting(true);
            const rawUserId = localStorage.getItem("userId");
            const userId = rawUserId && /^[0-9a-fA-F-]+$/.test(rawUserId) ? rawUserId : undefined;

            const payload = {
                title: form.title.trim(),
                authorName: form.authorName.trim(),
                author: form.authorName.trim(),           // 양쪽 키 지원
                category: form.category?.trim() || null,
                description: form.description?.trim() || null,
                imageUrl: (coverUrl && coverUrl.trim()) ? coverUrl.trim() : "https://url.kr/etp2f7",

            // imageUrl: coverUrl || null,
            };
            if (userId) payload.userId = userId;

            +   console.log("[POST /books] payload =", payload);
            const createRes = await api.post("/books", payload);

            const message = createRes?.data?.message || "도서가 성공적으로 등록되었습니다.";
            const bookId = extractBookId(createRes);
            if (!bookId) {
                console.error("bookId 추출 실패. 전체 응답:", createRes?.data);
                // alert("도서는 등록되었지만 응답에서 도서 ID를 확인하지 못했습니다.");
                navigate("/books");
                return;
            }

            if (coverUrl) {
                try {
                    await api.put(`/books/${bookId}/cover-url`, { coverUrl }); // baseURL 중복 방지
                } catch (e) {
                    console.error("표지 URL 저장 실패:", e?.response?.data || e);
                }
            }

            alert(message);
            navigate("/books");
        } catch (e) {
            console.error("[POST /books] error =", e?.response?.data || e);
            const msg =
                e?.response?.data?.message || "도서 등록 중 오류가 발생했습니다.";
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
                    <Typography variant="h4" fontWeight={800}>신규 도서 등록</Typography>
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

                    {/* 절차 안내 리스트 (기존 유지) */}
                    <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, backgroundColor: "rgba(248, 250, 252, 0.65)", borderColor: "#e5e7eb" }}>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>등록 절차 요약</Typography>
                        <List dense sx={{ pt: 0 }}>
                            <ListItem>
                                <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                                <ListItemText primary="필수 항목 입력" secondary="도서 제목과 저자명을 먼저 채워 주세요. 미입력 시 등록이 진행되지 않습니다." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                                <ListItemText primary="카테고리/내용 소개 추가" secondary="찾기 쉽도록 카테고리를 지정하고, 짧은 소개나 메모를 적어두면 좋아요." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                                <ListItemText primary="표지 이미지 자동 생성(선택)" secondary="토글을 켜고 프롬프트를 입력하거나 자동 프롬프트로 이미지를 만들어 저장할 수 있어요." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                                <ListItemText primary="등록하기 버튼 클릭" secondary="성공하면 목록으로 이동하며, 표지 URL도 함께 저장됩니다(생성된 경우)." />
                            </ListItem>
                        </List>
                    </Paper>

                    <Divider />
                </Stack>

                {/* 폼 입력 */}
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
                        name="authorName"   // ✅ 변경
                        variant="outlined"
                        fullWidth
                        required
                        value={form.authorName} // ✅ 변경
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

                    {/* ===== 표지 이미지 자동 생성 섹션 ===== */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={autoGenerateCover}
                                onChange={(e) => setAutoGenerateCover(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="표지 이미지 자동 생성 (OpenAI)"
                    />

                    {autoGenerateCover && (
                        <Stack spacing={2} sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 3, backgroundColor: "rgba(248, 250, 252, 0.65)" }}>
                            <TextField
                                label="OpenAI API Key"
                                type="password"
                                value={userApiKey}
                                onChange={(e) => setUserApiKey(e.target.value)}
                                helperText="실습용 입력. 프로덕션에서는 백엔드 프록시를 사용하세요."
                                fullWidth
                            />
                            <TextField
                                label="이미지 프롬프트"
                                value={coverPrompt}
                                onChange={(e) => setCoverPrompt(e.target.value)}
                                placeholder="예: '겨울 바다의 차가운 색감과 고요함을 상징적으로 표현한 일러스트...'"
                                fullWidth
                                multiline
                                rows={3}
                            />
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                                <Button variant="outlined" onClick={() => setCoverPrompt(buildCoverPrompt(form))}>
                                    자동 생성 프롬프트 적용
                                </Button>
                                <TextField
                                    label="이미지 크기"
                                    value={coverSize}
                                    onChange={(e) => setCoverSize(e.target.value)}
                                    helperText='예: "1024x1024", "512x512"'
                                    sx={{ width: { xs: "100%", sm: 220 } }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        if (!form.title?.trim() || !form.authorName?.trim()) {
                                            setCoverError(new Error("제목과 저자를 먼저 입력하세요."));
                                            return;
                                        }
                                        if (!autoGenerateCover) setAutoGenerateCover(true);
                                        if (!coverPrompt?.trim()) setCoverPrompt(buildCoverPrompt(form));
                                    }}
                                    disabled={coverLoading}
                                >
                                    {coverLoading ? "이미지 생성 중..." : "이미지 생성"}
                                </Button>
                            </Stack>

                            {coverError && (
                                <Alert severity="error">
                                    {coverError.message}
                                </Alert>
                            )}

                            {coverUrl && (
                                <Stack spacing={1}>
                                    <Typography variant="subtitle2" fontWeight={700}>미리보기</Typography>
                                    <img
                                        src={coverUrl}
                                        alt="generated cover"
                                        style={{ width: "100%", borderRadius: 12, border: "1px solid #e5e7eb" }}
                                    />
                                    {/*<Typography variant="body2" sx={{ wordBreak: "break-all" }}>*/}
                                    {/*    imageUrl: {coverUrl}*/}
                                    {/*</Typography>*/}
                                    <Alert severity="success">이미지 URL 생성 완료. 등록 시 서버에 저장됩니다.</Alert>
                                </Stack>
                            )}
                        </Stack>
                    )}

                    {/* 제출 버튼 */}
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


