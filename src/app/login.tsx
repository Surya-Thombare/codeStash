"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Github, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <Suspense>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-block"
            >
              <Code2 className="h-12 w-12 text-primary mb-2" />
            </motion.div>
            <h1 className="text-3xl font-bold">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {mode === "signin"
                ? "Enter your credentials to access your account"
                : "Get started with your free account"}
            </p>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <form className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      onChange={(e) => setName(e.currentTarget.value)}
                      value={name}
                      required
                      maxLength={50}
                      placeholder="Enter your name"
                      className="rounded-md"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={50}
                    placeholder="name@example.com"
                    className="rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "signin" && (
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    required
                    minLength={8}
                    maxLength={100}
                    placeholder="Enter your password"
                    className="rounded-md"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-sm bg-destructive/10 p-3 rounded-md"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsPending(true);
                    try {
                      if (mode === "signin") {
                        await authClient.signIn.email({
                          email,
                          password,
                          callbackURL: "https://code-stash-three.vercel.app/snippets",
                        });
                      } else {
                        await authClient.signUp.email({
                          email,
                          password,
                          name,
                          callbackURL: "https://code-stash-three.vercel.app/snippets",
                        });
                      }
                    } catch (error) {
                      setError(`Authentication failed. Please try again. ${error}`);
                    } finally {
                      setIsPending(false);
                    }
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Loading...
                    </>
                  ) : mode === "signin" ? (
                    "Sign in"
                  ) : (
                    "Create account"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    await authClient.signIn.social({
                      provider: "github",
                      callbackURL: "https://code-stash-three.vercel.app/snippets",
                    });
                  }}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                {mode === "signin" ? (
                  <p className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                      href={`/sign-up${redirect ? `?redirect=${redirect}` : ""}${priceId ? `&priceId=${priceId}` : ""
                        }`}
                      className="text-primary hover:underline font-medium"
                    >
                      Create one
                    </Link>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href={`/sign-in${redirect ? `?redirect=${redirect}` : ""}${priceId ? `&priceId=${priceId}` : ""
                        }`}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Suspense>
  );
}