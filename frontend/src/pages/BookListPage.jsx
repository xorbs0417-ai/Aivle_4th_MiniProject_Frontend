// src/pages/BookListPage.jsx
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

const mockBooks = [
    {
        id: 1,
        title: "작가의 산책",
        createdAt: "2025-12-04",
        coverUrl: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        title: "겨울의 기록",
        createdAt: "2025-12-03",
        coverUrl: "https://via.placeholder.com/150",
    },
];

function BookListPage() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                도서 목록
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/books/new")}
                sx={{ mb: 2 }}
            >
                신규 도서 등록
            </Button>
            <Grid container spacing={2}>
                {mockBooks.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                        <Card onClick={() => navigate(`/books/${book.id}`)} sx={{ cursor: "pointer" }}>
                            <img src={book.coverUrl} alt="표지" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                            <CardContent>
                                <Typography variant="h6">{book.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    등록일: {book.createdAt}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default BookListPage;