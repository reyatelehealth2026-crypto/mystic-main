/**
 * Example usage of DateInputPair component
 * This file demonstrates how to use the DateInputPair component in a compatibility form
 */

"use client";

import { useState } from "react";
import { DateInputPair } from "./DateInputPair";
import { validateCompatibilityDates } from "@/lib/compatibility/validation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function DateInputPairExample() {
  const [person1Date, setPerson1Date] = useState("");
  const [person2Date, setPerson2Date] = useState("");
  const [person1Error, setPerson1Error] = useState("");
  const [person2Error, setPerson2Error] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setPerson1Error("");
    setPerson2Error("");

    // Validate both dates
    const result = validateCompatibilityDates(person1Date, person2Date);

    if (!result.ok) {
      // Set error messages
      if (result.error.person1) {
        setPerson1Error(result.error.person1.message);
      }
      if (result.error.person2) {
        setPerson2Error(result.error.person2.message);
      }
      return;
    }

    // Proceed with compatibility calculation
    console.log("Valid dates:", result.value);
    // Navigate to result page or call compatibility engine
  };

  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold text-fg mb-4">ดูดวงความรัก</h2>
      <p className="text-sm text-fg-muted mb-6">
        ใส่วันเกิดของทั้งสองคนเพื่อดูความเข้ากันของคู่รัก
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <DateInputPair
          person1Date={person1Date}
          person2Date={person2Date}
          onPerson1DateChange={setPerson1Date}
          onPerson2DateChange={setPerson2Date}
          person1Error={person1Error}
          person2Error={person2Error}
        />

        <Button type="submit" className="w-full">
          ดูความเข้ากัน
        </Button>
      </form>
    </Card>
  );
}

// Example with custom labels
export function DateInputPairCustomLabelsExample() {
  const [yourDate, setYourDate] = useState("");
  const [partnerDate, setPartnerDate] = useState("");

  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold text-fg mb-4">ความเข้ากันของคู่รัก</h2>

      <form className="space-y-6">
        <DateInputPair
          person1Date={yourDate}
          person2Date={partnerDate}
          onPerson1DateChange={setYourDate}
          onPerson2DateChange={setPartnerDate}
          person1Label="วันเกิดของคุณ"
          person2Label="วันเกิดคู่ของคุณ"
        />

        <Button type="submit" className="w-full">
          วิเคราะห์ความเข้ากัน
        </Button>
      </form>
    </Card>
  );
}
