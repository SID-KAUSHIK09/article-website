import { vi } from 'vitest';

// fake supabase query builder - each method returns itself, awaiting it gives `result`
export const createQueryMock = (result = { data: [], error: null }) => {
  const query = { calls: [], result };
  const chain = ['select', 'insert', 'update', 'delete', 'eq', 'order'];
  for (const method of chain) {
    query[method] = vi.fn((...args) => {
      query.calls.push([method, ...args]);
      return query;
    });
  }
  query.single = vi.fn(() => {
    query.calls.push(['single']);
    return Promise.resolve(query.result);
  });
  query.then = (resolve, reject) => Promise.resolve(query.result).then(resolve, reject);
  return query;
};
