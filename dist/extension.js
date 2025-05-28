"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const openai_1 = __importDefault(require("openai"));
function activate(context) {
    const disposable = vscode.commands.registerCommand('codesafe-ai.scanFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Open a file to scan.');
            return;
        }
        const apiKey = vscode.workspace.getConfiguration().get('codesafe-ai.apiKey') ||
            process.env.OPENAI_API_KEY;
        if (!apiKey) {
            vscode.window.showWarningMessage('Set your OpenAI API key in the extension settings.');
            return;
        }
        const openai = new openai_1.default({ apiKey });
        const code = editor.document.getText();
        const prompt = `You are a secure‑code auditor. Check the following code for ${TOP_CWE.join(', ')}. Identify vulnerable line ranges and propose a secure patch. Reply JSON strictly in the form: { "issues": [ { "cwe": "...", "line": "start-end", "reason": "...", "patch": "..." } ] }.\n\nCODE:\n${code}`;
        const resp = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1
        });
        // TODO: parse JSON, create diagnostics
        vscode.window.showInformationMessage('Analysis completed.');
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
const TOP_CWE = [
    'CWE-79', // XSS
    'CWE-89', // SQL Injection
    'CWE-352', // CSRF
    'CWE-434', // Unrestricted File Upload
    'CWE-798', // Hard-coded Credentials
    'CWE-601', // Open Redirect
    'CWE-120', // Buffer Overflow
    'CWE-400', // Uncontrolled Resource Consumption
    'CWE-269', // Improper Privilege Management
    'CWE-306' // Missing Authentication
];
