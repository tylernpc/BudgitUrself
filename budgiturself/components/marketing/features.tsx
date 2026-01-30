import {DollarSign, PieChart, CreditCard, TrendingUp} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

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
        description: "Instantly see how much you're allowed to spend on extras after covering essentials.",
    },
    {
        icon: CreditCard,
        title: "Categorize Everything",
        description: "Organize spending by card and category to understand where your money goes.",
    },
];

export function Features() {
    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl text-gray-900 mb-4">
                        Everything You Need to Budget Smarter
                    </h2>
                    <p className="text-xl text-gray-600">
                        Simple tools that help you take control of your finances
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={feature.title} className="border-2 hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div
                                        className="size-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                                        <Icon className="size-6 text-blue-600"/>
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
