import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import BookListPage from '../pages/BookListPage';
import BookDetailPage from '../pages/BookDetailPage';
import BookFormPage from '../pages/BookFormPage';
import BookModifyPage from "../pages/BookModifyPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'books', element: <BookListPage /> },
            // 1. 글쓰기 페이지 (순서 중요: :id보다 위에 있어야 함)
            { path: 'books/new', element: <BookFormPage /> },

            // 2. 상세 페이지 (:id는 변수처럼 1, 2, 3 등 아무 숫자나 들어올 수 있다는 뜻)
            { path: 'books/:id', element: <BookDetailPage /> },
            { path: 'books/modify/:id/', element: <BookModifyPage /> },
        ],
    },
]);

export default router;
