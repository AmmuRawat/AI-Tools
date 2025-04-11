const fs = require('fs');
const path = require('path');

// Tools data from main.js
const tools = [
    // ... (same tools array as in main.js)
];

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Function to read template
function readTemplate() {
    return fs.readFileSync('tools/template.html', 'utf8');
}

// Function to create tool files
function createToolFiles() {
    const template = readTemplate();
    
    tools.forEach(tool => {
        // Create category directory if it doesn't exist
        const categoryDir = path.join('tools', tool.category);
        ensureDirectoryExists(categoryDir);
        
        // Create tool-specific directories
        const cssDir = path.join('assets', 'css', 'tools', tool.category);
        const jsDir = path.join('assets', 'js', 'tools', tool.category);
        ensureDirectoryExists(cssDir);
        ensureDirectoryExists(jsDir);
        
        // Replace placeholders in template
        let toolHtml = template
            .replace(/TOOL_NAME/g, tool.name)
            .replace(/TOOL_DESCRIPTION/g, tool.description)
            .replace(/TOOL_CATEGORY/g, tool.category);
        
        // Create HTML file
        const htmlPath = path.join(categoryDir, `${tool.path.split('/').pop()}`);
        fs.writeFileSync(htmlPath, toolHtml);
        
        // Create CSS file
        const cssPath = path.join(cssDir, `${tool.name.toLowerCase().replace(/\s+/g, '-')}.css`);
        fs.writeFileSync(cssPath, '/* Tool-specific styles */\n');
        
        // Create JS file
        const jsPath = path.join(jsDir, `${tool.name.toLowerCase().replace(/\s+/g, '-')}.js`);
        fs.writeFileSync(jsPath, `// ${tool.name} functionality\n`);
        
        console.log(`Created files for ${tool.name}`);
    });
}

// Run the script
createToolFiles(); 