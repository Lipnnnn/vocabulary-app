const fs = require('fs');
const path = require('path');

// 配置
const INPUT_FILE = 'word_list.csv';
const OUTPUT_DIR = 'chapter';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`创建目录: ${OUTPUT_DIR}`);
}

// 读取原始文件
const content = fs.readFileSync(INPUT_FILE, 'utf-8');
const lines = content.split('\n');

// 获取表头
const header = lines[0];
const dataLines = lines.slice(1).filter(line => line.trim() !== '');

console.log(`总行数: ${lines.length}`);
console.log(`数据行数: ${dataLines.length}`);
console.log(`表头: ${header}`);

// 按 sort 列分组
const groups = new Map();

for (const line of dataLines) {
    const parts = parseCSVLine(line);
    if (parts.length < 3) continue;

    const sort = parts[2].trim();
    const title = parts[3]?.trim() || `Chapter ${sort}`;

    if (!groups.has(sort)) {
        groups.set(sort, {
            title: title,
            lines: []
        });
    }
    groups.get(sort).lines.push(line);
}

console.log(`\n共发现 ${groups.size} 个分组`);

// 按 sort 值排序并生成文件
const sortedSorts = Array.from(groups.keys()).sort((a, b) => parseInt(a) - parseInt(b));

for (const sort of sortedSorts) {
    const group = groups.get(sort);
    const chunk = group.lines;

    // 构建文件内容（包含表头）
    const fileContent = [header, ...chunk].join('\n');

    // 生成文件名: chapter_XXX_章节名称.csv
    const safeTitle = group.title.replace(/[\\/:*?"<>|]/g, '_');
    const fileName = `chapter_${String(sort).padStart(3, '0')}_${safeTitle}.csv`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    // 写入文件
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`已生成: ${fileName} (${chunk.length} 行数据)`);
}

console.log('\n分割完成！');
console.log(`文件保存在 ${OUTPUT_DIR}/ 目录中`);

// 解析CSV行（处理引号内的逗号）
function parseCSVLine(line) {
    const parts = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            parts.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    parts.push(current);

    return parts;
}
