import { CreditCard, DollarSign, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: DollarSign,
    title: "Track Your Paycheck",
    description: "Input your total paycheck and let us help you allocate every dollar wisely.",
  },
  {
    icon: TrendingUp,
    title: "Manage Expenses",
    description: "Subtract your fixed expenses automatically and see what's left for spending.",
  },
  {
    icon: PieChart,
    title: "Know Your Budget",
    description:
      "Instantly see how much you're allowed to spend on extras after covering essentials.",
  },
  {
    icon: CreditCard,
    title: "Categorize Everything",
    description: "Organize spending by card and category to understand where your money goes.",
  },
];

export function Features() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl text-gray-900 sm:text-5xl">
            Everything You Need to Budget Smarter
          </h2>
          <p className="text-xl text-gray-600">
            Simple tools that help you take control of your finances
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-2 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="size-6 text-blue-600" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
