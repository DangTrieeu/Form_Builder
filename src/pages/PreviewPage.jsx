import { useNavigate } from "react-router-dom";
import { useFormStore } from "../stores/formStore";
import PreviewForm from "../components/form-preview/PreviewForm.jsx";
import '../styles/PreviewPage.css';

const PreviewPage = () => {
  const navigate = useNavigate();
  const formConfig = useFormStore(state => state.formConfig);
  const fields = useFormStore(state => state.fields);

  return (
    <div className="preview-page">
      <PreviewForm
        formConfig={formConfig}
        fields={fields}
        onBack={() => navigate('/editor')}
        onSubmit={(answers) => {
          // Placeholder: hiển thị nhanh kết quả gửi (demo)
          alert('Đã gửi (demo) - kiểm tra console');
          console.log('Submitted answers:', answers);
        }}
      />
    </div>
  );
}

export default PreviewPage;