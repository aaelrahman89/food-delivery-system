import { Primitive, Translatable } from '../types';

export interface NavSegment {
  routeName: string;
  routeParams?: Record<string, Primitive>;
  text: Translatable;
}
