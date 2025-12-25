
import { describe, it, expect, vi } from 'vitest';
import { createContact } from '../services/apiService';

// Mock supabase since we don't want to hit real DB in basic unit tests
vi.mock('../services/supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: { id: 1 }, error: null }))
                }))
            }))
        }))
    },
    isSupabaseReady: vi.fn(() => true)
}));

describe('Contact Service', () => {
    it('should successfully create a contact message', async () => {
        const mockContact = {
            name: 'Test User',
            email: 'test@example.com',
            message: 'Hello'
        };

        const result = await createContact(mockContact);
        expect(result).toBeDefined();
        expect(result.id).toBe(1);
    });
});
