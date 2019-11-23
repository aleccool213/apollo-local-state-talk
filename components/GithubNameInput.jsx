import React from "react";

const IssueContainer: React.FC<{ issue: GithubIssue }> = ({ issue }) => {
  const updateIssuename = useMutation(UPDATE_ISSUE_NAME);
  return (
    <input
      onChange={name => {
        updateIssuename({
          variables: {
            input: {
              id: issue.id,
              name
            }
          }
        });
      }}
    />
  );
};
