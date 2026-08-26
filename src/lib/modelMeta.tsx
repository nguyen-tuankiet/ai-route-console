import type { ReactNode } from "react";
import {
  MessageOutlined,
  ApartmentOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  AudioOutlined,
} from "@ant-design/icons";

/**
 * Mỗi capability có input/output modality "mặc định" theo đúng bảng capability
 * taxonomy ở SRS §5.2.1 — dùng để tự điền gợi ý trong form tạo/sửa Model Alias,
 * và để hiển thị mô tả dễ hiểu (thay vì chỉ show tên enum) trên card/trang chi tiết.
 * Dùng chung giữa models.tsx (tạo mới) và models.$alias.tsx (chỉnh sửa) để không lệch nhau.
 */
export const CAPABILITY_INFO: Record<
  string,
  { icon: ReactNode; short: string; defaultInput: string[]; defaultOutput: string[] }
> = {
  "Text Generation": {
    icon: <MessageOutlined />,
    short: "Sinh văn bản — chat, tóm tắt, viết nội dung",
    defaultInput: ["text"],
    defaultOutput: ["text"],
  },
  Embedding: {
    icon: <ApartmentOutlined />,
    short: "Chuyển văn bản/ảnh thành vector để tìm kiếm ngữ nghĩa",
    defaultInput: ["text"],
    defaultOutput: ["vector"],
  },
  "Image Generation": {
    icon: <PictureOutlined />,
    short: "Tạo ảnh từ mô tả văn bản",
    defaultInput: ["text"],
    defaultOutput: ["image"],
  },
  "Video Generation": {
    icon: <VideoCameraOutlined />,
    short: "Tạo video từ văn bản hoặc ảnh",
    defaultInput: ["text", "image"],
    defaultOutput: ["video"],
  },
  "Speech To Text": {
    icon: <AudioOutlined />,
    short: "Chuyển giọng nói trong file audio thành văn bản",
    defaultInput: ["audio"],
    defaultOutput: ["text"],
  },
};

export const MODALITY_LABEL: Record<string, string> = {
  text: "Văn bản",
  image: "Ảnh",
  video: "Video",
  audio: "Audio",
  vector: "Vector",
};
