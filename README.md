# C++ Code Grader Frontend

Frontend application cho hệ thống chấm code C++ được xây dựng bằng React + Vite.

## Tính năng

- ✅ Danh sách bài tập
- ✅ Xem chi tiết đề bài
- ✅ Code editor để viết code C++
- ✅ Submit code
- ✅ Hiển thị kết quả chấm bài (số test pass/fail, chi tiết từng test)

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview
```

## Cấu trúc dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── CodeEditor.jsx   # Code editor component
│   └── TestResults.jsx  # Component hiển thị kết quả
├── pages/              # Các trang
│   ├── ProblemList.jsx  # Trang danh sách bài
│   └── ProblemDetail.jsx # Trang chi tiết đề bài
├── services/           # API services
│   └── api.js          # API calls
├── App.jsx             # App component chính với routing
└── main.jsx            # Entry point
```

## API Endpoints

Application sử dụng các API endpoints sau:

- `GET /problems/:id` - Lấy thông tin đề bài
- `POST /submit` - Submit code để chấm

### Environment Variables

Tạo file `.env` để cấu hình API URL:

```
VITE_API_URL=http://localhost:5000
```

Nếu không có file `.env`, mặc định sẽ sử dụng `http://localhost:5000`.

## Sử dụng

1. Khởi động backend server (port 5000)
2. Chạy `npm run dev` để khởi động frontend (port 3000)
3. Truy cập `http://localhost:3000` trong browser




//client id: 1030441729766-d7n92bmocpaq6v4e3ban47qpsodgqaqc.apps.googleusercontent.com
//1030441729766-d7n92bmocpaq6v4e3ban47qpsodgqaqc.apps.googleusercontent.com
//client sêcret: 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
//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