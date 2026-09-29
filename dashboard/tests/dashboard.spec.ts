import { test, expect } from '@playwright/test'

test.describe('SFOOD AI 오피스 Dashboard v2.0', () => {

  test('01 — 홈 페이지 로드 및 전체 스크린샷', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    await page.screenshot({
      path: 'tests/screenshots/01-home-full.png',
      fullPage: true,
    })
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('02 — 헤더: 브랜딩 + KST 시계 + 동기화 버튼', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('header')
    await expect(page.locator('header')).toContainText('SFOOD AI 오피스')
    await expect(page.locator('header')).toContainText('KST')
    await expect(page.locator('button:has-text("동기화")')).toBeVisible()
    await page.screenshot({ path: 'tests/screenshots/02-header.png' })
  })

  test('03 — 운영 플로어와 3개 팀 표시', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'AI 운영 플로어' })).toBeVisible()
    await expect(page.getByText('Wiki 관리팀').first()).toBeVisible()
    await expect(page.getByText('AI 검색 품질팀').first()).toBeVisible()
    await expect(page.getByText('자동 검색팀').first()).toBeVisible()
    await page.screenshot({ path: 'tests/screenshots/03-office-floor.png', fullPage: true })
  })

  test('04 — 직원 카드 12개 + 사원 사진 렌더링', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    const cards = page.locator('[data-testid="agent-card"]')
    await expect(cards).toHaveCount(12)
    // 사원 사진이 실제 로드되는지 확인
    const photos = page.locator('img[src^="/employees/"]')
    expect(await photos.count()).toBeGreaterThanOrEqual(12)
    const firstPhoto = photos.first()
    await expect(firstPhoto).toBeVisible()
    const naturalWidth = await firstPhoto.evaluate((img: HTMLImageElement) => img.naturalWidth)
    expect(naturalWidth).toBeGreaterThan(0)
    await page.screenshot({ path: 'tests/screenshots/04-employee-cards.png', fullPage: true })
  })

  test('05 — 근무 일정 타임라인 실시간 표시', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    await expect(page.getByText('근무 일정', { exact: true })).toBeVisible()
    await page.screenshot({ path: 'tests/screenshots/05-schedule-timeline.png' })
  })

  test('06 — 직원 클릭 → 사원증 모달', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    await page.locator('[data-testid="agent-card"]').first().click()
    await expect(page.getByText('사번')).toBeVisible()
    await expect(page.getByText('담당 업무')).toBeVisible()
    await page.screenshot({ path: 'tests/screenshots/06-employee-id-card.png' })
    await page.keyboard.press('Escape')
    await expect(page.getByText('사번')).not.toBeVisible()
  })

  test('07 — 리포트 버튼 클릭 → Markdown 모달 렌더링', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    const reportBtn = page.locator('button:has-text("리포트")').first()
    const hasBtnVisible = await reportBtn.isVisible()
    if (!hasBtnVisible) {
      console.log('리포트 버튼 없음 (로컬 runs/ 비어있음) — 스킵')
      return
    }
    await reportBtn.click()
    await page.waitForSelector('article.prose', { timeout: 8000 })
    await expect(page.locator('article.prose')).toBeVisible()
    await page.screenshot({ path: 'tests/screenshots/07-markdown-modal.png' })
    await page.keyboard.press('Escape')
    await expect(page.locator('article.prose')).not.toBeVisible()
  })

  test('08 — 직원 근무 상태 칩 표시 (근무 사이클)', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    // 7-state 중 최소 하나의 상태 칩이 플로어에 표시되어야 함
    const stateChips = page.locator('text=/근무 중|차례 대기|전달 완료|출근 준비|업무 완료|휴식 중|자리 비움/')
    expect(await stateChips.count()).toBeGreaterThanOrEqual(12)  // 직원 12명 각자 상태 칩
    await page.screenshot({ path: 'tests/screenshots/08-state-chips.png', fullPage: true })
  })

  test('09 — 3D 오피스 렌더링', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    await expect(page.getByRole('heading', { name: '사무실 3D 뷰' })).toBeVisible()
    // WebGL 캔버스가 실제로 생성되는지
    const canvas = page.locator('.office-3d-canvas canvas')
    await expect(canvas).toBeVisible({ timeout: 20000 })
    const size = await canvas.evaluate((c: HTMLCanvasElement) => ({ w: c.width, h: c.height }))
    expect(size.w).toBeGreaterThan(100)
    expect(size.h).toBeGreaterThan(100)
    await page.locator('.office-3d-canvas').screenshot({ path: 'tests/screenshots/09-office-3d.png' })
  })

  test('10 — 푸터: 팀 수 + 재직 인원 표시', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('footer')
    await expect(page.locator('footer')).toContainText('3개 팀')
    await expect(page.locator('footer')).toContainText('12명 재직')
    await page.screenshot({ path: 'tests/screenshots/10-footer.png' })
  })

})
