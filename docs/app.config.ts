import { defineConfig } from "@solidjs/start/config";
import { withSolidBase } from "@kobalte/solidbase/config";

export default defineConfig(withSolidBase(
  // SolidStart config
  {
    server: {
      prerender: {
        crawlLinks: true
      }
    }
  },
  // SolidBase config
  {
    title: "@kobalte/themes",
    titleTemplate: ":title - @kobalte/themes",
    description: "Theme utilities for Solid & SolidStart",
    themeConfig: {
      sidebar: {
        "/": [
          {
            title: "Overview",
            collapsed: false,
            items: [
              {
                title: "Home",
                link: "/"
              },
              {
                title: "About",
                link: "/about"
              }
            ]
          }
        ]
      }
    }
  }
));
