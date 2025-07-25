import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            FreightFlow AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline lumber mill freight coordination with AI-powered onboarding
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/onboarding"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Onboarding
            </Link>
            <Link 
              href="/dashboard"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Mill Profile</h3>
            <p className="text-gray-600">
              Capture lumber mill specifications, capacity, and product catalog
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Ai Configuration</h3>
            <p className="text-gray-600">
              AI-powered freight coordination setup with intelligent routing rules
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Go Live</h3>
            <p className="text-gray-600">
              Integration testing and seamless transition to production shipments
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}