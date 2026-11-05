# 三位成员的代码分工与协作边界

## 1. Time-based：时间负责人（姓名待填）

编辑 `js/mechanics/time/time-mechanic.js`。负责 `TimeMechanic.open/turn/toggleNight/update`：累计秒数、开书进度、翻页中点切换事件、书页渐显、春夏秋冬过渡、120 秒自动昼夜、手动昼夜的覆盖期。

调参位置：`js/shared/config.js` 中 `time`。`Story` 的状态定义在 `js/shared/state.js`，绘制层读取这些进度显示画面。用户点击由 Input 接收，再请求时间模块开始动画；按钮属于 User input，动画何时结束属于 Time。

建议验证：开书封皮始终存在；落平后画面浮现；右翻页四季完整循环；不操作时昼夜仍随时间改变；不同帧率下动画时长一致。

## 2. Perlin noise and randomness：你的部分（姓名待填）

| 文件 | 需要掌握的内容 |
| --- | --- |
| `js/mechanics/noise-random/perlin-mechanic.js` | `rand/range` 独立种子、`newFlock`、`addCloud`、`releaseSheep`、`update`；噪声速度、升空、随机寿命/降雨、生羊与消散粒子 |
| `js/mechanics/noise-random/flock-model.js` | `create/findSpace/addAt/update`；个体随机属性、尺寸/狼影/眼色、河流与间距限制、音乐开关下的追逐、影子缓动、羊毛膨胀 |

Noise 模块决定实体的数据和行为，不负责画每一笔。它调用 `Flock.create/findSpace` 生成随机且有效的位置。`releaseSheep` 在长按达标时移除原羊并生成云。云由缓动升空进入 Perlin 漂移，最后四秒共享一个进度控制云消失与新羊长大。每帧使用的是连续噪声；个体外观参数只在创建时随机一次。

音乐只是布尔开关。追逐半径、速度、相位、眼色和跳跃参数来自随机个体属性；画面模块只读这些参数绘制。云也需要 `dt` 和秒数，但它的随机生命周期属于这套噪声/随机机制，不因使用时间就变成第四种机制。

建议验证：相同种子可复现；翻页改变布局；云漂移连续；拖云松开后继续漂；羊变云位置和大小连续；降雨处出现新羊且进度同步；长期运行能回收云和粒子。

## 3. User input：交互负责人（姓名待填）

| 文件 | 需要掌握的内容 |
| --- | --- |
| `js/mechanics/user-input/input-controls.js` | 手势状态、短按/长按、拖云、空白点击添羊、空白拖动昼夜、按钮、说明面板与取消操作 |
| `js/mechanics/user-input/p5-events.js` | p5 鼠标、键盘和触屏回调；将画布像素转换成场景坐标 |
| `js/mechanics/user-input/hit-testing.js` | 按位置判断指针命中了哪只羊或哪朵云 |

交互层发出请求：翻页交给 Time，变云交给 `NoiseMechanic.releaseSheep`，添羊交给 `Flock.addAt`，音乐交给 `MusicBox`。它记录长按多久，但不直接复制随机生成或云生命周期代码。

建议验证：点击草地与拖动昼夜互斥；点击河流不生羊；按住再松开只变一次云；窗口缩放后命中位置正确；取消手势不会留下持续长按状态；触屏、键盘与鼠标都可使用。

## 4. 三位成员共享的部分

| 分类 | 文件 | 职责 |
| --- | --- | --- |
| 主程序 | `js/sketch.js` | setup/draw、每帧更新顺序、书本缩放、窗口 resize；整合机制 |
| 公共参数/状态 | `js/shared/config.js`, `state.js`, `scene-geometry.js` | 时间参数、长按阈值、数量上限、全局 Story 状态和共享河道几何 |
| 书本与环境绘制 | `js/rendering/book-scene.js`, `painted-desk.js` | 绿色草地、河流、季节色彩、封皮与纸页、CG 桌面摆件 |
| 羊和狼绘制 | `js/rendering/flock-renderer.js`, `wool-painter.js` | 体积羊毛、羊的脸和腿、狼影、完整四足狼、绘制排序 |
| 云与粒子绘制 | `js/rendering/cloud-renderer.js` | 云体积、雨线和消散星点；实体是否下雨由 Noise 决定 |
| 音频支持 | `js/audio/music-box.js` | 合成三首固定旋律、切歌、播放状态；没有节拍/频谱分析 |
| 页面/UI | `index.html`, `style.css` | 加载顺序、按钮、说明、响应式样式 |
| 依赖 | `vendor/` | 本地 p5.js 与许可证，不应手改库代码 |
| 开发工具 | `scripts/`, `tests/`, `package*.json` | 构建单文件、浏览器检查及开发依赖 |
| 文档/截图 | `README.md`, `docs/` | 灵感、操作、AI/来源声明、职责、当前效果 |
| 生成文件 | `preview.html` | 便于直接打开；修改源文件后重新生成，不在这里分头开发 |

共享绘制层中使用 `Story.elapsed` 来画步态、雪花或闪烁，不代表它负责全局时间推进；在画笔中使用噪声来形成静态材质，也不代替成员的互动 Perlin 风场。

## 5. 一次操作跨模块的流程

- **翻页：** User input 识别页角 → Time 推进翻页 → 中点触发 Noise 刷新羊群或 Time 切换季节 → Rendering 显示纸张与新内容。
- **羊变云：** User input 累计长按并松手 → Noise 检查阈值、移除羊并生成云 → Noise 推进升空和漂浮 → Rendering 画羊毛到云的连续变化。
- **拖云：** User input 更新拖动坐标 → 松开后 Noise 继续风场 → Rendering 显示位置变化。
- **音乐追逐：** User input 点击播放 → Audio 改变播放状态 → Noise/Flock 更新随机个体的轨迹 → Rendering 画完整四足狼追逐。

模块是职责分工，不是互不调用的三个独立程序。各成员应理解接口，自己维护本机制的设计与修改。实际成员姓名、每人至少三次有意义的提交和最终署名须由团队按真实工作记录补齐，不能用拆文件代替贡献。
