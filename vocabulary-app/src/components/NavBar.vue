<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/" class="brand-link">
        📚 单词记忆
      </router-link>
    </div>
    <div class="nav-links">
      <router-link to="/level4" class="nav-link" active-class="active">
        四级词汇
      </router-link>
      <router-link to="/level6" class="nav-link" active-class="active">
        六级词汇
      </router-link>
      <router-link to="/ielts" class="nav-link" active-class="active">
        雅思词汇
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: linear-gradient(135deg, #2d5a2d 0%, #3d7a3d 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-brand {
  font-size: 1.2rem;
  font-weight: 700;
}

.brand-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.brand-link:hover {
  opacity: 0.8;
}

.nav-links {
  display: flex;
  gap: 5px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s;
  font-weight: 500;
  font-size: 0.9rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

/* 平板设备 */
@media (min-width: 768px) {
  .navbar {
    padding: 0 30px;
    height: 65px;
  }
  
  .nav-brand {
    font-size: 1.4rem;
  }
  
  .nav-link {
    padding: 10px 18px;
    font-size: 1rem;
  }
}

/* 桌面设备 */
@media (min-width: 1024px) {
  .navbar {
    padding: 0 40px;
    height: 70px;
  }
  
  .nav-brand {
    font-size: 1.5rem;
  }
  
  .nav-links {
    gap: 10px;
  }
  
  .nav-link {
    padding: 10px 20px;
  }
}
</style>
