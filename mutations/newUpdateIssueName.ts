import gql from "graphql-tag";

import { ISSUE_PARTS } from "../issues";
import {
  IssueParts,
  UpdateIssueNameInput,
} from "../../graphql-types";
import { createResolver } from './createResolver';

const ISSUE_FRAGMENT = gql`
  ${ISSUE_PARTS}

  fragment IssueParts on Issue {
    id @client
    name @client
  }
`;

export const reducer = (
  issue: IssueParts,
  input: UpdateIssueNameInput
): IssueParts => ({
  ...issue,
  name: input.name,
});

export default createResolver(
  reducer,
  fragment: ISSUE_FRAGMENT,
  "IssueParts",
  (input: UpdateIssueNameInput) => {
    return input.id;
  }
);
