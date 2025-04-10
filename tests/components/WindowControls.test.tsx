import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WindowControls } from '../../src/components/WindowControls';

describe('WindowControls', () => {
  const mockHandlers = {
    onMinimize: vi.fn(),
    onMaximize: vi.fn(),
    onClose: vi.fn(),
  };

  it('renders all window control buttons', () => {
    render(<WindowControls {...mockHandlers} isMaximized={false} />);
    
    expect(screen.getByLabelText('Minimize window')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximize window')).toBeInTheDocument();
    expect(screen.getByLabelText('Close window')).toBeInTheDocument();
  });

  it('calls onMinimize when minimize button is clicked', () => {
    render(<WindowControls {...mockHandlers} isMaximized={false} />);
    
    fireEvent.click(screen.getByLabelText('Minimize window'));
    expect(mockHandlers.onMinimize).toHaveBeenCalledTimes(1);
  });

  it('calls onMaximize when maximize button is clicked', () => {
    render(<WindowControls {...mockHandlers} isMaximized={false} />);
    
    fireEvent.click(screen.getByLabelText('Maximize window'));
    expect(mockHandlers.onMaximize).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(<WindowControls {...mockHandlers} isMaximized={false} />);
    
    fireEvent.click(screen.getByLabelText('Close window'));
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows restore icon when window is maximized', () => {
    render(<WindowControls {...mockHandlers} isMaximized={true} />);
    
    expect(screen.getByLabelText('Restore window')).toBeInTheDocument();
  });

  it('shows maximize icon when window is not maximized', () => {
    render(<WindowControls {...mockHandlers} isMaximized={false} />);
    
    expect(screen.getByLabelText('Maximize window')).toBeInTheDocument();
  });
}); 