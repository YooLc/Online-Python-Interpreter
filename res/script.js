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
}

// 切换白天模式，写的不太好看....
function toggleMode() {
    var curMode = document.getElementsByTagName('meta')['theme'];
    if (curMode.content == "dark") {
        var body = document.getElementsByTagName('div');
        for (i = 0; i < body.length; i++) {
            body[i].classList.add("light");
            for (j = 0; j < body[i].childElementCount; j++) {
                body[i].children[j].classList.add("light");
            }
        }
        document.getElementsByTagName('body')[0].style.backgroundColor='#fff';
        monaco.editor.setTheme("vs");
        curMode.content = "light";
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
        curMode.content = "dark";
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
    window.editor = monaco.editor.create(document.getElementById("editorContainer"), {
        theme: 'vs-darker',
        fontSize: "16px",
        model: monaco.editor.createModel("# " + t, "python"),
        wordWrap: 'on',
        automaticLayout: true,
        scrollbar: {
            vertical: 'auto'
        }
    }); 
    
});

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
    var prog = window.editor.getValue(); 
    var mypre = document.getElementById("outputContainer"); 
    mypre.innerHTML = ''; 
    var myCanvas = document.getElementById("turtleCanvas"); 
    myCanvas.innerHTML = '';
    Sk.pre = "output";
    Sk.configure({output:outf, read:builtinRead}); 
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'turtleCanvas';
    var myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(function(mod) {
        console.log('Yeah! There\'s nothing wrong! when ' + getFormatTime() + ' ¯\_(ツ)_/¯');
    },
        function(err) {
        var errlog = document.getElementById("outputContainer"); 
        var curMode = document.getElementsByTagName('meta')['theme'];
        if (curMode.content == "dark") {
            errlog.innerHTML = mypre.innerHTML + "<div class=\"error\">运行出错了(·.·)， 看看错误信息:</div><div class=\"errorLog\">" + err.toString() + "</div>"; 
        } else {
            errlog.innerHTML = mypre.innerHTML + "<div class=\"error light\">运行出错了(·.·)， 看看错误信息:</div><div class=\"errorLog light\">" + err.toString() + "</div>"; 
        }
    });
}