<script setup lang="ts">
import { useTheme } from '@/stores/theme'
import { SECTIONS } from '@/constants'
import type { Section, Mode } from '@/types'

defineProps<{
  mode: Mode
  activeSection: Section | null
  generalSection: Section
  navHeight: number
}>()

const emit = defineEmits<{
  logoClick: []
  navClick: [section: Section]
  navPointerEnter: [section: Section]
  modeChange: [mode: Mode]
  pointerEnter: []
  pointerLeave: []
}>()

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <nav
    class="top-nav"
    :style="{ height: `${navHeight}px` }"
    @pointerenter="emit('pointerEnter')"
    @pointerleave="emit('pointerLeave')"
  >
    <button type="button" class="brand" @click="emit('logoClick')">
      <span class="brand__logo">INVEST</span>
      <span class="brand__mode">{{ mode === 'pro' ? 'PRO' : 'BASIC' }} HTS</span>
    </button>

    <ul class="menu" role="tablist">
      <li v-for="section in SECTIONS" :key="section.id">
        <button
          role="tab"
          type="button"
          :class="{
            active:
              mode === 'pro'
                ? activeSection === section.id
                : generalSection === section.id
          }"
          :aria-selected="
            mode === 'pro'
              ? activeSection === section.id
              : generalSection === section.id
          "
          @click="emit('navClick', section.id)"
          @pointerenter="emit('navPointerEnter', section.id)"
          @focus="emit('navPointerEnter', section.id)"
        >
          {{
            section.id === 'chart' && mode === 'general' ? '자산군' : section.label
          }}
        </button>
      </li>
    </ul>

    <div class="nav-right">
      <div class="mode-toggle" role="group" aria-label="화면 모드 전환">
        <button
          type="button"
          :class="{ active: mode === 'general' }"
          @click="emit('modeChange', 'general')"
        >
          일반
        </button>
        <button
          type="button"
          :class="{ active: mode === 'pro' }"
          @click="emit('modeChange', 'pro')"
        >
          트레이딩
        </button>
      </div>
      <button
        type="button"
        class="theme-toggle"
        :aria-label="`테마 전환 (${theme === 'dark' ? '라이트' : '다크'})`"
        @click="toggleTheme"
      >
        <div class="material-icons-round">
          {{ theme === 'dark' ? 'light_mode' : 'dark_mode' }}
        </div>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Navigation styles will be kept in HomeView.vue for now to maintain consistency */
</style>


