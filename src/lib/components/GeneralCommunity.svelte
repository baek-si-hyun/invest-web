<script lang="ts">
  import {
    communityBoards,
    featuredCommunityPosts,
    trendingCommunityTags
  } from '$lib/data/community';

  const sortedBoards = [...communityBoards].sort(
    (a, b) => (b.metrics.postsToday ?? 0) - (a.metrics.postsToday ?? 0)
  );
  const boardShowcase = sortedBoards.slice(0, 6);
  const feed = featuredCommunityPosts;
  const boardMap = new Map(communityBoards.map((board) => [board.slug, board]));
</script>

<section class="community-general">
  <section class="community-body">
    <div class="feed">
      <div class="section-header">
        <div>
          <p class="section-eyebrow">실시간 토론</p>
          <h3>커뮤니티 하이라이트</h3>
        </div>
        <button type="button" class="ghost-button">모든 게시글</button>
      </div>
      <div class="feed-list">
        {#each feed as post}
          {@const board = boardMap.get(post.boardSlug)}
          <article class="feed-card">
            <div class="feed-card__meta">
              <span class="feed-card__board">{board?.emoji} {board?.title ?? '커뮤니티'}</span>
            </div>
            <h4>{post.title}</h4>
            <p>{post.summary}</p>
            <div class="feed-card__footer">
              <span>{post.author}</span>
              <span>{post.postedAt}</span>
              <span>좋아요 {post.likes}</span>
              <span>댓글 {post.comments}</span>
            </div>
            <div class="feed-card__tags">
              {#each post.tags as tag}
                <span>{tag}</span>
              {/each}
            </div>
          </article>
        {/each}
      </div>
    </div>
    <aside class="sidebar">
      <section class="board-stack">
        <header>
          <p class="section-eyebrow">주제별 보드</p>
          <h3>지금 활발한 곳</h3>
        </header>
        <div class="board-grid">
          {#each boardShowcase as board}
            <article>
              <span class="board-grid__emoji" aria-hidden="true">{board.emoji}</span>
              <div>
                <strong>{board.title}</strong>
                <p>{board.description}</p>
              </div>
              <div class="board-grid__stat">
                오늘 {board.metrics.postsToday}건
              </div>
            </article>
          {/each}
        </div>
      </section>
      <section class="tag-panel">
        <header>
          <p class="section-eyebrow">트렌딩 태그</p>
          <h3>키워드 레이더</h3>
        </header>
        <ul>
          {#each trendingCommunityTags as tag}
            <li>
              <div>
                <strong>{tag.label}</strong>
                <span>{tag.change}</span>
              </div>
              <p>{tag.usage}회 언급</p>
            </li>
          {/each}
        </ul>
      </section>
    </aside>
  </section>
</section>

<style>
  .community-general {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .community-body {
    display: grid;
    grid-template-columns: minmax(0, 2.5fr) minmax(260px, 1fr);
    gap: 24px;
  }

  .feed {
    border-radius: 20px;
    background: var(--c-bg-800);
    border: 1px solid var(--c-border-strong);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-eyebrow {
    margin: 0;
    font-size: 0.78rem;
    color: var(--c-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .section-header h3 {
    margin: 4px 0 0;
    font-size: 1.3rem;
  }

  .ghost-button {
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid var(--c-border);
    background: transparent;
    color: var(--c-text-secondary);
    cursor: pointer;
    font-size: 0.85rem;
  }

  .ghost-button:hover {
    color: var(--c-text-primary);
    border-color: var(--c-border-hover);
  }

  .feed-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .feed-card {
    border-radius: 16px;
    border: 1px solid var(--c-border);
    padding: 18px;
    background: var(--c-bg-900);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .feed-card__meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    color: var(--c-text-muted);
  }

  .feed-card h4 {
    margin: 0;
    font-size: 1.05rem;
  }

  .feed-card p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--c-text-secondary);
    line-height: 1.5;
  }

  .feed-card__footer {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 0.78rem;
    color: var(--c-text-muted);
  }

  .feed-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .feed-card__tags span {
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--c-bg-800);
    border: 1px solid var(--c-border);
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .board-stack,
  .tag-panel {
    border-radius: 20px;
    border: 1px solid var(--c-border-strong);
    background: var(--c-bg-800);
    padding: 20px;
  }

  .board-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 12px;
  }

  .board-grid article {
    border-radius: 16px;
    border: 1px solid var(--c-border);
    padding: 14px;
    background: var(--c-bg-900);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .board-grid__emoji {
    font-size: 1.4rem;
  }

  .board-grid strong {
    font-size: 1rem;
  }

  .board-grid p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--c-text-secondary);
  }

  .board-grid__stat {
    font-size: 0.78rem;
    color: var(--c-text-muted);
  }

  .tag-panel ul {
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .tag-panel li {
    border: 1px solid var(--c-border);
    border-radius: 14px;
    padding: 12px;
    background: var(--c-bg-900);
  }

  .tag-panel li div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .tag-panel li span {
    color: var(--c-link);
    font-weight: 600;
    font-size: 0.86rem;
  }

  .tag-panel li p {
    margin: 6px 0 0;
    font-size: 0.78rem;
    color: var(--c-text-muted);
  }

  /* 반응형 브레이크포인트 */
  /* Large Desktop: 1440px+ */
  @media (min-width: 1440px) {
    .community-general {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .feed {
      padding: 32px;
    }
    
    .section-header h3 {
      font-size: 1.5rem;
    }
    
    .board-stack,
    .tag-panel {
      padding: 28px;
    }
  }

  /* Desktop: 1200px - 1439px */
  @media (max-width: 1439px) and (min-width: 1200px) {
    .community-general {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .feed {
      padding: 28px;
    }
    
    .board-stack,
    .tag-panel {
      padding: 24px;
    }
  }

  /* Tablet Landscape: 1024px - 1199px */
  @media (max-width: 1199px) and (min-width: 1024px) {
    .community-general {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .community-body {
      grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
      gap: 20px;
    }
    
    .feed {
      padding: 24px;
    }
    
    .board-stack,
    .tag-panel {
      padding: 20px;
    }
  }

  /* Tablet Portrait: 768px - 1023px */
  @media (max-width: 1023px) and (min-width: 768px) {
    .community-body {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .feed {
      padding: 20px;
    }
    
    .section-header h3 {
      font-size: 1.2rem;
    }
    
    .board-stack,
    .tag-panel {
      padding: 18px;
    }
    
    .board-grid {
      gap: 12px;
    }
    
    .board-grid article {
      padding: 12px;
    }
  }

  /* Mobile Landscape: 640px - 767px */
  @media (max-width: 767px) and (min-width: 640px) {
    .community-general {
      gap: 20px;
    }
    
    .community-body {
      gap: 18px;
    }
    
    .feed {
      padding: 18px;
      border-radius: 16px;
    }
    
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .section-header h3 {
      font-size: 1.1rem;
    }
    
    .ghost-button {
      align-self: flex-start;
      padding: 6px 12px;
      font-size: 0.8rem;
    }
    
    .feed-card {
      padding: 16px;
    }
    
    .feed-card h4 {
      font-size: 1rem;
    }
    
    .feed-card p {
      font-size: 0.85rem;
    }
    
    .board-stack,
    .tag-panel {
      padding: 16px;
      border-radius: 16px;
    }
    
    .board-grid article {
      padding: 10px;
    }
    
    .tag-panel li {
      padding: 10px;
    }
  }

  /* Mobile Portrait: 480px - 639px */
  @media (max-width: 639px) and (min-width: 480px) {
    .community-general {
      gap: 16px;
    }
    
    .community-body {
      gap: 16px;
    }
    
    .feed {
      padding: 16px;
      border-radius: 12px;
    }
    
    .section-header h3 {
      font-size: 1rem;
    }
    
    .section-eyebrow {
      font-size: 0.75rem;
    }
    
    .ghost-button {
      padding: 5px 10px;
      font-size: 0.75rem;
    }
    
    .feed-card {
      padding: 14px;
      border-radius: 12px;
    }
    
    .feed-card h4 {
      font-size: 0.95rem;
    }
    
    .feed-card p {
      font-size: 0.8rem;
    }
    
    .feed-card__footer {
      font-size: 0.75rem;
      gap: 8px;
    }
    
    .feed-card__tags span {
      font-size: 0.7rem;
      padding: 3px 8px;
    }
    
    .board-stack,
    .tag-panel {
      padding: 14px;
      border-radius: 12px;
    }
    
    .board-grid article {
      padding: 8px;
      border-radius: 12px;
    }
    
    .board-grid strong {
      font-size: 0.9rem;
    }
    
    .board-grid p {
      font-size: 0.8rem;
    }
    
    .tag-panel li {
      padding: 8px;
      border-radius: 10px;
    }
    
    .tag-panel li div {
      font-size: 0.85rem;
    }
    
    .tag-panel li span {
      font-size: 0.8rem;
    }
    
    .tag-panel li p {
      font-size: 0.75rem;
    }
  }

  /* Small Mobile: 320px - 479px */
  @media (max-width: 479px) {
    .community-general {
      gap: 12px;
    }
    
    .community-body {
      gap: 12px;
    }
    
    .feed {
      padding: 12px;
      border-radius: 8px;
    }
    
    .section-header h3 {
      font-size: 0.9rem;
    }
    
    .section-eyebrow {
      font-size: 0.7rem;
    }
    
    .ghost-button {
      padding: 4px 8px;
      font-size: 0.7rem;
    }
    
    .feed-card {
      padding: 12px;
      border-radius: 8px;
    }
    
    .feed-card h4 {
      font-size: 0.9rem;
    }
    
    .feed-card p {
      font-size: 0.75rem;
    }
    
    .feed-card__footer {
      font-size: 0.7rem;
      gap: 6px;
    }
    
    .feed-card__tags {
      gap: 6px;
    }
    
    .feed-card__tags span {
      font-size: 0.65rem;
      padding: 2px 6px;
    }
    
    .board-stack,
    .tag-panel {
      padding: 12px;
      border-radius: 8px;
    }
    
    .board-grid {
      gap: 8px;
    }
    
    .board-grid article {
      padding: 6px;
      border-radius: 8px;
    }
    
    .board-grid__emoji {
      font-size: 1.2rem;
    }
    
    .board-grid strong {
      font-size: 0.85rem;
    }
    
    .board-grid p {
      font-size: 0.75rem;
    }
    
    .board-grid__stat {
      font-size: 0.7rem;
    }
    
    .tag-panel ul {
      gap: 8px;
    }
    
    .tag-panel li {
      padding: 6px;
      border-radius: 6px;
    }
    
    .tag-panel li div {
      font-size: 0.8rem;
    }
    
    .tag-panel li span {
      font-size: 0.75rem;
    }
    
    .tag-panel li p {
      font-size: 0.7rem;
    }
  }

  /* 터치 디바이스 최적화 */
  @media (hover: none) and (pointer: coarse) {
    .ghost-button {
      min-height: 44px;
    }
    
    .feed-card {
      min-height: 44px;
    }
    
    .board-grid article {
      min-height: 44px;
    }
    
    .tag-panel li {
      min-height: 44px;
    }
  }

  /* 고해상도 디스플레이 */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .section-header h3 {
      font-weight: 700;
    }
    
    .feed-card h4 {
      font-weight: 700;
    }
  }

  /* 다크 모드 최적화 */
  @media (prefers-color-scheme: dark) {
    .community-general {
      background: var(--c-bg-900);
    }
  }
</style>
