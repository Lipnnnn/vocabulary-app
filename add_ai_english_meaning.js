const fs = require('fs');
const path = require('path');

// 配置 - 使用 OpenAI 兼容的 API
const API_CONFIG = {
  // 阿里云百炼配置
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', // API地址
  apiKey: 'sk-4e975e69880e4c1b8377bbbd5c30b614', // API密钥
  model: 'qwen-turbo', // 模型名称
  // 请求间隔（毫秒），避免请求过快
  delay: 500 // 请求间隔(毫秒)
};

// 主函数：读取CSV，使用AI添加英文释义
async function processCSV(inputFilePath, outputFilePath) {
  const inputFile = inputFilePath || path.join(__dirname, 'word_list.csv');
  const outputFile = outputFilePath || inputFile.replace('.csv', '_with_ai_english.csv');
  
  console.log(`正在处理文件: ${inputFile}`);
  
  // 读取CSV文件
  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  console.log(`共找到 ${lines.length - 1} 个单词需要处理`);
  
  // 处理每一行
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (i === 0) {
      // 表头行，添加两列：english_meaning 和 example
      newLines.push(line.trim() + ',english_meaning,example');
      console.log('已添加表头: english_meaning, example');
      continue;
    }
    
    // 解析CSV行
    const parts = parseCSVLine(line);
    if (parts.length < 2) {
      newLines.push(line);
      continue;
    }
    
    const word = parts[0].trim();
    const chineseMeaning = parts[1].trim();
    
    console.log(`\n[${i}/${lines.length - 1}] 处理单词: ${word}`);
    
    try {
      // 调用 AI API 生成英文解释
      const result = await generateEnglishMeaning(word, chineseMeaning);
      
      // 转义并添加到行
      const escapedMeaning = escapeCSVField(result.meaning);
      const escapedExample = escapeCSVField(result.example);
      newLines.push(line.trim() + ',' + escapedMeaning + ',' + escapedExample);
      
      console.log(`  英文释义: ${result.meaning.substring(0, 60)}...`);
      if (result.example) {
        console.log(`  示例: ${result.example.substring(0, 60)}...`);
      }
      
      // 延迟，避免请求过快
      if (i < lines.length - 1) {
        await sleep(API_CONFIG.delay);
      }
      
    } catch (error) {
      console.error(`  处理失败: ${error.message}`);
      // 失败时添加空值或错误标记
      newLines.push(line.trim() + ',"[Error: ' + error.message + ']",""');
    }
  }
  
  // 写入新文件
  fs.writeFileSync(outputFile, newLines.join('\n'), 'utf-8');
  console.log(`\n✅ 处理完成！新文件已保存为: ${outputFile}`);
  console.log(`共处理 ${lines.length - 1} 个单词`);
}

// 调用 AI API 生成英文解释
async function generateEnglishMeaning(word, chineseMeaning) {
  const prompt = `Please provide a simple, clear, and easy-to-understand English explanation for the following word. 

Word: "${word}"
Chinese meaning: ${chineseMeaning}

Requirements:
1. Use simple English that a 12-year-old can understand
2. Explain the meaning in 1-2 sentences
3. Include a simple example starting with "For example," on a new line
4. Focus on the most common usage
5. Avoid using the word itself in the explanation

Please respond in this exact format:
Meaning: [your explanation here]
Example: [your example here starting with For example,]`;

  const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful English teacher who explains words in simple, clear English. Always provide meaning and example in the specified format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API request failed: ${error}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid API response format');
  }

  const content = data.choices[0].message.content.trim();
  
  // 解析 meaning 和 example
  return parseMeaningAndExample(content);
}

// 解析 AI 返回的内容，分离 meaning 和 example
function parseMeaningAndExample(content) {
  const result = {
    meaning: '',
    example: ''
  };
  
  // 尝试匹配 "Meaning:" 和 "Example:" 格式
  const meaningMatch = content.match(/Meaning:\s*([\s\S]*?)(?=Example:|$)/i);
  const exampleMatch = content.match(/Example:\s*([\s\S]*)/i);
  
  if (meaningMatch) {
    result.meaning = meaningMatch[1].trim();
  }
  
  if (exampleMatch) {
    result.example = exampleMatch[1].trim();
  }
  
  // 如果没有匹配到格式，尝试用 "For example" 分割
  if (!result.meaning && !result.example) {
    const parts = content.split(/For example/i);
    result.meaning = parts[0].trim();
    if (parts.length > 1) {
      result.example = 'For example' + parts[1].trim();
    }
  }
  
  // 清理多余的换行符
  result.meaning = result.meaning.replace(/\n+/g, ' ').trim();
  result.example = result.example.replace(/\n+/g, ' ').trim();
  
  return result;
}

// 解析CSV行（处理引号）
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

// 转义CSV字段
function escapeCSVField(field) {
  if (!field) return '';
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

// 延迟函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 批量处理文件夹中的所有 CSV 文件
async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.csv'))
    .filter(file => !file.includes('_with_ai_english')) // 跳过已处理的文件
    .sort();
  
  console.log(`\n📁 发现 ${files.length} 个 CSV 文件需要处理\n`);
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(dirPath, file);
    const outputPath = inputPath.replace('.csv', '_with_ai_english.csv');
    
    console.log(`\n========================================`);
    console.log(`[${i + 1}/${files.length}] 处理文件: ${file}`);
    console.log(`========================================`);
    
    try {
      await processCSV(inputPath, outputPath);
    } catch (error) {
      console.error(`❌ 处理文件失败: ${file}`);
      console.error(`   错误: ${error.message}`);
    }
    
    // 文件之间添加额外延迟
    if (i < files.length - 1) {
      console.log(`\n⏳ 等待 ${API_CONFIG.delay}ms 后继续处理下一个文件...`);
      await sleep(API_CONFIG.delay);
    }
  }
  
  console.log(`\n\n🎉 所有文件处理完成！共处理 ${files.length} 个文件`);
}

// 主程序
async function main() {
  // 检查 API Key
  if (!API_CONFIG.apiKey) {
    console.error('❌ 错误: 未设置 OPENAI_API_KEY 环境变量');
    console.log('\n请设置以下环境变量之一:');
    console.log('  - OPENAI_API_KEY: 你的 API 密钥');
    console.log('  - OPENAI_BASE_URL: API 基础 URL (可选，默认使用 OpenAI)');
    console.log('  - OPENAI_MODEL: 模型名称 (可选，默认 gpt-3.5-turbo)');
    console.log('  - REQUEST_DELAY: 请求间隔毫秒 (可选，默认 500)');
    console.log('\n使用示例:');
    console.log('  处理单个文件:');
    console.log('    $env:OPENAI_API_KEY="your-api-key"; node add_ai_english_meaning.js words/words_001.csv');
    console.log('  批量处理整个文件夹:');
    console.log('    $env:OPENAI_API_KEY="your-api-key"; node add_ai_english_meaning.js chapter/');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const inputPath = args[0];

  if (!inputPath) {
    console.log('使用方法:');
    console.log('  处理单个文件: node add_ai_english_meaning.js <输入CSV文件> [输出CSV文件]');
    console.log('  批量处理文件夹: node add_ai_english_meaning.js <文件夹路径>/');
    console.log('\n示例:');
    console.log('  node add_ai_english_meaning.js words/words_001.csv');
    console.log('  node add_ai_english_meaning.js chapter/');
    process.exit(1);
  }

  try {
    // 判断是文件还是文件夹
    const stats = fs.statSync(inputPath);
    
    if (stats.isDirectory()) {
      // 批量处理文件夹
      await processDirectory(inputPath);
    } else {
      // 处理单个文件
      const outputPath = args[1];
      await processCSV(inputPath, outputPath);
    }
  } catch (error) {
    console.error('❌ 处理失败:', error.message);
    process.exit(1);
  }
}

main();
