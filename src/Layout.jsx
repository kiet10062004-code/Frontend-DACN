import React, { useState, useEffect } from 'react'; // <-- Đã thêm useEffect
import { Link } from 'react-router-dom';
import AvatarDefault from './assets/Avatar.jpg';
import axios from "axios";
import { MdHome, MdStore, MdSearch, MdShoppingCart } from 'react-icons/md';

const DEBOUNCE_DELAY = 300; 

function Layout({ children, isLoggedIn, avatarUrl, fullName, handleLogout }) {
    
    // Giữ nguyên state cũ
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]); 
    
    // State mới: Chứa từ khóa đã được "debounce"
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Hàm CHỈ CẬP NHẬT STATE 'search'
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        // KHÔNG GỌI API TẠI ĐÂY NỮA
    };

    // 1. Hook DEBOUNCE: Cập nhật debouncedSearch sau khi người dùng ngừng gõ
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, DEBOUNCE_DELAY);

        // Cleanup: Xóa timer nếu search thay đổi
        return () => {
            clearTimeout(handler);
        };
    }, [search]); 

    // 2. Hook GỌI API: Thực hiện tìm kiếm và hủy yêu cầu cũ
    useEffect(() => {
        const value = debouncedSearch.trim();
        
        if (value === "") {
            setSuggestions([]);
            return;
        }

        // Khởi tạo AbortController để hủy yêu cầu cũ
        const controller = new AbortController();

        const fetchSuggestions = async () => {
            try {
                const res = await axios.get(
                    `https://backend-dacn-hmw1.onrender.com/api/product/search/?q=${value}`,
                    { signal: controller.signal } // <-- Gắn signal vào yêu cầu
                );

                console.log("API trả về:", res.data);

                if (Array.isArray(res.data)) {
                    setSuggestions(res.data);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                // Bỏ qua lỗi nếu đó là lỗi do yêu cầu bị hủy (AbortError)
                if (axios.isCancel(error) || error.name === 'AbortError') {
                    console.log('Request aborted:', value);
                    return; 
                }
                console.log("Search error:", error);
                setSuggestions([]);
            }
        };

        fetchSuggestions();
        
        // Cleanup: Khi debouncedSearch thay đổi (có yêu cầu mới), hủy yêu cầu cũ
        return () => {
            controller.abort();
        };

    }, [debouncedSearch]); // Chạy lại khi 'debouncedSearch' thay đổi


  return (
<div style={{ width: '100%', minHeight: '100vh',display: 'flex',flexDirection: 'column',  overflowX: 'hidden' }}>
      <nav
        style={{
          position: 'fixed',
            // ... (Các style giữ nguyên)
        }}
      >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      
        {/* ... (Các Link giữ nguyên) ... */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/More_len.png"
            alt="Logo"
            style={{ height: "46px", width: "46px", borderRadius: "6px", objectFit: "cover" }}
          />
        </Link>
        {/* ... (Các Link khác giữ nguyên) ... */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#000' }}>
          <MdHome size={20} />
          Trang chủ
        </Link>

        <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#000' }}>
          <MdStore size={20} />
          Sản phẩm
        </Link>

        <Link to="/tra-cuu" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#000' }}>
          <MdSearch size={20} />
          Tra cứu
        </Link>

        <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#000', marginLeft: 'auto' }}>
          <MdShoppingCart size={20} />
          Giỏ hàng
        </Link>
        {/* Vùng Input Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={handleSearch}
            autoComplete="off"
          />

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((item) => (
                <Link to={`/product/${item.id}`} key={item.id} className="suggestion-item">
                  <img src={`https://backend-dacn-hmw1.onrender.com${item.image}`} alt={item.name} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

        {/* ... (Phần đăng nhập/đăng ký giữ nguyên) ... */}
        <div>
          {!isLoggedIn ? (
            <>
              <Link to="/register" style={{ marginRight: '15px', textDecoration: 'none', color: '#000' }}>
                Đăng ký
              </Link>
              <Link to="/login" style={{ textDecoration: 'none', color: '#000' }}>
                Đăng nhập
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

              {fullName && (
                <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                  {fullName}
                </span>
              )}

              <Link to="/profile" style={{ textDecoration: 'none', color: '#000' }}>
                <img
                  src={avatarUrl || AvatarDefault}
                  alt="avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: 'black',
                  background: '#fff',
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ... (Phần main và footer giữ nguyên) ... */}
      <main
        style={{
          flex :1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '84px 20px 20px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
      <footer className="footer">
        <div className="footer-content">

          <div className="footer-col">
            <h3>Shop MoreLen</h3>
            <p>THÊM LEN - THÊM VUI</p>
            <div className="social-links">
            </div>
          </div>

          <div className="footer-col">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li><a href="/">Trang chủ</a></li>
              <li><a href="/products">Sản phẩm</a></li>

            </ul>
          </div>



          <div className="footer-col">
            <h4>Thanh toán</h4>
              <img src="/Logo-MoMo-Square.webp" style={{width:'40px', height:'40px',alignItems:'center',display:'flex',justifyContent:'center'}} />
          </div>

        </div>

        <div className="footer-bottom">
          © 2025 Shop More Len    
        </div>
      </footer>
    </div>
  );
}

export default Layout;