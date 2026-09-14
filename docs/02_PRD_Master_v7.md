# Chris Machinery 网站需求文档 (PRD Master v7.0 终极全量版)

> **文档说明**：本文档为 Chris Machinery 官方网站开发、测试与交付的唯一指导标准，整合了前端交互、后端 Headless CMS 控制台、SEO/SSR 架构、线索 CRM 数据流及技术验收 Checklist。

---

## 1. 品牌视觉与响应式规范

### 1.1 品牌 UI 规范
- **Logo**：黑色线条 + 浅黄底 (`#F5C518`)，使用透明背景 PNG (`logo_chris_machinery.png`)[cite: 6]。
- **配色系统**[cite: 6]：
  - **主色 (Primary)**：黑 `#1A1A1A`[cite: 6]
  - **辅色 (Accent)**：亮黄 `#F5C518`（仅用于 CTA 按钮、选中态、地图高亮点）[cite: 6]
  - **背景 (Background)**：纯白 `#FFFFFF`[cite: 6]
  - **深色区块 (Dark Section)**：`#111111`[cite: 6]
  - **正文文字 (Text)**：`#4A5568`[cite: 6]
- **字体 (Google Fonts)**[cite: 6]：
  - 标题：Montserrat (Bold)[cite: 6]
  - 正文：Inter (Regular)[cite: 6]

### 1.2 响应式与 Mac/Mobile 显示适配
- **断点规范 (Responsive Breakpoints)**[cite: 6]：
  - Desktop ($\ge 1200\text{px}$)：三栏/两栏网格布局，强化 `:hover` 视觉反馈（放大 1.02x、阴影加深）[cite: 6]。
  - Tablet ($768\text{px} - 1199\text{px}$)：自动调整为单列/双列，筛选侧边栏折叠[cite: 6]。
  - Mobile ($< 768\text{px}$)：开启汉堡菜单（☰）与底部抽屉式筛选[cite: 6]。
- **Mac Retina 优化**：资源采用 2x 导出或 SVG 格式；CSS 声明 `-webkit-font-smoothing: antialiased;`[cite: 6]。
- **移动端交互硬指标**：所有触控元素点击区域 $\ge 44 \times 44\text{px}$[cite: 6]。
- **性能指标**：移动 4G 网络下首屏 LCP $< 3$ 秒；全站图片全量开启 `loading="lazy"`[cite: 6]。

---

## 2. 页面结构与核心交互

### 2.1 导航结构
导航栏链接从左到右排列顺序：
**首页 $\rightarrow$ 产品中心 $\rightarrow$ 解决方案 $\rightarrow$ 关于我们 $\rightarrow$ 博客 $\rightarrow$ 联系我们**[cite: 6]

### 2.2 首页 (Homepage)
1. **Hero Banner**：高清白底产品全景图 + 品牌 Slogan + 双 CTA 按钮（`Get a Quote` / `View Products`）[cite: 6]。
2. **Core Advantages**：4-5 个 Icon+短文卖点（1年质保、24h快速报价、热镀锌底盘、定制化服务）[cite: 6]。
3. **Hot Products**：展示 5 个热卖系列（Pod / Airstream / Square / Container / NY）白底代表图卡片[cite: 6]。
4. **Global Footprint (全球足迹)**[cite: 6]：
   - 静态地图（2x SVG / 2880px PNG），灰底 `#E0E0E0` + 亮黄 `#F5C518` 实心圆点[cite: 6]。
   - **数据源**：读取 `public/data/footprint.json` 静态节点配置，悬停展示国家名及发货台数。
5. **Testimonials**：3-4 条精选评价（图文 + 客户国家国旗）[cite: 6]。

### 2.3 产品中心 (Product Center)
- **7 个独立分类页面**：`/products/pod`、`/products/airstream`、`/products/square`、`/products/container`、`/products/ny`、`/products/in-stock`、`/products/others`[cite: 6]。
- **多维度筛选机制**[cite: 6]：
  - 维度包含尺寸（长/宽）、造型、外部材质、玻璃位置等[cite: 6]。
  - **轴数逻辑**：轴数不作为筛选项，在卡片上标明 "Single Axle" 或 "Tandem Axle"[cite: 6]。
  - **排序**：默认按产品长度升序排列[cite: 6]。
  - **移动端抽屉**：点击“筛选”从底部滑出，实时更新“查看结果（共 X 款）”，带“重置”与“关闭”按钮[cite: 6]。
- **In Stock 现货聚合页**：仅拉取后台 `stock_status = "In Stock"` 的产品[cite: 6]。若为空，展示兜底提示：“*Currently no units in stock. Please contact us for custom orders.*”[cite: 6]
- **参数对比表格**：分类页底部提供对比表格；卡片提供“加入对比”勾选框，选中平滑滚动 (Smooth Scroll) 至对比区[cite: 6]。

### 2.4 解决方案 (Solutions)
- **场景分类**：咖啡店 Coffee Shop、快餐 Fast Food、冰淇淋 Ice Cream、移动酒吧 Mobile Bar、夜市摊位 Night Market[cite: 6]。
- **内容配置**：场景图 + 推荐车型 + 标准设备清单 + CTA 按钮（点击携带方案参数跳转至联系表单）[cite: 6]。

### 2.5 关于我们 & 博客 (About Us & Blog)
- **关于我们**：工厂数据（面积、年产量、技师数、出口国） + 生产流程可视化 + 资质认证 + 客户 Logo 墙[cite: 6]。
- **博客**：支持分类筛选（All, Buying Guide, Industry News, Case Study）[cite: 6]，详情页支持 Markdown 格式解析[cite: 6]。

### 2.6 联系我们与询盘表单 (Contact & Leads)
- **URL 参数自动解析**：识别 `?product=xxx` 或 `?solution=xxx` 并自动填充“感兴趣的产品/方案”[cite: 6]。
- **防垃圾邮件系统**：集成 **Google reCAPTCHA v3** / **Cloudflare Turnstile** + 后端 HoneyPot 蜜罐隐藏字段[cite: 6]。

---

## 3. 技术架构、SEO 与多语言

### 3.1 渲染架构 (SSG / SSR)
- **硬性禁止 SPA/CSR**：严禁采用纯前端动态渲染多语言[cite: 6]。必须使用 **Next.js (SSG/ISR)** 或 **Astro** 进行预渲染，为每个语种编译独立 HTML 文件[cite: 6]。
- **URL 结构**[cite: 6]：
  - 英文（主）：`https://chrismachinery.com/products/pod/`[cite: 6]
  - 西语：`https://chrismachinery.com/es/products/pod/`[cite: 6]
  - 法语：`https://chrismachinery.com/fr/products/pod/`[cite: 6]
  - 阿拉伯语：`https://chrismachinery.com/ar/products/pod/`[cite: 6]
- **Hreflang 配置**：全站 `<head>` 注入多语言互链 `<link rel="alternate" hreflang="..." />` 标签[cite: 6]。

### 3.2 Schema.org 结构化数据 (JSON-LD)
所有产品详情及分类页必须输出符合 Google Rich Results 标准的 JSON-LD 代码[cite: 6]：
```json
{
  "@context": "[https://schema.org/](https://schema.org/)",
  "@type": "Product",
  "name": "Airstream 4000 Food Trailer",
  "image": ["[https://chrismachinery.com/images/products/airstream-4000.jpg](https://chrismachinery.com/images/products/airstream-4000.jpg)"],
  "description": "Premium stainless steel classic Airstream style food trailer.",
  "sku": "CM-AS-4000",
  "brand": { "@type": "Brand", "name": "Chris Machinery" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "8500",
    "highPrice": "15000",
    "availability": "[https://schema.org/InStock](https://schema.org/InStock)"
  }
}