## About this project

For this project, I used:
    **Create react app with template typescript**
    **React hook & typescript**
    **React router dom v6**
    **Ant Design**
    **Sass**
    **Axios and lodash**

When user open web app, the login screen will be display to request user login:
For Login screen:
- Email & Password are required
- Email and/or Password is invalid, we cannot login
- Email & Password are valid, we can login and will redirect to Home page. We also used session storage to store the access token when user login successfully.
For Homepage (Invoice List Page):
- If user has not logged in or session storage does not have access token. User will be redirected to login page. We used Private Route to do this.
- If we have access token in session storage. We will use this to get organisation storage and then get list invoice with access token and org-token.
- When the API get list invoice successfull. We will render the list invoice with have functions: search, filter, pagination.
- When user click on Create Invoice button. The modal Create Invoice will be opened. And then user can create new invoice.
- When user click submit. We will call the API to create new invoice and then fetch data list invoice again, then we closed modal.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).