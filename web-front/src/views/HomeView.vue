<script setup lang="ts">
import { features, site, stats } from '@/data/site'
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero__grid">
        <div class="reveal">
          <p class="hero__kicker">LANZHI AI</p>
          <h1 class="hero__title">{{ site.slogan }}</h1>
          <p class="hero__desc">
            澜知把大模型做成可登录、可审计的智能服务：客服、知识问答与流程助手，都在同一套权限里运行。
          </p>
          <div class="hero__actions">
            <router-link class="btn btn--primary" to="/login">登录工作台</router-link>
            <router-link class="btn btn--ghost" to="/services">了解能力</router-link>
          </div>
        </div>

        <aside class="hero__panel reveal reveal-delay-2" aria-label="服务速览">
          <div class="hero__row">
            <span>当前场景</span>
            <strong>企业知识问答</strong>
          </div>
          <div class="hero__row">
            <span>今日会话</span>
            <strong>1,286</strong>
          </div>
          <div class="hero__row">
            <span>自动办结</span>
            <strong>92%</strong>
          </div>
          <div class="hero__row">
            <span>平均首响</span>
            <strong>3 秒</strong>
          </div>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="stats">
          <article v-for="item in stats" :key="item.label" class="stat-card">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section__title">智能，要能落地</h2>
        <p class="section__lead">少一点演示幻觉，多一点能上线的服务。权限、数据和对话在同一条链路上。</p>
        <div class="feature-grid">
          <article v-for="item in features" :key="item.title" class="feature-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta">
          <div>
            <h2>把重复问答，交给可管控的智能服务</h2>
            <p>登录后进入工作台；需要落地评估，欢迎直接联系我们。</p>
          </div>
          <router-link class="btn btn--primary" to="/contact">预约沟通</router-link>
        </div>
      </div>
    </section>
  </div>
</template>
