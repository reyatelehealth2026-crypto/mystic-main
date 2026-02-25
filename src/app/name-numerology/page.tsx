'use client';

import * as React from 'react';
import { ThaiNameInput, useThaiNameInput } from '@/components/name-numerology/ThaiNameInput';
import { Button } from '@/components/ui/Button';
import { FeatureMenu } from '@/components/nav/FeatureMenu';
import { FAB } from '@/components/ui/FAB';
import { PrivacyNotice } from '@/components/ui/PrivacyNotice';
import { ReadingType } from '@/lib/reading/types';
import { useRouter } from 'next/navigation';

/**
 * Name Numerology Input Page
 * 
 * Allows users to input their Thai name for numerology analysis.
 * Validates input in real-time and navigates to result page on submission.
 * 
 * Feature: popular-fortune-features
 * Requirements: 6.1, 6.6, 6.7, 9.6
 */
export default function NameNumerologyPage() {
  const router = useRouter();
  const nameInput = useThaiNameInput();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nameInput.validate()) {
      // Navigate to result page with name data
      const params = new URLSearchParams({
        firstName: nameInput.firstName,
        lastName: nameInput.lastName
      });
      router.push(`/name-numerology/result?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4">
      {/* Privacy Notice - shows only on first use */}
      <PrivacyNotice 
        featureType={ReadingType.NAME_NUMEROLOGY}
        featureName="เลขศาสตร์ชื่อ"
      />
      
      <div className="mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-fg">
            วิเคราะห์ชื่อด้วยเลขศาสตร์
          </h1>
          <p className="text-fg-muted">
            ค้นพบความหมายและพลังของชื่อคุณผ่านเลขศาสตร์ไทย
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <ThaiNameInput
              firstName={nameInput.firstName}
              lastName={nameInput.lastName}
              onFirstNameChange={nameInput.setFirstName}
              onLastNameChange={nameInput.setLastName}
              showValidation={nameInput.showValidation}
            />
          </div>

          {/* Submit Button */}
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

        {/* Info Section */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-3 text-lg font-semibold text-fg">
            เกี่ยวกับการวิเคราะห์ชื่อ
          </h2>
          <div className="space-y-2 text-sm text-fg-muted">
            <p>
              เลขศาสตร์ชื่อเป็นศาสตร์โบราณที่ใช้วิเคราะห์ความหมายและพลังของชื่อ
              โดยแปลงตัวอักษรเป็นตัวเลขและวิเคราะห์ความหมาย
            </p>
            <p>
              การวิเคราะห์จะให้ข้อมูลเกี่ยวกับ:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>บุคลิกภาพและลักษณะนิสัย</li>
              <li>จุดแข็งและจุดอ่อน</li>
              <li>เส้นทางชีวิตและโอกาส</li>
              <li>แนวทางการงานที่เหมาะสม</li>
              <li>ความสัมพันธ์กับผู้อื่น</li>
            </ul>
          </div>
        </div>

        {/* Feature Menu */}
        <div className="mt-8">
          <FeatureMenu />
        </div>
      </div>

      {/* FAB */}
      <FAB label="เพิ่มเพื่อน LINE" />
    </div>
  );
}
