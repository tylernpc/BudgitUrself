import { CreditCard, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWholeCurrency } from "@/lib/format";

const cards = [
  { name: "Chase Sapphire", type: "Credit", amount: 432, color: "bg-blue-500" },
  { name: "Bank of America", type: "Debit", amount: 289, color: "bg-green-500" },
  { name: "Amex Gold", type: "Credit", amount: 156, color: "bg-yellow-500" },
];

const categories = [
  { name: "Groceries", amount: 340, color: "bg-emerald-500" },
  { name: "Dining", amount: 220, color: "bg-orange-500" },
  { name: "Entertainment", amount: 180, color: "bg-purple-500" },
  { name: "Shopping", amount: 137, color: "bg-pink-500" },
];

const cardsTotal = cards.reduce((total, card) => total + card.amount, 0);
const categoriesTotal = categories.reduce((total, category) => total + category.amount, 0);

export function Categories() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl text-gray-900 sm:text-5xl">Track Every Dollar</h2>
          <p className="text-xl text-gray-600">
            Organize your spending by card and category to see the full picture
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-100">
                  <CreditCard className="size-6 text-indigo-600" />
                </div>
                <CardTitle>Spending by Card</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.name}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-3 rounded-full ${card.color}`} />
                    <div>
                      <p className="text-gray-900">{card.name}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {card.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xl text-gray-900">{formatWholeCurrency(card.amount)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-gray-600">Total Spending</p>
                <p className="text-2xl text-gray-900">{formatWholeCurrency(cardsTotal)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-violet-100">
                  <Tag className="size-6 text-violet-600" />
                </div>
                <CardTitle>Spending by Category</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-3 rounded-full ${category.color}`} />
                      <p className="text-gray-900">{category.name}</p>
                    </div>
                    <p className="text-gray-900">{formatWholeCurrency(category.amount)}</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${category.color}`}
                      style={{ width: `${Math.round((category.amount / categoriesTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-gray-600">Total Categorized</p>
                <p className="text-2xl text-gray-900">{formatWholeCurrency(categoriesTotal)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
