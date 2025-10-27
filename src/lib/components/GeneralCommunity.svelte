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
    color: #4ade80;
    font-weight: 600;
    font-size: 0.86rem;
  }

  .tag-panel li p {
    margin: 6px 0 0;
    font-size: 0.78rem;
    color: var(--c-text-muted);
  }

  @media (max-width: 1080px) {
    .community-body {
      grid-template-columns: 1fr;
    }
  }
</style>
