import { computed } from 'vue'
import { instruments } from '@/data/instruments'
import { socialPlatforms, type SocialPlatform } from '@/data/social'
import { newsSources, type NewsSource } from '@/data/news'
import { communityBoards } from '@/data/community'
import { NEWS_REGION_ACCENTS, DEFAULT_NEWS_ACCENT } from '@/constants'

export function useDataMaps() {
  const instrumentMap = computed(
    () => new Map(instruments.map((instrument) => [instrument.id, instrument] as const))
  )

  const snsPlatformMap = computed(
    () => new Map(socialPlatforms.map((platform) => [platform.id, platform] as const))
  )

  const allPlatformIds = computed(() => socialPlatforms.map((platform) => platform.id))

  const newsSourceMap = computed(
    () => new Map(newsSources.map((source) => [source.id, source] as const))
  )

  const allNewsSourceIds = computed(() => newsSources.map((source) => source.id))

  const newsPublishers = computed(() =>
    newsSources.map((source) => ({
      id: source.id,
      label: source.label,
      region: source.region,
      accent: NEWS_REGION_ACCENTS[source.region] ?? DEFAULT_NEWS_ACCENT,
      icon: source.icon,
      iconUrl: source.iconUrl
    }))
  )

  const communityBoardMap = computed(
    () => new Map(communityBoards.map((board) => [board.slug, board] as const))
  )

  const communityBoardsByActivity = computed(() =>
    [...communityBoards].sort((a, b) => (b.metrics.postsToday ?? 0) - (a.metrics.postsToday ?? 0))
  )

  return {
    instrumentMap,
    snsPlatformMap,
    allPlatformIds,
    newsSourceMap,
    allNewsSourceIds,
    newsPublishers,
    communityBoardMap,
    communityBoardsByActivity
  }
}


