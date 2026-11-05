# 柔和平面绘本风试验版

本轮为可撤回试验，不代表最终选定画风。用户要求：卷曲羊毛、针织草地、简化圆树冠；录音带上移并将播放和下一首放到录音带上；删除指南针旁的文字。构图、书本大小、三种机制和桌面其余摆件保留。

恢复点：`/workspace/backups/storybook-before-flat-trial`。完整归档为 `project.zip`，含逐文件 SHA-256 校验和；`restore.py` 只应在用户明确说恢复上一版后运行。不能用远程 main 代替恢复点，因为试验前版本包含本地未提交修改。此轮不推送 GitHub，不发布环境。

`CassetteGeometry` 统一控制绘制、点击与按钮布局；两个真实 HTML 按钮定位到录音带标签上，仍可键盘操作。源代码按三种机制及公共绘制脚本归类。

本次按用户参考目录整理为根目录的 settings.js、noise-random.js、time-based.js、user-input.js、renderer.js、music.js、sketch.js。只改变文件归类和加载顺序，不改变试验版画面。用户已明确授权：无法直接导出附件时，将此代码交付版本更新 GitHub 供 ZIP 下载。原厚涂版本恢复点仍保留。
