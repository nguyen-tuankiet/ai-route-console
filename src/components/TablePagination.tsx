import { Button, Select, Space, Typography } from "antd";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 24,
        padding: "12px 4px 0",
        marginTop: 8,
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <Space size={8}>
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          Hiển thị dòng
        </Typography.Text>
        <Select
          size="small"
          value={pageSize}
          style={{ width: 68 }}
          onChange={(size) => {
            onPageSizeChange(size);
            onPageChange(1);
          }}
          options={pageSizeOptions.map((n) => ({ value: n, label: n }))}
        />
      </Space>

      <Typography.Text style={{ fontSize: 13 }}>
        Trang {page} trên {totalPages}
      </Typography.Text>

      <Space size={2}>
        <Button
          size="small"
          type="text"
          icon={<DoubleLeftOutlined />}
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        />
        <Button
          size="small"
          type="text"
          icon={<LeftOutlined />}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <Button
          size="small"
          type="text"
          icon={<RightOutlined />}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
        <Button
          size="small"
          type="text"
          icon={<DoubleRightOutlined />}
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
        />
      </Space>
    </div>
  );
}
