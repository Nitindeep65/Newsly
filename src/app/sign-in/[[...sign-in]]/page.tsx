import { ModeToggle } from '@/components/togglemode'
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center relative">
      {/* Theme toggle positioned in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      
      {/* Sign-in form centered */}
      <div className="w-full max-w-md px-4">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border shadow-lg rounded-lg transition-colors duration-300",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
              formFieldInput: "bg-input border-border text-foreground placeholder:text-muted-foreground transition-colors",
              formFieldLabel: "text-foreground",
              identityPreviewText: "text-foreground",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground transition-colors",
              footerActionText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90 transition-colors",
              dividerText: "text-muted-foreground",
            }
          }}
          afterSignInUrl="/admin-panel"
        />
      </div>
    </div>
  )
}