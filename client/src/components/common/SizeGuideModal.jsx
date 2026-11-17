import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, Check, HelpCircle } from 'lucide-react';

export const SizeGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('bras'); // 'bras' | 'panties' | 'sleepwear'
  const [unit, setUnit] = useState('inches'); // 'inches' | 'cm'

  // Calculator inputs
  const [underbust, setUnderbust] = useState('30');
  const [bust, setBust] = useState('34');
  const [calculatedSize, setCalculatedSize] = useState(null);

  const calculateBraSize = (e) => {
    e.preventDefault();
    const ub = parseFloat(underbust);
    const b = parseFloat(bust);

    if (isNaN(ub) || isNaN(b) || b < ub) {
      setCalculatedSize('Please enter valid measurements.');
      return;
    }

    // Convert cm to inches if needed
    const ubInches = unit === 'cm' ? ub / 2.54 : ub;
    const bInches = unit === 'cm' ? b / 2.54 : b;

    // Calculate band
    let band = Math.round(ubInches);
    if (band % 2 !== 0) band += 1;

    // Cup calculation based on difference
    const diff = Math.round(bInches - ubInches);
    const cupLetters = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F'];
    const cup = cupLetters[Math.max(0, Math.min(diff, cupLetters.length - 1))] || 'B';

    setCalculatedSize(`${band}${cup}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Atelier Fit & Sizing Guide" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-charcoal-200">
          <button
            onClick={() => setActiveTab('bras')}
            className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'bras'
                ? 'border-charcoal-900 text-charcoal-900'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
            }`}
          >
            Bra Sizing & Calculator
          </button>
          <button
            onClick={() => setActiveTab('panties')}
            className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'panties'
                ? 'border-charcoal-900 text-charcoal-900'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
            }`}
          >
            Panties & Shapewear
          </button>
          <button
            onClick={() => setActiveTab('sleepwear')}
            className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'sleepwear'
                ? 'border-charcoal-900 text-charcoal-900'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
            }`}
          >
            Silk Loungewear
          </button>
        </div>

        {/* Tab 1: Bras & Interactive Calculator */}
        {activeTab === 'bras' && (
          <div className="space-y-6">
            {/* Interactive Calculator */}
            <div className="p-4 rounded-sm bg-ivory-100 border border-charcoal-200/70">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-gold-vip" />
                  <h4 className="font-serif text-base font-semibold text-charcoal-900">
                    Smart Bra Size Finder
                  </h4>
                </div>
                {/* Unit Switcher */}
                <div className="flex items-center bg-white rounded-sm border border-charcoal-200 p-0.5 text-xs">
                  <button
                    onClick={() => setUnit('inches')}
                    className={`px-2.5 py-1 rounded-sm ${unit === 'inches' ? 'bg-charcoal-900 text-white' : 'text-charcoal-600'}`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    className={`px-2.5 py-1 rounded-sm ${unit === 'cm' ? 'bg-charcoal-900 text-white' : 'text-charcoal-600'}`}
                  >
                    CM
                  </button>
                </div>
              </div>

              <form onSubmit={calculateBraSize} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-medium text-charcoal-600 uppercase tracking-wider mb-1">
                    1. Underbust ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={underbust}
                    onChange={(e) => setUnderbust(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-charcoal-200 rounded-sm text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-charcoal-600 uppercase tracking-wider mb-1">
                    2. Overbust ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={bust}
                    onChange={(e) => setBust(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-charcoal-200 rounded-sm text-sm"
                    required
                  />
                </div>
                <div>
                  <Button type="submit" size="default" className="w-full">
                    Calculate Fit
                  </Button>
                </div>
              </form>

              {calculatedSize && (
                <div className="mt-3 p-3 bg-white border border-gold-vip/40 rounded-sm flex items-center justify-between">
                  <span className="text-xs text-charcoal-700">Your Recommended VELOURA Size:</span>
                  <span className="font-serif text-xl font-bold text-charcoal-900 tracking-wider">
                    {calculatedSize}
                  </span>
                </div>
              )}
            </div>

            {/* Standard Chart */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Band Size</th>
                    <th className="py-2.5 px-3">Underbust (Inches)</th>
                    <th className="py-2.5 px-3">Underbust (CM)</th>
                    <th className="py-2.5 px-3">Standard Sister Sizes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
                  <tr><td className="py-2 px-3 font-medium">32</td><td className="py-2 px-3">28" - 30"</td><td className="py-2 px-3">71 - 76 cm</td><td className="py-2 px-3">30C / 34A</td></tr>
                  <tr><td className="py-2 px-3 font-medium">34</td><td className="py-2 px-3">30" - 32"</td><td className="py-2 px-3">76 - 81 cm</td><td className="py-2 px-3">32C / 36A</td></tr>
                  <tr><td className="py-2 px-3 font-medium">36</td><td className="py-2 px-3">32" - 34"</td><td className="py-2 px-3">81 - 86 cm</td><td className="py-2 px-3">34C / 38A</td></tr>
                  <tr><td className="py-2 px-3 font-medium">38</td><td className="py-2 px-3">34" - 36"</td><td className="py-2 px-3">86 - 91 cm</td><td className="py-2 px-3">36C / 40A</td></tr>
                  <tr><td className="py-2 px-3 font-medium">40</td><td className="py-2 px-3">36" - 38"</td><td className="py-2 px-3">91 - 96 cm</td><td className="py-2 px-3">38C / 42A</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Panties & Shapewear */}
        {activeTab === 'panties' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Waist (Inches)</th>
                  <th className="py-2.5 px-3">Hips (Inches)</th>
                  <th className="py-2.5 px-3">Pakistani Dress Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
                <tr><td className="py-2 px-3 font-medium">S</td><td className="py-2 px-3">24" - 26"</td><td className="py-2 px-3">34" - 36"</td><td className="py-2 px-3">6 - 8 (Small Kurti)</td></tr>
                <tr><td className="py-2 px-3 font-medium">M</td><td className="py-2 px-3">27" - 29"</td><td className="py-2 px-3">37" - 39"</td><td className="py-2 px-3">10 - 12 (Medium)</td></tr>
                <tr><td className="py-2 px-3 font-medium">L</td><td className="py-2 px-3">30" - 32"</td><td className="py-2 px-3">40" - 42"</td><td className="py-2 px-3">14 (Large)</td></tr>
                <tr><td className="py-2 px-3 font-medium">XL</td><td className="py-2 px-3">33" - 35"</td><td className="py-2 px-3">43" - 45"</td><td className="py-2 px-3">16 (XL)</td></tr>
                <tr><td className="py-2 px-3 font-medium">XXL</td><td className="py-2 px-3">36" - 39"</td><td className="py-2 px-3">46" - 49"</td><td className="py-2 px-3">18 - 20 (XXL)</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Sleepwear */}
        {activeTab === 'sleepwear' && (
          <div className="space-y-4 text-xs text-charcoal-700">
            <p className="leading-relaxed">
              VELOURA Privé silk nightdresses, chemises, and robes are tailored with a classic bias-cut drape designed to float elegantly over the contours without restriction.
            </p>
            <table className="w-full text-xs text-left">
              <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Bust (Inches)</th>
                  <th className="py-2.5 px-3">Waist (Inches)</th>
                  <th className="py-2.5 px-3">Hips (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
                <tr><td className="py-2 px-3 font-medium">S</td><td className="py-2 px-3">32" - 34"</td><td className="py-2 px-3">25" - 27"</td><td className="py-2 px-3">35" - 37"</td></tr>
                <tr><td className="py-2 px-3 font-medium">M</td><td className="py-2 px-3">35" - 37"</td><td className="py-2 px-3">28" - 30"</td><td className="py-2 px-3">38" - 40"</td></tr>
                <tr><td className="py-2 px-3 font-medium">L</td><td className="py-2 px-3">38" - 40"</td><td className="py-2 px-3">31" - 33"</td><td className="py-2 px-3">41" - 43"</td></tr>
                <tr><td className="py-2 px-3 font-medium">XL</td><td className="py-2 px-3">41" - 43"</td><td className="py-2 px-3">34" - 36"</td><td className="py-2 px-3">44" - 46"</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Fit Guarantee Note */}
        <div className="p-3 bg-white border border-charcoal-200/60 rounded-sm text-xs text-charcoal-600 flex items-start space-x-2">
          <HelpCircle className="h-4 w-4 text-gold-vip flex-shrink-0 mt-0.5" />
          <span>
            <strong>Unsure between sizes?</strong> WhatsApp our discreet female fit specialists directly at +92 300 1234567 for confidential assistance.
          </span>
        </div>
      </div>
    </Modal>
  );
};
