import { Link } from 'react-router-dom';
import GooeyNav from '../components/ui/GooeyNav.jsx';
import TextType from '../components/ui/TextType.jsx';

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tạo form', href: '/editor' },
  { label: 'Có sẵn', href: '/forms' },
    { label: 'Trang Admin', href: '/admin/responses' },
  { label: 'Tài liệu', href: 'https://reactbits.dev' },
];

export default function HomePage() {
  return (
    <div className="homepage-bg">
      <div className="gooey-nav-center">
        <GooeyNav items={navItems} />
      </div>

      <div className="hero-section">
        <h1 className="hero-title">Form Builder Pro</h1>
        <div className="hero-subtitle">
          <TextType
            text={[
              "Tạo biểu mẫu chuyên nghiệp trong vài phút",
              "Trải nghiệm như Google Forms",
              "Giao diện dễ sử dụng",
            ]}
            typingSpeed={75}
            pauseDuration={200}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>

        <p className="hero-subtitle">
          Công cụ tạo biểu mẫu mạnh mẽ với giao diện hiện đại,
          hỗ trợ nhiều loại câu hỏi và tùy chỉnh linh hoạt
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📝</span>
            <h3>Đa dạng câu hỏi</h3>
            <p>Hỗ trợ text, email, lựa chọn, checkbox, dropdown và nhiều loại câu hỏi khác</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🎨</span>
            <h3>Giao diện đẹp</h3>
            <p>Thiết kế hiện đại, responsive và dễ sử dụng trên mọi thiết bị</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Nhanh chóng</h3>
            <p>Tạo và chỉnh sửa form trong thời gian thực với trải nghiệm mượt mà</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">👀</span>
            <h3>Xem trước</h3>
            <p>Xem trước form như người dùng cuối trước khi chia sẻ</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔧</span>
            <h3>Tùy chỉnh</h3>
            <p>Cài đặt chi tiết cho từng câu hỏi và toàn bộ form</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">💾</span>
            <h3>Lưu trữ</h3>
            <p>Dữ liệu được lưu tự động với Zustand và Immer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
