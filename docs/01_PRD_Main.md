# Chris Machinery 网站需求文档

## 1. 整体风格
### 1.1 Logo
- 使用现有Logo（黑色线条+浅黄底）
- Logo图片会单独提供
### 1.2 颜色
- 主色：黑 #1A1A1A
- 辅色：亮黄 #F5C518
- 背景：白色 #FFFFFF
- 深色区块：#111111
- 正文文字：#4A5568
### 1.3 字体
- 标题：Montserrat（Bold）
- 正文：Inter（Regular）
- 全部从 Google Fonts 免费加载

### 1.4 参考网站
- https://saltrino.com/
- https://prestigefoodtrucks.com/
- https://concessionnation.com/
- https://chrismachinery.com/

### 1.5 兼顾移动端/mac端的显示

- 1.5.1 响应式断点策略 (Responsive Breakpoints)

网站需采用响应式设计，适配不同屏幕尺寸，主要断点定义如下：

Mac/桌面端 (Desktop): ≥ 1200px（保持原有三栏或两栏布局）

平板 (Tablet): 768px - 1199px（布局自动调整为单列或双列，筛选栏收起）

移动端 (Mobile): < 768px（全面启用移动端专属交互，如底部抽屉、汉堡菜单）

- 1.5.2 Mac端 (Desktop) 显示优化

字体渲染: 针对 Mac 系统的 Retina 高分屏，确保 SVG 图标和图片资源使用 2x 版本，防止模糊；

利用 font-smoothing: antialiased 优化 Inter 和 Montserrat 字体的渲染效果。

导航与 hover 态: Mac 用户主要使用鼠标操作，需确保所有可点击元素（如按钮、卡片）有明确的 :hover 视觉效果（如轻微放大、阴影加深或颜色变化）。


布局对齐: 严格按照 Grid 网格系统进行对齐，确保大屏下的留白（Padding/Margin）视觉舒适，避免内容过于分散。

- 1.5.3 移动端 (Mobile) 专属交互规范

筛选面板: 如 2.2.2.2.6 所述，移动端筛选改为底部抽屉式菜单，避免遮挡内容。

导航菜单: 顶部导航在移动端折叠为“汉堡菜单”（☰），点击后从右侧或底部滑出全屏/半屏导航层。

触控友好: 所有按钮、链接、表单控件的最小点击区域不得小于 44x44px，防止误触。

手势支持: 产品详情图支持左右滑动切换；在“动手定制”页面支持双指缩放查看 SVG 拖车细节。

- 1.5.4 兼容性要求

浏览器: 需兼容 Mac 端最新的 Safari、Chrome、Firefox 以及移动端的 Safari (iOS) 和 Chrome (Android)。

性能: 移动端需特别注意图片懒加载和资源压缩，确保在 4G 网络下首屏加载时间不超过 3 秒。

- 💡 扩展思路解析（供参考）：

区分 Mac 和 Mobile：Mac 端通常指桌面端的大屏体验，强调视觉和 Hover 交互；Mobile 端强调触控和空间节省。

呼应前文：这里提到的“筛选面板”直接引用了之前在 2.2.2.2.6 中定义的移动端筛选规则，保持文档的一致性。

落地性：加入了“44x44px 点击区域”、“Retina 图片”、“首屏加载 3 秒”等开发能直接执行的硬性指标。
## 2. 页面结构
### 2.1 首页
- Banner：

使用高清白底产品大图，迅速抓住眼球，无声突出产品质量。

内容：搭配品牌核心口号（Slogan）及明确的CTA（行动呼吁）按钮（如：View Products / Get a Quote）。
- 核心优势 (Core Advantages): 

展示4-5个核心卖点，采用图标+简短文字的形式（例如：1年质保、24小时快速报价、热镀锌底盘、定制化服务等）。

作用：快速告诉买家为什么选择我们。
- 热门产品 (Hot Products): 

展示5个热卖系列：Pod / Airstream / Square / Container / NY

视觉要求：每个型号使用一张高质量的白底产品图代表。

内容：包含产品名称及简短描述，点击可进入对应的产品中心页面。

- 客户好评展示 (Testimonials):

展示3-4条精选的客户评价。

内容：包含评价文字、客户名字、所在国家（可配合国旗图标）。

作用：建立真实信任感，打消买家顾虑。

- 全球足迹 (Global Footprint)：
    - 视觉形式：静态世界地图（建议输出 2x 倍率 SVG 或 2880px 宽 PNG），灰底 #E0E0E0 大陆轮廓，已发货国家用亮黄 #F5C518 实心圆点标注，悬停（桌面端）显示国家名+台数。
    - 无缩放/平移/点击钻取；整张图作为单图块放入首页，alt 文本写 "Chris Machinery food trailers shipped to USA, UK, UAE, Romania, Switzerland and 30+ countries"。
    - 若后期需要国家级案例入口，可在地图下方放一排国家文字链接（如 USA / UK / UAE → /cases.html?country=xxx），不依赖地图自身交互。

- 公司简介引导 (About Us Teaser):

展示一小段精简的品牌故事或工厂介绍。

包含“了解更多 (Learn More)”按钮，点击跳转至“工厂实力”或“关于我们”页面。
### 2.2 产品中心
#### 2.2.1 产品分类页面（共7个独立页面）
每个页面代表一个产品系列，拥有独立的URL（如 /products/pod.html），专注于展示该系列的详细信息。

- Pod
- Airstream
- Square
- Container
- NY
- In Stock
- Others
#### 2.2.2 页面结构与功能
每个产品分类页面应包含以下内容：

- 2.2.2.1 分类标题与简介

清晰标明该系列的名称（如：Airstream Series Food Trailers）。
简短的描述，突出该系列的特点和优势（如：经典流线型设计，高端商业空间首选）。

-  2.2.2.2 筛选功能区（核心功能，参考附件 Airstream分类.html）

除 In Stock 与 Others 外，每个产品分类页面应具备筛选功能，帮助客户缩小范围，精准找到所需产品。筛选后的产品卡片按长度从小到大排列。

不同产品的筛选维度不同，具体如下：

##### 2.2.2.2.1 Pod
- 宽度/mm：1650 / 2000
- 长度/mm：2300 / 2500 / 2800 / 2900 / 3000 / 3200 / 3400 / 3800 / 3900 / 4000 / 4500 / 5000
- 造型：圆顶 / 方顶
- 轴数处理说明：轴数不作为筛选维度。同一尺寸（如3000×2000）可同时存在「单轴版」和「双轴版」两条产品记录，各自在产品卡片上以标签形式标注 "Single Axle" 或 "Tandem Axle"。这样用户先选尺寸和造型，看到结果后自行选择适合的轴数配置。
##### 2.2.2.2.2 Airsteam
- 宽度/mm：2200
- 长度/mm：3000 / 3500 / 3800 / 3900 / 4000 / 4500 / 5000 / 5500 / 5800 / 6000 / 6500 / 7000
- 造型：700弧度 / 500弧度 / 350弧度
- 外部材质：不锈钢 / 喷漆
- 轴数处理说明：轴数不作为筛选维度。同一尺寸（如3000×2000）可同时存在「单轴版」和「双轴版」两条产品记录，各自在产品卡片上以标签形式标注 "Single Axle" 或 "Tandem Axle"。这样用户先选尺寸和造型，看到结果后自行选择适合的轴数配置。
##### 2.2.2.2.3 Square
- 宽度/mm：2200
- 长度/mm：2800/ 2900 / 3000 / 3500 / 3800 / 3900 / 4000 / 4500 / 5000 / 5500 / 5800 / 6000 / 6500 / 7000
- 外部材质：喷漆
- 轴数处理说明：轴数不作为筛选维度。同一尺寸（如3000×2000）可同时存在「单轴版」和「双轴版」两条产品记录，各自在产品卡片上以标签形式标注 "Single Axle" 或 "Tandem Axle"。这样用户先选尺寸和造型，看到结果后自行选择适合的轴数配置。
##### 2.2.2.2.4 Container
- 宽度/mm：2200
- 长度/mm：4500 / 5000 / 5500 / 5800 / 6000
- 外部材质：喷漆
##### 2.2.2.2.5 NY
- 宽度/mm：2200
- 长度/mm：3900 / 4000 / 4500 / 5000 / 5500
- 玻璃数量：1个，车子前部 / 2个，车子前后
- 玻璃高度：台面上 / 台面下
- 外部材质：喷漆 / 不锈钢
##### 2.2.2.2.6 In Stock（现货聚合页，无筛选）
- **定位**：跨系列聚合所有库存车辆，强调"可立即发货"。
- **展示逻辑**：无筛选条件，后台有什么库存就展示什么，卖完自动消失。
- **排序**：默认按长度升序，顶部提供简单排序条（长度 / 价格 / 最新入库）。
- **卡片字段**：同 2.2.2.4，但"获取报价"按钮文案改为 "Buy This Unit / Get Quote"。
- **数据来源**：
  - 数据由产品管理后台（CMS / Admin Panel）中的 **库存状态 (Stock Status)** 字段控制。
  - 可选值：`In Stock` / `Out of Stock` / `Made to Order`。
  - In Stock 页面仅拉取 `stock_status = "In Stock"` 的产品。当后台将该字段改为 `Out of Stock` 或 `Made to Order` 时，该产品自动从本页消失。
  - 字段维护由运营人员在后台录入新产品或更新库存时同步修改。
- **兜底提示**：若当前无任何产品处于 `In Stock` 状态，页面顶部显示："Currently no units in stock. Please check our standard product lines or contact us for custom orders."


##### 2.2.2.2.7 Others（非标与定制案例，无筛选）
- 定位：展示非标定制案例、特殊车型、展会样车。
- 展示：大图卡片 + 一句场景描述，点击进案例详情（图片轮播+文字）。
- 排序：按年份倒序，无筛选维度。

##### 2.2.2.2.8 移动端筛选适配

- 交互方式：在移动端（屏幕宽度 < 768px）下，筛选面板改为**底部抽屉式菜单**，点击“筛选”按钮从底部滑出，而非桌面端的侧边栏或顶部固定栏。
- 折叠与展开：筛选条件默认收起，仅显示当前已选条件摘要。点击任一条件类别展开该维度的选项列表。
- 实时计数：每次勾选/取消一个筛选条件，底部抽屉的“查看结果”按钮上实时更新匹配产品数量（如“查看结果（共 12 款）”）。
- 关闭与重置：抽屉顶部提供“重置”按钮和“关闭”按钮，关闭后保留当前筛选状态，不自动清空。


-  2.2.2.3 交互逻辑：

筛选按钮点击后高亮激活。

适用于 Pod/Airstream/Square/Container/NY 五个系列页，多个筛选条件可同时组合使用。

实时更新下方产品卡片的显示/隐藏。

显示当前筛选条件的摘要和匹配的产品数量（如：“当前筛选: Medium × Stainless × Wood × Dome — 共 2 款”）。

若无匹配结果，显示友好的“未找到匹配产品，请调整筛选条件”提示。

-  2.2.2.4 产品卡片网格

以卡片网格形式展示该系列下的具体车型。

每张卡片应包含：

产品高清白底图。

产品名称/型号。

关键规格标签（如尺寸、材质）。

核心参数表格（参考附件中的spec-table）。

一个醒目的“获取报价 (Get Quote)”按钮，点击后跳转到询盘表单页面，并可自动带入产品信息。

排序规则：产品卡片默认按**长度从小到大**排列。后续可扩展增加按价格、按热度等排序选项。


-  2.2.2.5 参数对比表格

- **在每个分类页面底部，放置一个针对该系列所有车型的参数对比表格。**
方便客户在同一系列内进行横向比较，做出最终决定。

- **在产品卡片上增加“加入对比”勾选框（最长对比 3 款车型），点击后页面自动平滑滚动（Smooth Scroll）至底部对比区并高亮对应数据，提升比价效率**，适用于不同页面交叉对比。
### 2.3 解决方案

- 行业分类导航：按应用场景分类（如：咖啡店 Coffee Shop / 快餐小吃 Fast Food / 冰淇淋冰淇淋店 Ice Cream / 移动酒吧 Mobile Bar / 夜市摊位 Night Market）。
- 场景化展示：每个分类下配有高清场景图（如餐车在街头运营的真实照片）。
- 方案详情：
推荐车型（链接到产品中心）。
标准设备清单（Standard Equipment List：如水槽、操作台、电路系统）。
定制建议（Customization Advice：如品牌LOGO喷涂、特殊设备安装）。
CTA 按钮：每个方案卡片底部需有醒目的亮黄色“获取该方案报价 (Get Solution Quote)”按钮，点击后跳转至联系页面并携带方案名称参数。

### 2.4 关于我们
- 核心数据展示区：

工厂面积 (Factory Area: e.g., 5000㎡)。

年产量 (Annual Output: e.g., 200+ Units)。

资深技师数量 (Skilled Technicians: e.g., 50+)。

出口国家数量 (Countries Exported: e.g., 30+ Countries)。

- 生产流程可视化：

图文展示 5-6 个核心生产步骤（设计 Drafting → 切割 Cutting → 焊接 Welding → 打磨 Polishing → 喷漆 Painting → 质检 QC）。
- 资质与认证：展示 ISO、CE 等相关认证图标。

- 实景视频/图片：车间实拍、原材料堆放区、成品展示区（图片需高清，可支持点击放大查看）。

- 信任背书：客户Logo墙（展示合作过的知名品牌）。

### 2.5 动手定制

- 功能概述：这是一个完整的双页面食品拖车定制系统，客户可以在浏览器中直接使用，无需安装任何软件。
- 定制步骤：先确认产品系列 ； 再选取产品尺寸 ； 之后跳出设计好空车平面图 ；选取定制模块 ； **发送询盘**
- **发送询盘逻辑**：
    - 点击“发送询盘”按钮，系统会将用户选择的**所有定制参数**（包括颜色代码、Logo图片、设备清单及自动计算的总价）打包。
    - 页面会跳转到 `2.6 联系我们` 页面的询盘表单，并自动将这些参数填充到“留言内容 (Message)”字段中，方便用户补充其他信息后一键提交。
    - 这确保了定制需求和普通询盘需求都能汇总到同一个后台，方便销售跟进。
- 3大功能定制模块：
  
  颜色（30+ 预设色卡 + HEX/RAL 色号输入 + 原生取色器，主色/辅助色双色配置，实时预览） 
  
  Logo内容（自定义品牌名 + 4种字体风格 + 6个预设模板 + 图片上传 + 字号调节）；仅支持 JPG/PNG/WEBP 格式，文件上限 2MB，且上传后需通过后端压缩/清洗再合成至 PDF 报价单中

  厨房设备 （20种专业设备（7大类），多选勾选，自动计算价格）

- 定制完成后，前端只需将配置参数（JSON）传给后端，由后端生成 PDF 格式的报价单（Quote PDF）并发送邮件给客户，前端仅做基础的预览
- 🔄 拖车预览​
SVG矢量拖车实时展示定制效果，支持旋转/缩放 ；建议: 需要对SVG进行性能优化。对于Logo上传，可以限制文件大小（如不超过2MB）和分辨率。同时，可以考虑使用Canvas替代部分复杂的SVG渲染，以获得更好的性能表现。

### 2.6 Blog
- **页面定位**：内容营销中心，用于发布行业资讯、产品选购指南、客户案例等，提升SEO流量。
- **列表页 (Blog List)**：
    - 布局：卡片网格形式，每张卡片包含：特色图片、文章标题、发布日期、简短摘要。
    - 分类筛选：顶部设有分类标签（如：All, Buying Guide, Industry News, Case Study），点击可筛选文章。
    - 排序：默认按发布时间倒序排列（最新文章在前）。
- **详情页 (Blog Post)**：
    - 结构：大图 Banner + 文章标题 + 发布日期 + 作者 + 正文内容。
    - 正文支持：Markdown 格式解析，支持图片、列表、引用等富文本样式。
    - 社交分享：文章底部提供分享到 Facebook, Twitter, LinkedIn 的按钮。
    - 相关推荐：底部展示 3 篇相关文章，引导用户继续阅读。

### 2.7 联系我们
- 公司信息：

工厂地址（嵌入 Google Maps 地图插件，方便海外客户定位）。

邮箱、电话、WhatsApp、WeChat（二维码）。

Facebook / ins / Youtube 跳转图标。

工作时间（Working Hours: Mon-Fri, 9:00-18:00 Beijing Time）。
- 在线询盘表单（核心转化入口）：


    - **字段说明**：
        - 姓名 (Name) * [必填]
        - 邮箱 (Email) * [必填]
        - 电话 (Phone) [选填]
        - **感兴趣的产品/方案 (Interested Product) [选填]**：支持通过 URL 参数自动填充。例如，当用户从产品页点击“获取报价”跳转到 `/contact.html?product=pod-3000-single` 时，该字段会自动填入 "Pod 3000 Single Axle"。
        - 留言内容 (Message) * [必填]
        - 国家 (Country) [选填，建议通过 IP 自动识别]
        - 预算 (Budget) [选填]
    - 提交按钮：亮黄色背景，黑色文字“发送询盘 (Send Inquiry)”。
    - 提交成功后显示“Thank you! We will get back to you within 24 hours.”提示。
    - **后端逻辑**：该表单需与“动手定制”页面的发送功能共用同一接口，确保数据格式统一。
    - **集成 Google reCAPTCHA v3 或 Cloudflare Turnstile（无感知验证码），并在后端做 HoneyPot（蜜罐字段）防护，确保销售团队收到的都是高质量真实询盘。**
- FAQ 区域（放置在页面底部）：
- 内容待补充（上线前填充），预留以下话题方向的问答空间：
    - 交货周期 (Lead Time)
    - 最小起订量 (MOQ)
    - 付款方式 (Payment Terms)
    - 运输方式 (Shipping Method)
    - 保修政策 (Warranty Policy)
    - 能否参观工厂 (Factory Visit)
- 格式：每条 FAQ 采用折叠展开式（点击问题→展开答案），预留 6-10 条问答位。
- 当前阶段：仅搭建 FAQ 区域的 HTML 结构和样式，内容留空，标注占位符 `【TEXT: FAQ-Q1】` `【TEXT: FAQ-A1】` 等，上线前统一替换。
## 3. 功能需求
### 3.1 多语言
- 支持语种：
默认语言：英语 (English)。
扩展语种：西班牙语 (Spanish)、法语 (French)、阿拉伯语 (Arabic) —— 考虑到这些地区的餐车市场需求较大。
切换控件：
- 位置：顶部导航栏最右侧。
形式：国家旗帜图标 + 语言名称下拉菜单（或点击图标弹出语言选择框）。
- 实现方式：
推荐使用 i18next 或类似前端国际化库，将文案存储在 JSON 文件中，实现无刷新切换。
确保 URL 结构支持多语言（如：/en/products/pod，/es/products/pod），有利于 SEO。
- 内容同步：
产品参数、解决方案、博客文章等需准备好对应语种的翻译文本。
图片中的文字（如产品卡片上的 "Single Axle"）尽量使用通用图标。
- 严禁使用纯前端 SPA（CSR）动态切换语言。必须结合 Next.js (App Router / SSG) 或 Astro 等技术进行预渲染，确保 Google 抓取 /es/ 或 /fr/ 页面时直接拿到对应语种的 HTML 源码，否则多语言的 SEO 效果会打折扣。
## 4. 内容素材清单
导航栏链接从左到右排列顺序：首页 → 产品中心 → 解决方案 → 关于我们 → 动手定制 → 博客 → 联系我们
- 4.1图片占位规则
网站中所有需要图片的位置，在开发阶段一律使用占位符，后期统一替换。

占位方式：
使用纯色灰底方块 + 居中文字标注，格式为 [图片: 用途说明]，例如：[图片: 首页Hero Banner - 高清白底餐车全景图][图片: 工厂车间实拍 - 焊接工位][图片: Pod系列 - 3000×2000 单轴圆顶款白底图]

灰底色值：#E0E0E0，文字颜色：#999999，字号：14px，居中显示。
图片命名规范（后期替换时遵循）：产品图：产品系列_尺寸_轴数_造型_材质.jpg（如pod_3000x2000_single_dome_stainless.jpg）
场景图：场景_描述.jpg（如：factory_welding.jpg、showroom_airstream.jpg）
Logo：logo_chris_machinery.png（透明背景 PNG 格式）
Favicon：favicon.ico（32×32px）

图片规格要求：
产品白底图：背景纯白 #FFFFFF，长边不低于 2000px，JPG 格式，质量 85% 以上。
Banner 图：宽高比 16:9 或 21:9，不低于 1920px 宽。
场景/工厂图：长边不低于 1600px，JPG 格式。


建议: 必须全面实施图片懒加载（Lazy Loading）。这不仅是为了提升首屏加载速度，也是为了节省用户的流量。可以使用 <img loading="lazy"> 属性或专门的JavaScript库来实现。
- 4.2 链接占位规则
网站中所有需要插入链接的位置，在开发阶段使用特殊标记，后期替换为真实 URL。

标记格式：使用全大写 【LINK: 描述】 作为占位标记。
颜色：亮黄色 #F5C518，加粗，带下划线，鼠标悬停显示提示文字。
点击后暂时不跳转（href 设为 javascript:void(0)），并弹出 alert('链接待替换：【LINK: 描述】') 方便测试。

- 4.3 占位符全局搜索关键词

为了方便后期批量查找和替换，统一使用以下关键词：

图片占位：搜索 img-placeholder 或 [图片: 即可定位所有图片占位位置。

链接占位：搜索 【LINK: 即可定位所有链接占位位置。

文本占位：搜索 【TEXT: 可标记尚未确定的文案内容（如具体地址、营业执照号等）。

- 4.4 需要预留链接的位置清单

| 位置 | 占位标记示例 | 后期替换为 |
|------|-------------|-----------|
| 顶部导航栏 | `【LINK: 首页】` `【LINK: 产品中心】` `【LINK: 解决方案】` `【LINK: 关于我们】` `【LINK: 动手定制】``【LINK: 博客文章】` `【LINK: 联系我们】` | 对应页面 URL |
| 首页 Hero CTA | `【LINK: 询盘入口】` | `#inquiry` 锚点或 `/contact.html` |
| 首页热门产品 | `【LINK: Pod系列页】` `【LINK: Airstream系列页】` 等 | 对应系列页面 URL |
| 首页全球足迹 | `【LINK: 客户案例页】` | `/cases.html` |
| 产品卡片"获取报价" | `【LINK: 询盘表单-Pod-3000单轴】` | `/contact.html?product=pod-3000-single` |
| 解决方案 CTA | `【LINK: 询盘表单-咖啡方案】` | `/contact.html?solution=coffee` |
| 页脚联系方式 | `【LINK: WhatsApp】` `【LINK: Email】` `【LINK: WeChat】` | 真实联系方式链接 |
| 页脚社交媒体 | `【LINK: Facebook】` `【LINK: Instagram】` `【LINK: YouTube】` `【LINK: LinkedIn】` | 对应社交平台 URL |
| 博客文章 | `【LINK: 博客-选购指南】` | `/blog/buying-guide.html` |
| 动手定制 | `【LINK: Customize your own】` | `/customizeyourown.html` |

## 5.技术交付验收对照表（Checklist）


> **使用说明**：本文档用于前端、后端及测试团队在交付各阶段成果时进行对照验收。全部勾选确认后方可部署上线。

---

## 1. 响应式与性能规范 (Responsive & Performance)

- [ ] **1.1 断点适配 (Breakpoints)**
  - [ ] Desktop (≥1200px)：保持标准网格与多栏布局，视觉留白舒适。
  - [ ] Tablet (768px - 1199px)：自动调整为单列/双列，筛选侧边栏收起。
  - [ ] Mobile (<768px)：启用汉堡菜单（☰）及底部抽屉式筛选。
- [ ] **1.2 触控与 Mac 显示 (Touch & Retina)**
  - [ ] 移动端所有可点击元素（按钮、表单、链接）点击区域 $\ge 44 \times 44\text{px}$。
  - [ ] Mac Retina 屏下 SVG 图标与图片资源无模糊（提供 @2x 或 SVG）。
  - [ ] 鼠标悬停（:hover）有明确的视觉反馈（缩放、阴影或变色）。
- [ ] **1.3 性能与加载 (Performance)**
  - [ ] 移动端 4G 网络环境下首屏加载时间（LCP） $< 3$ 秒。
  - [ ] 全站图片开启原生懒加载 (`loading="lazy"`)。
  - [ ] 产品白底图、 Banner 图按文档要求格式及尺寸压缩，无超大未压缩资源。

---

## 2. 页面功能与交互 (Pages & Features)

- [ ] **2.1 首页 (Homepage)**
  - [ ] 全球足迹静态地图：2x SVG / 2880px 宽度 PNG，Hover 显示国家名及台数，图片 `alt` 文本正确配置。
  - [ ] 热门产品卡片点击可正常跳转至对应分类页。
- [ ] **2.2 产品中心 (Products)**
  - [ ] 五大系列（Pod/Airstream/Square/Container/NY）筛选逻辑正常，多条件组合实时更新卡片与匹配数量。
  - [ ] 无匹配结果时显示友好的提示文案。
  - [ ] 卡片默认按产品长度从小到大排列。
  - [ ] 移动端筛选面板以底部抽屉方式滑出，含“重置”、“关闭”及带实时计数的“查看结果”按钮。
  - [ ] `In Stock` 现货页仅展示 `stock_status = "In Stock"` 产品，无匹配时展示兜底提示。
- [ ] **2.3 动手定制系统 (Interactive Customizer)**
  - [ ] 颜色选配（预设色卡/HEX/RAL/原生取色器）与 Logo 自定义可实时反应在拖车预览图上。
  - [ ] 选配设备列表勾选后价格实时自动计算。
  - [ ] **草稿保护**：支持 `localStorage` 自动保存草稿，防止误刷新丢失配置。
  - [ ] **数据透传**：点击“发送询盘”后，打包定制 JSON 数据并通过 `sessionStorage` 传递至联系我们表单，并自动填充至 `Message` 框。
  - [ ] **安全校验**：Logo 上传限制格式（PNG/JPG/WEBP）及大小（$\le 2\text{MB}$）。
  - [ ] 后端正确接收 JSON 参数并合成 PDF 报价单。
- [ ] **2.4 联系表单与防垃圾邮件 (Contact Form & Anti-Spam)**
  - [ ] URL 参数解析：支持通过 `?product=xxx` 或 `?solution=xxx` 自动填充“感兴趣的产品/方案”。
  - [ ] 集成 **Google reCAPTCHA v3** 或 **Cloudflare Turnstile** 无感验证码及 HoneyPot 蜜罐防护。
  - [ ] 提交成功后提示：“Thank you! We will get back to you within 24 hours.”。

---

## 3. SEO 与多语言 (SEO & i18n)

- [ ] **3.1 路由与预渲染**
  - [ ] 采用路由式多语言结构（如 `/en/products/pod`, `/es/products/pod`）。
  - [ ] 采用服务端预渲染（SSR/SSG），避免纯前端 CSR 渲染导致搜索引擎无法抓取多语言页面。
- [ ] **3.2 SEO 基础配置**
  - [ ] 每个产品页、方案页及 Blog 文章均有独立的 `<title>` 及 `<meta description>`。
  - [ ] HTML Header 自动植入正确的 `hreflang` 标签。

---

## 4. 占位符与规范检查 (Placeholders Check)

- [ ] **4.1 占位替换完成**
  - [ ] `img-placeholder` 或 `[图片:` 全局搜索无遗留，已替换为真实压缩图。
  - [ ] `【LINK:` 占位符已全部替换为真实 URL，无跳转弹窗测试代码残留。
  - [ ] `【TEXT:` 文案占位符（如 FAQ 区域）已统一填充真实信息。
## 6.补充内容
一、 针对【第3点:SEO、多语言与结构化数据】的修改规范
原文档中 3.1 多语言 仅约定了前端国际化库(i18next)与语言切换控件,未对搜索引擎抓取及 SSR 渲染架构作出
限制。现作如下系统性修订:
3.2 多语言架构与 SEO 渲染规范(新增章节)
1. 技术栈与渲染模式(架构定型)
B2B SEO 刚性要求: 禁止使用纯前端 SPA(如 Vue/React 单页应用 + JS 动态渲染)来实现多语言,防范
Googlebot 抓取延迟或无法解析的问题。
推荐方案: 采用 Next.js (SSG/ISR) 或 Astro。采用静态路由生成(SSG)或预渲染模式,每个语种生成独立的
物理 HTML 文件。
URL 规范: 采用子目录结构。
英文(主):https://chrismachinery.com/products/pod/
西班牙语:https://chrismachinery.com/es/products/pod/
法语:https://chrismachinery.com/fr/products/pod/
阿拉伯语:https://chrismachinery.com/ar/products/pod/
Hreflang 标签: 每个页面的 <head> 中必须注入全量多语言互链映射,指引搜索引擎做区域定位。
Head Hreflang Tag Implementation Template
<!-- 示例:放在 /products/pod.html 的 <head> 中 -->
<link rel="alternate" hreflang="en" href="https://chrismachinery.com/products/pod/" />
<link rel="alternate" hreflang="es" href="https://chrismachinery.com/es/products/pod/" />
<link rel="alternate" hreflang="fr" href="https://chrismachinery.com/fr/products/pod/" />
<link rel="alternate" hreflang="ar" href="https://chrismachinery.com/ar/products/pod/" />
<link rel="alternate" hreflang="x-default" href="https://chrismachinery.com/products/pod/" />
2. 自动化 TDK(Title, Description, Keywords)配置规范
在后台/CMS 中每个产品分类、单个产品、博客文章及解决方案页面,均需开放独立的 TDK 编辑入口。前端读取变
量动态注入:


Page 1 of 4

页面类型 Title 模板格式 Meta Description 模板格式

产品分类页

{Series Name} Food Trailers
for Sale | Custom
Manufacturer - Chris
Machinery

Explore our {Series Name} food trailers.
Available in {Size Range}, {Material Options}.
Direct factory price, CE certified. Get a
quote today!

产品详情/卡片

{Model Name} ({Size} {Axle})
Food Trailer - Chris
Machinery

Buy {Model Name} custom food trailer ({Size},
{Shape}, {Material}). Heavy duty chassis,
fully equipped kitchen available. Fast
shipping worldwide.

解决方案页

Custom {Solution Name}
Trailer Solutions &
Equipment - Chris Machinery

Turnkey {Solution Name} trailer setup
including commercial equipment, floor plan
layout, and custom branding. Request free
proposal.

3. Schema.org 结构化数据 (JSON-LD) 注入
在产品详情与分类页必须输出符合 Google Rich Results 标准的 Schema markup,以提升富文本搜索结果曝光度:
Schema.org Product Markup JSON-LD
<script type="application/ld+json">
{
"@context": "https://schema.org/",
"@type": "Product",
"name": "Airstream 4000 Food Trailer",
"image": [
"https://chrismachinery.com/images/products/airstream-4000.jpg"
],
"description": "Premium stainless steel classic Airstream style food trailer, 4000mm
length.",
"sku": "CM-AS-4000",
"mpn": "AS4000-2026",
"brand": {
"@type": "Brand",
"name": "Chris Machinery"
},
"offers": {
"@type": "AggregateOffer",
"priceCurrency": "USD",
"lowPrice": "8500",
"highPrice": "15000",
"offerCount": "1",
"availability": "https://schema.org/InStock",
"itemCondition": "https://schema.org/NewCondition"
}
}
</script>

Page 2 of 4

二、 针对【第4点:后台管理系统 CMS】的修改规范
原 PRD 缺少对运营人员后台操作逻辑的明确约束。现新增 第5章 后台管理系统 (CMS / Admin Panel) 需求:
5.1 后台核心功能模块定义(新增章节)
1. 产品与库存状态管理(Product & Stock Management)
字段控制: 后台每个产品包含专属字段 stock_status(枚举值:In Stock / Made to Order / Out of
Stock)。
现货自动上下架:
当设置为 In Stock 时,前台 2.2.2.2.6 In Stock 现货聚合页 自动拉取该产品,并展示 "Buy This Unit
/ Get Quote" 按钮。
当修改为 Made to Order 或 Out of Stock 时,该产品即刻从现货页移除,但不影响其在普通系列分类页
(如 Pod / Airstream 页)的正常展示。
关键规格字段绑定: 必须支持针对 长度(mm)、宽度(mm)、造型、外部材质、轴数(Single/Tandem) 等字段的
标准化勾选,直接联动前台的 2.2.2.2 筛选功能区。
2. 询盘归集与线索追踪系统(Leads & Inquiry CRM)
所有来自普通表单、方案页 CTA、现货页 CTA 以及“动手定制”页面的询盘必须统一汇总至后台 Leads 管理模块:
字段名称 数据类型 来源/采集规则
Inquiry ID String (Auto) 自动生成唯一编号(如 INQ-20260820-001)
Customer Info JSON / Object Name, Email, Phone, Budget, Message
Source URL String 客户提交表单时的完整 URL (含 Query Parameters)
Target Product String 解析 URL 中的 product 或 solution 参数(如 pod-3000-single)
Custom Config

JSON
(Optional)

如来自“动手定制”页,记录:颜色代码、Logo文件名、所选设备清单、估算
总价

Geo IP &
Country

String 根据请求 IP 自动识别的国家和城市(如 United States (US))

3. 实时通知与邮件抄送 API
当新询盘进入时,后台需触发 SMTP / SendGrid API,向销售团队指定邮箱(如
sales@chrismachinery.com)实时发送带有完整询盘参数和预估配置信息的邮件通知。
必须同时支持配置 Webhook,以便后期无缝整合至 Hubspot 或 Salesforce 等第三方 CRM 系统。
三、 VS Code 项目结构及文件修改指引
请前端与后端工程师按照以下工程结构在 VS Code 中进行目录建构及 Markdown 文件的增补:
VS Code Project Directory Structure


Page 3 of 4

chris-machinery-prd/
├── docs/
│ ├── 01_PRD_Main.md # 原始需求文档
│ ├── 02_PRD_SEO_and_SSR.md # [新增] 本补充文档一:SEO与SSR规范
│ └── 03_PRD_CMS_and_Leads.md # [新增] 本补充文档二:CMS与询盘规范
├── src/
│ ├── components/
│ │ ├── SEO/
│ │ │ └── JsonLd.tsx # Schema markup 封装组件
│ │ ├── Filter/
│ │ │ └── MobileDrawer.tsx # 移动端底部抽屉筛选
│ │ └── Customizer/
│ │ └── CanvasPreview.tsx # 定制页面预览模块
│ └── locales/ # 多语言静态 JSON 目录
│ ├── en.json
│ ├── es.json
│ ├── fr.json
│ └── ar.json
└── README.md