import React from "react";

export const UPDATE_ISSUE_NAME = gql`
  mutation UpdateIssueName($input: UpdateIssueNameInput!) {
    updateIssueName(input: $input) @client
  }
`;

export const IssueInput: React.FC<{ issue: Issue }> = ({
  issue,
}) => {
  const updateIssuename = useMutation(UPDATE_ISSUE_NAME);
  return (
    <>
      <input
        onChange={name => {
          updateIssuename({
            variables: {
              input: {
                id: issue.id,
                name,
              },
            },
          });
        }}
      />
      <button>Save</button>
      <button>Cancel</button>
    </>
  );
};
