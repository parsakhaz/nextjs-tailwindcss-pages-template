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

// Configuration
const SPACE_WIDTH = 8;  // Width of each space in pixels
const INDENT_SIZE = 4;  // Python standard indentation size
const BASE_X = 90;      // Starting x position for code

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
    
    // Enhanced Python syntax highlighting
    return line
        .replace(/(".*?")/g, `<tspan fill="${colors.string}">$1</tspan>`) // Strings
        .replace(/\b(import|from|def|if|return|None)\b/g, `<tspan fill="${colors.keyword}">$1</tspan>`) // Keywords
        .replace(/\b([A-Z][a-zA-Z]*)\b/g, `<tspan fill="${colors.function}">$1</tspan>`) // Class names
        .replace(/\b([a-z]+)\(/g, `<tspan fill="${colors.function}">$1</tspan>(`); // Function calls
}

export function createSVG(theme: 'light' | 'dark', data: DiffData): string {
    const colors = themes[theme];
    let y = 95; // Starting y position for text
    let content = '';
    let lineNumber = 1;

    // Process each line
    for (let i = 0; i < Math.max(data.oldLines.length, data.newLines.length); i++) {
        const oldLine = data.oldLines[i];
        const newLine = data.newLines[i];

        if (oldLine === newLine) {
            // Unchanged line
            const indent = measureIndentation(oldLine);
            const x = BASE_X + (indent * SPACE_WIDTH / INDENT_SIZE);
            const displayLine = oldLine.trimLeft();
            
            content += `
                <text x="45" y="${y}" fill="${colors.lineNumbers}">${lineNumber}</text>
                <text x="${x}" y="${y}" fill="${colors.text}">${syntaxHighlight(displayLine, colors.syntax)}</text>`;
            y += 25;
            lineNumber++;
        } else {
            if (oldLine !== undefined) {
                // Removed line
                const indent = measureIndentation(oldLine);
                const x = BASE_X + (indent * SPACE_WIDTH / INDENT_SIZE);
                const displayLine = oldLine.trimLeft();
                
                content += `
                    <rect x="30" y="${y - 15}" width="740" height="25" fill="${colors.removedBg}"/>
                    <text x="45" y="${y}" fill="${colors.lineNumbers}">${lineNumber}</text>
                    <text x="75" y="${y}" fill="${colors.removedText}">-</text>
                    <text x="${x}" y="${y}" fill="${colors.text}">${syntaxHighlight(displayLine, colors.syntax)}</text>`;
                y += 25;
            }
            if (newLine !== undefined) {
                // Added line
                const indent = measureIndentation(newLine);
                const x = BASE_X + (indent * SPACE_WIDTH / INDENT_SIZE);
                const displayLine = newLine.trimLeft();
                
                content += `
                    <rect x="30" y="${y - 15}" width="740" height="25" fill="${colors.addedBg}"/>
                    <text x="45" y="${y}" fill="${colors.lineNumbers}">${lineNumber}</text>
                    <text x="75" y="${y}" fill="${colors.addedText}">+</text>
                    <text x="${x}" y="${y}" fill="${colors.text}">${syntaxHighlight(displayLine, colors.syntax)}</text>`;
                y += 25;
            }
            lineNumber++;
        }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${Math.max(500, y + 50)}">
    <!-- Background -->
    <rect width="800" height="${Math.max(500, y + 50)}" fill="${colors.background}"/>
    
    <!-- File header -->
    <rect x="30" y="20" width="740" height="40" rx="6" fill="${colors.headerBg}"/>
    <text x="50" y="45" font-family="monospace" font-size="14" fill="${colors.text}">${data.filename}</text>
    
    <!-- Code container with subtle border -->
    <rect x="30" y="70" width="740" height="${Math.max(410, y - 60)}" fill="${colors.background}" stroke="${colors.border}" stroke-width="1"/>
    
    <!-- Line numbers background -->
    <rect x="30" y="70" width="50" height="${Math.max(410, y - 60)}" fill="${colors.headerBg}"/>
    
    <!-- Code content -->
    <g font-family="monospace" font-size="14">
        ${content}
    </g>
</svg>`;
} 