import { test, expect } from '@playwright/test';

const DEBUG = process.env.DEBUG === 'true';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    if (DEBUG) {
      console.log('Starting test case...');
    }
    
    page.on('console', msg => {
      if (DEBUG) console.log(`Browser console: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.error(`Browser page error: ${error.message}`);
    });

    try {
      if (DEBUG) console.log('Navigating to homepage...');
      await page.goto('/', { waitUntil: 'networkidle' });
      
      if (DEBUG) console.log('Waiting for todo-app element...');
      await page.waitForSelector('[data-testid="todo-app"]', { 
        state: 'visible',
        timeout: 10000 
      });
      
      if (DEBUG) console.log('Page loaded successfully');
    } catch (error) {
      console.error('Error in test setup:', error);
      throw error;
    }
  });

  test('should load the todo app successfully', async ({ page }) => {
    await page.waitForSelector('[data-testid="todo-form"]');
    
    await expect(page.getByText('Todo App')).toBeVisible();
    await expect(page.getByPlaceholder('Add a new todo...')).toBeVisible();
    await expect(page.getByRole('button', { name: /sort by/i })).toBeVisible();
  });

  test('should add a new todo', async ({ page }) => {
    const todoText = 'Test todo item';
    
    // Fill and submit the form
    await page.getByPlaceholder('Add a new todo...').fill(todoText);
    await page.getByRole('button', { name: /category selector/i }).click();
    await page.getByRole('option', { name: 'Work' }).click();
    await page.getByRole('button', { name: /priority selector/i }).click();
    await page.getByRole('option', { name: 'High' }).click();
    await page.getByRole('button', { type: 'submit' }).click();

    // Verify todo was added
    await expect(page.getByText(todoText)).toBeVisible();
    await expect(page.getByText('High')).toBeVisible();
    
    console.log('Todo added successfully:', todoText);
  });

  test('should edit a todo', async ({ page }) => {
    // First add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Initial todo');
    await page.getByRole('button', { type: 'submit' }).click();

    // Edit the todo
    await page.getByText('Initial todo').hover();
    await page.getByRole('button', { name: /edit todo/i }).click();
    await page.getByRole('textbox').fill('Updated todo');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify changes
    await expect(page.getByText('Updated todo')).toBeVisible();
    await expect(page.getByText('Initial todo')).not.toBeVisible();
    
    console.log('Todo edited successfully');
  });

  test('should mark todo as completed', async ({ page }) => {
    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Complete me');
    await page.getByRole('button', { type: 'submit' }).click();

    // Toggle completion
    await page.getByRole('checkbox').click();

    // Verify completion status
    await expect(page.getByText('Complete me')).toHaveClass(/line-through/);
    
    console.log('Todo marked as completed');
  });

  test('should delete a todo', async ({ page }) => {
    const todoText = 'Delete me';
    
    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill(todoText);
    await page.getByRole('button', { type: 'submit' }).click();

    // Delete the todo
    await page.getByText(todoText).hover();
    await page.getByRole('button', { name: /delete todo/i }).click();

    // Verify deletion
    await expect(page.getByText(todoText)).not.toBeVisible();
    
    console.log('Todo deleted successfully');
  });

  test('should filter todos by category', async ({ page }) => {
    // Add todos with different categories
    const workTodo = 'Work task';
    const personalTodo = 'Personal task';

    // Add work todo
    await page.getByPlaceholder('Add a new todo...').fill(workTodo);
    await page.getByRole('button', { name: /category selector/i }).click();
    await page.getByRole('option', { name: 'Work' }).click();
    await page.getByRole('button', { type: 'submit' }).click();

    // Add personal todo
    await page.getByPlaceholder('Add a new todo...').fill(personalTodo);
    await page.getByRole('button', { name: /category selector/i }).click();
    await page.getByRole('option', { name: 'Personal' }).click();
    await page.getByRole('button', { type: 'submit' }).click();

    // Test filtering
    await page.getByRole('button', { name: /filter/i }).click();
    await page.getByRole('option', { name: 'Work' }).click();

    // Verify filtering
    await expect(page.getByText(workTodo)).toBeVisible();
    await expect(page.getByText(personalTodo)).not.toBeVisible();
    
    console.log('Todo filtering tested successfully');
  });

  test('should sort todos by priority', async ({ page }) => {
    // Add todos with different priorities
    const priorities = ['Low', 'Medium', 'High'];
    for (const priority of priorities) {
      await page.getByPlaceholder('Add a new todo...').fill(`${priority} priority task`);
      await page.getByRole('button', { name: /priority selector/i }).click();
      await page.getByRole('option', { name: priority }).click();
      await page.getByRole('button', { type: 'submit' }).click();
    }

    // Sort by priority
    await page.getByRole('button', { name: /sort by/i }).click();
    await page.getByRole('option', { name: /priority/i }).click();

    // Verify order (High priority should be first)
    const todos = await page.getByText(/priority task/).all();
    await expect(todos[0]).toContainText('High');
    
    console.log('Todo sorting tested successfully');
  });

  test('should handle empty input validation', async ({ page }) => {
    // Try to submit empty todo
    await page.getByRole('button', { type: 'submit' }).click();
    
    // Verify todo wasn't added
    await expect(page.getByText('No todos yet')).toBeVisible();
    
    console.log('Empty input validation tested successfully');
  });

  test('should persist todos after page reload', async ({ page }) => {
    const todoText = 'Persistent todo';
    
    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill(todoText);
    await page.getByRole('button', { type: 'submit' }).click();
    
    // Reload page
    await page.reload();
    
    // Verify todo persists
    await expect(page.getByText(todoText)).toBeVisible();
    
    console.log('Todo persistence tested successfully');
  });
});

test.describe('mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show mobile menu button when viewport is small', async ({ page }) => {
    await page.waitForSelector('[data-testid="mobile-menu-button"]');
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible();
  });
}); 