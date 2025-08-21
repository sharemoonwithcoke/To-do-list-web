# Final Project Requirements

* Project is **Due Mon Dec 9, 11:59pm PT**

## Submission Instructions
* Your project is submitted as PR to merge your branch 'final-project' into main
  - This is similar to your other project submissions
  - I am not listing all the steps here so you can see if you understand the process of creating a branch, pushing it, and creating a PR
  - You will likely use the same process to submit work in your future jobs
* Be sure to include the reviewer(s) on your PR

Hint: Scoring is heavily influenced by attention to detail to all the practices taught in class.  Be sure to follow what you were taught, not just the items explicitly listed here.  (Example: Make sure to have a good commit message.  Not "Adds MYNAME" or "Adds files via upload")

## Structural Requirements
* Projects are individual (no groups)
* Project must be based in this directory
    * THIS directory (the one containing the REQUIREMENTS.md file) must be able to run the startup commands
      - Hint: use `npm create vite . -- --template react` to create files in this directory
        - This tells vite to use the current folder (`.`) instead of creating a new project folder
        - The command will warn there are already files, just "ignore" them
* The project must run with this series of commands: `npm install`, `npm run build`, `npm start`
    - Note the extra requirements about `npm start` below!
      - It should NOT start the vite dev server
      - It should start your single `server.js` that will run both your static SPA and your REST services
    - You may define additional commands as options, but running the above commands only must work
* Any `package.json` files you write should be well organized and complete
    * Fill in fields accurately
    * Use `dependencies` and `devDependencies` appropriately
    * Configure `scripts` appropriately
* Your project should use `npm`, not `yarn` or other alternatives
* Your project should NOT include files not appropriate
  - Do not commit `node_modules/` or `dist/`, for example
  - Vite will automatically provide a `.gitignore` file to do this, you just need to not mess it up
* The project CANNOT use `npm start` to run `vite` or `npm run dev` 
    * You must use Vite to create and develop your application
    * You will have to adjust the `scripts` section of `package.json` 
    * Serve the results of `npm run build` as static files in your server (which starts with `npm start`)
    * This is how the production use of your project would work

## Front End
* The project must use a React-based front end
* The project must be a Vite-based SPA and an express-based NodeJS server
* Your front end code must follow all the best practices as outlined in classes and in PR feedback
* Your front end code may use ONLY outside libs or resources listed here, unless you get advance approval
    * react, react-dom, vite, and the libraries that vite installs
    * icons as SVG or PNG (only) from https://fonts.google.com/icons 
    * images from https://unsplash.com or images you personally own
    * vitest, jest, enzyme, @testing-library/react, chai, sinon, tape
* Advance approval will NOT be granted for:
    * SASS/less
    * CSS preprocessors
    * react-router, @tanstack/router
    * react-query, @tanstack/query
    * font-awesome or other icon libraries
    * Bootstrap/Foundation/similar libraries
    * axios and other fetch() alternatives
    * jQuery or other non-react DOM manipulation

## Services
* Your backend/service code must use express-based NodeJS
* The project must involve calling REST-based service calls that you write
    * You may call outside services as well, but you must use some services you write
    * Your service calls (the ones you wrote) must include at least 3 different HTTP methods in a RESTful way
- You must use fetch() and promises directly (NO async/await)
  - Not because async/await is bad, but because I want to see that you understand promises themselves
* Your backend code must follow the best practices as outlined in classes and in PR feedback 
* Your backend code may include ONLY outside libs listed here, unless you get __advance__ approval
    * express
    * cookie-parser
    * eslint, prettier, babel
    * vitest, jest, mocha, chai, sinon, tape
* Advance approval will NOT be granted for:
    * express-session
    * SASS/less
    * CSS preprocessors
    * Bootstrap/Foundation/similar libraries
    * Database libraries
    * axios and other fetch() alternatives
    * jQuery or other non-react DOM manipulation

## Functionality and Creativity 
* Your project must do something useful and/or interesting
* Your project must be usable and attractive
* Your project must have some form of input validation (front end AND back end)
* Your project must have some form of helpful error reporting (to the user, on screen)
* Your project may be considered for the college to exhibit - projects that meet that criteria are scoring very well for functionality and creativity
* Because I am banning routing libraries like react-router, the app is NOT expected to handle the Back button or maintaining the current front-end state on page reload/refresh

## README
* You must include a README.md in your project
  - Replace the default README.md file Vite creates
* Your README must include a good and useful description of what your project does
* Your README must include a basic description of how to use your project (so we can use your application and see all the parts)
    * Your project shouldn't **require** someone read the README to understand how to use it (discoverable functionality)
* You must indicate the source and licensing of any outside images/media in your README.  Any outside libraries or resources that you gained approval for should also be listed with their source and licensing information.

## Security requirements
- Users must have an authentication step
    - No actual passwords are checked, but the step must happen
      - Banning user "dog" counts IF you treat it differently from invalid characters in the username
        - Instead treat the user as not having enough permissions
    - There must be some case where authentication is denied (such as banning user "dog")
    - The step should be clearly distinct as when any authentication happen
    - The server must respond with some sort of token/session id for the client to use for authentication/authorization
      - A session id cookie counts
- All service calls must have some form of authorization (unless the service call is intended to allow open access)
    - passing a token that is validated on the server side
    - token may be passed as a cookie or as a header
- All security best practices from classes must be followed
    - In particular, various insertion attacks (XSS, etc)
      - React will do MOST of this automatically on the front end, but the backend MUST sanitize user input
      - For this project, assume we are content to store data with HTML Entities in it if needed
    - Exception: We aren't worried about requiring HTTPS
- Do NOT store or ask for any passwords in any way
    - You can completely omit passwords, or you can ask for a password and not check it
    - You CAN require that a password be given (not ''), but SHOULD NOT check passwords for any other specific value or pattern
    - This is because we have learned that writing our own password storage/use is poor security unless we specialize in that

## Grading Rubric
Note: The project is to show your understanding of the material from class.  If you don't do that, you can lose points, even it "it works".  Do NOT copy or generate your work (see "do-not-copy-work.md" at the root of this repo).

This project is graded on a number of categories, each graded on the below scale:
- Missing (0)
- Needs Improvement (1)
- Good (2)
- Excellent (3)

This means a single mistake might cost you 0 points or more than 1 point, depending on how much that mistake changes your demonstration of the skills from class.

The categories for this project are:

### Submission and Overall Requirements
- PR contains only work that is part of this assignment
- PR follows expectations for PRs in this course
- Project includes a README giving necessary information as required
- Code structure and content matches the requirements 
- Code runs successfully and using expected methods using `npm install; npm run build; npm start`
- The listed requirements from REQUIREMENTS not covered by other categories are fulfilled
- Follow all restrictions, including in particular but not limited to:
  - Allowed/banned packages/modules/libraries/resources
  - Do not use front end JS to modify the DOM outside of React
  - Do not use style attributes/properties/props
### Server Code Organization and Quality
- Server code should have distinct separation of data models (state) and the code that changes them from the code that handles server route handling
- Server code is understandable, skimmable, with files, functions, and variables well-named for what they hold, represent, and do
### RESTful Services
- Your services each follow all 3 of my basic rules of REST
- Services that require auth must confirm auth 
  - Outside of login/logout, if you have any services that intentionally do not require auth, mention that specifically in the REQUIREMENTS
- At least some services require auth
- You must use at least 3 distinct HTTP methods as part of RESTful services 
- Your services must interact with changing server-side state beyond sessions
- Your services validate/sanitize data before saving it to state
### HTML and CSS Quality
- Your HTML uses semantic elements correctly and when applicable
- Your HTML is valid and complete
- Your page uses a correct and useful `<title>`
- Your class names are semantic and use kebab-case or BEM
- Your CSS is contained within CSS files
- Your CSS is in multiple CSS files as recommended in the React unit of the course
- Your HTML and CSS follow the best practices as taught in class
### General JS Quality
- Do not use alert(), prompt(), or similar
- Do not use async or await keywords 
  - To promote your understanding of asynchronous behavior and promises
- Your JS follows the best practices as taught in class
### JSX Quality
- Your JSX follows the best practices as taught in class
- No Component should be too large and complex
- Client side state should be clear and understandable
### Calling Services
- When a service call means that a user must take action or should be made aware, the application shows the user a message or required step
  - Messages sent to the console do not count as being shown to the user
### Extra Credit Opportunities 
Note: worry about the base requirements first!

Extra Credit comes in two variations.  Each category is a single category that does not require all the options listed and is evaluated based on the demonstrated skill and understanding.  **Working** is not what these are graded upon (though that needs to happen for them to be counted)

Be sure to mention any features you think are worthy of Extra Credit that could be easily overlooked (such as using pagination from a service call)
#### Extra Service Interaction Complexity
- More complex service interactions beyond the minimum
  - Different HTTP methods (used in an appropriate RESTful way)
  - Polling when appropriate to the application
    - Remember to perform clean up of any intervals!
  - Services with (used) pagination
  - Rather than treat every user as having an account, require registration(creation)  of usernames before allowing those usernames to login
    - You can treat dog as existing username that always fails an authorization check (has no permissions)
#### Extra State Complexity
- Different levels of authorization (users not yet logged in, logged in users, logged in administrators) able to use different services or get different results from those services
  - As we don't have passwords, this would be based on the user name and data saying which users have what permissions
  - Mention any predefined usernames and permissions in the README
- UI interactions that require state management
  - Different "pages" and screens 
    - Note: react-router is NOT allowed, you will have to do conditional rendering yourself
        - Not because react-router (or other router libraries) are BAD, but because I want to see you demonstrate YOUR understanding of how they should work
        - Handling the "Back" button isn't required, but doing so is an opportunity for extra credit
  - The larger the number of visual states that are possible (and managed correctly), the more impressive the work
  - Complex form validation with visual feedback to the user 
- Excellent architecture and separation of concerns on both front end and backend
  - Good use of useReducer to update state via "action" concepts

