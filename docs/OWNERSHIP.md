# 按三位成员分工的 p5.js 文件说明

所有作品脚本都在项目根目录，与参考目录保持一致；直接通过 `index.html` 的 `<script>` 加载，不需要框架或打包器。

## Time-based — `time-based.js`

负责人：真实姓名待填。

- 对象：`TimeMechanic`。
- `open()`：开始开书；`turn(kind)`：开始翻页；`setNight/toggleNight()`：改变昼夜目标。
- `update(dt)`：推进秒数、封皮打开、书页渐显、翻页中点事件、春夏秋冬过渡、120 秒昼夜周期与手动覆盖期。
- 时间参数来自 `settings.js` 的 `ProjectConfig.time`，状态存放在 `Story`。
- 不绘制羊或草地，也不处理鼠标事件。输入成员请求动画，绘制层读取动画进度。

验证重点：开书期间封皮存在；落平后内容浮现；四季能完整循环；没有输入时昼夜仍推进；动画时长不依赖帧率。

## Perlin noise and randomness — `noise-random.js`

负责人：你，真实姓名待填。

本文件含两个有明确注释分区的对象：

1. **`Flock` 的数据与行为**：`create/findSpace/addAt/update` 管理羊的随机属性、尺寸、眼色、狼影、合法放置、避让、随机追逐参数、影子缓动和羊毛膨胀。
2. **`NoiseMechanic`**：`rand/range` 是独立种子随机序列；`newFlock` 刷新羊群；`releaseSheep/addCloud` 管理羊消失并变云；`update` 推进升空、Perlin 漂移、随机寿命、雨云选择、新羊成长和粒子回收。

羊、云和狼怎么画，位于共享 `renderer.js`；不要把绘制代码复制进个人机制。`Flock` 和 `NoiseMechanic` 的命中方法由 `user-input.js` 安装，输入与绘制共享同一份实体数据。

跨模块边界：长按多久由 User input 记录，是否允许变云及实体移除/生成由这里处理。云虽然使用 `dt`，但随机生命周期仍属于本机制。音乐只是布尔开关，不分析节拍。

验证重点：同种子复现、翻页刷新、噪声连续、拖动后继续漂移、变云起点连续、雨云生羊与消散同步、避免在天空/树/留声机上生成、云与粒子能回收。

## User input — `user-input.js`

负责人：真实姓名待填。

文件分为三段：

- **命中判断**：向 `Flock/NoiseMechanic` 安装 `hit()`，选择指针下的羊或云。
- **`Input` 手势与界面**：点击、长按、拖云、空白草地添羊、上下拖动昼夜、按钮、帮助面板、手势取消与录音带按钮定位。
- **p5 事件**：鼠标、触屏和键盘回调，按画布尺寸转换坐标，再请求对应机制。

输入层调用 `TimeMechanic` 开始时间动画，调用 `NoiseMechanic.releaseSheep` 变云，调用 `Flock.addAt` 添羊，调用 `MusicBox` 播放音乐，不重复实现其内部逻辑。

验证重点：点击和拖动互斥；长按只变云一次；无效位置不生羊；录音带按钮在开书前后及缩放后都可见、可点击；键盘和触屏可用。

## 共同维护的文件

| 文件 | 内容 |
| --- | --- |
| `renderer.js` | `Book`、`PaintedDesk`、`WoolPainter`，以及附加到 `Flock/NoiseMechanic` 的绘制方法；负责封皮、纸页、桌面摆件、草坡、树、羊、完整狼、云、雨线和粒子外观 |
| `settings.js` | `ProjectConfig` 参数、`Story` 状态、`SceneGeometry` 地形、`CassetteGeometry` 录音带坐标与按钮区域 |
| `music.js` | `MusicBox` 的三段原创旋律、播放/暂停/下一首与音频节点；不是第四种 Audio mechanic |
| `sketch.js` | `setup/draw/windowResized`，初始化、模块更新顺序、画布缩放和整合 |
| `index.html` / `style.css` | 页面入口、加载顺序、按钮、帮助面板和响应式样式 |
| `vendor/` | p5.js 与许可证，不是个人机制，不手改库代码 |
| `scripts/` / `tests/` | 开发工具和检查，不参与作品运行 |
| `docs/` / `README.md` | 职责、灵感、操作、AI 与出处声明、试验恢复说明 |
| `preview.html` | 自动生成的单文件体验版；不在这里分工编辑，应修改根目录源文件后重新生成 |

## 加载与一次交互的协作

`p5.js → settings.js → noise-random.js → time-based.js → renderer.js → user-input.js → music.js → sketch.js`。

- **翻页**：Input 识别页角 → Time 推进动画 → 中点切换季节或请求 Noise 刷新羊群 → Renderer 显示内容。
- **变云**：Input 累计长按并松手 → Noise 检查阈值、移除羊、生成云并持续更新 → Renderer 呈现变化。
- **音乐追逐**：Input 点击录音带 → MusicBox 改变状态 → Flock 更新轨迹 → Renderer 绘制四足狼。

共享绘制中的步态、闪烁和材质会读取时间或噪声，但不替代三位成员的机制实现。成员需要理解接口并自己完成设计与修改，不能用文件拆分冒充每人三次真实贡献。
