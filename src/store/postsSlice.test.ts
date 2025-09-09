import reducer, { fetchPostDetails } from './postsSlice';

// Minimal fetch mock
const originalFetch = global.fetch as any;

describe('postsSlice fetchPostDetails', () => {
  afterEach(() => {
    // @ts-ignore
    global.fetch = originalFetch;
  });

  it('stores selftext and comments on success', async () => {
    // Mock Reddit comments response shape
    // json[0] = post data, json[1] = comments
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ([
        { data: { children: [{ data: { selftext: 'Hello world with https://example.com' } }] } },
        { data: { children: [ { kind: 't1', data: { id: 'c1', author: 'a', body: 'Nice', score: 10, created_utc: 1 } } ] } }
      ])
    });

    const thunk = fetchPostDetails({ id: 'abc' });
    const result = await thunk(jest.fn(), () => ({}), undefined as any);
    expect(result.type).toBe('posts/fetchPostDetails/fulfilled');
    expect(result.payload).toEqual({ id: 'abc', selftext: 'Hello world with https://example.com', comments: [{ id: 'c1', author: 'a', body: 'Nice', score: 10, created_utc: 1 }] });
  });

  it('handles HTTP failure', async () => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    const thunk = fetchPostDetails({ id: 'oops' });
    const result = await thunk(jest.fn(), () => ({}), undefined as any);
    expect(result.type).toBe('posts/fetchPostDetails/rejected');
  });
});
