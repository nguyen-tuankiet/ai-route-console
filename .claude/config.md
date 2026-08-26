# Project Configuration — ai-route-console

> Nguồn sự thật duy nhất cho path, port, lệnh của **repo này**. Sai ở đây thì sửa ở đây.

## Project Info

- **repo**: `ai-route-console` — Admin console (frontend-only) cho **Unified Multimodal AI-Router**
- **vị trí**: `Draft/ai-route-console` bên trong repo tài liệu `ai-router` — đây là bản **nháp UI**, chưa
  phải nhánh production, được Lovable generate ban đầu rồi phát triển tiếp tại đây.
- **package_manager**: npm (theo `README.md`) · `bun.lock`/`bunfig.toml` cũng có sẵn (Lovable dùng bun nội
  bộ) — **không trộn lock file**, mặc định dùng npm trừ khi user nói khác.
- **runtime**: Node.js · React 19 + Vite 8 + TanStack Start

### Ngoài phạm vi (trạng thái hiện tại — quan trọng)

**Router Engine, Adapter Layer, Credential Vault, Job Worker, Admin API thật đều CHƯA TỒN TẠI.** Đây
thuần túy là UI console; toàn bộ dữ liệu là mock trong `src/lib/mock.ts`. Không có repo backend song song
kiểu `wg-workspace-be` — đừng viết code giả định một server thật đang chạy ở đâu đó, và đừng tự bịa ra
REST client gọi `https://ai-router.internal.example.com` thật. Mọi màn hình mới vẫn phải đọc/ghi qua
`src/lib/mock.ts` cho tới khi có quyết định khác từ user.

## Stack

TanStack Start (SSR-capable React 19) + TanStack Router (file-based routing) + Vite 8 · **AntD v6** là
design system chính (+ shadcn/radix components có sẵn từ Lovable scaffold trong `components/ui/` — legacy,
không mở rộng thêm) · Tailwind v4 (chỉ dùng cho layout/spacing, không phải nguồn màu) · Recharts cho biểu
đồ · `react-hook-form` + `zod` (đã cài, sẵn sàng dùng cho form có validate).

## Cấu trúc

```
src/
├─ router.tsx / routeTree.gen.ts   TanStack Router setup (routeTree.gen.ts TỰ SINH — không sửa tay)
├─ routes/<name>.tsx               File-based route = 1 trang (export const Route = createFileRoute(...))
├─ components/
│  ├─ AppLayout.tsx                Sidebar + Header khung chính, export PageHeader dùng chung mọi trang
│  ├─ StatusTag.tsx                Tag màu theo status/health/circuit — dùng chung toàn app, đừng tự vẽ Tag mới
│  └─ ui/                          shadcn/radix primitives từ Lovable scaffold — legacy, KHÔNG mở rộng
├─ lib/
│  ├─ mock.ts                      NGUỒN DỮ LIỆU DUY NHẤT hiện tại cho mọi bảng/card/chart/drawer
│  └─ utils.ts
├─ server.ts / start.ts            TanStack Start server entry
```

**Quy ước:** file route kebab-case theo path (`accounts.tsx`, `providers.tsx`); component PascalCase.
Mỗi route khai báo `head()` với `title`/`description`/OG tags (xem `providers.tsx`, `index.tsx` làm mẫu).

## Design system (khoá cứng theo `README.md` — đừng tự chọn màu/style khác)

Enterprise SaaS sáng màu: nền trắng chủ đạo, **không dark mode, không gradient, không glassmorphism**,
shadow nhẹ, spacing hệ 8px, border-radius 6–8px. Primary = AntD Blue; success/warning/error/processing
theo màu mặc định AntD. Người dùng chính: Backend Developer / AI Engineer / DevOps / SysAdmin — ưu tiên
Desktop (≥1024px), không cần tối ưu mobile.

## Sidebar/menu chốt (README §2 — đối chiếu khi thêm route mới)

Tổng quan · Providers · Tài khoản Provider · Models · Chính sách định tuyến · API Keys ·
Usage & Analytics · Request Logs · Async Jobs · Assets · Audit Logs · System Health.

**Đã build:** `/` (Tổng quan), `/providers`, `/accounts`.
**Chưa build (9 route còn lại):** Models, Chính sách định tuyến (Routing Policies), API Keys,
Usage & Analytics, Request Logs (+ Request Detail), Async Jobs (+ Job Detail), Assets, Audit Logs,
System Health.

## Lệnh

```bash
npm install
npm run dev            # vite dev
npm run build           # vite build (bao gồm type-check qua tsc)
npm run build:dev       # build ở mode development
npm run preview
npm run lint             # eslint .
npm run format           # prettier --write .
```

Không có script `typecheck` riêng — type-check chạy lồng trong `vite build`. **Không có test runner nào
được cấu hình** (`test_cmd`: none) — đây là gap thật, không phải lỗi cấu hình.

## Tài liệu nguồn (đọc trước khi thêm màn/field mới — thay cho `ARCHITECTURE.md`/`DATABASE.md`)

Repo cha `../../` (`E:\DAT_Project\ai-router`) chứa:

- `../../CLAUDE.md` — tóm tắt nhanh kiến trúc + nguyên tắc cứng của toàn hệ thống Router.
- `../../Software Requirements Specification (SRS).pdf` — yêu cầu `FR-*`/`NFR-*`/`BR-*`. Nguồn quyết
  định **"màn này phải hiển thị/enforce cái gì"** (vd enum status account ở FR-PROV-005 phải khớp
  `StatusTag`; RBAC theo resource ở §5.1).
- `../../Đặc tả kỹ thuật — Unified Multimodal LLM Router.pdf` — kiến trúc, Admin API/UI §8 (đúng là
  nguồn của 12 mục sidebar), phân kỳ triển khai Phase 0–4.
- `../../API Specification.pdf` — hợp đồng API chính xác: tên field, enum, response shape. **Đối chiếu
  file này trước khi tự đặt tên field/enum mới trong `mock.ts` hoặc form** — đừng đoán.

Khi 3 tài liệu mâu thuẫn: API Specification thắng về hình dạng field/enum; SRS thắng về mức độ bắt buộc
phải có; đặc tả kỹ thuật thắng về cách trình bày/luồng.

## Backend / API thật

Chưa tồn tại. Base URL dự kiến theo spec (chỉ để tham chiếu, KHÔNG gọi thật):
`https://ai-router.internal.example.com/v1` (client API) + `/admin` (admin API). Không có server nào
đang chạy — mọi UI hiện tại phải tiếp tục dùng `src/lib/mock.ts`.

## CI/CD

`enabled: false` — chưa dựng.

## E2E

`required: false` — chưa có backend thật để test end-to-end có ý nghĩa; Playwright chưa được cài trong
`package.json`. Khi cần kiểm tra UI, dùng preview/browser tool để xem trực tiếp thay vì viết E2E test.
