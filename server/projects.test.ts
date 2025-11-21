import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    credits: 100,
    subscriptionTier: "free",
    subscriptionExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("projects router", () => {
  it("should allow authenticated users to create projects", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.projects.create({
      title: "Test Film Project",
      description: "A test film about AI",
    });

    expect(result).toEqual({ success: true });
  });

  it("should allow authenticated users to list their projects", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const projects = await caller.projects.list();

    expect(Array.isArray(projects)).toBe(true);
  });
});

describe("auth router", () => {
  it("should return user info for authenticated requests", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeDefined();
    expect(user?.email).toBe("test@example.com");
  });

  it("should return null for unauthenticated requests", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeNull();
  });
});
