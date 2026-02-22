<template>
  <div class="ielts-view">
    <!-- 章节选择页面 -->
    <div v-if="!selectedChapter" class="chapter-select">
      <div class="select-header">
        <h1>🌍 雅思词汇</h1>
        <p class="subtitle">请选择要学习的章节</p>
      </div>
      
      <div class="chapters-grid">
        <div 
          v-for="chapter in chapters" 
          :key="chapter.id"
          class="chapter-card"
          @click="selectChapter(chapter.id)"
        >
          <div class="chapter-icon-large">{{ chapter.icon }}</div>
          <h3 class="chapter-title">{{ chapter.name }}</h3>
          <p class="chapter-desc">共 {{ chapter.count }} 个单词</p>
          <span class="start-btn">开始学习</span>
        </div>
      </div>
    </div>
    
    <!-- 单词学习页面 -->
    <div v-else class="study-view">
      <div class="study-header">
        <button class="back-btn" @click="backToChapters">
          ← 返回章节列表
        </button>
        <h1>{{ currentChapterName }}</h1>
        <p class="progress">进度: {{ currentIndex + 1 }} / {{ currentWords.length }}</p>
      </div>
      
      <div class="card-wrapper">
        <WordCard 
          v-if="currentWords.length > 0" 
          :word="currentWord" 
          @known="nextWord"
          @unknown="nextWord"
        />
        <div v-else class="empty-state">
          <p>加载中...</p>
        </div>
      </div>
      
      <div class="navigation" v-if="currentWords.length > 0">
        <button class="nav-btn" @click="prevWord" :disabled="currentIndex === 0">
          ← 上一个
        </button>
        <button class="nav-btn" @click="nextWord" :disabled="currentIndex === currentWords.length - 1">
          下一个 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import WordCard from '../components/WordCard.vue'

const chapters = ref([
  { id: 'animals', name: 'Chapter 3 动物保护', icon: '🦁', count: 0, file: '/data/ielts_animals.csv' },
  { id: 'education', name: 'Chapter 5 学校教育', icon: '🎓', count: 0, file: '/data/ielts_education.csv' }
])

const selectedChapter = ref('')
const wordsMap = ref(new Map())
const currentIndex = ref(0)

const currentWords = computed(() => {
  return wordsMap.value.get(selectedChapter.value) || []
})

const currentWord = computed(() => currentWords.value[currentIndex.value] || {})

const currentChapterName = computed(() => {
  const chapter = chapters.value.find(c => c.id === selectedChapter.value)
  return chapter ? chapter.name : '雅思词汇'
})

// 解析CSV文件
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const words = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    // 处理包含逗号的字段
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    if (values.length >= 7) {
      words.push({
        word: values[0].replace(/"/g, ''),
        meaning: values[1].replace(/"/g, ''),
        sort: values[2].replace(/"/g, ''),
        title: values[3].replace(/"/g, ''),
        phonetic: values[4].replace(/"/g, ''),
        english_meaning: values[5].replace(/"/g, ''),
        example: values[6].replace(/"/g, '')
      })
    }
  }
  
  return words
}

onMounted(async () => {
  // 加载所有章节数据
  for (const chapter of chapters.value) {
    try {
      const response = await fetch(chapter.file)
      if (response.ok) {
        const csvText = await response.text()
        const words = parseCSV(csvText)
        wordsMap.value.set(chapter.id, words)
        chapter.count = words.length
      }
    } catch (error) {
      console.error(`加载章节 ${chapter.name} 失败:`, error)
    }
  }
  
  // 默认不选择章节
  if (chapters.value.length > 0) {
    selectedChapter.value = null
  }
})

const selectChapter = (chapterId) => {
  selectedChapter.value = chapterId
  currentIndex.value = 0
}

const backToChapters = () => {
  selectedChapter.value = ''
  currentIndex.value = 0
}

const nextWord = () => {
  if (currentIndex.value < currentWords.value.length - 1) {
    currentIndex.value++
  }
}

const prevWord = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
</script>

<style scoped>
.ielts-view {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f5f9f5 0%, #e8f5e8 100%);
}

/* 章节选择页面 */
.chapter-select {
  padding: 30px 15px;
  min-height: calc(100vh - 60px);
}

.select-header {
  text-align: center;
  margin-bottom: 30px;
}

.select-header h1 {
  font-size: 1.8rem;
  color: #2d5a2d;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1rem;
  color: #5a8a5e;
}

.chapters-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.chapter-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 2px solid #2d5a2d;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 100, 0, 0.1);
}

.chapter-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 100, 0, 0.15);
  background: #f8fdf8;
}

.chapter-icon-large {
  font-size: 2.5rem;
  margin-right: 15px;
}

.chapter-title {
  flex: 1;
  font-size: 1.1rem;
  color: #2d5a2d;
  font-weight: 600;
}

.chapter-desc {
  font-size: 0.85rem;
  color: #666;
  margin-right: 15px;
}

.start-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #2d5a2d 0%, #3d7a3d 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 单词学习页面 */
.study-view {
  padding: 20px 15px;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.study-header {
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 15px;
  background: transparent;
  border: 2px solid #2d5a2d;
  color: #2d5a2d;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #2d5a2d;
  color: white;
}

.study-header h1 {
  font-size: 1.4rem;
  color: #2d5a2d;
  margin-bottom: 8px;
}

.progress {
  color: #5a8a5e;
  font-size: 0.95rem;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
}

.empty-state {
  text-align: center;
  color: #666;
  font-size: 1rem;
}

.navigation {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.nav-btn {
  padding: 10px 25px;
  background: #2d5a2d;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover:not(:disabled) {
  background: #3d7a3d;
  transform: translateY(-2px);
}

.nav-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 小屏手机横屏 */
@media (min-width: 480px) {
  .chapter-select {
    padding: 40px 20px;
  }
  
  .select-header h1 {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .chapter-icon-large {
    font-size: 3rem;
    margin-right: 20px;
  }
  
  .chapter-title {
    font-size: 1.25rem;
  }
  
  .chapter-desc {
    font-size: 0.9rem;
  }
  
  .study-view {
    padding: 30px 20px;
  }
  
  .study-header h1 {
    font-size: 1.6rem;
  }
  
  .back-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

/* 平板端 */
@media (min-width: 768px) {
  .ielts-view {
    min-height: calc(100vh - 65px);
  }
  
  .chapter-select {
    padding: 50px 30px;
    min-height: calc(100vh - 65px);
  }
  
  .select-header {
    margin-bottom: 40px;
  }
  
  .select-header h1 {
    font-size: 2.6rem;
  }
  
  .chapters-grid {
    gap: 20px;
  }
  
  .chapter-card {
    padding: 25px 30px;
  }
  
  .chapter-icon-large {
    font-size: 3.5rem;
    margin-right: 25px;
  }
  
  .chapter-title {
    font-size: 1.4rem;
  }
  
  .chapter-desc {
    font-size: 1rem;
    margin-right: 20px;
  }
  
  .start-btn {
    padding: 10px 25px;
    font-size: 1rem;
  }
  
  .study-view {
    padding: 35px 30px;
    min-height: calc(100vh - 65px);
  }
  
  .study-header {
    margin-bottom: 25px;
  }
  
  .study-header h1 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  
  .progress {
    font-size: 1.05rem;
  }
  
  .navigation {
    gap: 20px;
    margin-top: 25px;
  }
  
  .nav-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }
}

/* 桌面端 */
@media (min-width: 1024px) {
  .ielts-view {
    min-height: calc(100vh - 70px);
  }
  
  .chapter-select {
    padding: 60px 40px;
    min-height: calc(100vh - 70px);
  }
  
  .select-header h1 {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .chapters-grid {
    max-width: 800px;
    gap: 25px;
  }
  
  .chapter-card {
    padding: 30px 40px;
  }
  
  .chapter-card:hover {
    transform: translateY(-5px);
  }
  
  .chapter-icon-large {
    font-size: 4rem;
  }
  
  .chapter-title {
    font-size: 1.5rem;
  }
  
  .study-view {
    padding: 40px;
    min-height: calc(100vh - 70px);
  }
  
  .study-header {
    margin-bottom: 30px;
  }
  
  .study-header h1 {
    font-size: 2rem;
  }
  
  .progress {
    font-size: 1.1rem;
  }
  
  .empty-state {
    font-size: 1.2rem;
  }
  
  .navigation {
    margin-top: 30px;
  }
}
</style>
