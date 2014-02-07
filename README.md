# atlassian-trello-integration

This tool is used to integrate JIRA and Trello, in order to use Trello boards as Kan Ban boards in an automated fashion.

## Configuring Your Personal Settings

1) Generate token at https://trello.com/docs/gettingstarted/index.html#getting-a-token-from-a-user
2) Rename settings.example.js to settings.js
3) You will then just need your organization name as well as your api key and newly generated token

```
module.exports = {
  organization: "MY_ORGANIZATION_NAME_FROM_TRELLO",
  key: "API_KEY",
  token: "READ_WRITE_TOKEN"
};
```