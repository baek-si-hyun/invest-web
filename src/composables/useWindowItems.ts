import type { SNSWindowState, NewsWindowState, CommunityWindowState } from '@/types'
import type { SocialPlatform } from '@/data/social'
import type { NewsSource } from '@/data/news'
import { socialPlatforms } from '@/data/social'
import { newsSources } from '@/data/news'
import { featuredCommunityPosts } from '@/data/community'

export type SNSListItem = SocialPlatform['posts'][number] & {
  platformId: string
  platformLabel: string
}

export type NewsListItem = NewsSource['headlines'][number] & {
  id: string
  sourceId: string
  sourceLabel: string
  region: string
}

export type CommunityListItem = (typeof featuredCommunityPosts)[number]

export function useWindowItems() {
  const getSNSItems = (platformIds: string[], allPlatformIds: string[]): SNSListItem[] => {
    const selected = platformIds.length ? new Set(platformIds) : new Set(allPlatformIds)
    const items: SNSListItem[] = []
    for (const platform of socialPlatforms) {
      if (!selected.has(platform.id)) continue
      for (const post of platform.posts) {
        items.push({ ...post, platformId: platform.id, platformLabel: platform.label })
      }
    }
    return items
  }

  const getNewsItems = (sourceIds: string[]): NewsListItem[] => {
    const selected = sourceIds.length
      ? new Set(sourceIds)
      : new Set(newsSources.map((source) => source.id))
    const items: NewsListItem[] = []
    for (const source of newsSources) {
      if (!selected.has(source.id)) continue
      source.headlines.forEach((headline, index) => {
        items.push({
          ...headline,
          id: `${source.id}-${index}`,
          sourceId: source.id,
          sourceLabel: source.label,
          region: source.region
        })
      })
    }
    return items
  }

  const getCommunityItems = (boardSlug: string | null): CommunityListItem[] => {
    if (!boardSlug) return featuredCommunityPosts
    return featuredCommunityPosts.filter((post) => post.boardSlug === boardSlug)
  }

  const getSNSWindowMeta = (
    window: SNSWindowState,
    allPlatformIds: string[],
    snsPlatformMap: Map<string, SocialPlatform>
  ) => {
    const selectedPlatforms = window.platforms
    const hasAllPlatforms = selectedPlatforms.length === allPlatformIds.length
    const platformLabels = selectedPlatforms.map(
      (id) => snsPlatformMap.get(id)?.label ?? id
    )
    const [firstPlatform] = selectedPlatforms
    const singlePlatform =
      !hasAllPlatforms && selectedPlatforms.length === 1 && firstPlatform
        ? snsPlatformMap.get(firstPlatform) ?? null
        : null
    const primaryPlatformLabel = hasAllPlatforms
      ? '전체'
      : platformLabels.length <= 2
        ? platformLabels.join(', ')
        : `${platformLabels.slice(0, 2).join(', ')} 외 ${platformLabels.length - 2}곳`
    const platformSubtitle = hasAllPlatforms
      ? '모든 플랫폼의 실시간 커뮤니티 업데이트를 한 곳에서 확인하세요.'
      : singlePlatform
        ? singlePlatform.description
        : `선택한 ${platformLabels.length}개 플랫폼의 실시간 커뮤니티 업데이트입니다.`
    const snsItems = getSNSItems(selectedPlatforms, allPlatformIds)
    return {
      hasAllPlatforms,
      platformLabels,
      primaryPlatformLabel,
      platformSubtitle,
      snsItems
    }
  }

  const getNewsWindowMeta = (
    window: NewsWindowState,
    newsSourceMap: Map<string, NewsSource>
  ) => {
    const selectedSources = window.sources
    const hasAllSources = selectedSources.length === newsSources.length
    const sourceLabels = selectedSources.map(
      (id) => newsSourceMap.get(id)?.label ?? id
    )
    const [firstSource] = selectedSources
    const singleSource =
      !hasAllSources && selectedSources.length === 1 && firstSource
        ? newsSourceMap.get(firstSource) ?? null
        : null
    const primarySourceLabel = hasAllSources
      ? '전체'
      : sourceLabels.length <= 2
        ? sourceLabels.join(', ')
        : `${sourceLabels.slice(0, 2).join(', ')} 외 ${sourceLabels.length - 2}곳`
    const sourceSubtitle = hasAllSources
      ? '신뢰도 높은 언론사의 최신 헤드라인을 모았습니다.'
      : singleSource
        ? `${singleSource.region} 주요 헤드라인`
        : `선택한 ${sourceLabels.length}개 언론사의 최신 헤드라인을 모았습니다.`
    const newsItems = getNewsItems(selectedSources)
    return {
      hasAllSources,
      sourceLabels,
      primarySourceLabel,
      sourceSubtitle,
      newsItems
    }
  }

  const getCommunityWindowMeta = (
    window: CommunityWindowState,
    communityBoardMap: Map<string, { title: string }>
  ) => {
    const boardFilter = window.selectedBoard
    const posts = getCommunityItems(boardFilter)
    const filterBoard = boardFilter ? communityBoardMap.get(boardFilter) ?? null : null
    const filterLabel = filterBoard ? filterBoard.title : '전체'
    return {
      boardFilter,
      filterBoard,
      filterLabel,
      posts
    }
  }

  const getSNSDetail = (items: SNSListItem[], index: number | null) =>
    index === null ? null : items[index] ?? null

  const getNewsDetail = (items: NewsListItem[], index: number | null) =>
    index === null ? null : items[index] ?? null

  const getCommunityDetail = (items: CommunityListItem[], index: number | null) =>
    index === null ? null : items[index] ?? null

  return {
    getSNSItems,
    getNewsItems,
    getCommunityItems,
    getSNSWindowMeta,
    getNewsWindowMeta,
    getCommunityWindowMeta,
    getSNSDetail,
    getNewsDetail,
    getCommunityDetail
  }
}

