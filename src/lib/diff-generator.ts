// GitHub color themes
export const themes = {
    light: {
        background: '#ffffff',
        headerBg: '#f6f8fa',
        text: '#24292f',
        removedBg: '#ffd7d5',
        addedBg: '#ccffd8',
        border: '#d0d7de',
        lineNumbers: '#6e7781',
        removedText: '#cf222e',
        addedText: '#24292f',
        syntax: {
            keyword: '#cf222e',
            string: '#0a3069',
            function: '#953800',
            params: '#24292f'
        }
    },
    dark: {
        background: '#0d1117', 
        headerBg: '#161b22',
        text: '#e6edf3',
        removedBg: '#3c1414',
        addedBg: '#1a4d1a',
        border: '#30363d',
        lineNumbers: '#8b949e',
        removedText: '#ff7b72',
        addedText: '#3fb950',
        syntax: {
            keyword: '#ff7b72',
            string: '#a5d6ff',
            function: '#ffa657',
            params: '#e6edf3'
        }
    }
};

interface DiffData {
    filename: string;
    oldLines: string[];
    newLines: string[];
}

function measureIndentation(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
}

function syntaxHighlight(line: string, colors: any): string {
    if (!line) return '';
    return line
        .replace(/(".*?")/g, `<tspan fill="${colors.string}">$1</tspan>`)
        .replace(/\b(import|from|def|if|return|None)\b/g, `<tspan fill="${colors.keyword}">$1</tspan>`)
        .replace(/\b([A-Z][a-zA-Z]*)\b/g, `<tspan fill="${colors.function}">$1</tspan>`)
        .replace(/\b([a-z]+)\(/g, `<tspan fill="${colors.function}">$1</tspan>(`);
}

export function createSVG(theme: 'light' | 'dark', data: DiffData): string {
    const colors = themes[theme];
    let y = 95;
    let content = '';
    let lineNumber = 1;

    for (let i = 0; i < Math.max(data.oldLines.length, data.newLines.length); i++) {
        const oldLine = data.oldLines[i];
        const newLine = data.newLines[i];
        const x = 90 + (measureIndentation(oldLine || newLine) * 8 / 4);

        if (oldLine === newLine) {
            content += `
                <text x="45" y="${y}" fill="${colors.lineNumbers}">${lineNumber}</text>
                <text x="${x}" y="${y}" fill="${colors.text}">${syntaxHighlight(oldLine.trimLeft(), colors.syntax)}</text>`;
        } else {
            if (oldLine !== undefined) {
                content += `
                    <rect x="30" y="${y - 15}" width="740" height="25" fill="${colors.removedBg}"/>
                    <text x="45" y="${y}" fill="${colors.lineNumbers}">${lineNumber}</text>
                    <text x="75" y="${y}" fill="${colors.removedText}">-</text>
                    <text x="${x}" y="${y}" fill="${colors.text}">${syntaxHighlight(oldLine.trimLeft(), colors.syntax)}</text>`;
                y += 25;
            }
            if (newLine !== undefined) {
                content += `
                    <rect x="30" y="${y - 15}" width="740" height="25" fill="${colors.addedBg}"/>
                    <text x="45" y="${y}" fill="${colors.lineNumbers}">${lineNumber}</text>
                    <text x="75" y="${y}" fill="${colors.addedText}">+</text>
                    <text x="${x}" y="${y}" fill="${colors.text}">${syntaxHighlight(newLine.trimLeft(), colors.syntax)}</text>`;
            }
        }
        y += 25;
        lineNumber++;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${Math.max(500, y + 50)}">
    <rect width="800" height="${Math.max(500, y + 50)}" fill="${colors.background}"/>
    <rect x="30" y="20" width="740" height="40" rx="6" fill="${colors.headerBg}"/>
    <text x="50" y="45" font-family="monospace" font-size="14" fill="${colors.text}">${data.filename}</text>
    <rect x="30" y="70" width="740" height="${Math.max(410, y - 60)}" fill="${colors.background}" stroke="${colors.border}" stroke-width="1"/>
    <rect x="30" y="70" width="50" height="${Math.max(410, y - 60)}" fill="${colors.headerBg}"/>
    <g font-family="monospace" font-size="14">${content}</g>
</svg>`;
} 