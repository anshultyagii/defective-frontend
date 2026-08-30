import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '#/components/common/GlassCard';
import { SectionHeading } from '#/components/common/SectionHeading';
import { FileDropzone } from './FileDropzone';
import { DataFormatSelector } from './DataFormatSelector';
import { DatasetPreview } from './DatasetPreview';
import { AnalysisProgress } from './AnalysisProgress';
import type { DataFormat, AnalysisStep } from '#/types/screening';
import { Rocket } from 'lucide-react';

const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: '1', label: 'Dataset validated', status: 'pending' },
  { id: '2', label: 'Parameters normalized', status: 'pending' },
  { id: '3', label: 'Baseline established', status: 'pending' },
  { id: '4', label: 'Anomaly detection running', status: 'pending' },
  { id: '5', label: 'Failure probability estimation', status: 'pending' },
  { id: '6', label: 'Generating engineering report', status: 'pending' },
];

const MOCK_DATASET_META = {
  totalRecords: 5216,
  totalComponents: 412,
  parameterCount: 17,
  dataQuality: 98.7,
  columns: [
    'timestamp', 'component_id', 'temperature_c', 'voltage_v', 'current_a',
    'resistance_ohm', 'leakage_current_ma', 'stress_duration_h', 'humidity_pct',
    'vibration_g', 'pressure_kpa', 'power_w', 'frequency_hz', 'capacitance_uf',
    'inductance_mh', 'threshold_v', 'gate_charge_nc'
  ],
  warnings: [
    'Missing values detected in 68 records (1.3%)',
    'Timestamp gaps detected around t=4500s'
  ]
};

type WorkflowState = 'selection' | 'preview' | 'analysis';

export const DataUploadPanel: React.FC = () => {
  const navigate = useNavigate();
  const [workflowState, setWorkflowState] = useState<WorkflowState>('selection');
  const [selectedFormat, setSelectedFormat] = useState<DataFormat>('csv');
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadError, setUploadError] = useState<string | undefined>();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadError(undefined);
  };

  const handleUploadData = () => {
    if (!file) return;

    // Validate file
    const validExtensions = ['.csv', '.json', '.xlsx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      setUploadError(`Unsupported file format: ${ext}. Please use CSV, JSON, or XLSX.`);
      return;
    }

    // Simulate upload processing
    setTimeout(() => {
      setWorkflowState('preview');
    }, 800);
  };

  const handleBeginAnalysis = () => {
    setWorkflowState('analysis');
    setCurrentStep(0);
  };

  const handleCancel = () => {
    setFile(null);
    setUploadError(undefined);
    setWorkflowState('selection');
  };

  const handleAnalysisComplete = () => {
    navigate({ to: '/dashboard' });
  };

  // Simulate analysis progression
  useEffect(() => {
    if (workflowState === 'analysis' && currentStep < ANALYSIS_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1200 + Math.random() * 800);

      return () => clearTimeout(timer);
    }
  }, [workflowState, currentStep]);

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 flex flex-col gap-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          title="MISSION INITIALIZATION"
          subtitle="Upload screening telemetry and test data for AI analysis"
          icon={<Rocket size={20} />}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {workflowState === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard className="p-6 md:p-8" hoverable={false}>
              <DataFormatSelector selected={selectedFormat} onSelect={setSelectedFormat} />

              <div className="mt-6">
                <FileDropzone
                  onFileSelect={handleFileSelect}
                  acceptedFormats={['.csv', '.json', '.xlsx']}
                  error={uploadError}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-white/5">
                <button
                  onClick={handleUploadData}
                  disabled={!file}
                  className="px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300"
                >
                  Upload Data
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {workflowState === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <DatasetPreview
              metadata={MOCK_DATASET_META}
              onProceed={handleBeginAnalysis}
              onCancel={handleCancel}
            />
          </motion.div>
        )}

        {workflowState === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <AnalysisProgress
              steps={ANALYSIS_STEPS}
              currentStep={currentStep}
              onComplete={handleAnalysisComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
