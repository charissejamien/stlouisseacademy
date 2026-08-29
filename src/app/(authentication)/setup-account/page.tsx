"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { setupAccount } from "./actions"

export default function SetupAccountPage() {
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const setupAccountMutation = useMutation({
    mutationFn: (password: string) =>
      setupAccount(password),

    onSuccess: () => {
      router.push("/dashboard")
    },

    onError: (error) => {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      )
    },
  })

  function handleSubmit() {
    setError("")

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your password.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setupAccountMutation.mutate(password)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Set up your account
          </h1>

          <p className="text-muted-foreground">
            Create a password to complete your account.
          </p>
        </div>

        <div className="space-y-4">
          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              disabled={setupAccountMutation.isPending}
              className="w-full rounded-md border p-2"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium"
            >
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError("")
              }}
              disabled={setupAccountMutation.isPending}
              className="w-full rounded-md border p-2"
              placeholder="Confirm your password"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={setupAccountMutation.isPending}
            className="w-full rounded-md bg-black p-2 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {setupAccountMutation.isPending
              ? "Setting up..."
              : "Complete Account Setup"}
          </button>
        </div>
      </div>
    </main>
  )
}
