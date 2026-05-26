import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              'bg-primary hover:bg-primary-hover text-white text-sm normal-case',
            card: 'bg-dark-card border border-dark-border shadow-xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton: 'border-dark-border text-white hover:bg-dark-border',
            socialButtonsBlockButtonText: 'text-white',
            dividerLine: 'bg-dark-border',
            dividerText: 'text-gray-500',
            formFieldLabel: 'text-gray-300',
            formFieldInput:
              'bg-dark border-dark-border text-white focus:border-primary',
            footerActionLink: 'text-primary hover:text-primary-hover',
          },
        }}
      />
    </div>
  )
}
