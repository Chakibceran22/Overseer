import { useState, type FormEvent } from "react"
import { motion } from "motion/react"
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/api"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/store/useAuth"
export const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email, password })
      toast.success("Signed in", {
        description: "Welcome back to Overseer.",
      })
      navigate("/", { replace: true })
    } catch (error) {
      // getApiErrorMessage maps 401 / 400 / network / 5xx to a readable message
      toast.error("Could not sign in", {
        description: getApiErrorMessage(error),
      })
    } finally {
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
              Sign in
            </CardTitle>
            <CardDescription className="text-[var(--ctp-subtext-0)]">
              Enter your credentials to access Overseer.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ctp-overlay-2)]" />
                  <Input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    required
                    className="h-11 border-[color-mix(in_srgb,var(--ctp-surface-2)_44%,transparent)] bg-[var(--ctp-base)] pl-10 text-[var(--ctp-text)] placeholder:text-[var(--ctp-overlay-1)] focus-visible:border-[var(--ctp-primary)] focus-visible:ring-[var(--ctp-primary)]/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Password</Label>
                  
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ctp-overlay-2)]" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value) }
                    autoComplete="current-password"
                    placeholder="Password"
                    required
                    className="h-11 border-[color-mix(in_srgb,var(--ctp-surface-2)_44%,transparent)] bg-[var(--ctp-base)] pl-10 text-[var(--ctp-text)] placeholder:text-[var(--ctp-overlay-1)] focus-visible:border-[var(--ctp-primary)] focus-visible:ring-[var(--ctp-primary)]/30"
                  />
                </div>
              </div>

              

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full border border-[var(--ctp-primary)] bg-[var(--ctp-primary)] text-[var(--ctp-base)] hover:border-[var(--ctp-primary-2)] hover:bg-[var(--ctp-primary-2)] focus-visible:border-[var(--ctp-primary-2)] focus-visible:bg-[var(--ctp-primary-2)] focus-visible:ring-[var(--ctp-primary-2)]/40 active:bg-[color-mix(in_srgb,var(--ctp-primary-2)_82%,var(--ctp-base)_18%)]"
                disabled={isSubmitting}
              >
                {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-[var(--ctp-subtext-0)]">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-[var(--ctp-primary)] transition-colors hover:text-[var(--ctp-primary-2)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ctp-primary)]/35"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
