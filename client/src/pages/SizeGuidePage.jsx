import React, { useState } from 'react';
import { Sparkles, HelpCircle, Ruler, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SizeGuidePage = () => {
  const [unit, setUnit] = useState('inches');
  const [underbust, setUnderbust] = useState('32');
  const [bust, setBust] = useState('36');
  const [calculatedSize, setCalculatedSize] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const ub = parseFloat(underbust);
    const b = parseFloat(bust);
    if (isNaN(ub) || isNaN(b) || b < ub) return;

    const ubInches = unit === 'cm' ? ub / 2.54 : ub;
    const bInches = unit === 'cm' ? b / 2.54 : b;

    let band = Math.round(ubInches);
    if (band % 2 !== 0) band += 1;

    const diff = Math.round(bInches - ubInches);
    const cups = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F'];
    const cup = cups[Math.max(0, Math.min(diff, cups.length - 1))] || 'B';

    setCalculatedSize(`${band}${cup}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Fit & Engineering Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal">
          The Comprehensive Sizing Guide
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-lg mx-auto leading-relaxed">
          More than 80% of women wear the incorrect bra size. Discover your true silhouette using our interactive calculator and measurement standards.
        </p>
      </div>

      {/* Interactive Size Calculator */}
      <div className="bg-white p-6 sm:p-10 rounded-sm border border-charcoal-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-charcoal-100 pb-4">
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-gold-vip" />
            <h3 className="font-serif text-2xl font-medium text-charcoal-900">
              Interactive Bra Measurement Calculator
            </h3>
          </div>

          <div className="flex items-center bg-ivory-100 border border-charcoal-200 rounded-sm p-0.5 text-xs">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 rounded-sm ${unit === 'inches' ? 'bg-charcoal-900 text-white font-semibold' : 'text-charcoal-600'}`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-sm ${unit === 'cm' ? 'bg-charcoal-900 text-white font-semibold' : 'text-charcoal-600'}`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* 2 Step instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal-600">
          <div className="p-4 bg-ivory-50 rounded-sm border border-charcoal-200/50">
            <strong className="text-charcoal-900 block mb-1">Step 1: Underbust (Band)</strong>
            Measure firmly directly beneath your bust line where your bra band rests. Keep the tape parallel to the floor.
          </div>
          <div className="p-4 bg-ivory-50 rounded-sm border border-charcoal-200/50">
            <strong className="text-charcoal-900 block mb-1">Step 2: Overbust (Cup)</strong>
            Measure loosely around the fullest part of your bust while wearing a comfortable unpadded bra.
          </div>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Underbust Measurement ({unit})
            </label>
            <input
              type="number"
              step="0.5"
              value={underbust}
              onChange={(e) => setUnderbust(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-charcoal-200 rounded-sm text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Overbust Measurement ({unit})
            </label>
            <input
              type="number"
              step="0.5"
              value={bust}
              onChange={(e) => setBust(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-charcoal-200 rounded-sm text-sm"
              required
            />
          </div>

          <div>
            <Button type="submit" size="lg" className="w-full">
              Calculate True Size
            </Button>
          </div>
        </form>

        {calculatedSize && (
          <div className="p-4 bg-gold-light/40 border border-gold-vip/50 rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-charcoal-700 block">Your Recommended VELOURA Size:</span>
              <strong className="font-serif text-3xl font-bold text-charcoal-900">{calculatedSize}</strong>
            </div>
            <a
              href={`/shop?size=${calculatedSize}`}
              className="text-xs font-semibold text-gold-dark hover:underline uppercase tracking-wider"
            >
              Shop {calculatedSize} Pieces →
            </a>
          </div>
        )}
      </div>

      {/* Bra Sister Sizes Table */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/80 shadow-soft space-y-4">
        <h3 className="font-serif text-2xl font-medium text-charcoal-900">
          Bra Sizing Chart (30A to 42DD)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Band Size</th>
                <th className="py-2.5 px-3">Underbust (Inches)</th>
                <th className="py-2.5 px-3">Underbust (CM)</th>
                <th className="py-2.5 px-3">Sister Size Option</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              <tr><td className="py-2.5 px-3 font-semibold">32 Band</td><td className="py-2.5 px-3">28" - 30"</td><td className="py-2.5 px-3">71 - 76 cm</td><td className="py-2.5 px-3">34A / 30C</td></tr>
              <tr><td className="py-2.5 px-3 font-semibold">34 Band</td><td className="py-2.5 px-3">30" - 32"</td><td className="py-2.5 px-3">76 - 81 cm</td><td className="py-2.5 px-3">32C / 36A</td></tr>
              <tr><td className="py-2.5 px-3 font-semibold">36 Band</td><td className="py-2.5 px-3">32" - 34"</td><td className="py-2.5 px-3">81 - 86 cm</td><td className="py-2.5 px-3">34C / 38A</td></tr>
              <tr><td className="py-2.5 px-3 font-semibold">38 Band</td><td className="py-2.5 px-3">34" - 36"</td><td className="py-2.5 px-3">86 - 91 cm</td><td className="py-2.5 px-3">36C / 40A</td></tr>
              <tr><td className="py-2.5 px-3 font-semibold">40 Band</td><td className="py-2.5 px-3">36" - 38"</td><td className="py-2.5 px-3">91 - 96 cm</td><td className="py-2.5 px-3">38C / 42A</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
