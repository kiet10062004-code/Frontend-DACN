import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// =========================================================
// THÊM LOGIC NÀY ĐỂ TẮT CONSOLE TRÊN MÔI TRƯỜNG PRODUCTION
// =========================================================
// Khi deploy lên Vercel (Production), process.env.NODE_ENV sẽ là 'production'
if (process.env.NODE_ENV === 'production') {
    // Ghi đè các hàm console cơ bản thành hàm rỗng
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
}
// =========================================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)