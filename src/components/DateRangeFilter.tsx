import { useState, type CSSProperties } from "react";
import { Button, DatePicker, Space, Tooltip } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";

export interface DateRangeValue {
  key: string;
  range: [Dayjs, Dayjs];
  label: string;
}

const DAY_PRESETS: { key: string; label: string; days: number }[] = [
  { key: "7d", label: "7 ngày qua", days: 7 },
  { key: "28d", label: "28 ngày qua", days: 28 },
  { key: "90d", label: "90 ngày qua", days: 90 },
  { key: "365d", label: "365 ngày qua", days: 365 },
];

/** Default value a page can use for `useState` — "28 ngày qua" ending today, matching the product's default. */
export function defaultDateRange(): DateRangeValue {
  const today = dayjs();
  return { key: "28d", range: [today.subtract(27, "day"), today], label: "28 ngày qua" };
}

function monthPresets(today: Dayjs) {
  return [0, 1, 2].map((back) => {
    const m = today.subtract(back, "month");
    return {
      key: `month-${back}`,
      label: `Tháng ${m.month() + 1}`,
      start: m.startOf("month"),
      end: m.endOf("month"),
    };
  });
}

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"list" | "custom">("list");
  const today = dayjs();
  const months = monthPresets(today);

  const rowStyle = (active: boolean): CSSProperties => ({
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 13.5,
    background: active ? "#f5f5f5" : undefined,
    fontWeight: active ? 600 : 400,
  });

  const closeToList = (open: boolean) => {
    setOpen(open);
    if (!open) setMode("list");
  };

  const selectPreset = (next: DateRangeValue) => {
    onChange(next);
    setOpen(false);
    setMode("list");
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Tooltip
        title={`${value.range[0].format("DD/MM/YYYY")} → ${value.range[1].format("DD/MM/YYYY")}`}
      >
        <Button onClick={() => closeToList(!open)} style={{ textAlign: "left" }}>
          <Space size={6}>
            {value.label}
            {open ? (
              <UpOutlined style={{ fontSize: 10 }} />
            ) : (
              <DownOutlined style={{ fontSize: 10 }} />
            )}
          </Space>
        </Button>
      </Tooltip>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 1000 }}
            onClick={() => closeToList(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              zIndex: 1001,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              minWidth: 220,
              padding: mode === "list" ? "4px 0" : 12,
            }}
          >
            {mode === "list" ? (
              <>
                {DAY_PRESETS.map((p) => (
                  <div
                    key={p.key}
                    style={rowStyle(value.key === p.key)}
                    onClick={() =>
                      selectPreset({
                        key: p.key,
                        range: [today.subtract(p.days - 1, "day"), today],
                        label: p.label,
                      })
                    }
                  >
                    {p.label}
                  </div>
                ))}
                <div
                  style={rowStyle(value.key === "all")}
                  onClick={() =>
                    selectPreset({
                      key: "all",
                      range: [dayjs("2020-01-01"), today],
                      label: "Toàn thời gian",
                    })
                  }
                >
                  Toàn thời gian
                </div>

                <div style={{ borderTop: "1px solid #f0f0f0", margin: "4px 0" }} />

                {months.map((m) => (
                  <div
                    key={m.key}
                    style={rowStyle(value.key === m.key)}
                    onClick={() =>
                      selectPreset({ key: m.key, range: [m.start, m.end], label: m.label })
                    }
                  >
                    {m.label}
                  </div>
                ))}

                <div style={{ borderTop: "1px solid #f0f0f0", margin: "4px 0" }} />

                <div style={rowStyle(value.key === "custom")} onClick={() => setMode("custom")}>
                  Tùy chỉnh
                </div>
              </>
            ) : (
              <DatePicker.RangePicker
                open
                autoFocus
                value={value.key === "custom" ? value.range : null}
                onChange={(dates) => {
                  if (dates?.[0] && dates[1]) {
                    selectPreset({
                      key: "custom",
                      range: [dates[0], dates[1]],
                      label: "Tùy chỉnh",
                    });
                  }
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
