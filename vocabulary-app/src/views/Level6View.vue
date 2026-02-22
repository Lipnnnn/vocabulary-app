<template>
  <div class="level-view">
    <div class="header">
      <h1>📖 六级词汇</h1>
      <p class="progress">进度: {{ currentIndex + 1 }} / {{ words.length }}</p>
    </div>
    
    <div class="card-wrapper">
      <WordCard 
        v-if="words.length > 0" 
        :word="currentWord" 
        @known="nextWord"
        @unknown="nextWord"
      />
      <div v-else class="empty-state">
        <p>暂无词汇数据</p>
      </div>
    </div>
    
    <div class="navigation">
      <button class="nav-btn" @click="prevWord" :disabled="currentIndex === 0">
        ← 上一个
      </button>
      <button class="nav-btn" @click="nextWord" :disabled="currentIndex === words.length - 1">
        下一个 →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import WordCard from '../components/WordCard.vue'

const words = ref([])
const currentIndex = ref(0)

const currentWord = computed(() => words.value[currentIndex.value] || {})

onMounted(async () => {
  // 六级词汇数据 - 示例数据
  words.value = [
    {
      word: 'ambiguous',
      phonetic: '/æmˈbɪɡjuəs/',
      english_meaning: 'Having more than one possible meaning; unclear or uncertain.',
      meaning: 'adj. 模棱两可的，含糊不清的',
      example: 'For example, if a sentence can be understood in two different ways, it is ambiguous.'
    },
    {
      word: 'comprehensive',
      phonetic: '/ˌkɒmprɪˈhensɪv/',
      english_meaning: 'Including everything or nearly everything; thorough and complete.',
      meaning: 'adj. 全面的，综合的',
      example: 'For example, a comprehensive report covers all aspects of a topic.'
    },
    {
      word: 'deteriorate',
      phonetic: '/dɪˈtɪəriəreɪt/',
      english_meaning: 'To become worse in quality or condition; to decline.',
      meaning: 'v. 恶化，退化',
      example: 'For example, old buildings may deteriorate if not properly maintained.'
    }
  ]
})

const nextWord = () => {
  if (currentIndex.value < words.value.length - 1) {
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
.level-view {
  min-height: calc(100vh - 60px);
  padding: 20px 15px;
  background: linear-gradient(135deg, #f5f9f5 0%, #e8f5e8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  color: #2d5a2d;
  font-size: 1.5rem;
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
  .level-view {
    padding: 30px 20px;
  }
  
  .header h1 {
    font-size: 1.7rem;
  }
  
  .progress {
    font-size: 1rem;
  }
}

/* 平板 */
@media (min-width: 768px) {
  .level-view {
    min-height: calc(100vh - 65px);
    padding: 35px 30px;
  }
  
  .header {
    margin-bottom: 25px;
  }
  
  .header h1 {
    font-size: 1.9rem;
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

/* 桌面 */
@media (min-width: 1024px) {
  .level-view {
    min-height: calc(100vh - 70px);
    padding: 40px;
  }
  
  .header {
    margin-bottom: 30px;
  }
  
  .header h1 {
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
