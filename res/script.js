function popInfo(title, message, type, icon, timeout = 2000) {
    var c = type === "infoOK" ?  "#587c0c" : type === "infoErr" ? "#b81c27" : "#000000";
    iziToast.show({
        title: title,
        message: message,
        theme: 'dark',
        color: c,
        icon: icon,
        timeout: timeout
    });
}

function saveCookie(cookieName, cookieValue, cookieDays) {
    if (cookieValue.length > 4050) return false;
    var d = new Date();
    d.setTime(d.getTime() + (cookieDays * 24 * 60 * 60 * 1000));
    document.cookie = cookieName + "=" + cookieValue + ";expires=" + d.toGMTString();
    return true;
}

function readCookie(cookieName) {
    var name = cookieName + "=";
    var cookies = document.cookie.split(';');
    for (i = 0; i < cookies.length; i++) {
        var t = cookies[i];
        while (t.charAt(0) == ' ') t = t.substring(1, t.length);
        if (t.indexOf(name) == 0) return t.substring(name.length, t.length);
    }
    return null;
}

function saveCode()
{
    var code = window.editor.getValue();
    code = encode(code);
    try {
        localStorage.setItem("code", code);
    }
    catch(err) {
        popInfo("保存失败", "请尝试下载代码", "infoErr");
        console.log(`错误信息:${err}`);
        return;
    }
    popInfo("已保存", "", "infoOK", "fa fa-check");
}

function encode(str) {
    return btoa(encodeURIComponent(str));
}

function decode(str) {
    return decodeURIComponent(atob(str));
}

// 格式化时间戳
function getFormatTime()
{
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    if (h >= 0 && h <= 9) h = '0' + h;
    if (m >= 0 && m <= 9) m = '0' + m;
    if (s >= 0 && s <= 9) s = '0' + s;
    return h.toString() + m.toString() + s.toString();
}

// 使用 html2canvas 截图
function screenShot() {
    try {
        var mctn = document.getElementById("mctn");
        // 根据显示器分辨率截取高清图片
        const s = (window.screen.height <= 1080) ? 2 : (window.screen.height <= 1440) ? 1.5 : 1;
        html2canvas(mctn, {
            scale: s
        }).then(function(canvas) {
            var a = document.createElement('a');
            a.href = canvas.toDataURL("image/png");
            a.download = "code-" + getFormatTime() + ".png";
            a.click();
        });
    } catch(err) {
        popInfo("截图失败", "刷新试试？¯\_(ツ)_/¯记得保存", "infoErr", "fa fa-bug", 3000);
        console.log(`错误信息:${err}`);
        return;
    }
    popInfo("已截图", "", "infoOK", "fa fa-check");
}

// 下载代码
// Reference: https://www.jianshu.com/p/40cfe9a12f9e
function dlCode() {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(window.editor.getValue()));
    pom.setAttribute('download', "code-" + getFormatTime() + ".py");
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
    popInfo("已开始下载", "请选择保留文件", "infoOK", "fa fa-download", 3000);
}

// 切换白天模式，写的不太好看....
function toggleMode(forceMode = null) {
    var curMode = readCookie("darkMode");
    if (forceMode != null) curMode = forceMode == "1" ? "0" : "1";
    if (curMode == "1") {
        var body = document.getElementsByTagName('div');
        for (i = 0; i < body.length; i++) {
            body[i].classList.add("light");
            for (j = 0; j < body[i].childElementCount; j++) {
                body[i].children[j].classList.add("light");
            }
        }
        document.getElementsByTagName('body')[0].style.backgroundColor='#fff';
        monaco.editor.setTheme("vs");
        saveCookie("darkMode", "0", 365);
    } else {
        var body = document.getElementsByTagName('div');
        for (i = 0; i < body.length; i++) {
            body[i].classList.remove("light");
            for (j = 0; j < body[i].childElementCount; j++) {
                body[i].children[j].classList.remove("light");
            }
        }
        document.getElementsByTagName('body')[0].style.backgroundColor='#0d0d0d';
        monaco.editor.setTheme("vs-darker");
        saveCookie("darkMode", "1", 365);
    }
}

// Microsoft 的 Monaco Editor
// https://stackoverflow.com/questions/48934163/monaco-editor-set-font-size
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});
require.config({
    'vs/nls': {
        availableLanguages: {
            '*': 'zh-cn'
        }
    }
});
require(['vs/editor/editor.main'], () => {
    // Dark Mode Theme 暗黑主题
    monaco.editor.defineTheme('vs-darker', {
        base: 'vs-dark',
        inherit: true,
        rules: [{ background: '0d0d0d' }],
        colors: {
            'editor.background': '#0d0d0d'
        }
    });
    // Initialize Editor 初始化
    var d = new Date();
    var t = d.toLocaleString();
    var c = localStorage.getItem("code");
    var str = c != null ? decode(c) : "# " + t;
    window.editor = monaco.editor.create(document.getElementById("editorContainer"), {
        theme: 'vs-darker',
        fontSize: "16px",
        model: monaco.editor.createModel(str, "python"),
        wordWrap: 'on',
        automaticLayout: true,
        scrollbar: {
            vertical: 'auto'
        }
    }); 
    
});

document.onkeydown = function(e) {
    if (e.ctrlKey && e.code == "KeyS") 
    {
        saveCode();
        e.preventDefault();
    }
}

// 新人提示
window.onload = function () {
    var darkMode = readCookie("darkMode");
    if (darkMode == null) {
        popInfo("Hi! 首次使用？", "欢迎点击标题栏 <i class=\"fa fa-info\"></i> 图标查看说明", "info", null, 5000);
        saveCookie("darkMode", "1", 365);
    } else if (darkMode == "0") {
        toggleMode("0");
    }
}

// 这段代码是 Skulpt 官网上的，我们为什么不留下来呢 ¯\_(ツ)_/¯
function outf(text) { 
    var mypre = document.getElementById("outputContainer"); 
    mypre.innerHTML = mypre.innerHTML + text; 
} 

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runCode() { 
    popInfo("开始运行", "", "infoOK", "fa fa-code", 1000);
    try {
        var prog = window.editor.getValue(); 
    } catch(err) {
        popInfo("无代码", "请等待代码编辑器加载", "infoErr", "fa fa-bug");
        console.log(`错误信息:${err}`);
        return;
    }
    var mypre = document.getElementById("outputContainer"); 
    mypre.innerHTML = ''; 
    var myCanvas = document.getElementById("turtleCanvas"); 
    myCanvas.innerHTML = '';
    Sk.pre = "output";
    Sk.configure({
        __future__: Sk.python3,
        output: outf,
        read: builtinRead
    });
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'turtleCanvas';
    var myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(function(mod) {
        popInfo("运行成功", "", "infoOK", "fa fa-check", 1000);
        console.log('Yeah! There\'s nothing wrong! when ' + getFormatTime() + ' ¯\_(ツ)_/¯');
    },
        function(err) {
        var errlog = document.getElementById("outputContainer"); 
        var curMode = document.getElementsByTagName('meta')['theme'];
        popInfo("运行出错了", "= = 看看错误信息吧", "infoErr", "fa fa-bug");
        if (curMode.content == "dark") {
            errlog.innerHTML = mypre.innerHTML + "<div class=\"errorLog\">" + err.toString() + "</div>"; 
        } else {
            errlog.innerHTML = mypre.innerHTML + "<div class=\"errorLog light\">" + err.toString() + "</div>"; 
        }
    });
    
}