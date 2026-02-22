<template>
  <div class="word-card-container" @click="flipCard">
    <div class="word-card" :class="{ flipped: isFlipped }">
      <!-- 卡片正面 -->
      <div class="card-face card-front">
        <div class="title-area" @click.stop="speakWord">
          <h2 class="word">{{ word.word }}</h2>
          <span class="phonetic">{{ word.phonetic }}</span>
          <div class="speaker-icon">🔊</div>
        </div>
        <div class="english-meaning-area">
          <p class="english-meaning">{{ word.english_meaning }}</p>
        </div>
        <div class="button-area">
          <button class="btn btn-unknown" @click.stop="markUnknown">不认识</button>
          <button class="btn btn-known" @click.stop="markKnown">认识</button>
        </div>
      </div>
      
      <!-- 卡片反面 -->
      <div class="card-face card-back">
        <div class="chinese-meaning-area">
          <h3>中文释义</h3>
          <p class="chinese-meaning">{{ word.meaning }}</p>
        </div>
        <div class="example-area" @click.stop="speakExample">
          <h3>例句</h3>
          <p class="example">{{ word.example }}</p>
          <div class="speaker-icon-small">🔊 点击朗读</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  word: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['known', 'unknown'])

const isFlipped = ref(false)

const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

const speakWord = () => {
  const utterance = new SpeechSynthesisUtterance(props.word.word)
  utterance.lang = 'en-US'
  utterance.rate = 0.8
  speechSynthesis.speak(utterance)
}

const speakExample = () => {
  const utterance = new SpeechSynthesisUtterance(props.word.example)
  utterance.lang = 'en-US'
  utterance.rate = 0.7
  speechSynthesis.speak(utterance)
}

const markKnown = () => {
  emit('known', props.word)
}

const markUnknown = () => {
  emit('unknown', props.word)
}
</script>

<style scoped>
.word-card-container {
  width: 90%;
  max-width: 500px;
  height: 350px;
  perspective: 1000px;
  cursor: pointer;
}

/* 小屏手机 */
@media (min-width: 375px) {
  .word-card-container {
    height: 380px;
  }
}

/* 平板 */
@media (min-width: 768px) {
  .word-card-container {
    height: 420px;
  }
}

.word-card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.word-card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 100, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: linear-gradient(135deg, #f5f9f5 0%, #e8f5e8 100%);
  border: 2px solid #2d5a2d;
}

.card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
}

/* 标题区域 */
.title-area {
  text-align: center;
  padding: 20px;
  background: rgba(45, 90, 45, 0.1);
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
  transition: background 0.3s;
}

.title-area:hover {
  background: rgba(45, 90, 45, 0.2);
}

.word {
  font-size: 1.8rem;
  color: #1a472a;
  margin: 0 0 8px 0;
  font-weight: 700;
}

@media (min-width: 768px) {
  .word {
    font-size: 2.2rem;
  }
}

@media (min-width: 1024px) {
  .word {
    font-size: 2.5rem;
  }
}

.phonetic {
  font-size: 1rem;
  color: #4a7c4e;
  font-style: italic;
}

@media (min-width: 768px) {
  .phonetic {
    font-size: 1.1rem;
  }
}

@media (min-width: 1024px) {
  .phonetic {
    font-size: 1.2rem;
  }
}

.speaker-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  opacity: 0.6;
}

/* 英文解释区域 */
.english-meaning-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.english-meaning {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
  text-align: center;
}

@media (min-width: 768px) {
  .english-meaning {
    font-size: 1.05rem;
    line-height: 1.7;
  }
}

@media (min-width: 1024px) {
  .english-meaning {
    font-size: 1.1rem;
    line-height: 1.8;
  }
}

/* 按钮区域 */
.button-area {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 20px;
}

.btn {
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

@media (min-width: 768px) {
  .btn {
    padding: 12px 35px;
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .btn {
    padding: 12px 40px;
  }
}

.btn-unknown {
  background: #dc3545;
  color: white;
}

.btn-unknown:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-known {
  background: #28a745;
  color: white;
}

.btn-known:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

/* 反面样式 */
.chinese-meaning-area,
.example-area {
  flex: 1;
  padding: 15px;
  text-align: center;
}

.chinese-meaning-area h3,
.example-area h3 {
  color: #2d5a2d;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.chinese-meaning {
  font-size: 1.1rem;
  color: #1a472a;
  font-weight: 600;
}

@media (min-width: 768px) {
  .chinese-meaning {
    font-size: 1.2rem;
  }
}

@media (min-width: 1024px) {
  .chinese-meaning {
    font-size: 1.3rem;
  }
}

.example-area {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  margin-top: 10px;
  position: relative;
  transition: background 0.3s;
}

.example-area:hover {
  background: rgba(255, 255, 255, 0.8);
}

.example {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.5;
  font-style: italic;
}

@media (min-width: 768px) {
  .example {
    font-size: 0.95rem;
    line-height: 1.6;
  }
}

@media (min-width: 1024px) {
  .example {
    font-size: 1rem;
  }
}

.speaker-icon-small {
  font-size: 0.9rem;
  color: #4a7c4e;
  margin-top: 10px;
  opacity: 0.7;
}
</style>
