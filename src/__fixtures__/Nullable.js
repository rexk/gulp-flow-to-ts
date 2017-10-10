// @flow
/**
 * Nullable test
 */
function Nullable(something?: ?stirng): ?string {
  return something;
}

export type P = {
  name?: string;
  ok: ?boolean;
  age?: ?number;
}
