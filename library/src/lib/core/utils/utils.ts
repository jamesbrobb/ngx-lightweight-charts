
export type Identifiable = {
  id?: string
}


export function filterByIds<T extends Identifiable>(
  ids: string | string[]
): (arg: T) => arg is T {

  const values = Array.isArray(ids) ? ids : !ids ? [] : [ids];

  return (arg: T): arg is T => {
    return !values.length || !!(arg.id && values.includes(arg.id));
  }
}
