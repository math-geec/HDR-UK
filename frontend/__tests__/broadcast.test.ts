import { bc } from "@/lib/broadcast";

describe("BroadcastChannel setup", () => {
  test("bc is created in browser environment", () => {
    expect(bc).toBeDefined();
  });

  test("bc exposes postMessage", () => {
    expect(typeof bc.postMessage).toBe("function");
  });
});
