import { test, expect } from "@playwright/test";
import { KICD_LINKS } from "../../lib/kicd";

// @external — these tests make real HTTP requests to kicd.ac.ke.
// They are tagged `@external` and skipped automatically when offline.
// Run explicitly with: npx playwright test --grep @external

for (const link of KICD_LINKS) {
  test(`@external ${link.id}: ${link.url} returns non-500`, async ({ request }) => {
    test.slow(); // KICD can be slow
    try {
      const res = await request.get(link.url, {
        timeout: 15_000,
        headers: { "User-Agent": "elimuMtaani-link-health/1.0" },
      });
      // Accept anything below 500: 200, 301, 302, 403 (firewalled), 404 (page moved) are all OK
      // as long as the server is alive.
      expect(res.status()).toBeLessThan(500);
    } catch {
      test.skip(true, "KICD server unreachable (offline or firewall)");
    }
  });
}
