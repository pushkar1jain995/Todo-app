import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../TodoForm';
import { TodoProvider } from '@/context/TodoContext';
import { CATEGORIES } from '@/lib/constants/categories';
import { PRIORITIES } from '@/lib/constants/priorities';

// Mock useTodos hook
const mockAddTodo = jest.fn();

jest.mock('@/hooks/useTodos', () => ({
  useTodos: () => ({
    addTodo: mockAddTodo,
    todos: [],
    filter: 'All',
    sortBy: 'date'
  })
}));

describe('TodoForm', () => {
  const renderTodoForm = () => {
    return render(
      <TodoProvider>
        <TodoForm />
      </TodoProvider>
    );
  };

  beforeEach(() => {
    mockAddTodo.mockClear();
  });

  describe('Form Rendering', () => {
    it('should render all form elements correctly', () => {
      renderTodoForm();
      
      // Check input
      expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
      
      // Check category select
      expect(screen.getByLabelText('Category selector')).toBeInTheDocument();
      
      // Check priority select
      expect(screen.getByLabelText('Priority selector')).toBeInTheDocument();
      
      // Check submit button
      expect(screen.getByRole('button', { type: 'submit' })).toBeInTheDocument();
    });

    it('should initialize with default values', () => {
      renderTodoForm();
      
      // Check input is empty
      expect(screen.getByPlaceholderText('Add a new todo...')).toHaveValue('');
      
      // Check default category
      const categoryTrigger = screen.getByLabelText('Category selector');
      expect(categoryTrigger).toHaveTextContent('Work');
      
      // Check default priority
      const priorityTrigger = screen.getByLabelText('Priority selector');
      expect(priorityTrigger).toHaveTextContent('Low');
    });
  });

  describe('Form Interactions', () => {
    it('should update input value when typing', async () => {
      renderTodoForm();
      const input = screen.getByPlaceholderText('Add a new todo...');
      
      await userEvent.type(input, 'New Todo Item');
      expect(input).toHaveValue('New Todo Item');
    });

    it('should submit form with valid data', async () => {
      renderTodoForm();
      
      // Fill in the form
      const input = screen.getByPlaceholderText('Add a new todo...');
      await userEvent.type(input, 'Test Todo');
      
      // Submit the form
      const submitButton = screen.getByRole('button', { type: 'submit' });
      await userEvent.click(submitButton);
      
      // Verify addTodo was called with correct data
      expect(mockAddTodo).toHaveBeenCalledWith({
        text: 'Test Todo',
        category: 'Work',
        priority: 'Low'
      });
      
      // Verify form was reset
      expect(input).toHaveValue('');
    });

    it('should not submit form with empty todo text', async () => {
      renderTodoForm();
      const submitButton = screen.getByRole('button', { type: 'submit' });
      
      await userEvent.click(submitButton);
      expect(mockAddTodo).not.toHaveBeenCalled();
    });
  });
}); 