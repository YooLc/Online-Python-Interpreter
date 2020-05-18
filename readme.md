# PyOnline 在线 Python 编程
## 截图
![screenshot.png](screenshot.png)

## 功能

- 适用于 Python 教学
- 编辑 Python 代码，并输出结果（支持 Turtle 海龟图）
- 支持清晰地截图代码及结果
- 支持保存代码和下载代码（``.py``文件需选择保留）
- 静态页面，本地运行

## 说明

- Python 的解释器是依靠 [Skulpt](https://github.com/skulpt/skulpt) 使用 Javascript 模拟的，有可能和 CPython 有区别。
- 界面写的比较丑，一是不会设计，二是不熟悉css = =
- 体验网址 [https://pyol.cf](https://pyol.cf) (特意注册了个短域名= =)

## 感谢

- [Skulpt](https://github.com/skulpt/skulpt)
- [html2canvas](https://github.com/niklasvh/html2canvas)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [iziToast](https://www.izitoast.cn/)

## Q & A

***
**Q:** 加载太慢了！

**A:** 网络环境不好 ¯\\_(ツ)_/¯ 可以试试刷新几次。
***
**Q:** 我按了按钮没反应？

**A:** [是时候升级你的浏览器了！](https://support.dmeng.net/upgrade-your-browser.html)
***
**Q:** 字体太小了怎么办？

**A:** 可以使用 <kbd>Ctrl</kbd> + <kbd>鼠标滚轮</kbd> 调整大小。
***
**Q:** 你这个 xx 按钮/xx 提示框 怎么被 盖住了/错位了？

**A:** 技术不精，很有可能我不会改= =  建议在正常大小的窗口（比如全屏）下使用。不过有这方面问题欢迎提交 Issue 和 PR。
***
**Q:** 我的代码和截图保存到哪里了？

**A:** 你浏览器默认的下载文件夹。
***
**Q:** 我的代码怎么保存的？怎么不用登录？

**A:** 使用 ``LocalStorage`` 保存，请不要开启隐私模式，代码只会保存在同一个浏览器下。

***
**Q:** 这玩意怎么写的？

**A:** 把几个开源项目缝起来的。