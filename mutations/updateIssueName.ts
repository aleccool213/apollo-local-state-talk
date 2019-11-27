import gql from "graphql-tag";
import { IFieldResolver } from "graphql-tools";

import { ISSUE_PARTS } from "../issues";
import {
  IssueParts,
  UpdateIssueNameVariables,
} from "../../graphql-types";
import { ResolverContext } from ".";

const ISSUE_FRAGMENT = gql`
  ${ISSUE_PARTS}

  fragment IssueParts on Issue {
    id @client
    name @client
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

  const id = getCacheKey({
    __typename: "Issue",
    id: input.id,
  });

  const issue: IssueParts | null = cache.readFragment({
    fragment: ISSUE_FRAGMENT,
    fragmentName: "IssueParts",
    id,
  });
  if (!issue) {
    return null;
  }

  const updatedIssue = {
    ...issue,
    name: input.name,
  };

  cache.writeFragment({
    fragment: ISSUE_FRAGMENT,
    fragmentName: "IssueParts",
    id,
    data: updatedIssue,
  });
  return null;
};

export default updateIssuename;
