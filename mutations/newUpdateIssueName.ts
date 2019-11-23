const fragment = gql`
  ${ISSUE_PARTS}
  fragment BasicIssueParts on BasicIssue {
    ... on Node {
      id
    }
    parameters {
      id
      value
    }
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
  fragment,
  "IssueParts",
  (input: UpdateIssueNameInput) => {
    return input.id;
  }
);
