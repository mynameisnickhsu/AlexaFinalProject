# AlexaFinalProject

## Description
Allows users to manage their inventory verbally through the alexa device. Functions include storing, transferring, removing, and locating items, undoing an action, and returning amount of item in storage.

## Set up
### Code Setup
1. Download project from github.
2. Create an amazon developer account at https://developer.amazon.com. Once your account is created, sign in and go to your Alexa Dashboard.
3. Once there, click on Alexa tab and there should be a box that says Alexa Skills Kit. Click on Get Started.
4. Add a new skill and under Name and Invocation Name, put inventory. Click save.
5. Click on Interaction Model Builder and then click code editor.
6. Drag and drop LanguageModel.json from speechAssests into the drag and drop .json tab.
7. Click Save Model
8. Click Build Model (May take a few minutes)
9. Click configurations and open a new tab and go to https://aws.amazon.com/
10. Click Sign Into Console with the same account
11. Search IAM under AWS services and click on IAM
12. Go to the roles page and click create a new role
13. For Role Type, choose Lambda
14. For Permissions, choose DynamoDB full access
15. In Review, name your role lambda_dynamodb_fullaccess. Hit Save
16. Navigate to https://aws.amazon.com/ and search lambda under AWS services and click on Lambda
17. Click create function and click blueprints.
18. Choose alexa-skill-kit-sdk-factskill and click configure
19. Name it Inventory and choose existing role and lambda_dynamodb_fullaccess
20. Create function and copy and paste index.js from src over the old code in text editor.
21. Click add trigger and choose Alexa Skill Kit
22. Click save
23. Copy the arn number and go back to configurations tab from step 9
24. Click AWS Lambda ARN as service endpoint type.
25. Paste ARN and click next.
### Alexa set up
1. Follow instructions to set up alexa account with the same account that you used for the code.
2. The skill should now be able to be invoked by :Alexa, ask Inventory [utterance]"
## Contributers
Nicholas Hsu



