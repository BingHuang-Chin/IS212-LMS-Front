# IS212-LMS-Front

## Setting up envrionment
This repository requires you to have [vercel](https://vercel.com/cli) installed. Vercel will be acting as our web-server, and our deployment engine for this repository.

## Running development server
Before proceeding, you are required to create an account at [here](https://vercel.com/login). Once done, you are ready to continue.
```sh
# Access the cloned project
cd IS212-LMS-Back

# Run the webserver in development mode
vercel dev
```

Fill the in the values per prompted by the setup after running `vercel dev`.  
Choose whichever options you have signed up with, for mine it's email. Do the required authentication the prompt shows.
```sh
Vercel CLI 23.1.2 dev (beta) — https://vercel.com/feedback
No existing credentials found. Please log in:
  Log in to Vercel
  Continue with GitHub
  Continue with GitLab
  Continue with Bitbucket
❯ Continue with Email
  Continue with SAML Single Sign-On
  ─────────────────────────────────
  Abort
```

Once you have logged in, we're ready to setup the project environment now.
```sh
# Run the local web server again
vercel dev

# Fill in the parameters accordingly
Vercel CLI 23.1.2 dev (beta) — https://vercel.com/feedback
? Set up and develop “~/Documents/Singapore Management University/IS212 - Software Project Management/Project/IS212-LMS-Front”? [Y/n] y
? Which scope should contain your project? Bing Huang # This should contain your scope.
? Link to existing project? [y/N] n
? What’s your project’s name? aio-lms
? In which directory is your code located? ./
No framework detected. Default Project Settings:
- Build Command: `npm run vercel-build` or `npm run build`
- Output Directory: `public` if it exists, or `.`
- Development Command: None
? Want to override the settings? [y/N] n
```

Your application will be accessible at http://localhost:3000.
