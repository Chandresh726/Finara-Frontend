**planning.md**

# Objective
Design and build a futuristic, highly interactive frontend for our AI-powered portfolio management platform. The frontend will integrate with the NestJS backend (documented via Swagger) and provide seamless user experience for both new and returning users.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **UI Kit**: shadcn/ui
- **Animation**: Framer Motion
- **Form Validation**: react-hook-form + zod
- **State Management**: React Context (Auth, Theme, Portfolio)

## Design Guidelines
- Modular component-based structure
- Use server components where appropriate
- Responsive layout (desktop, tablet, mobile)
- Theme support: Light & Dark (with toggle)
- Modern visual design (glassmorphism, gradients, clean UI)
- Smooth UI/UX transitions using Framer Motion
- Follow accessible, semantic HTML best practices

## Notes
- Each development task will be listed in `tasks.md`.
- Mark a task as **done** when completed.
- Use clean code principles and reusable atomic components.
- Authenticate all user sessions using JWT stored in cookies/localStorage.