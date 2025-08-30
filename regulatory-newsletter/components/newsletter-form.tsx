"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Building2, Factory, FileText, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormData {
  name: string
  email: string
  description: string
  frequency: string
  agencies: string[]
  industries: string[]
  topics: string[]
}

const agencies = [
  { id: "epa", label: "EPA - Environmental Protection Agency" },
  { id: "fda", label: "FDA - Food and Drug Administration" },
  { id: "faa", label: "FAA - Federal Aviation Administration" },
  { id: "sec", label: "SEC - Securities and Exchange Commission" },
  { id: "dot", label: "DOT - Department of Transportation" },
  { id: "ftc", label: "FTC - Federal Trade Commission" },
  { id: "osha", label: "OSHA - Occupational Safety & Health" },
  { id: "cdc", label: "CDC - Centers for Disease Control" },
  { id: "cms", label: "CMS - Centers for Medicare & Medicaid" },
  { id: "dol", label: "DOL - Department of Labor" },
  { id: "doe", label: "DOE - Department of Energy" },
  { id: "fcc", label: "FCC - Federal Communications Commission" },
  { id: "cftc", label: "CFTC - Commodity Futures Trading" },
  { id: "ferc", label: "FERC - Federal Energy Regulatory" },
  { id: "usda", label: "USDA - Department of Agriculture" },
  { id: "hhs", label: "HHS - Health and Human Services" },
]

const industries = [
  { id: "healthcare", label: "Healthcare & Medical Devices" },
  { id: "pharmaceutical", label: "Pharmaceutical & Biotechnology" },
  { id: "finance", label: "Finance & Banking" },
  { id: "fintech", label: "Fintech & Digital Payments" },
  { id: "manufacturing", label: "Manufacturing & Industrial" },
  { id: "automotive", label: "Automotive & Electric Vehicles" },
  { id: "energy", label: "Energy & Utilities" },
  { id: "renewable_energy", label: "Renewable Energy" },
  { id: "oil_gas", label: "Oil & Gas" },
  { id: "transportation", label: "Transportation & Logistics" },
  { id: "aviation", label: "Aviation & Aerospace" },
  { id: "maritime", label: "Maritime & Shipping" },
  { id: "technology", label: "Technology & Software" },
  { id: "telecommunications", label: "Telecommunications" },
  { id: "food", label: "Food & Beverage" },
  { id: "agriculture", label: "Agriculture & Farming" },
  { id: "construction", label: "Construction & Real Estate" },
  { id: "chemicals", label: "Chemicals & Materials" },
  { id: "mining", label: "Mining & Natural Resources" },
  { id: "retail", label: "Retail & Consumer Goods" },
]

const topics = [
  { id: "safety", label: "Safety Standards & Requirements" },
  { id: "environmental_protection", label: "Environmental Protection" },
  { id: "climate_change", label: "Climate Change & Emissions" },
  { id: "air_quality", label: "Air Quality & Pollution" },
  { id: "water_quality", label: "Water Quality & Management" },
  { id: "compliance", label: "Compliance & Enforcement" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "data_privacy", label: "Data Privacy & Protection" },
  { id: "financial_regulation", label: "Financial Regulation" },
  { id: "trade", label: "Trade & Commerce" },
  { id: "import_export", label: "Import/Export Controls" },
  { id: "workplace_safety", label: "Workplace Safety" },
  { id: "consumer_protection", label: "Consumer Protection" },
  { id: "antitrust", label: "Antitrust & Competition" },
  { id: "intellectual_property", label: "Intellectual Property" },
  { id: "drug_approval", label: "Drug Approvals & Clinical Trials" },
  { id: "medical_devices", label: "Medical Device Regulations" },
  { id: "airworthiness", label: "Airworthiness & Aviation Safety" },
  { id: "nuclear_safety", label: "Nuclear Safety & Licensing" },
  { id: "immigration", label: "Immigration & Visa Policy" },
  { id: "reproductive_health", label: "Reproductive Health & Abortion" },
  { id: "contraception", label: "Contraception & Family Planning" },
  { id: "gender_identity", label: "Gender Identity & LGBTQ+ Rights" },
  { id: "civil_rights", label: "Civil Rights & Anti-Discrimination" },
  { id: "voting_rights", label: "Voting Rights & Election Law" },
  { id: "education", label: "Education Policy & Title IX" },
  { id: "criminal_justice", label: "Criminal Justice & Sentencing" },
  { id: "gun_control", label: "Gun Control & Firearms" },
  { id: "disability_rights", label: "Disability Rights & ADA" },
  { id: "housing", label: "Housing & Fair Housing" },
  { id: "social_services", label: "Social Services & Welfare" },
]

export function NewsletterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    description: "",
    frequency: "weekly",
    agencies: [],
    industries: [],
    topics: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isOptionalOpen, setIsOptionalOpen] = useState(false)

  const handleCheckboxChange = (category: "agencies" | "industries" | "topics", value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [category]: checked ? [...prev[category], value] : prev[category].filter((item) => item !== value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Successfully subscribed! You'll start receiving personalized regulatory updates.",
        })
        setFormData({
          name: "",
          email: "",
          description: "",
          frequency: "weekly",
          agencies: [],
          industries: [],
          topics: [],
        })
      } else {
        throw new Error("Subscription failed")
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again or contact support." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
          </div>

          {/* Primary Interest Description */}
          <Card className="border-2 border-gray-300 bg-gray-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-gray-900">Regulatory Interests *</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                This is the most important field - our AI will use your description to find relevant regulatory
                documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the regulatory topics, industries, or specific areas you'd like to stay informed about. For example:

• Environmental regulations affecting manufacturing
• FDA approvals for medical devices  
• Financial compliance requirements for fintech
• Aviation safety standards and airworthiness directives
• OSHA workplace safety updates for construction
• Data privacy regulations impacting tech companies

Be as specific as possible - this helps us match you with the most relevant updates!"
                className="min-h-[120px] border-gray-300 focus:border-gray-500 focus:ring-gray-500 resize-none"
              />
            </CardContent>
          </Card>

          {/* Newsletter Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
              Newsletter Frequency
            </Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Updates</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="monthly">Monthly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional Categories */}
          <Collapsible open={isOptionalOpen} onOpenChange={setIsOptionalOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Optional: Help us categorize your interests
                <ChevronDown className={`h-4 w-4 transition-transform ${isOptionalOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-6">
              <p className="text-sm text-gray-600 italic">
                These categories are optional but can help improve our matching. Your description above is most
                important.
              </p>

              {/* Federal Agencies */}
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                    <Building2 className="h-4 w-4" />
                    Federal Agencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agencies.map((agency) => (
                      <div
                        key={agency.id}
                        className="flex items-center space-x-2 p-2 rounded border border-gray-100 hover:bg-gray-50"
                      >
                        <Checkbox
                          id={agency.id}
                          checked={formData.agencies.includes(agency.id)}
                          onCheckedChange={(checked) => handleCheckboxChange("agencies", agency.id, checked as boolean)}
                        />
                        <Label htmlFor={agency.id} className="text-sm text-gray-700 cursor-pointer">
                          {agency.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Industries */}
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                    <Factory className="h-4 w-4" />
                    Industries & Sectors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {industries.map((industry) => (
                      <div
                        key={industry.id}
                        className="flex items-center space-x-2 p-2 rounded border border-gray-100 hover:bg-gray-50"
                      >
                        <Checkbox
                          id={industry.id}
                          checked={formData.industries.includes(industry.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("industries", industry.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={industry.id} className="text-sm text-gray-700 cursor-pointer">
                          {industry.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Topics */}
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                    <FileText className="h-4 w-4" />
                    Regulatory Topics & Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center space-x-2 p-2 rounded border border-gray-100 hover:bg-gray-50"
                      >
                        <Checkbox
                          id={topic.id}
                          checked={formData.topics.includes(topic.id)}
                          onCheckedChange={(checked) => handleCheckboxChange("topics", topic.id, checked as boolean)}
                        />
                        <Label htmlFor={topic.id} className="text-sm text-gray-700 cursor-pointer">
                          {topic.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-base font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe to Regulatory Updates"
            )}
          </Button>

          {/* Messages */}
          {message && (
            <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
