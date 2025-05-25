"use client"

import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              We provide innovative financial solutions to help you achieve your goals.
            </p>
          </div>
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center sm:justify-start text-sm sm:text-base text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                kchandresh726@gmail.com
              </li>
              <li className="flex items-center justify-center sm:justify-start text-sm sm:text-base text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                +91 9398610921
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex justify-center sm:justify-start space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Finara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
