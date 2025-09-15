import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { this.setState({ info }); console.error('UI ErrorBoundary:', error, info); }
  handleReload = () => { this.setState({ hasError: false, error: null, info: null }); window.location.reload(); };
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:'2rem', fontFamily:'sans-serif'}}>
          <h2 style={{color:'#dc2626'}}>Đã xảy ra lỗi giao diện</h2>
          <p>Hãy mở DevTools (F12) tab Console để xem chi tiết. Bạn có thể gửi log để xử lý thêm.</p>
          {this.state.error && <pre style={{whiteSpace:'pre-wrap', background:'#fef2f2', padding:'1rem', border:'1px solid #fecaca', borderRadius:8, fontSize:12}}>{String(this.state.error)}</pre>}
          <button onClick={this.handleReload} style={{marginTop:'1rem', padding:'0.5rem 1rem', background:'#2563eb', color:'#fff', border:'none', borderRadius:6, cursor:'pointer'}}>Tải lại trang</button>
        </div>
      );
    }
    return this.props.children;
  }
}

