import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders game mode selection', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /fading tic-tac-toe/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /play vs bot/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /play online/i })).toBeInTheDocument();
});

test('starts a self-play-trained Hard bot match in the browser', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /play vs bot/i }));
  fireEvent.click(screen.getByRole('button', { name: /hard/i }));
  fireEvent.click(screen.getByRole('button', { name: /start match/i }));

  expect(screen.getAllByText(/hard bot/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/60,000 training games/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /cell \d: empty/i })).toHaveLength(9);
  expect(screen.getByRole('checkbox', { name: /hint mode/i })).not.toBeChecked();

  fireEvent.click(screen.getByRole('checkbox', { name: /hint mode/i }));
  expect(screen.getByLabelText(/move age colors/i)).toBeInTheDocument();
  expect(screen.getByText(/3rd last · fades next/i)).toBeInTheDocument();
});

test('reserves a stable status area while the bot is thinking', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /play vs bot/i }));
  fireEvent.click(screen.getByRole('button', { name: /medium/i }));
  fireEvent.click(screen.getByRole('button', { name: /o — bot moves first/i }));
  fireEvent.click(screen.getByRole('button', { name: /start match/i }));

  const status = screen.getByRole('heading', { name: /medium bot is thinking/i });
  expect(status).toHaveAttribute('aria-atomic', 'true');
  expect(status.parentElement).toHaveClass('bot-status-slot');
});
