import { IFieldResolver } from "graphql-tools";
import { DocumentNode } from "graphql";

import { ResolverContext } from ".";

interface InputVariablesShape<TInput> {
  input: TInput;
}

/**
 * Creates a client-side mutation resolver which reads one item from the cache,
 * mutates it using the given mutation, then writes it back to the cache.
 * @param reducer Func which mutates data and returns it. Must be a pure function.
 * @param fragment Used to read/write data to apollo-link-state.
 * @param fragmentName Name of fragment inside
 * @param getId A func which returns the id of the entity to be used in the `reducer` func.
 */
export const createResolver = <InputShape, EntityType>(
  reducer: (
    entity: EntityType,
    input: InputShape
  ) => EntityType,
  fragment: DocumentNode,
  fragmentName: string,
  getId: (input: InputShape) => string
) => {
  const resolver: IFieldResolver<
    void,
    ResolverContext,
    any
  > = (
    _obj,
    args: InputVariablesShape<InputShape>,
    { cache, getCacheKey }
  ) => {
    const { input } = args;

    // 1. Get the id of the object in the cache using `getId`
    const id = getCacheKey({ id: getId(input) });

    // 2. Get the data from the cache
    const entity: EntityType | null = cache.readFragment({
      fragment,
      fragmentName,
      id,
    });

    if (!entity) {
      return null;
    }

    const newEntity: EntityType = reducer(entity, input);

    cache.writeFragment({
      fragment,
      fragmentName,
      id,
      data: newEntity,
    });
    return null;
  };

  return resolver;
};
