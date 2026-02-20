# Auth0 Hosted Login (Classic) Template

This folder contains a fully custom Auth0-hosted login page that matches the current BudgitUrself login/signup UI.

## How to use

1. In the Auth0 Dashboard, open `Branding` -> `Universal Login`.
2. Switch to the `Classic` experience.
3. Open `Login` and enable `Custom Login Form`.
4. Paste the contents of `auth0/custom-login.html` into the editor and save.

## Notes

- The template uses `@@config@@` and Auth0.js to perform database login and signup.
- Sign-up mode is toggled via `screen_hint=signup` (or via the in-page toggle).
- The Google button uses the `google-oauth2` connection.

## App links (optional)

If you want your app to open the sign-up view by default:
- Use `/auth/login?screen_hint=signup` for "Sign up" actions.
- Use `/auth/login` for "Log in" actions.
