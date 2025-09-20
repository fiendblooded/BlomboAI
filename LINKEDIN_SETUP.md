# LinkedIn OAuth Setup

To enable LinkedIn authentication in your Event Matcher app, follow these steps:

## 1. Create a LinkedIn Developer App

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill out the form:
   - **App name**: Event Matcher (or your preferred name)
   - **LinkedIn Page**: Select your company page (or create one)
   - **Privacy policy URL**: Your privacy policy URL
   - **App logo**: Upload a logo (optional)
4. Click "Create app"

## 2. Configure OAuth Settings

1. In your app dashboard, go to the **Auth** tab
2. Add **Authorized redirect URLs**:
   - For local development: `http://localhost:3000/api/auth/callback/linkedin`
   - For production: `https://your-domain.vercel.app/api/auth/callback/linkedin`

## 3. Request Permissions

1. In the **Products** tab, request access to:
   - **Sign In with LinkedIn using OpenID Connect** (for basic profile)
   - **Share on LinkedIn** (if you want to add sharing features later)

## 4. Get Your Credentials

1. Go to the **Auth** tab
2. Copy your **Client ID** and **Client Secret**
3. Add them to your `.env.local`:

```bash
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

## 5. Test the Integration

1. Start your dev server: `npm run dev`
2. Go to any join wizard page
3. Click "Continue with LinkedIn"
4. You should be redirected to LinkedIn for authentication
5. After approval, you'll be redirected back with your profile info pre-filled

## Troubleshooting

**"Invalid redirect_uri"**: Make sure your redirect URL in LinkedIn matches exactly what's in your app settings.

**"Unauthorized"**: Check that your Client ID and Secret are correct in your `.env.local` file.

**Profile info not showing**: LinkedIn's API has rate limits. In development, you might need to wait a few minutes between requests.

## Production Deployment

When deploying to Vercel:

1. Add the production redirect URL to your LinkedIn app
2. Set the environment variables in Vercel dashboard
3. Update `NEXTAUTH_URL` to your production domain

## Optional: Customize Scopes

By default, we request `r_liteprofile r_emailaddress`. You can modify the scopes in `src/lib/auth.ts` if you need additional permissions.
