import gql from "graphql-tag";
import { IFieldResolver } from "graphql-tools";

import { ISSUE_PARTS } from "../issues";
import {
  IssueParts,
  UpdateIssueNameVariables,
} from "../../graphql-types";
import { ResolverContext } from ".";

export const UPDATE_ISSUE_NAME = gql`
  mutation UpdateIssueName($input: UpdateIssueNameInput!) {
    updateIssueName(input: $input) @client
  }
`;

const ISSUE_FRAGMENT = gql`
  ${ISSUE_PARTS}

  fragment IssueParts on Issue {
    id
    name
  }
`;

/**
 * Updates the name of a Github issue.
 **/
const updateIssuename: IFieldResolver<
  void,
  ResolverContext,
  any
> = (_obj, args: UpdateIssueNameVariables, context) => {
  const { input } = args;
  const { cache, getCacheKey } = context;

  // 1. Get the id of the object in the cache using the actual issue id
  const id = getCacheKey({
    __typename: "Issue",
    id: input.id,
  });

  // 2. Get the data from the cache
  const issue: IssueParts | null = cache.readFragment({
    fragment: ISSUE_FRAGMENT,
    fragmentName: "IssueParts",
    id,
  });
  if (!issue) {
    return null;
  }

  // 3. Update the data locally
  const updatedIssue = {
    ...issue,
    name: input.name,
  };

  // 4. Write the data back to the cache
  cache.writeFragment({
    fragment: ISSUE_FRAGMENT,
    fragmentName: "IssueParts",
    id,
    data: updatedIssue,
  });
  return null;
};

export default updateIssuename;
