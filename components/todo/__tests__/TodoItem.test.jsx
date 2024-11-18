import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';

describe('TodoItem', () => {
  // Mock handlers
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  // Sample todo item
  const sampleTodo = {
    id: 1,
    text: 'Test Todo',
    completed: false,
    category: 'Work',
    priority: 'High'
  };

  // Setup function to render component with default props
  const renderTodoItem = (props = {}) => {
    const defaultProps = {
      todo: sampleTodo,
      onToggle: mockOnToggle,
      onDelete: mockOnDelete,
      onUpdate: mockOnUpdate,
      ...props
    };
    return render(<TodoItem {...defaultProps} />);
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    console.log('Starting new test');
  });

  describe('View Mode', () => {
    it('renders todo item correctly in view mode', () => {
      renderTodoItem();
      
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('applies correct styles for completed todo', () => {
      const completedTodo = { ...sampleTodo, completed: true };
      renderTodoItem({ todo: completedTodo });
      
      const todoText = screen.getByText('Test Todo');
      expect(todoText).toHaveClass('line-through', 'text-gray-400');
    });

    it('displays correct priority badge with appropriate styling', () => {
      renderTodoItem();
      
      const badge = screen.getByText('High');
      expect(badge).toHaveClass('bg-red-100', 'text-red-900', 'border-red-500');
    });
  });

  describe('Checkbox Interactions', () => {
    it('calls onToggle when checkbox is clicked', async () => {
      renderTodoItem();
      
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      
      expect(mockOnToggle).toHaveBeenCalledWith(sampleTodo.id);
      console.log('Checkbox toggle called with ID:', sampleTodo.id);
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode when edit button is clicked', async () => {
      renderTodoItem();
      
      const editButton = screen.getByRole('button', { name: /edit todo/i });
      await userEvent.click(editButton);
      
      expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('updates todo text when save is clicked', async () => {
      renderTodoItem();
      
      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit todo/i });
      await userEvent.click(editButton);
      
      // Modify input
      const input = screen.getByDisplayValue('Test Todo');
      await userEvent.clear(input);
      await userEvent.type(input, 'Updated Todo');
      
      // Save changes
      const saveButton = screen.getByText('Save');
      await userEvent.click(saveButton);
      
      expect(mockOnUpdate).toHaveBeenCalledWith(sampleTodo.id, {
        text: 'Updated Todo',
        category: 'Work',
        priority: 'High'
      });
      console.log('Todo updated with new text:', 'Updated Todo');
    });

    it('cancels edit mode without changes when cancel is clicked', async () => {
      renderTodoItem();
      
      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit todo/i });
      await userEvent.click(editButton);
      
      // Modify input but cancel
      const input = screen.getByDisplayValue('Test Todo');
      await userEvent.clear(input);
      await userEvent.type(input, 'Updated Todo');
      
      const cancelButton = screen.getByText('Cancel');
      await userEvent.click(cancelButton);
      
      expect(mockOnUpdate).not.toHaveBeenCalled();
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
    });
  });

  describe('Delete Operations', () => {
    it('calls onDelete when delete button is clicked', async () => {
      renderTodoItem();
      
      const deleteButton = screen.getByRole('button', { name: /delete todo/i });
      await userEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith(sampleTodo.id);
      console.log('Delete called with ID:', sampleTodo.id);
    });
  });

  describe('UI State Transitions', () => {
    it('shows edit/delete buttons on hover', async () => {
      renderTodoItem();
      
      const todoContainer = screen.getByText('Test Todo').closest('.group');
      const buttonsContainer = todoContainer.querySelector('.opacity-0');
      
      // Verify initial state
      expect(buttonsContainer).toHaveClass('opacity-0');
      
      // Simulate hover
      fireEvent.mouseEnter(todoContainer);
      
      // Verify buttons are visible
      await waitFor(() => {
        expect(buttonsContainer).toHaveClass('group-hover:opacity-100');
      });
    });
  });
}); 