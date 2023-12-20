const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.createWebService', async function () {
        const promptedText = await vscode.window.showInputBox({
            placeHolder: 'Enter your prompted text for the web service'
        });

        if (promptedText) {
            // Langchain 에이전트를 통해 웹 서비스 파일 생성
            const webServiceFiles = generateWebServiceFiles(promptedText);
            const webServiceDir = path.join(vscode.workspace.rootPath, 'webService');

            // 파일 저장
            webServiceFiles.forEach(file => {
                const filePath = path.join(webServiceDir, file.name);
                fs.writeFileSync(filePath, file.content);
            });

            // 웹 서버 실행
            exec(`cd ${webServiceDir} && python -m http.server`, (err, stdout, stderr) => {
                if (err) {
                    vscode.window.showErrorMessage(`Error starting web server: ${stderr}`);
                    return;
                }
                vscode.window.showInformationMessage('Web server started on http://localhost:6000');
            });
        }
    });

    context.subscriptions.push(disposable);
}

function generateWebServiceFiles(promptedText) {
    // HTML 파일 생성
    const htmlContent = `
        <html>
        <head>
            <title>${promptedText}</title>
            <link rel="stylesheet" type="text/css" href="style.css">
            <script src="script.js"></script>
        </head>
        <body>
            <h1>Welcome to ${promptedText}!</h1>
            <p>This web page is generated based on your input.</p>
            <button id="clickMeBtn">Click Me</button>
            <p id="clickResult"></p>
        </body>
        </html>
    `;

    // CSS 파일 생성
    const cssContent = `
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f0f0f0;
        }
        h1 {
            color: #333;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 15px 20px;
            margin: 10px 0;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    `;

    // JavaScript 파일 생성
    const jsContent = `
        document.getElementById('clickMeBtn').addEventListener('click', function() {
            document.getElementById('clickResult').innerText = 'Button clicked!';
        });
    `;

    return [
        { name: 'index.html', content: htmlContent },
        { name: 'style.css', content: cssContent },
        { name: 'script.js', content: jsContent }
    ];
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};