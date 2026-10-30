import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
vi.mock('@/lib/auth/guard', () => ({ requireAuth: vi.fn() }));
vi.mock('@/lib/cloudinary', () => ({ deleteFromCloudinary: vi.fn(), uploadToCloudinary: vi.fn() }));
vi.mock('@/lib/rate-limit', () => ({ checkRateLimit: vi.fn(), RATE_LIMIT_CONFIGS: { apiMutation: {} } }));
import { requireAuth } from '@/lib/auth/guard';
import { checkRateLimit } from '@/lib/rate-limit';
import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/cloudinary';
import { DELETE } from '@/app/api/upload/[publicId]/route';
import { POST } from '@/app/api/upload/route';
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(requireAuth).mockResolvedValue({ user: { id: 'admin', email: 'admin@example.com', role: 'ADMIN' } });
  vi.mocked(checkRateLimit).mockResolvedValue({ success: true, limit: 30, remaining: 29, reset: 0 });
});
describe('Upload access and body limits', () => {
  it('requires a database-authorised administrator for deletion', async () => {
    vi.mocked(requireAuth).mockRejectedValue(new Error('FORBIDDEN'));
    const response = await DELETE(new NextRequest('https://portal.test/api/upload/example', { method: 'DELETE' }), { params: Promise.resolve({ publicId: 'paithan/grievances/example' }) });
    expect(response.status).toBe(403);
    expect(requireAuth).toHaveBeenCalledWith('ADMIN');
    expect(deleteFromCloudinary).not.toHaveBeenCalled();
  });
  it.each(['another-app/profile/asset', 'paithan/grievances/../asset', 'paithan/grievances/asset?destroy=true'])('rejects an invalid asset namespace %s', async publicId => {
    const response = await DELETE(new NextRequest('https://portal.test/api/upload/example', { method: 'DELETE' }), { params: Promise.resolve({ publicId }) });
    expect(response.status).toBe(400);
    expect(deleteFromCloudinary).not.toHaveBeenCalled();
  });
  it('permits an authorised deletion within portal folders', async () => {
    vi.mocked(deleteFromCloudinary).mockResolvedValue(true);
    expect((await DELETE(new NextRequest('https://portal.test/api/upload/example', { method: 'DELETE' }), { params: Promise.resolve({ publicId: 'paithan/profile/asset' }) })).status).toBe(200);
  });
  it('caps declared upload size before decoding JSON or calling Cloudinary', async () => {
    const request = new NextRequest('https://portal.test/api/upload', { method: 'POST', headers: { 'content-length': String(8 * 1024 * 1024) }, body: '{}' });
    expect((await POST(request)).status).toBe(413);
    expect(uploadToCloudinary).not.toHaveBeenCalled();
  });
  it('caps chunked upload bodies even without a content-length header', async () => {
    const request = new NextRequest('https://portal.test/api/upload', { method: 'POST', body: 'x'.repeat(7 * 1024 * 1024 + 1) });
    expect((await POST(request)).status).toBe(413);
    expect(uploadToCloudinary).not.toHaveBeenCalled();
  });
});
