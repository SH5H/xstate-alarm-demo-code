import { interpret } from 'xstate';
import { timerMachine } from './timerMachine';
import { expect, test, vi } from 'vitest';

test('should eventually reach "success"', () => {
  vi.useFakeTimers();
  const fetchService = interpret(timerMachine);

  fetchService.start();
  expect(fetchService.getSnapshot().matches('waiting')).toBe(true);

  const duration = 10;
  const deltaTime = (duration / 2) * 1000;

  fetchService.send({ type: 'SUBMIT', duration });
  expect(fetchService.getSnapshot().matches('playing')).toBe(true);
  vi.advanceTimersByTime(deltaTime);
  expect(fetchService.getSnapshot().matches('playing')).toBe(true);
  vi.advanceTimersByTime(deltaTime);
  expect(fetchService.getSnapshot().matches('done')).toBe(true);
});
