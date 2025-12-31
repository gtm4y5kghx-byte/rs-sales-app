import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from './useOnlineStatus';

describe('useOnlineStatus', () => {
	const originalNavigator = window.navigator;

	beforeEach(() => {
		Object.defineProperty(window, 'navigator', {
			value: { onLine: true },
			writable: true,
		});
	});

	afterEach(() => {
		Object.defineProperty(window, 'navigator', {
			value: originalNavigator,
			writable: true,
		});
	});

	it('returns true when browser is online', () => {
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current).toBe(true);
	});

	it('returns false when browser is offline', () => {
		Object.defineProperty(window, 'navigator', {
			value: { onLine: false },
			writable: true,
		});

		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current).toBe(false);
	});

	it('updates when online status changes', () => {
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current).toBe(true);

		act(() => {
			Object.defineProperty(window, 'navigator', {
				value: { onLine: false },
				writable: true,
			});
			window.dispatchEvent(new Event('offline'));
		});

		expect(result.current).toBe(false);
	});
});
