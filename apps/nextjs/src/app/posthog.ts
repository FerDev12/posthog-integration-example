// app/posthog.js
import { PostHog } from 'posthog-node'

export default function PostHogClient() {
  const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (process.env.NODE_ENV === 'production' && POSTHOG_KEY && POSTHOG_HOST) {
    return new PostHog(POSTHOG_KEY as string, {
      host: POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0
    })
  }
}
