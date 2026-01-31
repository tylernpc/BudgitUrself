import {CreditCard, Tag} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const cardData = [
    {name: "Chase Sapphire", type: "Credit", amount: "$432", color: "bg-blue-500"},
    {name: "Bank of America", type: "Debit", amount: "$289", color: "bg-green-500"},
    {name: "Amex Gold", type: "Credit", amount: "$156", color: "bg-yellow-500"},
];

const categoryData = [
    {name: "Groceries", amount: "$340", percentage: 38, color: "bg-emerald-500"},
    {name: "Dining", amount: "$220", percentage: 25, color: "bg-orange-500"},
    {name: "Entertainment", amount: "$180", percentage: 20, color: "bg-purple-500"},
    {name: "Shopping", amount: "$137", percentage: 17, color: "bg-pink-500"},
];

export function Categories() {
    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl text-gray-900 mb-4">
                        Track Every Dollar
                    </h2>
                    <p className="text-xl text-gray-600">
                        Organize your spending by card and category to see the full picture
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* By Card */}
                    <Card className="border-2">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <CreditCard className="size-6 text-indigo-600"/>
                                </div>
                                <CardTitle>Spending by Card</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cardData.map((card) => (
                                <div key={card.name}
                                     className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-3 rounded-full ${card.color}`}/>
                                        <div>
                                            <p className="text-gray-900">{card.name}</p>
                                            <Badge variant="outline" className="text-xs mt-1">{card.type}</Badge>
                                        </div>
                                    </div>
                                    <p className="text-xl text-gray-900">{card.amount}</p>
                                </div>
                            ))}
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-600">Total Spending</p>
                                    <p className="text-2xl text-gray-900">$877</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* By Category */}
                    <Card className="border-2">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-violet-100 flex items-center justify-center">
                                    <Tag className="size-6 text-violet-600"/>
                                </div>
                                <CardTitle>Spending by Category</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {categoryData.map((category) => (
                                <div key={category.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-3 rounded-full ${category.color}`}/>
                                            <p className="text-gray-900">{category.name}</p>
                                        </div>
                                        <p className="text-gray-900">{category.amount}</p>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${category.color}`}
                                            style={{width: `${category.percentage}%`}}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-600">Total Categorized</p>
                                    <p className="text-2xl text-gray-900">$877</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
