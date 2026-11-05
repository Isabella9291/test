# The Sheep — p5.js 绘本试验版

这是当前的**柔和平面绘本风试验版本**：卷曲羊毛、针织草地、天空与树木；左上录音带已上移，播放与下一首在录音带上，指南针旁的标题已移除。

项目按参考目录整理为同一层级的普通 **p5.js JavaScript 脚本**，没有 React、TypeScript 或运行时构建要求。本次只整理交付结构，不改变当前画面与交互。厚涂版的本地恢复备份仍保留，见 `docs/trial-version.md`。

## 打开作品

解压完整项目后，可用浏览器打开 **`preview.html`**：它已内嵌 p5.js、样式和所有作品代码，不依赖外部 CDN。

团队开发时使用 **`index.html`** 和同目录的 `.js` 文件，推荐 VS Code Live Server，或在项目根目录运行：

```sh
python3 -m http.server 8000
```

然后在浏览器访问 `http://localhost:8000`。播放音乐需要用户点击。p5.js 1.11.3 已在 `vendor/` 中。

## 目录与成员分工

```text
index.html          模块版入口，按依赖顺序加载 p5.js 与各脚本
music.js            公共音乐播放服务
noise-random.js     Perlin noise and randomness 成员负责
renderer.js         公共绘制：书、桌面、羊、狼、云、树与草地
settings.js         公共参数、状态、地形与录音带坐标
sketch.js           主程序：setup / draw / resize，整合各机制
style.css           页面样式、录音带按钮和帮助面板
time-based.js       Time-based 成员负责
user-input.js       User input 成员负责
preview.html        生成的单文件体验版，不在这里分别编辑代码
vendor/             p5.js 库与许可证
docs/               分工、试验说明与效果截图
scripts/            更新单文件预览的开发工具
tests/              浏览器检查
package*.json       可选的浏览器检查依赖，不是作品运行依赖
```

| 机制 | 负责人 | 文件与职责 |
| --- | --- | --- |
| Time-based | 成员姓名待填 | `time-based.js`：开书、翻页、画面渐显、四季切换过渡、自动昼夜与手动覆盖期 |
| Perlin noise and randomness | 你，真实姓名待填 | `noise-random.js`：随机羊群与个体差异、Perlin 风场、变云升空、随机雨云生羊、粒子生命周期与追逐轨迹 |
| User input | 成员姓名待填 | `user-input.js`：点击、长按、拖动、触屏、键盘、命中判断与录音带按钮 |
| 共同维护 | 团队 | `settings.js`、`renderer.js`、`music.js`、`sketch.js`、HTML/CSS 和工具文档 |

逐文件接口与协作方式见 **[docs/OWNERSHIP.md](docs/OWNERSHIP.md)**。这些是代码维护分工，不是已经完成的个人贡献证明。请填写真实姓名，并保留各成员自己完成的有意义提交。

修改源文件后，如需更新 `preview.html`，执行：

```sh
python3 scripts/build-preview.py
```

## 操作

| 操作 | 效果 |
| --- | --- |
| 点击封皮或 Enter | 开书，落平后画面渐显 |
| 左下页角 / ← /「新的羊群」 | 翻页刷新羊群 |
| 右下页角 / → /「下一季节」 | 春夏秋冬循环 |
| 点击空白草地 | 添加羊，避开天空、树木与留声机 |
| 长按羊至少 0.6 秒，再松手 | 羊膨胀、消失，连续化云升空 |
| 拖动云再松手 | 改变位置，随后继续 Perlin 漂移 |
| 空白书页上下拖动 | 调节昼夜；不与点击添羊同时触发 |
| 环绕移动鼠标 | 改变投影，带缓动与转速限制 |
| N /「昼 / 夜」 | 切换昼夜，手动覆盖自动循环 45 秒 |
| 录音带上的播放键 / M | 播放或暂停；白天完整四足狼追逐，夜间羊跳动 |
| 录音带上的下一首 / T | 切换三段固定原创旋律 |
| H /「操作说明」 | 显示或隐藏说明 |

支持触屏。昼夜默认按 120 秒循环；云随机存活 16–25 秒，一部分降雨，新羊长大与云消散共享同一进度。`?seed=1927` 可复现初始羊群布局。

## 灵感与技术

团队提供的古书参考决定了俯视桌面、棕色封皮与泛黄书页；最新构图参考决定天空、草坡、三棵树和左下留声机；当前试验风格参考图决定奶油色卷曲羊毛、针织草地与柔和树冠。参考图片未直接嵌入场景，画面由代码绘制。

此前用户上传的 `p5js-storybook-integrated.zip` 中 `noise-random.js` 的 `releaseSheep/updateCloud` 提供了分阶段膨胀、移除与缓动升空的思路。本项目按自己的实体结构重新实现，没有直接运行该 ZIP。所有图片、视频和 ZIP 的原作者及真实出处链接仍待团队补齐。

- **随机与噪声：** 独立 LCG 随机序列设置羊群数量、位置、尺寸、狼影概率（28%）、眼色、云寿命和降雨；`noise()` 连续采样控制云风场。外观不会每帧随机重绘。
- **时间：** `deltaTime` 推进全局秒数、翻页、季节与昼夜。Noise 模块也使用相同时间步长管理随机云生命周期，并不构成第四个机制。
- **交互：** 逆变换指针坐标并区分手势；录音带绘制和按钮使用同一坐标配置，窗口缩放后同步定位。
- **绘制：** Canvas 2D、离屏缓存、裁剪、针织纹、螺旋羊毛、纸页和影子叠加。当前为平面绘本试验风，书本体积是二维投影效果。
- **音乐：** Web Audio 合成三段固定原创旋律，只作为行为开关，没有振幅或频谱分析，因此不是第四种 Audio mechanic。

## AI 与外部资料声明

项目使用 **OpenAI ChatGPT / Codex** 协助需求整理、代码生成和调整、机制归类、绘图、原创旋律、检查和文档。源文件保留对应 AI 辅助注释；团队应理解并说明自己负责代码的工作方式与实际修改。

- [p5.js](https://p5js.org/) 1.11.3；许可证见 `vendor/p5-LICENSE.txt`。
- [noise()](https://p5js.org/reference/p5/noise/)：连续噪声。
- [randomSeed()](https://p5js.org/reference/p5/randomSeed/)：可复现随机过程的概念参考，本项目使用独立 LCG。
- [deltaTime](https://p5js.org/reference/p5/deltaTime/)：按秒推进动画。
- [mousePressed()](https://p5js.org/reference/p5/mousePressed/)：p5 输入事件。
- [Canvas 2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)：裁剪、绘制和材质。
- [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)：振荡器与音量包络，属于课程外技术，代码内有说明。
- [Playwright](https://playwright.dev/)：仅开发时使用的浏览器检查。

## 检查和提交准备

先启动服务器，再另开终端：

```sh
npm ci
npx playwright install chromium
npm test
```

如已有 Chromium，可执行 `CHROMIUM_PATH=/usr/bin/chromium npm test`。检查开书、添羊、禁放区、长按变云、拖云、噪声漂移、雨云生羊、四季、昼夜、音乐及缩放。音频节点检查不能替代人耳试听。

交作业前须补齐真实姓名、图片/视频出处、导师要求，以及每人至少三次有意义的个人提交（不含初始搭建）。一次 AI 辅助归类提交不替代三位成员的实际贡献。
