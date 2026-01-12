# Pulse

A custom Spotify frontend featuring a redesigned UI/UX, custom theming, and keyboard-driven navigation.

## Overview

Pulse is an alternative Spotify client that aims to provide a more streamlined and customizable listening experience. Built with modern web technologies, it connects to Spotify's API to deliver music playback with a fresh interface.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Backend**: Cloudflare Workers
- **Build Tool**: Vite 7
- **Package Manager**: pnpm

## Project Structure

```
pulse/
├── app/
│   ├── src/           # React frontend
│   ├── worker/        # Cloudflare Workers backend
│   │   ├── auth/      # Spotify OAuth (PKCE) flow
│   │   └── spotify/   # Spotify API utilities
│   └── public/        # Static assets
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/)
- A [Spotify Developer](https://developer.spotify.com/) account
  - The account must have a Spotify Premium subscription to enable playback features.

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pulse.git
   cd pulse/app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables for Cloudflare Workers:
   - `SPOTIFY_CLIENT_ID` – Your Spotify app client ID
   - `SPOTIFY_REDIRECT_URI` – OAuth callback URL

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Deployment

```bash
pnpm deploy
```

This builds the project and deploys to Cloudflare Workers.

## Planned Features

- [ ] Custom color themes and styling
- [ ] Keyboard shortcuts for navigation and playback
- [ ] Streamlined, minimal UI
- [ ] Full playback controls

## License

See [LICENSE](LICENSE) for details.

