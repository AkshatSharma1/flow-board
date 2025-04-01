"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Pen, Share, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#6366F1" />
              <path d="M10 10L22 22M22 10L10 22" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="3" />
            </svg>
            <span className="font-bold text-xl">Flowboard</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary cursor-pointer">
              Features
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary">
              FAQ
            </Link>
            <Link href="/signIn">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                Sign in
              </Button>
            </Link>
            <Link href="/signUp">
              <Button size="sm" className="cursor-pointer">
                Sign up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Visual collaboration made <span className="text-primary">simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create diagrams, wireframes, and collaborative visual documents in seconds. No learning curve required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/board">
              <Button size="lg" className="gap-2 cursor-pointer">
                Start drawing now <ArrowRight size={16} />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="cursor-pointer">
              Watch demo
            </Button>
          </div>

          {/* App Preview */}
          <div className="mt-16 relative">
            <div className="w-full h-[400px] rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border shadow-sm">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M21 9C21 15 19.5 19 12.5 19C5.5 19 3 15.5 3 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M15 22L12 19L15 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 19H19.5C20.8807 19 22 17.8807 22 16.5V16.5C22 15.1193 20.8807 14 19.5 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm font-medium">Preview image will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-16">Why Flowboard?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Pen size={20} className="text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold mt-2">Intuitive Drawing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sketch, diagram, and wireframe with our easy-to-use drawing tools.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Share size={20} className="text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold mt-2">Real-time Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Work together with your team in real-time, from anywhere.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Zap size={20} className="text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold mt-2">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No lag, no waiting. Create and share your ideas instantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of teams already using Flowboard to collaborate visually.
          </p>
          <Button size="lg">Create your first board</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#6366F1" />
                <path d="M10 10L22 22M22 10L10 22" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="3" />
              </svg>
              <span className="font-medium">Flowboard</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary">Terms</Link>
              <Link href="#" className="hover:text-primary">Privacy</Link>
              <Link href="#" className="hover:text-primary">Help</Link>
              <Link href="#" className="hover:text-primary">Contact</Link>
              <span>© 2025 Flowboard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}