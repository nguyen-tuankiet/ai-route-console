# AI Router Dashboard

# THIẾT KẾ UI/UX CHO HỆ THỐNG AI ROUTER

Hãy thiết kế một hệ thống Admin Dashboard hoàn chỉnh cho dự án **AI Router – Unified Multimodal AI Gateway**.

Đây là một nền tảng nội bộ dùng để quản lý và định tuyến request AI từ các hệ thống nội bộ đến nhiều AI Provider khác nhau như OpenAI-compatible API, Vertex AI và các provider khác trong tương lai.

Toàn bộ giao diện phải sử dụng **Ant Design (AntD)** làm Design System chính.

---

# 1. PHONG CÁCH THIẾT KẾ

Thiết kế theo phong cách:

- Enterprise SaaS

- Modern

- Clean

- Minimal

- Professional

- Phù hợp cho hệ thống quản trị dành cho Developer / DevOps / AI Engineer

## Màu sắc

Ưu tiên tuyệt đối giao diện sáng.

- Background chính: WHITE (#FFFFFF)

- Background phụ: #F5F5F5 hoặc #FAFAFA

- Card: WHITE

- Border: #E5E7EB hoặc màu border mặc định của Ant Design

- Màu primary: Ant Design Blue

- Success: Green

- Warning: Orange

- Error: Red

- Processing: Blue

- Disabled: Gray

YÊU CẦU QUAN TRỌNG:

- Luôn ưu tiên background màu trắng.

- Không sử dụng dark mode.

- Không sử dụng gradient.

- Không sử dụng glassmorphism.

- Không sử dụng background nhiều màu.

- Không sử dụng shadow quá mạnh.

- Ưu tiên border mảnh và khoảng trắng.

- Giao diện phải sạch và có độ tương phản tốt.

- Không thiết kế theo phong cách landing page.

- Đây là một hệ thống quản trị thực tế dành cho doanh nghiệp.

Sử dụng spacing theo hệ thống 8px.

Border radius khoảng 6–8px.

---

# 2. LAYOUT TỔNG THỂ

Sử dụng Ant Design Layout.

## Sidebar bên trái

Sidebar cố định, có khả năng collapse.

Background màu trắng.

Phía trên:

AI Router

Unified Multimodal AI Gateway

Menu:

1. Tổng quan

2. Providers

3. Tài khoản Provider

4. Models

5. Chính sách định tuyến

6. API Keys

7. Usage & Analytics

8. Request Logs

9. Async Jobs

10. Assets

11. Audit Logs

12. System Health

Phía dưới sidebar:

- Avatar Admin

- Tên Admin

- Cài đặt

- Đăng xuất

Sử dụng icon của Ant Design.

Sidebar phải có cảm giác tương tự các dashboard enterprise như AWS, Vercel, Supabase hoặc Datadog.

---

# 3. TOP HEADER

Header màu trắng, cố định phía trên.

Bao gồm:

- Breadcrumb

- Global Search

- Environment Selector

  - Development

  - Staging

  - Production

- Notification

- Avatar Admin

- Dropdown tài khoản

Header nhỏ gọn, sạch và chuyên nghiệp.

---

# 4. TRANG TỔNG QUAN — DASHBOARD

Thiết kế trang Dashboard chính.

## KPI Cards

Hiển thị 6 card:

- Tổng số Request

- Tỷ lệ thành công

- Latency trung bình

- P95 Latency

- Tỷ lệ Fallback

- Chi phí ước tính

Mỗi card bao gồm:

- Icon

- Giá trị chính

- So sánh với khoảng thời gian trước

- Trend indicator

Sử dụng Ant Design Card + Statistic.

---

## Provider Health

Một Card lớn hiển thị tình trạng các Provider.

Table:

- Provider

- Account

- Region

- Status

- Quota

- Latency

- Circuit State

Status:

- Healthy

- Degraded

- Quota Exhausted

- Disabled

Sử dụng Ant Design Tag và Badge.

---

## Request Trend

Một Card lớn chứa Line Chart.

Hiển thị số lượng request theo thời gian.

Biểu đồ phải tối giản, nền trắng.

---

## Recent Routing Activity

Table hiển thị request gần đây:

- Request ID

- Model Alias

- Provider

- Attempts

- Result

- Duration

- Created Time

Có pagination.

---

# 5. PROVIDERS

Trang quản lý các AI Provider.

Tiêu đề:

Providers

Button chính:

+ Thêm Provider

Table:

- Tên Provider

- Loại

- Base URL

- Số lượng Account

- Số Model

- Status

- Updated At

- Actions

Provider Type:

- OpenAI Compatible

- Vertex AI

- Native

- OAuth

Actions:

- Xem

- Chỉnh sửa

- Disable

---

# 6. PROVIDER ACCOUNTS

Trang quản lý các tài khoản của Provider.

Phía trên có KPI:

- Active Accounts

- Degraded

- Quota Exhausted

- Reauth Required

Table:

- Account Label

- Provider

- Credential Type

- Region

- RPM Limit

- Daily Budget

- Health

- Status

- Last Health Check

- Actions

Khi click vào Account, mở Ant Design Drawer.

Drawer gồm:

## Thông tin Account

- Label

- Provider

- Region

- Credential Type

- Created At

## Quota

Progress bar:

- Requests per minute

- Daily budget

- Token usage

## Health History

Sử dụng Timeline.

## Circuit Breaker

Hiển thị:

- Closed

- Open

- Half-open

KHÔNG BAO GIỜ hiển thị API Key hoặc Secret thực tế.

---

# 7. MODELS

Trang Model Registry.

Tiêu đề:

Model Registry

Button:

+ Tạo Model Alias

Hiển thị các Model Alias dưới dạng Card.

Ví dụ:

- text/fast

- text/reasoning

- embedding/default

- image/quality

- video/standard

- audio/stt

Mỗi Card hiển thị:

- Alias

- Capability

- Input Modalities

- Output Modalities

- Streaming

- Structured Output

- Số lượng Target

- Status

---

# 8. MODEL DETAIL

Khi click vào Model Alias.

Ví dụ:

text/fast

## General

Hiển thị:

- Alias

- Capability

- Input Modalities

- Output Modalities

- Context Limit

- Streaming Supported

- Structured Output Supported

## Provider Targets

Editable Table:

- Priority

- Provider

- Account Pool

- Provider Model

- Estimated Cost

- Recent Latency

- Status

- Enabled

Cho phép thay đổi thứ tự Priority bằng drag & drop.

---

# 9. ROUTING POLICIES

Đây là một trong những màn hình quan trọng nhất.

Tiêu đề:

Routing Policies

Ví dụ đang cấu hình:

text/fast

Hiển thị routing chain theo dạng flow:

Priority 1

OpenAI Account Pool

Model: GPT-compatible

Status: Healthy

↓

Priority 2

Vertex AI

Model: Gemini

Status: Healthy

↓

Priority 3

OpenAI Compatible Provider

Model: Fallback Model

Status: Standby

---

## Policy Configuration

Panel bên phải:

- Retry Count

- Request Timeout

- Overall Deadline

- Fallback Enabled

- Maximum Cost

- Budget Policy

- Round Robin

- Circuit Breaker Threshold

Sử dụng Ant Design Form.

Giao diện phải làm cho người dùng dễ hiểu thứ tự:

Hard Filter

↓

Ranking

↓

Retry

↓

Fallback

↓

Circuit Breaker

---

# 10. API KEYS

Trang quản lý API Key.

Tiêu đề:

API Keys

Button:

+ Tạo API Key

Table:

- Client Name

- Key Prefix

- Scopes

- Status

- Created

- Last Used

- Expiration

- Actions

Scopes:

- ai:read:models

- ai:invoke:text

- ai:invoke:embedding

- ai:invoke:image

- ai:invoke:video

- ai:invoke:audio

---

## Create API Key Modal

Form:

- Client Name

- Scopes

- Expiration

- Description

Sau khi tạo:

Hiển thị API Key đầy đủ CHỈ MỘT LẦN.

Hiển thị cảnh báo:

"API Key chỉ được hiển thị một lần. Hãy lưu lại key trước khi đóng cửa sổ này."

Không cho phép xem lại API Key sau khi đóng.

---

# 11. USAGE & ANALYTICS

Trang phân tích usage.

Filter:

- Date Range

- Provider

- Model Alias

- Client

- Capability

Biểu đồ:

1. Requests theo thời gian

2. Success vs Failed

3. Provider Distribution

4. Token Usage

5. Estimated Cost

6. Average Latency

7. Fallback Rate

Bên dưới có Usage Table:

- Date

- Client

- Model

- Provider

- Input Tokens

- Output Tokens

- Total Tokens

- Cost

- Requests

---

# 12. REQUEST LOGS

Trang monitoring request.

Tiêu đề:

Request Logs

Có ô tìm kiếm:

Search by Request ID

Advanced Filters:

- Status

- Provider

- Model

- Client

- Capability

- Date

Table:

- Request ID

- Client

- Model Alias

- Provider

- Status

- Attempts

- Fallback

- Duration

- Created At

---

# 13. REQUEST DETAIL

Khi click vào Request.

Hiển thị Summary Card:

- Request ID

- Client

- Model Alias

- Capability

- Total Duration

- Result

- Input Tokens

- Output Tokens

- Estimated Cost

---

## Routing Timeline

Hiển thị flow:

Request Started

↓

Attempt 1

Provider: OpenAI

Result: Timeout

Duration: 2.1s

↓

Attempt 2

Provider: Vertex AI

Result: Success

Duration: 1.3s

↓

Request Completed

Sử dụng Ant Design Timeline.

KHÔNG hiển thị:

- Prompt

- Completion

- API Key

- OAuth Token

- Provider Secret

---

# 14. ASYNC JOBS

Trang quản lý các tác vụ chạy lâu.

Tabs:

- Video

- Music

- Image

Table:

- Job ID

- Model

- Client

- Status

- Progress

- Attempts

- Created

- Updated

Job Status:

- Accepted

- Queued

- Dispatching

- Running

- Succeeded

- Failed

- Cancelled

- Expired

Progress sử dụng Ant Design Progress.

---

# 15. JOB DETAIL

Hiển thị:

- Job ID

- Type

- Model

- Client

- Status

- Progress

- Created At

- Updated At

Timeline:

Accepted

↓

Queued

↓

Dispatching

↓

Running

↓

Succeeded

Hoặc:

Failed

Cancelled

Expired

---

# 16. ASSETS

Trang quản lý các file/media được tạo ra.

Hiển thị dạng Grid.

Mỗi Asset Card:

- Preview

- Asset ID

- MIME Type

- File Size

- Created At

- Expiration

- Actions

Hỗ trợ:

- Image

- Audio

- Video

Sử dụng Ant Design Image, Card.

Filter:

- Type

- Date

- Client

---

# 17. AUDIT LOGS

Trang Security Audit.

Table:

- Actor

- Action

- Resource

- Result

- IP Address

- Timestamp

Ví dụ Action:

- Created Provider

- Updated Provider

- Created Model

- Updated Routing Policy

- Revoked API Key

- Disabled Provider Account

Click row mở Drawer.

Hiển thị:

- Actor

- Action

- Resource

- Before

- After

- Timestamp

Sensitive data phải được redacted.

---

# 18. SYSTEM HEALTH

Trang monitoring hệ thống.

Hiển thị các Card:

PostgreSQL

Status: Healthy

Redis

Status: Healthy

Vault

Status: Healthy

Object Storage

Status: Healthy

Router API

Status: Healthy

Worker

Status: Healthy

Mỗi Card:

- Status

- Response Time

- Last Check

- Uptime

---

## Provider Health Matrix

Table:

- Provider

- Account

- Health

- Circuit Breaker

- Remaining Quota

- Average Latency

- Last Check

---

# 19. EMPTY STATE

Thiết kế Empty State đẹp và rõ ràng cho:

- Chưa có Provider

- Chưa có Provider Account

- Chưa có Model

- Chưa có Routing Policy

- Chưa có API Key

- Chưa có Request Logs

- Chưa có Async Job

Mỗi Empty State có:

- Icon

- Tiêu đề

- Mô tả ngắn

- Primary Action

Ví dụ:

"Chưa có Provider"

"Thêm Provider đầu tiên để bắt đầu định tuyến request AI."

Button:

"+ Thêm Provider"

---

# 20. ERROR STATE

Thiết kế Error State cho:

- Provider unavailable

- Database unavailable

- Redis unavailable

- Vault unavailable

- Quota exhausted

- Circuit breaker open

- Authentication failed

- Permission denied

Sử dụng Ant Design Alert, Result và Tag.

---

# 21. COMPONENT DESIGN SYSTEM

Sử dụng nhất quán các Ant Design components:

- Layout

- Menu

- Breadcrumb

- Card

- Statistic

- Table

- Tag

- Badge

- Drawer

- Modal

- Form

- Input

- Select

- DatePicker

- Progress

- Timeline

- Tabs

- Dropdown

- Avatar

- Alert

- Tooltip

- Pagination

- Empty

- Result

- Skeleton

- Spin

Không tự tạo UI component nếu Ant Design đã có component tương ứng.

---

# 22. RESPONSIVE

Ưu tiên Desktop.

Breakpoints:

- Desktop: 1440px+

- Laptop: 1024–1439px

- Tablet: 768–1023px

Sidebar có thể collapse.

Table phải responsive.

Các Dashboard Cards tự động xuống dòng khi màn hình nhỏ.

Không cần ưu tiên Mobile vì đây là hệ thống Admin nội bộ.

---

# 23. UX PRINCIPLES

Ưu tiên:

1. Information hierarchy

2. Data density vừa phải

3. Dễ scan thông tin

4. Dễ tìm kiếm

5. Dễ filter

6. Dễ debug routing

7. Dễ theo dõi Provider health

8. Dễ quản lý quota

9. Dễ kiểm tra request lifecycle

Người sử dụng chính:

- Backend Developer

- AI Engineer

- DevOps

- System Administrator

- Technical Manager

Đây KHÔNG phải giao diện dành cho end-user phổ thông.

---

# 24. QUAN TRỌNG

Thiết kế toàn bộ các màn hình như một sản phẩm duy nhất.

Phải đảm bảo:

- Cùng sidebar

- Cùng header

- Cùng typography

- Cùng spacing

- Cùng màu sắc

- Cùng border radius

- Cùng table style

- Cùng button style

- Cùng trạng thái Success / Warning / Error

- Cùng pattern Drawer / Modal / Detail page

Toàn bộ UI phải có cảm giác như một **Enterprise AI Infrastructure Platform** hoàn chỉnh.

Background màu trắng phải là màu chủ đạo xuyên suốt toàn bộ sản phẩm.

Không thiết kế landing page.

Không sử dụng dark theme.

Không sử dụng gradient.

Không sử dụng giao diện quá màu mè.

Ưu tiên **Ant Design + White Enterprise UI + Clean + Professional + Developer-focused + Data-driven**.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/327ad2b3-03a9-4bcd-b185-d71a76baf40c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
