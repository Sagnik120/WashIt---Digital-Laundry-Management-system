
export function parsePaging(query: any) {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const skip = (page - 1) * pageSize;
  const sort = (query.sort as string | undefined) || 'createdAt:desc';
  const [field, direction] = sort.split(':');
  return { page, pageSize, skip, take: pageSize, orderBy: { [field]: direction === 'asc' ? 'asc' : 'desc' } as any };
}
