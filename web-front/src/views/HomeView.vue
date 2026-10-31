<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { fetchHomeVisitsApi, recordHomeVisitApi } from '@/api/stats'
import { features, site, stats } from '@/data/site'

const VISIT_FLAG = 'lanzhi_home_visit'

const visits = ref<number | null>(null)

function formatVisits(value: number) {
  return value.toLocaleString('zh-CN')
}

onMounted(async () => {
  try {
    const already = sessionStorage.getItem(VISIT_FLAG)
    const res = already
      ? ((await fetchHomeVisitsApi()) as { data: { visits: number } })
      : ((await recordHomeVisitApi()) as { data: { visits: number } })
    if (!already) {
      sessionStorage.setItem(VISIT_FLAG, '1')
    }
    visits.value = Number(res.data.visits) || 0
  } catch {
    visits.value = null
  }
})
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero__grid">
        <div class="reveal">
          <div class="hero__brand">
            <BrandLogo size="md" />
            <p class="hero__kicker">LANZHI AI</p>
          </div>
          <h1 class="hero__title">{{ site.slogan }}</h1>
          <p class="hero__desc">
            澜知为企业提供可登录、可演示、可落地的 AI 服务。视觉智能、场景定制与系统接入，都在同一套工作台里推进。先试用现有能力，再按你的业务往下做。
          </p>
          <div class="hero__actions">
            <router-link class="btn btn--primary" to="/login">进入 AI 工作台</router-link>
            <router-link class="btn btn--ghost" to="/services">了解 AI 服务</router-link>
          </div>
        </div>

        <aside class="hero__panel reveal reveal-delay-2" aria-label="服务速览">
          <div class="hero__row hero__row--visits">
            <span>网站访客</span>
            <strong>{{ visits == null ? '—' : formatVisits(visits) }}</strong>
          </div>
          <div class="hero__row">
            <span>服务形态</span>
            <strong>可登录的 AI 工作台</strong>
          </div>
          <div class="hero__row">
            <span>能力方向</span>
            <strong>视觉 · 定制 · 接入</strong>
          </div>
          <div class="hero__row">
            <span>如何开始</span>
            <strong>注册 / 登录即可体验</strong>
          </div>
          <div class="hero__row">
            <span>合作方式</span>
            <strong>评估 · 试用 · 陪跑落地</strong>
          </div>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="stats">
          <article class="stat-card">
            <strong>{{ visits == null ? '—' : formatVisits(visits) }}</strong>
            <span>网站访客</span>
          </article>
          <article v-for="item in stats" :key="item.label" class="stat-card">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section__title">AI 服务，要能真正帮上忙</h2>
        <p class="section__lead">
          少一点空泛概念，多一套能开通、能看结果、能管权限的服务。适合内部试用，也适合拿给客户看。
        </p>
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
            <h2>先体验，再按你的业务加深</h2>
            <p>登录工作台使用已开放的 AI 能力。若要定制模型或接入现有系统，欢迎直接联系我们。</p>
          </div>
          <router-link class="btn btn--primary" to="/contact">预约沟通</router-link>
        </div>
      </div>
    </section>
  </div>
</template>
