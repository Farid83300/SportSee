import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  // Désactivé pour permettre un déploiement 100% statique sur Vercel (démo mockée)
  ssr: false,
} satisfies Config;
