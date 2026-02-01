'use client';

import React, { useState, useMemo } from 'react';
import { useExamStore } from './useExamStore';
import { LabValue, LabCategory } from './types';

// Comprehensive lab values database
const LAB_VALUES: LabValue[] = [
  // Hematology
  { id: 'hgb-1', name: 'Hemoglobin (Male)', value: '13.5-17.5', unit: 'g/dL', category: 'hematology' },
  { id: 'hgb-2', name: 'Hemoglobin (Female)', value: '12.0-15.5', unit: 'g/dL', category: 'hematology' },
  { id: 'hct-1', name: 'Hematocrit (Male)', value: '41-50', unit: '%', category: 'hematology' },
  { id: 'hct-2', name: 'Hematocrit (Female)', value: '36-46', unit: '%', category: 'hematology' },
  { id: 'rbc', name: 'Red Blood Cell Count', value: '4.5-5.5', unit: 'million/μL', category: 'hematology' },
  { id: 'wbc', name: 'White Blood Cell Count', value: '4,500-11,000', unit: '/μL', category: 'hematology' },
  { id: 'plt', name: 'Platelet Count', value: '150,000-400,000', unit: '/μL', category: 'hematology' },
  { id: 'mcv', name: 'Mean Corpuscular Volume', value: '80-100', unit: 'fL', category: 'hematology' },
  { id: 'mpv', name: 'Mean Platelet Volume', value: '7.2-11.7', unit: 'fL', category: 'hematology' },
  { id: 'retic', name: 'Reticulocyte Count', value: '0.5-1.5', unit: '%', category: 'hematology' },
  
  // Chemistry
  { id: 'na', name: 'Sodium (Na+)', value: '135-145', unit: 'mmol/L', category: 'chemistry' },
  { id: 'k', name: 'Potassium (K+)', value: '3.5-5.0', unit: 'mmol/L', category: 'chemistry' },
  { id: 'cl', name: 'Chloride (Cl-)', value: '98-106', unit: 'mmol/L', category: 'chemistry' },
  { id: 'co2', name: 'Carbon Dioxide (CO2)', value: '23-29', unit: 'mmol/L', category: 'chemistry' },
  { id: 'bun', name: 'Blood Urea Nitrogen', value: '7-20', unit: 'mg/dL', category: 'chemistry' },
  { id: 'cr', name: 'Creatinine (Male)', value: '0.7-1.3', unit: 'mg/dL', category: 'chemistry' },
  { id: 'cr-f', name: 'Creatinine (Female)', value: '0.6-1.1', unit: 'mg/dL', category: 'chemistry' },
  { id: 'glu', name: 'Fasting Glucose', value: '70-100', unit: 'mg/dL', category: 'chemistry' },
  { id: 'hba1c', name: 'Hemoglobin A1C', value: '<5.7', unit: '%', category: 'chemistry' },
  { id: 'ca', name: 'Calcium (Total)', value: '8.5-10.5', unit: 'mg/dL', category: 'chemistry' },
  { id: 'ca-ion', name: 'Calcium (Ionized)', value: '4.5-5.1', unit: 'mg/dL', category: 'chemistry' },
  { id: 'mg', name: 'Magnesium', value: '1.7-2.2', unit: 'mg/dL', category: 'chemistry' },
  { id: 'phos', name: 'Phosphorus', value: '2.5-4.5', unit: 'mg/dL', category: 'chemistry' },
  { id: 'alb', name: 'Albumin', value: '3.5-5.0', unit: 'g/dL', category: 'chemistry' },
  { id: 'tp', name: 'Total Protein', value: '6.0-8.3', unit: 'g/dL', category: 'chemistry' },
  { id: 'tbili', name: 'Total Bilirubin', value: '0.1-1.2', unit: 'mg/dL', category: 'chemistry' },
  { id: 'ast', name: 'AST (SGOT)', value: '10-40', unit: 'U/L', category: 'chemistry' },
  { id: 'alt', name: 'ALT (SGPT)', value: '7-56', unit: 'U/L', category: 'chemistry' },
  { id: 'alp', name: 'Alkaline Phosphatase', value: '44-147', unit: 'U/L', category: 'chemistry' },
  { id: 'ggt', name: 'GGT', value: '0-30', unit: 'U/L', category: 'chemistry' },
  { id: 'ldh', name: 'LDH', value: '140-280', unit: 'U/L', category: 'chemistry' },
  { id: 'amy', name: 'Amylase', value: '30-110', unit: 'U/L', category: 'chemistry' },
  { id: 'lip', name: 'Lipase', value: '10-140', unit: 'U/L', category: 'chemistry' },
  { id: 'ua', name: 'Uric Acid (Male)', value: '3.4-7.0', unit: 'mg/dL', category: 'chemistry' },
  { id: 'ua-f', name: 'Uric Acid (Female)', value: '2.4-6.0', unit: 'mg/dL', category: 'chemistry' },
  
  // Urinalysis
  { id: 'urine-ph', name: 'Urine pH', value: '4.5-8.0', unit: '', category: 'urinalysis' },
  { id: 'urine-sg', name: 'Urine Specific Gravity', value: '1.005-1.030', unit: '', category: 'urinalysis' },
  { id: 'urine-glu', name: 'Urine Glucose', value: 'Negative', unit: '', category: 'urinalysis' },
  { id: 'urine-prot', name: 'Urine Protein', value: 'Negative', unit: '', category: 'urinalysis' },
  { id: 'urine-ket', name: 'Urine Ketones', value: 'Negative', unit: '', category: 'urinalysis' },
  { id: 'urine-blood', name: 'Urine Blood', value: 'Negative', unit: '', category: 'urinalysis' },
  { id: 'urine-leuk', name: 'Urine Leukocyte Esterase', value: 'Negative', unit: '', category: 'urinalysis' },
  { id: 'urine-nit', name: 'Urine Nitrite', value: 'Negative', unit: '', category: 'urinalysis' },
  
  // Coagulation
  { id: 'pt', name: 'Prothrombin Time', value: '11-13.5', unit: 'seconds', category: 'coagulation' },
  { id: 'ptt', name: 'Partial Thromboplastin Time', value: '25-35', unit: 'seconds', category: 'coagulation' },
  { id: 'inr', name: 'INR', value: '0.8-1.2', unit: '', category: 'coagulation' },
  { id: 'fibrin', name: 'Fibrinogen', value: '200-400', unit: 'mg/dL', category: 'coagulation' },
  { id: 'd-dimer', name: 'D-Dimer', value: '<0.5', unit: 'μg/mL', category: 'coagulation' },
  
  // Cardiac
  { id: 'tropo', name: 'Troponin I', value: '<0.04', unit: 'ng/mL', category: 'cardiac' },
  { id: 'tropt', name: 'Troponin T', value: '<0.01', unit: 'ng/mL', category: 'cardiac' },
  { id: 'ckmb', name: 'CK-MB', value: '0-5', unit: 'ng/mL', category: 'cardiac' },
  { id: 'bnp', name: 'BNP', value: '<100', unit: 'pg/mL', category: 'cardiac' },
  { id: 'ntpro', name: 'NT-proBNP', value: '<300', unit: 'pg/mL', category: 'cardiac' },
  
  // Endocrine
  { id: 'tsh', name: 'TSH', value: '0.4-4.0', unit: 'mIU/L', category: 'endocrine' },
  { id: 't4', name: 'Free T4', value: '0.8-1.8', unit: 'ng/dL', category: 'endocrine' },
  { id: 't3', name: 'Free T3', value: '2.3-4.2', unit: 'pg/mL', category: 'endocrine' },
  { id: 'cort-am', name: 'Cortisol (AM)', value: '5-25', unit: 'μg/dL', category: 'endocrine' },
  { id: 'cort-pm', name: 'Cortisol (PM)', value: '3-13', unit: 'μg/dL', category: 'endocrine' },
  { id: 'acth', name: 'ACTH', value: '10-60', unit: 'pg/mL', category: 'endocrine' },
  { id: 'insulin', name: 'Insulin (Fasting)', value: '2-20', unit: 'μIU/mL', category: 'endocrine' },
  { id: 'cortisol-st', name: 'Cortisol (Salivary at night)', value: '<1.8', unit: 'ng/mL', category: 'endocrine' },
];

const CATEGORY_INFO: Record<LabCategory, { name: string; icon: string; color: string }> = {
  hematology: { name: 'Hematology', icon: '🩸', color: 'bg-red-50 border-red-200 text-red-700' },
  chemistry: { name: 'Chemistry', icon: '🧪', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  urinalysis: { name: 'Urinalysis', icon: '🧪', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  coagulation: { name: 'Coagulation', icon: '⏱️', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  cardiac: { name: 'Cardiac', icon: '❤️', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  endocrine: { name: 'Endocrine', icon: '⚖️', color: 'bg-green-50 border-green-200 text-green-700' },
  other: { name: 'Other', icon: '📋', color: 'bg-slate-50 border-slate-200 text-slate-700' },
};

export default function LabValuesModal() {
  const { showLabValues, toggleLabValues } = useExamStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LabCategory | 'all'>('all');

  // Filter lab values
  const filteredLabValues = useMemo(() => {
    return LAB_VALUES.filter((lv) => {
      const matchesSearch = lv.name.toLowerCase().includes(search.toLowerCase()) ||
                           lv.value.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || lv.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Group by category
  const groupedLabValues = useMemo(() => {
    const groups: Record<string, LabValue[]> = {};
    filteredLabValues.forEach((lv) => {
      if (!groups[lv.category]) groups[lv.category] = [];
      groups[lv.category].push(lv);
    });
    return groups;
  }, [filteredLabValues]);

  if (!showLabValues) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={toggleLabValues}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Reference Lab Values</h2>
              <p className="text-sm text-slate-500">Common clinical reference ranges</p>
            </div>
          </div>
          <button
            onClick={toggleLabValues}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search lab values..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as LabCategory | 'all')}
              className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <option key={key} value={key}>{info.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lab Values List */}
        <div className="flex-1 overflow-y-auto p-6">
          {search && Object.keys(groupedLabValues).length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-500">No lab values found for "{search}"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedLabValues).map(([category, values]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{CATEGORY_INFO[category as LabCategory]?.icon}</span>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      {CATEGORY_INFO[category as LabCategory]?.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {values.map((lv) => (
                      <div 
                        key={lv.id}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-sm text-slate-700">{lv.name}</span>
                        <span className="text-sm font-mono font-medium text-slate-900">
                          {lv.value} <span className="text-slate-400">{lv.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <p className="text-xs text-slate-500 text-center">
            Reference ranges may vary by laboratory. Always consult your institution's specific values.
          </p>
        </div>
      </div>
    </div>
  );
}
