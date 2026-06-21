'use client';

import * as React from 'react';
import { ThaiNameInput, useThaiNameInput } from '@/components/name-numerology/ThaiNameInput';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/nav/AppBar';
import { FeatureMenu } from '@/components/nav/FeatureMenu';
import { FAB } from '@/components/ui/FAB';
import { PrivacyNotice } from '@/components/ui/PrivacyNotice';
import { ReadingType } from '@/lib/reading/types';
import { useRouter } from 'next/navigation';

export default function NameNumerologyPage() {
  const router = useRouter();
  const nameInput = useThaiNameInput();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nameInput.validate()) {
      const params = new URLSearchParams({
        firstName: nameInput.firstName,
        lastName: nameInput.lastName
      });
      router.push(`/name-numerology/result?${params.toString()}`);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg">
      <PrivacyNotice
        featureType={ReadingType.NAME_NUMEROLOGY}
        featureName="เลขศาสตร์ชื่อ"
      />

      <header className="px-5 pt-7 pb-3">
        <AppBar title="เลขศาสตร์ชื่อ" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">วิเคราะห์ชื่อด้วยเลขศาสตร์</h1>
        <p className="mt-1 text-sm text-fg-muted">ค้นพบความหมายและพลังของชื่อคุณผ่านเลขศาสตร์ไทย</p>
      </header>

      <div className="px-5 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <ThaiNameInput
              firstName={nameInput.firstName}
              lastName={nameInput.lastName}
              onFirstNameChange={nameInput.setFirstName}
              onLastNameChange={nameInput.setLastName}
              showValidation={nameInput.showValidation}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="flex-1"
              disabled={nameInput.showValidation && !nameInput.isValid}
            >
              ดูผลการวิเคราะห์
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={nameInput.reset}
            >
              ล้างข้อมูล
            </Button>
          </div>
        </form>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-3 text-lg font-semibold text-fg">
            เกี่ยวกับการวิเคราะห์ชื่อ
          </h2>
          <div className="space-y-2 text-sm text-fg-muted">
            <p>
              เลขศาสตร์ชื่อเป็นศาสตร์โบราณที่ใช้วิเคราะห์ความหมายและพลังของชื่อ
              โดยแปลงตัวอักษรเป็นตัวเลขและวิเคราะห์ความหมาย
            </p>
            <p>การวิเคราะห์จะให้ข้อมูลเกี่ยวกับ:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>บุคลิกภาพและลักษณะนิสัย</li>
              <li>จุดแข็งและจุดอ่อน</li>
              <li>เส้นทางชีวิตและโอกาส</li>
              <li>แนวทางการงานที่เหมาะสม</li>
              <li>ความสัมพันธ์กับผู้อื่น</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <FeatureMenu />
        </div>
      </div>

      <FAB label="เพิ่มเพื่อน LINE" />
    </main>
  );
}
