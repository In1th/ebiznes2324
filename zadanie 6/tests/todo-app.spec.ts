import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

test.describe('Rendering', () => {
  test('Has titles', async ({ page }) => {
    expect(await page.title()).toBe('React • TodoMVC');
    const title = page.getByText('todos')
    await expect(title).toBeVisible();
  })

  test('Has demo info', async ({ page }) => {
    const info = page.getByText('This is just a demo of TodoMVC for testing, not the ');
    await expect(info).toBeVisible();
    expect(await info.getAttribute('style')).toContain('background-color: #ffee5b;');
    expect(await page.getByText('real TodoMVC app.').getAttribute('href')).toBe('https://todomvc.com/');
  })

  test('Has info footer', async ({ page }) => {
    await expect(page.locator('.info')).toBeVisible();
    await expect(page.locator('.info')).toContainText('Created by Remo H. Jansen');
  })

  test('Todo footer', async ({ page }) => {
    await addTodo(page, 'Test');

    const elem = page.locator('.footer');
    await expect(elem).toBeVisible();
    await expect(elem.getByTestId('todo-count')).toBeVisible();
    await expect(elem.locator('.filters')).toBeVisible();
  })

  test('Filters render correctly', async ({ page }) => {
    await addTodo(page, 'Test');

    const footer = page.locator('.footer .filters');

    await expect(footer).toBeVisible();
    expect((await footer.locator('li').all()).length).toBe(3);
  });
});

test.describe('Filter routing', async () => {
  test.beforeEach(async ({page}) => {
    await addTodo(page, 'Test');
  })

  const cases = [
    { name: 'All', href: '#/'},
    { name: 'Active', href: '#/active'},
    { name: 'Completed', href: '#/completed'},
  ];

  cases.forEach(async ({name, href}) => {
    test(`${name} should have route with "${href}"`, async ({page}) => {
      await page.getByRole('link', { name }).click();
      await expect(page).toHaveURL(`https://demo.playwright.dev/todomvc/${href}`);
    })
  })
})

test.describe('Adding items', () => {
  test('Adds an item', async ({ page }) => {
    await addTodo(page, 'Test');

    expect((await page.getByTestId('todo-item').all()).length).toBe(1);

    const elem = page.getByTestId('todo-item').nth(0);
    await expect(elem).toBeVisible();
    await expect(elem.getByTestId('todo-title')).toHaveText('Test');

    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });

  test('Adds multiple items', async ({ page }) => {
    await addTodo(page, 'Test');
    await addTodo(page, 'Test 2');

    expect((await page.getByTestId('todo-item').all()).length).toBe(2);

    const elem = page.getByTestId('todo-item').nth(0);
    await expect(elem).toBeVisible();
    await expect(elem.getByTestId('todo-title')).toHaveText('Test');  

    const elem2 = page.getByTestId('todo-item').nth(1);
    await expect(elem2).toBeVisible();
    await expect(elem2.getByTestId('todo-title')).toHaveText('Test 2');

    await expect(page.getByTestId('todo-count')).toHaveText('2 items left');
  });
})

test.describe('Modify items', () => {
  test('Marks an item as completed', async ({ page }) => {
    await addTodo(page, 'Test');

    const elem = page.getByTestId('todo-item').nth(0);
    await expect(elem).toBeVisible();
    await expect(elem.locator('.view').locator('.toggle')).toBeVisible();
    await elem.locator('.view').locator('.toggle').click();
    expect(await elem.locator('.view').locator('.toggle').isChecked()).toBeTruthy();
    await expect(elem.locator('.view').locator('.destroy')).toBeVisible();
    expect(await elem.getAttribute('class')).toBe('completed');
  });

  test('Marks an item as completed and revert it', async ({ page }) => {
    await addTodo(page, 'Test');

    const elem = page.getByTestId('todo-item').nth(0);
    await expect(elem).toBeVisible();
    await expect(elem.locator('.view').locator('.toggle')).toBeVisible();
    await elem.locator('.view').locator('.toggle').click();
    expect(await elem.locator('.view').locator('.toggle').isChecked()).toBeTruthy();
    await expect(elem.locator('.view').locator('.destroy')).toBeVisible();
    expect(await elem.getAttribute('class')).toBe('completed');
    await elem.locator('.view').locator('.toggle').click();
    expect(await elem.locator('.view').locator('.toggle').isChecked()).toBeFalsy();
    expect(await elem.getAttribute('class')).toBe('');
  })

  test('Delete an item', async ({ page }) => {
    await addTodo(page, 'Test');

    const elem = page.getByTestId('todo-item').nth(0);
    await expect(elem).toBeVisible();
    await elem.click();
    await expect(elem.locator('.view').locator('.destroy')).toBeVisible();

    await elem.locator('.view').locator('.destroy').click();
    await expect(elem).not.toBeVisible();
  });

  test('Counter reacts to changes', async ({ page }) => {
    await addTodo(page, 'Test');

    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');

    await page.getByTestId('todo-item').nth(0).locator('.view .toggle').click();

    await expect(page.getByTestId('todo-count')).toHaveText('0 items left');

    await addTodo(page, 'Test 2');
    await addTodo(page, 'Test 3');

    await expect(page.getByTestId('todo-count')).toHaveText('2 items left');

    await page.getByTestId('todo-item').nth(0).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(2).locator('.view .toggle').click();

    await expect(page.getByTestId('todo-count')).toHaveText('2 items left');

    await page.getByTestId('todo-item').nth(0).click();
    await page.getByTestId('todo-item').nth(0).locator('.view .destroy').click();

    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');

  })

  test('Input arrow completes all items', async ({ page }) => {
    await addTodo(page, 'Test');
    await addTodo(page, 'Test 2');
    await addTodo(page, 'Test 3'); 

    await expect(page.getByTestId('todo-count')).toHaveText('3 items left');
    expect((await page.getByTestId('todo-item').all()).length).toBe(3);

    await page.locator('#toggle-all').click();
    await expect(page.getByTestId('todo-count')).toHaveText('0 items left');
  })
})

test.describe('Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await addTodo(page, 'Test');
    await addTodo(page, 'Test 2');
    await addTodo(page, 'Test 3');
    await addTodo(page, 'Test 4');
    await addTodo(page, 'Test 5');
  })

  test('Clear completed items', async ({ page }) => {
    await page.getByTestId('todo-item').nth(0).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(2).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(4).locator('.view .toggle').click();

    expect((await page.getByTestId('todo-item').all()).length).toBe(5);
    await page.locator('.clear-completed').click();
    expect((await page.getByTestId('todo-item').all()).length).toBe(2);
  });

  test('Show active items', async ({ page }) => {
    await page.getByTestId('todo-item').nth(0).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(2).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(4).locator('.view .toggle').click();

    expect((await page.getByTestId('todo-item').all()).length).toBe(5);
    await page.getByRole('link', { name: 'Active' }).click();
    expect((await page.getByTestId('todo-item').all()).length).toBe(2);
  })

  test('Show completed items', async ({ page }) => {
    await page.getByTestId('todo-item').nth(0).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(2).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(4).locator('.view .toggle').click();

    expect((await page.getByTestId('todo-item').all()).length).toBe(5);
    await page.getByRole('link', { name: 'Completed' }).click();
    expect((await page.getByTestId('todo-item').all()).length).toBe(3);
  })

  test('Show filters and clear completed', async ({ page }) => {
    await page.getByTestId('todo-item').nth(0).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(2).locator('.view .toggle').click();
    await page.getByTestId('todo-item').nth(4).locator('.view .toggle').click();

    expect((await page.getByTestId('todo-item').all()).length).toBe(5);
    await page.getByRole('link', { name: 'Completed' }).click();
    expect((await page.getByTestId('todo-item').all()).length).toBe(3);
    await page.locator('.clear-completed').click();
    expect((await page.getByTestId('todo-item').all()).length).toBe(0);
    await page.getByRole('link', { name: 'All' }).click();
    expect((await page.getByTestId('todo-item').all()).length).toBe(2);
  })
})

test('Persistance', async ({ page }) => {
  await addTodo(page, 'Test');
  await addTodo(page, 'Test 2');
  await addTodo(page, 'Test 3');

  expect((await page.getByTestId('todo-item').all()).length).toBe(3);

  await page.reload();

  expect((await page.getByTestId('todo-item').all()).length).toBe(3);

  await page.getByTestId('todo-item').nth(0).locator('.view .toggle').click();
  await page.getByTestId('todo-item').nth(2).locator('.view .toggle').click();
  await page.getByRole('link', { name: 'Active' }).click();
  expect((await page.getByTestId('todo-item').all()).length).toBe(1);
  
  await page.reload();
  expect((await page.getByTestId('todo-item').all()).length).toBe(1);
  expect(await page.getByRole('link', { name: 'Active' }).getAttribute('class')).toBe('selected');

  await page.getByRole('link', { name: 'All' }).click();
  await page.locator('.clear-completed').click();

  await page.reload();
  expect((await page.getByTestId('todo-item').all()).length).toBe(1);
})

const addTodo = async (page: Page, text: string) => {
  const loc = page.locator('.new-todo');
  await expect(loc).toBeVisible();
  await loc.fill(text);
  await expect(loc).toHaveValue(text);
  await loc.press('Enter');
  await expect(loc).toHaveValue('');
}