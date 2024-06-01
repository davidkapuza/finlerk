const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

const isDate = (val: unknown): val is ConstructorParameters<typeof Date>[0] =>
  !!(
    val &&
    typeof val === 'string' &&
    isoDateRE.test(val) &&
    !isNaN(Date.parse(val))
  );

export const format = {
  /** Takes an object that's coming from a database and converts it to plain JavaScript. */
  from<T>(object: Record<string, unknown> | T = {}): T {
    const newObject: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(object))
      if (isDate(value)) newObject[key] = new Date(value);
      else newObject[key] = value;
    return newObject as T;
  },
  /** Takes an object that's coming from Auth.js and prepares it to be written to the database. */
  to<T>(object: Record<string, unknown> | T): T {
    const newObject: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(object))
      if (value instanceof Date) newObject[key] = value.toISOString();
      else newObject[key] = value;
    return newObject as T;
  },
};
