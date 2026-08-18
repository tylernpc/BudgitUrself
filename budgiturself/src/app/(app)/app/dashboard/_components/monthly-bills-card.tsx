import { Calendar, CreditCard as CreditCardIcon, Plus, Receipt, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { DigitalBill, PersonalBill } from "@/lib/budget/types";
import { formatCurrency, formatDayOfMonth } from "@/lib/format";
import { RemoveButton } from "./remove-button";

interface MonthlyBillsCardProps {
  summary: BudgetSummary;
  onAddBill: () => void;
  onRemoveBill: (id: string) => void;
}

function BillMeta({ children }: { children: React.ReactNode }) {
  return <span className="flex items-center gap-1.5">{children}</span>;
}

function DigitalBillRow({ bill, onRemove }: { bill: DigitalBill; onRemove: () => void }) {
  return (
    <li className="rounded-xl border border-gray-700 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h4 className="text-sm font-medium text-white">{bill.name}</h4>
            <span className="rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2.5 py-1 text-xs text-indigo-300">
              {bill.category}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <BillMeta>
              <span className="rounded bg-indigo-500/20 p-1">
                <Calendar className="size-3 text-indigo-400" />
              </span>
              {formatDayOfMonth(bill.chargeDate)} of month
            </BillMeta>
            <BillMeta>
              <span className="rounded bg-purple-500/20 p-1">
                <CreditCardIcon className="size-3 text-purple-400" />
              </span>
              {bill.card}
            </BillMeta>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300">{formatCurrency(bill.amount)}</span>
          <RemoveButton label={`Remove ${bill.name}`} onClick={onRemove} />
        </div>
      </div>
    </li>
  );
}

function PersonalBillRow({ bill, onRemove }: { bill: PersonalBill; onRemove: () => void }) {
  return (
    <li className="rounded-xl border border-gray-700 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="mb-2 text-sm font-medium text-white">{bill.name}</h4>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <BillMeta>
              <span className="rounded bg-orange-500/20 p-1">
                <Calendar className="size-3 text-orange-400" />
              </span>
              {formatDayOfMonth(bill.chargeDate)} of month
            </BillMeta>
            <BillMeta>
              <span className="rounded bg-amber-500/20 p-1">
                <Users className="size-3 text-amber-400" />
              </span>
              Owed to {bill.owedTo}
            </BillMeta>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300">{formatCurrency(bill.amount)}</span>
          <RemoveButton label={`Remove ${bill.name}`} onClick={onRemove} />
        </div>
      </div>
    </li>
  );
}

export function MonthlyBillsCard({ summary, onAddBill, onRemoveBill }: MonthlyBillsCardProps) {
  return (
    <Card className="border-0 bg-slate-900/50 shadow-xl backdrop-blur-xl">
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-lg text-white">
              <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 p-2 shadow-lg shadow-indigo-500/50">
                <Calendar className="size-5 text-white" />
              </div>
              Monthly Bills
            </CardTitle>
            <CardDescription className="text-gray-400">
              A deeper breakdown of your recurring charges — what&apos;s paying out and when.
            </CardDescription>
          </div>
          <Button
            onClick={onAddBill}
            className="h-9 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="mr-2 size-4" />
            Add Bill
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Receipt className="size-4 text-indigo-400" />
              Digital Bills
            </h3>
            <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-sm font-medium text-white">
              {formatCurrency(summary.digitalBillsTotal)}
            </span>
          </div>
          {summary.digitalBills.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No digital bills added yet</p>
          ) : (
            <ul className="space-y-2">
              {summary.digitalBills.map((bill) => (
                <DigitalBillRow key={bill.id} bill={bill} onRemove={() => onRemoveBill(bill.id)} />
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Users className="size-4 text-orange-400" />
              Personal Owed Bills
            </h3>
            <span className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-sm font-medium text-white">
              {formatCurrency(summary.personalBillsTotal)}
            </span>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Money you owe someone else each month — like paying a family member back for a shared
            membership or bill.
          </p>
          {summary.personalBills.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              No personal owed bills added yet
            </p>
          ) : (
            <ul className="space-y-2">
              {summary.personalBills.map((bill) => (
                <PersonalBillRow key={bill.id} bill={bill} onRemove={() => onRemoveBill(bill.id)} />
              ))}
            </ul>
          )}
        </section>

        <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4">
          <span className="text-sm font-medium text-gray-300">Total Monthly Bills</span>
          <span className="text-xl font-bold text-white">
            {formatCurrency(summary.monthlyBillsTotal)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
