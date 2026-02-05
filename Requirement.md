# 🌈 Paws Rainbow: 实战级需求文档 (PRD v1.6 - 无代码版)

| 项目属性 | 描述 |
| :--- | :--- |
| **项目名称** | **Paws Rainbow** (彩虹爪印) |
| **生产域名** | `https://pawsrainbow.com` |
| **核心目标** | 构建唯美、支持换肤的宠物数字纪念馆，通过情感价值变现。 |
| **商业模式** | **$9.90 Lifetime Deal** (Stripe 支付) |
| **技术栈** | Next.js 16 (App Router) + Supabase + Stripe + Tailwind CSS |
| **配套服务** | Vercel (托管), Resend (邮件), Namecheap (域名) |
| **开发周期** | 预计 5-8 小时 (全栈开发) |

---

## 1. 产品核心价值 (Core Value)

*   **Slogan**: "Every paw print deserves a forever home." (每一个爪印都值得拥有一个永远的家)
*   **用户旅程**:
    1.  **悲伤 (Trigger)**: 用户访问首页。
    2.  **行动 (Action)**: 1分钟极简创建，获得专属链接 `pawsrainbow.com/m/luna-2024`。
    3.  **价值感 (Value)**: 页面展示唯美效果，但提示 "7天后过期"。
    4.  **转化 (Conversion)**: 用户支付 $9.90 -> 永久保存 + 解锁高级主题。

---

## 2. 功能规格说明 (Feature Specs)

### 2.1 纪念页前端 (The Memorial Page)
*   **访问路径**: `https://pawsrainbow.com/m/[唯一标识符]`
*   **多主题引擎 (配置化渲染)**:
    *   **Theme A: Pure Heaven (免费/默认)**: 米白暖色调，配合衬线字体，营造宁静氛围。
    *   **Theme B: Starry Night (高级)**: 深蓝渐变背景，配合金黄色文字，增加星光浮动特效。
    *   **Theme C: Rainbow Meadow (高级)**: 天蓝与嫩绿配色，配合无衬线字体，增加花瓣飘落特效。
*   **核心交互**:
    *   **点亮心灯**: 页面底部设有蜡烛图标。点击后播放微动效（如火焰燃烧），且数据库计数器加一。需做简单的 IP 防刷限制。

### 2.2 创建与管理流程 (Creator Flow)
*   **创建入口**: `https://pawsrainbow.com/create`
*   **表单字段**:
    1.  **Pet Name**: 宠物名字。
    2.  **Dates**: 生卒年份。
    3.  **Story**: 生平故事（支持多行文本）。
    4.  **Photo**: 仅支持单张图片上传（前端需限制 5MB 以内）。
    5.  **Theme Selection**: 允许用户实时预览 3 种主题效果。
    6.  **Owner Email**: 仅用于接收管理链接，不在前台显示。
*   **邮件通知**:
    *   使用 Resend 服务发送。
    *   邮件包含一个带有 Token 的 "Magic Link"，点击即可进入编辑模式或支付页面。

### 2.3 商业化逻辑 (Stripe)
*   **定价策略**: $9.90 一次性买断。
*   **权益控制逻辑**:
    *   **免费状态**: 页面顶部悬浮倒计时横幅，底部显示官方版权链接，强制锁定为 Theme A。
    *   **付费状态**: 移除倒计时，移除底部广告，允许自由切换 Theme B 和 Theme C。
*   **支付触发**:
    *   点击顶部 "Save Forever" 按钮。
    *   或在编辑页尝试保存高级主题时触发。

---

## 3. 数据库设计 (Database Schema)

使用 Supabase (PostgreSQL) 存储。核心表名为 `memorials`。

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| **id** | UUID | 主键，自动生成。 |
| **slug** | Text | 唯一且不重复的 URL 路径 (索引字段)。 |
| **pet_name** | Text | 宠物名字。 |
| **owner_email** | Text | **隐私字段**，需开启 RLS 保护，禁止公开读取。 |
| **content** | Text | 生平故事内容。 |
| **image_url** | Text | 图片在 Storage 中的完整公开链接。 |
| **theme_id** | Text | 枚举值：'default', 'starry', 'rainbow'。 |
| **candle_count** | Int | 点灯计数，默认为 0。 |
| **is_permanent** | Bool | **支付状态核心字段**。默认为 False，支付成功后变 True。 |
| **created_at** | Time | 创建时间。 |
| **expires_at** | Time | 过期时间。默认为创建时间 + 7天。 |

---

## 4. 技术架构与环境变量

### 4.1 核心技术策略
*   **Next.js 16**: 全面使用 Server Actions 处理表单提交和支付跳转，不编写 API 路由。
*   **Image Optimization**: 上传时在服务端或 Edge 端进行 WebP 转换，确保图片体积小于 300KB。
*   **SEO**: 利用 Next.js Metadata API，根据 slug 动态生成 Open Graph 标签（让分享卡片显示宠物照片）。

### 4.2 必须配置的环境变量
在 Vercel 后台配置以下变量：
1.  **基础 URL**: 用于支付回调跳转 (生产环境填 `https://pawsrainbow.com`)。
2.  **Supabase 配置**: URL 和 Anon Key。
3.  **Supabase Service Role**: 用于 Webhook 中绕过权限直接更新支付状态。
4.  **Stripe 配置**: Secret Key 和 Webhook Secret。
5.  **Resend 配置**: API Key。

---

## 5. 开发冲刺计划 (5小时执行表)

### 第 1 小时：地基搭建
*   初始化 Next.js 16 项目，配置 Tailwind CSS。
*   在 Supabase 建立数据库表和存储桶 (设置为公开读取)。
*   在 Vercel 绑定域名 `pawsrainbow.com`。
*   在 Resend 配置域名 DNS 验证（确保邮件不进垃圾箱）。

### 第 2 小时：核心功能
*   开发“创建纪念馆”的 Server Action，包含图片上传逻辑。
*   制作创建表单页面，实现主题切换的实时预览效果（通过切换 CSS 类名实现）。

### 第 3 小时：纪念页渲染
*   开发动态路由页面 `/m/[slug]`。
*   实现 3 套 CSS 变量皮肤，确保切换主题时颜色和背景生效。
*   实现“点灯”交互，点击后前端数字 +1，后台异步更新数据库。

### 第 4 小时：支付闭环
*   注册 Stripe，获取 API Key。
*   开发支付跳转逻辑：创建 Stripe Checkout Session，透传纪念馆 ID。
*   开发 Webhook 处理逻辑：监听支付成功事件，将数据库的 `is_permanent` 字段更新为 True。

### 第 5 小时：合规与发布
*   添加“隐私政策”和“服务条款”静态页（Stripe 审核必须）。
*   测试全流程：创建一个页面 -> 收到邮件 -> 模拟支付 -> 确认页面变为永久版。
*   正式上线，并去 Reddit 的 r/Petloss 板块进行第一次宣传。

---

## 6. 风险与合规检查

1.  **Stripe 激活**: 确保网站底部包含“联系我们”和“条款”链接，否则 Stripe 可能会禁用账户。
2.  **内容安全**: 建议在数据库后台定期查看新上传的图片，防止违规内容。
3.  **备份**: Supabase 提供自动备份，无需额外操作。