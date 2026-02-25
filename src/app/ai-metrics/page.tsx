'use client';

/**
 * AI Metrics Dashboard
 * 
 * หน้าแสดงสถิติคุณภาพคำตอบจาก AI
 * ใช้ตรวจสอบว่า enhanced prompts ทำงานได้ดีหรือไม่
 */

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface MetricsData {
  success: boolean;
  timestamp: string;
  metrics: {
    totalValidations: number;
    passedValidations: number;
    failedValidations: number;
    fallbackUsages: number;
    passRate: string;
    fallbackRate: string;
  };
  quality: {
    status: 'excellent' | 'good' | 'poor' | 'no_data';
    message: string;
    warnings: string[];
  };
  byType: Record<string, number>;
  errorTypes: Record<string, number>;
  enhancedPrompts: {
    active: Record<string, boolean>;
    allActive: boolean;
    message: string;
  };
  recentErrors: Array<{
    timestamp: string;
    type: string;
    divinationType: string;
    message: string;
  }>;
  expectedCharacteristics: Record<string, string[]>;
}

export default function AIMetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/ai/metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data);
      } else {
        setError(data.message || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">AI Metrics Dashboard</h1>
          <Card className="p-8 text-center">
            <p className="text-gray-400">กำลังโหลดข้อมูล...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">AI Metrics Dashboard</h1>
          <Card className="p-8 text-center">
            <p className="text-red-400 mb-4">เกิดข้อผิดพลาด: {error}</p>
            <Button onClick={fetchMetrics}>ลองอีกครั้ง</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getQualityIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '✅';
      case 'good': return '⚠️';
      case 'poor': return '❌';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">AI Metrics Dashboard</h1>
          <Button onClick={fetchMetrics}>รีเฟรช</Button>
        </div>

        {/* Enhanced Prompts Status */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {metrics.enhancedPrompts.allActive ? '✅' : '⚠️'} Enhanced Prompts Status
          </h2>
          <p className="text-gray-300 mb-4">{metrics.enhancedPrompts.message}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics.enhancedPrompts.active).map(([type, active]) => (
              <div key={type} className="bg-gray-800 p-3 rounded">
                <p className="text-sm text-gray-400">{type}</p>
                <p className="text-lg font-bold text-white">
                  {active ? '✅ Active' : '❌ Inactive'}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quality Assessment */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {getQualityIcon(metrics.quality.status)} คุณภาพโดยรวม
          </h2>
          <p className={`text-xl font-bold mb-2 ${getQualityColor(metrics.quality.status)}`}>
            {metrics.quality.message}
          </p>
          {metrics.quality.warnings.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-900/30 rounded">
              <p className="text-yellow-400 font-bold mb-2">⚠️ คำเตือน:</p>
              <ul className="list-disc list-inside text-yellow-300">
                {metrics.quality.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Overall Statistics */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">📊 สถิติโดยรวม</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-400">Total Validations</p>
              <p className="text-2xl font-bold text-white">{metrics.metrics.totalValidations}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-400">Pass Rate</p>
              <p className="text-2xl font-bold text-green-400">{metrics.metrics.passRate}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-400">Fallback Rate</p>
              <p className="text-2xl font-bold text-yellow-400">{metrics.metrics.fallbackRate}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-400">Passed</p>
              <p className="text-2xl font-bold text-green-400">{metrics.metrics.passedValidations}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-red-400">{metrics.metrics.failedValidations}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-400">Fallback Used</p>
              <p className="text-2xl font-bold text-yellow-400">{metrics.metrics.fallbackUsages}</p>
            </div>
          </div>
        </Card>

        {/* By Divination Type */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">📈 Errors by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics.byType).map(([type, count]) => (
              <div key={type} className="bg-gray-800 p-4 rounded">
                <p className="text-sm text-gray-400">{type}</p>
                <p className="text-2xl font-bold text-white">{count}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Error Types */}
        {Object.keys(metrics.errorTypes).length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">🔍 Error Types</h2>
            <div className="space-y-2">
              {Object.entries(metrics.errorTypes).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                  <span className="text-gray-300">{type}</span>
                  <span className="text-white font-bold">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Expected Characteristics */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">📋 ลักษณะคำตอบที่คาดหวัง</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(metrics.expectedCharacteristics).map(([type, characteristics]) => (
              <div key={type} className="bg-gray-800 p-4 rounded">
                <h3 className="text-lg font-bold text-white mb-3 capitalize">{type}</h3>
                <ul className="space-y-2">
                  {characteristics.map((char, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Errors */}
        {metrics.recentErrors.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">🚨 Recent Errors</h2>
            <div className="space-y-4">
              {metrics.recentErrors.map((error, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-red-400">[{error.divinationType}] {error.type}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(error.timestamp).toLocaleString('th-TH')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{error.message}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Last updated: {new Date(metrics.timestamp).toLocaleString('th-TH')}</p>
        </div>
      </div>
    </div>
  );
}
