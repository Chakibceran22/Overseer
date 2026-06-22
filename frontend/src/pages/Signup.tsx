import { useState, type FormEvent } from "react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { LoaderCircle, LockKeyhole, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const form = new FormData(event.currentTarget)
    const password = String(form.get("password") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please confirm the same password before signing up.",
      })
      return
    }

    setIsSubmitting(true)

    window.setTimeout(() => {
      setIsSubmitting(false)
      toast.info("Signup is ready for backend integration", {
        description: "No request is sent yet.",
      })
    }, 650)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-[color-mix(in_srgb,var(--ctp-surface-2)_38%,transparent)] bg-[var(--ctp-mantle)] shadow-xl shadow-[color-mix(in_srgb,var(--ctp-crust)_60%,transparent)]">
          <CardHeader className="space-y-3 px-5 pt-6 text-center sm:px-7 sm:pt-7">
            <CardTitle className="text-2xl font-semibold text-[var(--ctp-text)] sm:text-3xl">
              Create account
            </CardTitle>
            <CardDescription className="text-[var(--ctp-subtext-0)]">
              Choose a username and password to create your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ctp-overlay-2)]" />
                  <Input
                    id="signup-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Username"
                    required
                    className="h-11 border-[color-mix(in_srgb,var(--ctp-surface-2)_44%,transparent)] bg-[var(--ctp-base)] pl-10 text-[var(--ctp-text)] placeholder:text-[var(--ctp-overlay-1)] focus-visible:border-[var(--ctp-primary)] focus-visible:ring-[var(--ctp-primary)]/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ctp-overlay-2)]" />
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    required
                    className="h-11 border-[color-mix(in_srgb,var(--ctp-surface-2)_44%,transparent)] bg-[var(--ctp-base)] pl-10 text-[var(--ctp-text)] placeholder:text-[var(--ctp-overlay-1)] focus-visible:border-[var(--ctp-primary)] focus-visible:ring-[var(--ctp-primary)]/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ctp-overlay-2)]" />
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    required
                    className="h-11 border-[color-mix(in_srgb,var(--ctp-surface-2)_44%,transparent)] bg-[var(--ctp-base)] pl-10 text-[var(--ctp-text)] placeholder:text-[var(--ctp-overlay-1)] focus-visible:border-[var(--ctp-primary)] focus-visible:ring-[var(--ctp-primary)]/30"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  required
                  className="mt-0.5 border-[color-mix(in_srgb,var(--ctp-surface-2)_52%,transparent)] data-checked:border-[var(--ctp-primary)] data-checked:bg-[var(--ctp-primary)] data-checked:text-[var(--ctp-base)] focus-visible:ring-[var(--ctp-primary)]/35"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-5 text-[var(--ctp-subtext-0)]"
                >
                  I agree to the terms and privacy policy.
                </Label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full border border-[var(--ctp-primary)] bg-[var(--ctp-primary)] text-[var(--ctp-base)] hover:border-[var(--ctp-primary-2)] hover:bg-[var(--ctp-primary-2)] focus-visible:border-[var(--ctp-primary-2)] focus-visible:bg-[var(--ctp-primary-2)] focus-visible:ring-[var(--ctp-primary-2)]/40 active:bg-[color-mix(in_srgb,var(--ctp-primary-2)_82%,var(--ctp-base)_18%)]"
                disabled={isSubmitting}
              >
                {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
                Sign up
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-[var(--ctp-subtext-0)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[var(--ctp-primary)] transition-colors hover:text-[var(--ctp-primary-2)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ctp-primary)]/35"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
