"use client";

import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {ArrowRight, Wallet, ShoppingBag, Home, Car} from "lucide-react";

export function InteractiveDemo() {
    const [paycheck, setPaycheck] = useState("3500");
    const [rent, setRent] = useState("1200");
    const [utilities, setUtilities] = useState("200");
    const [car, setCar] = useState("300");
    const [errors, setErrors] = useState({
        rent: false,
        utilities: false,
        car: false,
        paycheck: false,
    });
    const [paycheckShake, setPaycheckShake] = useState(false);

    const totalExpenses = (Number(rent) || 0) + (Number(utilities) || 0) + (Number(car) || 0);
    const availableSpending = Number(paycheck) - Number(totalExpenses);

    const maxValue = 9999999;
    const maxDigits = String(maxValue).length;

    const totalLimit = (value: string, options?: { clamp?: boolean }) => {
        const {clamp = true} = options ?? {};

        if (value.trim() === "") {
            return "";
        }

        const numeric = Number(value);

        if (!Number.isFinite(numeric)) {
            return "";
        }

        const normalized = Math.max(numeric, 0);

        if (!clamp) {
            return String(normalized);
        }

        const limited = Math.min(normalized, maxValue);
        return String(limited);
    }

    const triggerPaycheckShake = () => {
        setPaycheckShake(false);
        window.requestAnimationFrame(() => {
            setPaycheckShake(true);
            window.setTimeout(() => {
                setPaycheckShake(false);
            }, 450);
        });
    };

    return (
        <section className="bg-linear-to-b from-gray-50 to-white py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="mb-4 text-4xl text-gray-900 sm:text-5xl">
                        See It In Action
                    </h2>
                    <p className="text-xl text-gray-600">
                        Try our interactive calculator to see how budgeting becomes effortless
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
                    <Card className="border-2 border-green-200 bg-green-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-green-500">
                                    <Wallet className="size-5 text-white"/>
                                </div>
                                <CardTitle className="text-green-900">Your Paycheck</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="paycheck" className="text-green-900">
                                Monthly Income
                            </Label>
                            <Input
                                id="paycheck"
                                type="number"
                                value={paycheck}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    const numericValueConversion = Number(value);
                                    const digitCount = value.replace(/\D/g, "").length;

                                    if (value === "") {
                                        setPaycheck("");
                                        setErrors((prev) => ({...prev, paycheck: false}));
                                        return;
                                    }
                                    // reddit karma

                                    const exceedsDigits = digitCount > maxDigits;
                                    const exceedsValue = Number.isFinite(numericValueConversion) && numericValueConversion > maxValue;
                                    const isTooBig = exceedsDigits || exceedsValue;

                                    if (isTooBig) {
                                        setErrors((prev) => ({...prev, paycheck: true}));
                                        triggerPaycheckShake();
                                        return;
                                    }

                                    setPaycheck(totalLimit(value, {clamp: false}));

                                    setErrors((prev) => ({...prev, paycheck: false}));
                                }}
                                aria-invalid={errors.paycheck}
                                className={`mt-1 bg-white ${
                                    errors.paycheck
                                        ? `border-destructive${paycheckShake ? " animate-input-shake" : ""}`
                                        : "border-green-300"
                                }`}
                                // className="mt-2 h-14 border-green-300 bg-white text-2xl"
                            />
                            <p className="mt-3 text-sm text-green-700">
                                This is what you earn each month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-200 bg-orange-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-orange-500">
                                    <ShoppingBag className="size-5 text-white"/>
                                </div>
                                <CardTitle className="text-orange-900">Your Expenses</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                {/* TODO: tyler, going to happen right here */}
                                <Label htmlFor="rent" className="flex items-center gap-2 text-orange-900">
                                    <Home className="size-4"/>
                                    Rent/Mortgage
                                </Label>
                                <Input
                                    id="rent"
                                    type="number"
                                    value={rent}
                                    onChange={(event) => setRent(totalLimit(event.target.value))}
                                    className="mt-1 border-orange-300 bg-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="utilities" className="text-orange-900">
                                    Utilities
                                </Label>
                                <Input
                                    id="utilities"
                                    type="number"
                                    value={utilities}
                                    onChange={(event) => setUtilities(totalLimit(event.target.value))}
                                    className="mt-1 border-orange-300 bg-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="car" className="flex items-center gap-2 text-orange-900">
                                    <Car className="size-4"/>
                                    Car Payment
                                </Label>
                                <Input
                                    id="car"
                                    type="number"
                                    value={car}
                                    onChange={(event) => setCar(totalLimit(event.target.value))}
                                    className="mt-1 border-orange-300 bg-white"
                                />
                            </div>
                            <div className="border-t border-orange-300 pt-2">
                                <p className="text-sm text-orange-700">Total Expenses</p>
                                <p className="text-2xl text-orange-900">
                                    ${totalExpenses.toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-blue-200 bg-blue-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-blue-500">
                                    <ArrowRight className="size-5 text-white"/>
                                </div>
                                <CardTitle className="text-blue-900">Available to Spend</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <p className="mb-2 text-sm text-blue-700">Your Extra Money</p>
                                <p className="mb-2 text-5xl text-blue-900">
                                    ${availableSpending.toLocaleString()}
                                </p>
                                <Badge
                                    variant={availableSpending > 0 ? "default" : "destructive"}
                                    className="text-sm"
                                >
                                    {availableSpending > 0 ? "On Track" : "Over Budget"}
                                </Badge>
                            </div>
                            <div className="border-t border-blue-300 pt-4">
                                <p className="mb-3 text-sm text-blue-700">This can be allocated to:</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-blue-900">Savings</span>
                                        <Badge variant="outline" className="bg-white">
                                            💰
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-blue-900">Entertainment</span>
                                        <Badge variant="outline" className="bg-white">
                                            🎬
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-blue-900">Dining Out</span>
                                        <Badge variant="outline" className="bg-white">
                                            🍽️
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
