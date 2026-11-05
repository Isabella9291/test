# The Sheep — p5.js 互动故事书

当前厚涂版本：绿色草坡、天空和树木，立体羊毛、狼影与云；录音带位于左上方，播放和下一首按钮在录音带上。底部文字按钮栏、指南针旁及书本右下角文字已移除。封皮使用烫金感花体字，环境为柔光。

## 运行

解压后，用浏览器打开 `index.html`，或用 VS Code Live Server 运行。推荐在项目目录启动静态服务器：

```sh
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。所有库与字体均随项目提供，不需要 npm 安装、打包器或外部 CDN。音乐需要用户点击后播放。

## 文件与三位成员分工

所有作品源文件与参考目录一样放在同一层，使用 p5.js global mode。

| 文件 | 负责人 / 内容 |
| --- | --- |
| `time-based.js` | **Time-based 成员，姓名待填**：开书、翻页、画面渐显、季节过渡、自动昼夜、手动调节后的覆盖期 |
| `noise-random.js` | **Perlin noise and randomness 成员，姓名待填**：羊群数量/尺寸/位置等随机属性、狼影概率、云的噪声风场、升空、随机寿命与雨云、雨中生羊、粒子回收和随机个体运动 |
| `user-input.js` | **User input 成员，姓名待填**：点击、长按、拖动、触屏、键盘、命中判断、羊毛膨胀、鼠标光源响应、录音带按钮与窗口缩放后的按钮定位 |
| `renderer.js` | 公共绘制：书本、纸页、桌面摆件、天空、草坡、树、羊、四足狼、云、雨和粒子外观 |
| `settings.js` | 公共参数与状态：`ProjectConfig`、`Story`、地形和录音带几何坐标 |
| `music.js` | 公共音乐支持：三段固定原创旋律的合成、播放、暂停和切歌；音乐只作为行为开关 |
| `sketch.js` | 主程序：`setup()`、`draw()`、窗口缩放与模块更新顺序 |
| `index.html` | 入口及依赖加载顺序 |
| `style.css` | 页面与录音带按钮样式、内嵌字体声明 |
| `vendor/` | 必需的 p5.js、Allura 字体以及各自许可证 |

### 各机制的接口

- **Time-based：** `TimeMechanic.open/turn/setNight/toggleNight/update`。输入层请求动画，Time 推进进度，绘制层读取 `Story` 显示结果。全局昼夜按 120 秒循环，手动调节保留 45 秒。
- **Perlin noise and randomness：** `Flock.create/findSpace/addAt/update` 管理实体、放置和轨迹；`NoiseMechanic.rand/range/newFlock/addCloud/releaseSheep/update` 管理随机生成、变云、噪声移动、雨云生羊和生命周期。云的随机生命周期也使用 `dt`，仍属于本机制。
- **User input：** `Input.press/move/release/update/bind` 管理手势；p5 鼠标、触屏和键盘回调在同一文件中。它调用 Time、Noise 和 Music 的接口，不复制各自的生成或计时逻辑。

`renderer.js` 只负责呈现；它读取时间或随机外观参数，不代替三位成员的互动机制。`music.js` 没有音量或频谱分析，不构成第四种 Audio mechanic。

## 操作说明

| 操作 | 效果 |
| --- | --- |
| 点击封皮/书扣，或 Enter | 开书，落平后画面渐显 |
| 左下页角或 ← | 翻页刷新随机羊群 |
| 右下页角或 → | 切换春夏秋冬 |
| 点击空白草地 | 添加小羊，避开天空、树和留声机 |
| 长按羊至少 0.6 秒再松开 | 羊膨胀，原羊消失并连续化云升空 |
| 拖动云再松开 | 改变位置，随后继续较大幅度的平滑噪声漂移 |
| 在空白书页上下拖动，或 N | 调节昼夜；不会同时添加羊 |
| 环绕移动鼠标 | 调节投影方向，带缓动和转速限制 |
| 录音带播放按钮或 M | 播放/暂停；白天四足狼显现追逐，夜间羊群跳动 |
| 录音带下一首按钮或 T | 切换三段固定旋律 |
| H | 显示/隐藏操作说明 |

支持触屏长按与拖拽。云寿命随机为 10–16 秒，末段消散约 1.7 秒；一部分云降雨，新羊长大与云淡出共享同一进度。用地址参数 `?seed=1927` 可复现初始布局。

## 灵感与技术

团队提供的古书参考决定了桌面、皮革与纸页构图；草坡绘本参考决定天空、起伏草坡、三棵树和下方羊群；羊群视频启发了奶白高光与蓝灰暗部的羊毛体积。图片未直接用作场景贴图，画面由代码绘制。

用户提供的 `p5js-storybook-integrated.zip` 中 `releaseSheep/updateCloud` 的分阶段处理提供了膨胀、移除和缓动升空的参考思路，本项目按自己的实体结构重新实现。图片、视频和参考 ZIP 的原作者及真实出处链接仍需团队补全。

- **噪声与随机：** 独立 LCG 随机序列控制羊群、个体差异和天气选择；`noise()` 连续采样控制云的风速，辅以缓动和边缘回转。外观参数不在每帧重新抽取。
- **时间：** 通过 `deltaTime` 按秒更新动画、事件和过渡，而非按帧计时。
- **输入：** 将指针逆变换为书页坐标，以手势状态区分添羊、长按、拖云和调节昼夜。
- **绘制：** Canvas 2D、离屏纹理、体积羊毛缓存、裁剪、分层笔触与纸页投影；书本立体感是二维绘制效果。
- **音乐：** Web Audio 振荡器与音量包络播放原创音符序列，属于课程外技术，代码中有解释与来源。

## AI 声明与外部来源

使用 **OpenAI ChatGPT / Codex** 协助需求整理、p5.js 绘制、三种机制、代码归类、原创合成旋律、验证与说明。各源文件保留 AI 辅助注释及相关技术来源；团队成员应理解代码，并说明自己实际完成的设计和修改。

- [p5.js](https://p5js.org/) 1.11.3，许可证：`vendor/p5-LICENSE.txt`。
- [noise()](https://p5js.org/reference/p5/noise/)、[randomSeed()](https://p5js.org/reference/p5/randomSeed/)（随机可复现概念参考，本项目使用 LCG）、[deltaTime](https://p5js.org/reference/p5/deltaTime/)、[mousePressed()](https://p5js.org/reference/p5/mousePressed/)。
- [Canvas 2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)：绘制、渐变、裁剪。
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)：音乐合成与播放。
- [Allura](https://github.com/googlefonts/allura)：封皮花体字，来自 `@fontsource/allura` 5.3.0，SIL OFL 1.1，字体与完整许可证保存在 `vendor/`。

提交前请填写三位成员真实姓名与参考资料出处，并完成每人至少三次有意义的真实个人提交（不含初始搭建）。本次代码归类不替代个人贡献记录。
