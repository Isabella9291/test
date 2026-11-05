# The Sheep

一本会呼吸的羊群故事书，使用 **p5.js 1.11.3**。当前版本为天空、起伏绿色草坡、三棵树、圆润的羊毛和云，以及桌面上的古书。书本展开后约占画面宽度的 84%；开书全程保留硬封皮和包边。场景由代码绘制，没有把参考图当作背景贴图。

## 打开作品

下载并解压完整项目，打开 **`preview.html`** 即可查看单文件版本，里面已包含 p5.js、样式和作品代码，无需 CDN。`index.html` 是便于团队开发的模块版，两者由同一份源代码生成。

推荐通过本地服务器开发：

```sh
# 在解压后的项目根目录执行
python3 -m http.server 8000
```

浏览器访问 `http://localhost:8000`。也可以使用 VS Code Live Server。音乐需要点击后才会播放。

## 团队代码分工

| 负责人 | 负责的机制 | 主要目录 |
| --- | --- | --- |
| Time 成员（真实姓名待填） | 开书/翻页计时、画面渐显、四季过渡、昼夜循环 | `js/mechanics/time/` |
| 你，Noise/Randomness 成员（真实姓名待填） | 随机羊群及个体差异、Perlin 风场、变云升空、随机降雨生羊、随机运动参数 | `js/mechanics/noise-random/` |
| User input 成员（真实姓名待填） | 点击、长按、拖动、键盘、触屏、命中判断和按钮 | `js/mechanics/user-input/` |
| 团队共同维护 | 绘制、音乐、共享状态/参数、主程序、页面样式和工具 | 其余目录 |

每种机制都有独立脚本。**逐文件职责、接口和交界功能见 [docs/OWNERSHIP.md](docs/OWNERSHIP.md)**。姓名留空不是最终署名；提交作业前须填真实负责人。此分工说明不代表已有每人三次个人贡献，每位成员仍应完成并提交自己的实际开发工作。

```text
index.html                    模块版入口
preview.html                  自动生成的单文件作品，便于直接打开
style.css                     页面、按钮和说明面板
js/
  sketch.js                   p5 setup/draw、窗口缩放、模块整合
  mechanics/
    time/
      time-mechanic.js         时间推进、开书、翻页、季节与昼夜
    noise-random/
      perlin-mechanic.js       随机数、云风场、变云、雨云、生羊、粒子生命周期
      flock-model.js          羊群数据、随机属性、放置与避让、追逐轨迹
    user-input/
      input-controls.js       手势状态、按钮、用户操作请求
      p5-events.js            鼠标/触屏/键盘回调
      hit-testing.js          羊和云的指针命中判断
  rendering/
    book-scene.js             古书、纸页、河流与四季画面
    painted-desk.js           桌面、纸张、录音带、蜡烛、指南针与笔
    wool-painter.js           羊毛与云的体积明暗和细毛纹理缓存
    flock-renderer.js         羊、影子和完整四足狼的外观
    cloud-renderer.js         云、雨线与消散星点的外观
  audio/
    music-box.js              三段固定原创旋律的合成与播放
  shared/
    config.js                 时间、交互阈值和实体数量上限
    state.js                  各模块共用的 Story 状态
    scene-geometry.js         共享地平线、树木与禁放判断
scripts/build-preview.py      从模块版生成单文件 HTML
vendor/                       p5.js 与许可证
tests/smoke.cjs              浏览器交互回归检查
```

`preview.html` 是交付入口，不是成员分别编辑的源文件。修改 `js/`、`style.css` 或 `index.html` 后，在项目根目录运行：

```sh
python3 scripts/build-preview.py
```

## 操作说明

| 操作 | 效果 |
| --- | --- |
| 点击封皮/书扣，或 Enter | 打开书本，画面落平后渐显 |
| 点击左下页角、←，或「新的羊群」 | 翻页并刷新随机羊群 |
| 点击右下页角、→，或「下一季节」 | 春夏秋冬循环 |
| 点击空白草地 | 在点击位置添加羊，避开树木、留声机与已有羊群 |
| 长按小羊至少 0.6 秒后松开 | 羊毛膨胀；原羊消失，以相近的体积化云升起 |
| 拖动云，松开 | 改变位置，之后继续 Perlin 漂移 |
| 在空白草地上下拖动 | 向上变白天，向下变夜晚；不会同时添加羊 |
| 环绕移动鼠标 | 改变影子方向，带缓动和转速上限 |
| N 或「昼 / 夜」 | 切换昼夜，手动设置覆盖自动循环 45 秒 |
| 录音带播放键、M 或「播放」 | 播放/暂停；白天狼从影子中显现追逐，夜晚羊群跳动 |
| 录音带箭头、T 或「换曲」 | 切换三首固定旋律 |
| H 或「操作说明」 | 显示/隐藏说明 |

昼夜默认每 120 秒循环。云寿命随机为 16–25 秒，部分云降雨；云淡出与新羊长大共享同一进度。夜间仍能看清场景，羊眼呈现随机彩色微光。支持触屏长按和拖拽。`?seed=1927` 可复现初始羊群布局。

## 灵感与技术

团队提供的羊群插画启发了俯视羊群和长投影；强调的古书参考决定了桌面构图、棕色皮革、泛黄纸页和近乎俯视的角度。第二个蓝色视频启发了奶白高光、蓝灰暗部和蓬松羊毛的体积感，**草地保持绿色**。狼参考用于尖耳、长嘴与四足轮廓。用户上传的 `p5js-storybook-integrated.zip` 中 `noise-random.js` 的 `releaseSheep/updateCloud` 提供了分阶段膨胀、移除和缓动升空的参考思路，现项目按自己的实体结构重新实现，没有直接执行该 ZIP。

图片、视频和参考 ZIP 的真实作者及出处链接尚待团队补齐，不能把这些参考资料署为自己原创。

- **随机与噪声：** 独立 LCG 随机序列设置数量、位置、尺寸、狼影概率（28%）、云寿命、降雨、眼睛颜色及运动差异。`noise()` 连续采样控制风场，不在每帧重新抽取外观。
- **时间：** `deltaTime` 推进秒数；开书、翻页、四季过渡和自动昼夜由时间模块管理。云的随机生命周期由 Noise/Randomness 模块使用相同的时间步长推进。
- **交互：** 将鼠标和触屏坐标逆变换到统一书页坐标，以手势状态区分长按、拖云、添羊和调节昼夜。
- **画面：** Canvas 2D 的渐变、裁剪、分层笔触、体积羊毛缓存与页缘投影形成绘画质感和立体错觉，并非真正的三维模型。
- **音乐：** Web Audio 播放固定原创音符序列，仅作为行为开关，没有做振幅或频谱分析，因此不是第四种 Audio mechanic。

## AI 与外部资料声明

项目使用 **OpenAI ChatGPT / Codex** 协助需求整理、p5.js 绘制、三种机制实现、模块拆分、原创合成旋律、检查和文档。源文件头部均保留 AI 辅助注释及相关来源。团队成员应理解自己负责的代码，记录自己的设计与修改，并按课程要求说明 AI 使用范围。

- [p5.js](https://p5js.org/) 1.11.3，许可证见 `vendor/p5-LICENSE.txt`。
- [noise()](https://p5js.org/reference/p5/noise/)：连续噪声风场。
- [randomSeed()](https://p5js.org/reference/p5/randomSeed/)：可复现随机过程的概念参考；本项目采用独立 LCG。
- [deltaTime](https://p5js.org/reference/p5/deltaTime/)：基于经过时间的动画。
- [mousePressed()](https://p5js.org/reference/p5/mousePressed/)：输入事件。
- [Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)：材质渐变、裁剪、纸页和体积效果。
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)：振荡器与音量包络，属于课程外技术，代码内有说明。
- [Playwright](https://playwright.dev/)：开发时的浏览器检查，不参与作品运行。

## 验证与提交

先启动服务器，另开终端执行：

```sh
npm ci
npx playwright install chromium
npm test
```

已有 Chromium 时可执行 `CHROMIUM_PATH=/usr/bin/chromium npm test`。检查开书、添羊和天空与树木禁放、长按变云、拖云与噪声漂移、随机降雨生羊、翻页与四季循环、昼夜、音乐切换暂停及窗口缩放。生命周期检查会加速推进时间。音频节点检查不能替代人耳试听。

提交作业前，填写真实姓名、参考资料出处，完成每人至少三次有意义的个人提交（不含初始搭建），并确认导师批准和课堂展示要求。单次 AI 辅助整理提交不能代替三位成员的个人贡献记录。

最新书页构图：按团队新参考改为上方天空与太阳、中部起伏草坡、下方羊群和三棵树，左下角的小留声机连接现有音乐开关。厚涂笔触、体积羊毛、桌面和书本材质保持。新地形下禁止在天空、树木和留声机上生成羊。
