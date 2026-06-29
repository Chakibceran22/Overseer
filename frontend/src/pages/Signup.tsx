import { useState, type FormEvent } from "react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { Dessert, LoaderCircle, LockKeyhole, Mail } from "lucide-react"
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
import type { AuthResponse } from "@/types/AuthState"
import { useAuth } from "@/store/useAuth"
import { getApiErrorMessage } from "@/lib/api"

export const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPass, setConfirmPass] = useState('')
  const {signup} = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }


    if (password !== confirmedPass) {
      toast.error("Passwords do not match", {
        description: "Please confirm the same password before signing up.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await signup({
        email: email,
        password: password
      })
      toast.success("Account created", {
        description: "Welcome to Overseer.",
      })

    } catch (error) {
      toast.error("Sign up failed", {
        description: getApiErrorMessage(error),
      })
    }
    finally {
      setIsSubmitting(false)
    }
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
              Choose an email and password to create your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ctp-overlay-2)]" />
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value) }
                    autoComplete="email"
                    placeholder="Email"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    value={confirmedPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
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
