
import {
  Type,
  CheckSquare,
  ChevronDown,
  Calendar,
  Clock,
  Mail,
  Hash,
  FileText
} from "lucide-react";

export const fieldTypes = [
  { type: "text", label: "Văn bản ngắn", icon: Type, description: "Câu trả lời văn bản một dòng" },
  { type: "textarea", label: "Văn bản dài", icon: FileText, description: "Câu trả lời văn bản nhiều dòng" },
  { type: "checkbox", label: "Hộp kiểm", icon: CheckSquare, description: "Cho phép chọn nhiều tuỳ chọn" },
  { type: "radio", label: "Trắc nghiệm", icon: CheckSquare, description: "Chỉ cho phép chọn một tuỳ chọn" },
  { type: "select", label: "Danh sách thả xuống", icon: ChevronDown, description: "Menu thả xuống" },
  { type: "date", label: "Ngày", icon: Calendar, description: "Chọn ngày tháng" },
  { type: "time", label: "Thời gian", icon: Clock, description: "Chọn giờ phút" },
  { type: "email", label: "Email", icon: Mail, description: "Địa chỉ email" },
  { type: "number", label: "Số", icon: Hash, description: "Chỉ nhập số" }
];

export const getFieldTypeMeta = (type) => fieldTypes.find(ft => ft.type === type);

