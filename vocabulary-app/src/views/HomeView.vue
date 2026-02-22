<template>
  <div class="home-view">
    <div class="hero-section">
      <h1 class="title">📚 单词记忆助手</h1>
      <p class="subtitle">选择你的学习等级，开始记忆单词之旅</p>
    </div>
    
    <div class="cards-container">
      <router-link to="/level4" class="level-card">
        <div class="card-icon">📝</div>
        <h2 class="card-title">四级词汇</h2>
        <p class="card-desc">大学英语四级考试核心词汇</p>
        <span class="card-btn">开始学习</span>
      </router-link>
      
      <router-link to="/level6" class="level-card">
        <div class="card-icon">📖</div>
        <h2 class="card-title">六级词汇</h2>
        <p class="card-desc">大学英语六级考试核心词汇</p>
        <span class="card-btn">开始学习</span>
      </router-link>
      
      <router-link to="/ielts" class="level-card">
        <div class="card-icon">🌍</div>
        <h2 class="card-title">雅思词汇</h2>
        <p class="card-desc">雅思考试分类词汇，按章节学习</p>
        <span class="card-btn">开始学习</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: calc(100vh - 60px);
  padding: 30px 15px;
  background: linear-gradient(135deg, #f5f9f5 0%, #e8f5e8 100%);
}

.hero-section {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 1.8rem;
  color: #2d5a2d;
  margin-bottom: 10px;
  font-weight: 700;
}

.subtitle {
  font-size: 1rem;
  color: #5a8a5e;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.level-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 100, 0, 0.1);
  border: 2px solid #2d5a2d;
  text-decoration: none;
  transition: all 0.3s;
  width: 100%;
  max-width: 320px;
}

.level-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 100, 0, 0.2);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.4rem;
  color: #2d5a2d;
  margin-bottom: 10px;
  font-weight: 700;
}

.card-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.card-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #2d5a2d 0%, #3d7a3d 100%);
  color: white;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.level-card:hover .card-btn {
  background: linear-gradient(135deg, #3d7a3d 0%, #4d9a4d 100%);
}

/* 小屏手机横屏 */
@media (min-width: 480px) {
  .home-view {
    padding: 40px 20px;
  }
  
  .title {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .level-card {
    padding: 35px 30px;
    max-width: 280px;
  }
}

/* 平板 */
@media (min-width: 768px) {
  .home-view {
    min-height: calc(100vh - 65px);
    padding: 50px 30px;
  }
  
  .hero-section {
    margin-bottom: 50px;
  }
  
  .title {
    font-size: 2.6rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .cards-container {
    gap: 30px;
  }
  
  .level-card {
    padding: 45px 35px;
    max-width: 300px;
  }
  
  .card-icon {
    font-size: 3.5rem;
  }
  
  .card-title {
    font-size: 1.6rem;
  }
  
  .card-desc {
    font-size: 0.95rem;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .home-view {
    min-height: calc(100vh - 70px);
    padding: 60px 40px;
  }
  
  .hero-section {
    margin-bottom: 60px;
  }
  
  .title {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 1.3rem;
  }
  
  .cards-container {
    gap: 40px;
  }
  
  .level-card {
    padding: 50px 40px;
    max-width: 320px;
  }
  
  .level-card:hover {
    transform: translateY(-10px);
  }
  
  .card-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }
  
  .card-title {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
  
  .card-desc {
    font-size: 1rem;
    margin-bottom: 30px;
    line-height: 1.6;
  }
  
  .card-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }
}
</style>
