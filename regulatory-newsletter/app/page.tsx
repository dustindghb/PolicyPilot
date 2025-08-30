import { NewsletterForm } from "@/components/newsletter-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Regulatory Newsletter Subscription</h1>
          <p className="text-lg text-gray-600">
            Stay informed with personalized regulatory updates tailored to your interests
          </p>
        </div>
        <NewsletterForm />
      </div>
    </main>
  )
}

