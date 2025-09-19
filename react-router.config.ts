import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
  async prerender() {
    return [
      "/",
      "/credits",
      "/auth/login",
      "/auth/register",
    ];
  },
} satisfies Config;