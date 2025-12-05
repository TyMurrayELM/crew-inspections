'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from '../components/Header';
import { ClipboardCheck, FileText, ChevronDown, Truck, Shield, Wrench, UserCheck } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function GateCheckForm() {
  // Crew data organized by branch (same as crew inspection form)
  const crewsByBranch = {
    'Las Vegas': [
      'LV_ARBOR_Team 1',
      'LV_ENHAN_Team 1',
      'LV_ENHAN_Team 2',
      'LV_IRR_Tech 1',
      'LV_IRR_Tech 2',
      'LV_IRR_Tech 3',
      'LV_MAINT_Onsite Cheyenne Corp',
      'LV_MAINT_Onsite Rainbow Creek HOA',
      'LV_MAINT_Onsite Spectrum',
      'LV_MAINT_Onsite_GoldenTriangle',
      'LV_MAINT_Onsite_Speedway',
      'LV_MAINT_Team 1',
      'LV_MAINT_Team 2',
      'LV_MAINT_Team 3',
      'LV_MAINT_Team 4',
      'LV_MAINT_Team 5',
      'LV_SPRAY'
    ],
    'Phoenix - North': [
      'PHX_N_IRR_Tech 1',
      'PHX_N_IRR_Tech 2',
      'PHX_N_MAINT_Onsite Venu at Grayhawk',
      'PHX_N_MAINT_Team 1',
      'PHX_N_MAINT_Team 2',
      'PHX_N_MAINT_Team 3',
      'PHX_N_MAINT_Team 4',
      'PHX_N_MAINT_Team 5',
      'PHX_N_MAINT_Team 6'
    ],
    'Phoenix - Southeast': [
      'PHX_SE_IRR_Tech 1',
      'PHX_SE_IRR_Tech 2',
      'PHX_SE_IRR_Tech 3',
      'PHX_SE_MAINT_Onsite Portales',
      'PHX_SE_MAINT_Onsite Spectrum Falls',
      'PHX_SE_MAINT_Onsite Waypoint',
      'PHX_SE_MAINT_Team 1',
      'PHX_SE_MAINT_Team 2',
      'PHX_SE_MAINT_Team 3',
      'PHX_SE_MAINT_Team 4',
      'PHX_SE_MAINT_Team 5',
      'PHX_SE_MAINT_Team 6',
      'PHX_SE_MAINT_Team 7'
    ],
    'Phoenix - Southwest': [
      'PHX_SW_ARBOR_Team 1',
      'PHX_SW_IRR_Tech 1',
      'PHX_SW_IRR_Tech 2',
      'PHX_SW_IRR_Tech 3',
      'PHX_SW_IRR_Tech 4',
      'PHX_SW_IRR_Tech 5',
      'PHX_SW_MAINT_Onsite Trilogy Encanterra',
      'PHX_SW_MAINT_Team 1',
      'PHX_SW_MAINT_Team 2',
      'PHX_SW_MAINT_Team 3',
      'PHX_SW_MAINT_Team 4',
      'PHX_SW_MAINT_Team 5',
      'PHX_SW_MAINT_Team 6',
      'PHX_SW_MAINT_Team 7',
      'PHX_SW_MAINT_Team 8'
    ],
    'Corporate': [
      'PHX_ARBOR_Team 1',
      'PHX_ARBOR_Team 2',
      'PHX_ARBOR_Team 3',
      'PHX_ARBOR_Team 4',
      'PHX_ARBOR_Team 5',
      'PHX_ARBOR_Team 6',
      'PHX_ENHAN_Team 1',
      'PHX_ENHAN_Team 2',
      'PHX_ENHAN_Team 3',
      'PHX_ENHAN_Team 4'
    ]
  };

  const [formData, setFormData] = useState({
    date: '',
    location: '',
    division: '',
    crewNumber: '',
    driverName: '',
    allEmployeesHavePPE: '',
    
    // Vehicle Condition
    lightsWorking: '',
    mirrorsIntact: '',
    licensePlateVisible: '',
    registrationInsuranceCard: '',
    
    // Trailer and Equipment
    loadSecured: '',
    trimmerRacksLocked: '',
    safetyPinsInPlace: '',
    tiresInflated: '',
    spareTireAvailable: '',
    chemicalLabeledSecured: '',
    
    // Safety Equipment
    fiveSafetyCones: '',
    firstAidKitFireExtinguisher: '',
    
    inspectedBy: '',
    additionalItems: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updates = { [field]: value };
      // Clear crew selection when location changes
      if (field === 'location') {
        updates.crewNumber = '';
      }
      return { ...prev, ...updates };
    });
  };

  // Get available crews based on selected location
  const getAvailableCrews = () => {
    const allCrews = [
      ...crewsByBranch['Las Vegas'],
      ...crewsByBranch['Phoenix - North'],
      ...crewsByBranch['Phoenix - Southeast'],
      ...crewsByBranch['Phoenix - Southwest'],
      ...crewsByBranch['Corporate']
    ];
    
    // Filter based on location
    if (formData.location === 'las-vegas') {
      return allCrews.filter(crew => crew.startsWith('LV')).sort();
    } else if (formData.location) {
      // Any Phoenix location or Corporate - show PHX crews
      return allCrews.filter(crew => crew.startsWith('PHX')).sort();
    }
    
    // No location selected - return empty (user must select location first)
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('gate_checks')
        .insert([
          {
            inspection_date: formData.date,
            location: formData.location,
            division: formData.division,
            crew_number: formData.crewNumber,
            driver_name: formData.driverName,
            all_employees_have_ppe: formData.allEmployeesHavePPE,
            lights_working: formData.lightsWorking,
            mirrors_intact: formData.mirrorsIntact,
            license_plate_visible: formData.licensePlateVisible,
            registration_insurance_card: formData.registrationInsuranceCard,
            load_secured: formData.loadSecured,
            trimmer_racks_locked: formData.trimmerRacksLocked,
            safety_pins_in_place: formData.safetyPinsInPlace,
            tires_inflated: formData.tiresInflated,
            spare_tire_available: formData.spareTireAvailable,
            chemical_labeled_secured: formData.chemicalLabeledSecured,
            five_safety_cones: formData.fiveSafetyCones,
            first_aid_kit_fire_extinguisher: formData.firstAidKitFireExtinguisher,
            inspected_by: formData.inspectedBy,
            additional_items: formData.additionalItems
          }
        ])
        .select();

      if (error) throw error;

      alert('✅ Gate check submitted successfully!');
      console.log('Saved data:', data);
      
      // Redirect to reports page with gate checks view
      window.location.href = '/reports?view=gatechecks';
      
    } catch (error) {
      console.error('Error submitting gate check:', error);
      alert('❌ Error submitting gate check. Please try again.\n\n' + error.message);
    }
  };

  // Modern Section Header Component
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-500">
      <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/25">
        <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <h2 className="text-lg md:text-xl font-bold text-slate-800">{title}</h2>
    </div>
  );

  // Modern Input styling
  const inputClasses = "w-full px-4 py-3 text-base text-slate-900 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200";
  
  // Modern Select with custom chevron
  const SelectInput = ({ value, onChange, children, required = false, disabled = false }) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClasses} appearance-none cursor-pointer pr-10 ${!value ? 'text-slate-500' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        required={required}
        disabled={disabled}
        style={{ color: value ? '#0f172a' : '#64748b' }}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Modern Card Container */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500" />
            
            <div className="p-4 md:p-8">
              {/* Header */}
              <Header
                title="Gate Check"
                subtitle="Inspect vehicles, trailers, and crews for safety and compliance"
                icon={ClipboardCheck}
                actions={[
                  {
                    label: 'View Reports',
                    href: '/reports?view=gatechecks',
                    icon: FileText,
                    variant: 'primary',
                    ariaLabel: 'View reports',
                  },
                ]}
              />

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <section className="space-y-4">
                  <SectionHeader icon={ClipboardCheck} title="Basic Information" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Date of Inspection *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Location *
                      </label>
                      <SelectInput
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                      >
                        <option value="">Select location...</option>
                        <option value="corporate">Corporate</option>
                        <option value="phx-north">Phoenix - North</option>
                        <option value="phx-southwest">Phoenix - Southwest</option>
                        <option value="phx-southeast">Phoenix - Southeast</option>
                        <option value="las-vegas">Las Vegas</option>
                      </SelectInput>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Division *
                      </label>
                      <SelectInput
                        value={formData.division}
                        onChange={(e) => handleInputChange('division', e.target.value)}
                        required
                      >
                        <option value="">Select division...</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Enhancements">Enhancements</option>
                        <option value="Arbor">Arbor</option>
                        <option value="Irrigation">Irrigation</option>
                        <option value="Spray">Spray</option>
                        <option value="Overhead">Overhead</option>
                      </SelectInput>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Crew *
                      </label>
                      <SelectInput
                        value={formData.crewNumber}
                        onChange={(e) => handleInputChange('crewNumber', e.target.value)}
                        required
                        disabled={!formData.location}
                      >
                        <option value="">
                          {formData.location ? 'Select Crew...' : 'Select location first'}
                        </option>
                        {getAvailableCrews().map((crew) => (
                          <option key={crew} value={crew}>
                            {crew}
                          </option>
                        ))}
                      </SelectInput>
                      {!formData.location && (
                        <p className="mt-1.5 text-xs text-slate-500">
                          Please select a location first to see available crews
                        </p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Driver Name *
                      </label>
                      <input
                        type="text"
                        value={formData.driverName}
                        onChange={(e) => handleInputChange('driverName', e.target.value)}
                        className={inputClasses}
                        placeholder="Enter driver's name"
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* PPE Check */}
                <section className="space-y-4">
                  <SectionHeader icon={Shield} title="PPE Verification" />
                  
                  <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Do all employees have their PPE? *
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {['yes', 'no'].map((value) => (
                        <label key={value} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="allEmployeesHavePPE"
                            value={value}
                            checked={formData.allEmployeesHavePPE === value}
                            onChange={(e) => handleInputChange('allEmployeesHavePPE', e.target.value)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            required
                          />
                          <span className="ml-2 text-sm md:text-base text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Vehicle Condition - TABLE FORMAT */}
                <section className="space-y-4">
                  <SectionHeader icon={Truck} title="Vehicle Condition" />
                  
                  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <table className="w-full border-collapse min-w-[500px] rounded-xl overflow-hidden shadow-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                          <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-white">
                            Item
                          </th>
                          <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-semibold text-white w-14 md:w-20">
                            Yes
                          </th>
                          <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-semibold text-white w-14 md:w-20">
                            No
                          </th>
                          <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-semibold text-white w-20 md:w-24">
                            Needs Service
                          </th>
                          <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-semibold text-white w-14 md:w-20">
                            N/A
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: 'lightsWorking', label: 'Lights Working' },
                          { key: 'mirrorsIntact', label: 'Mirrors Intact' },
                          { key: 'licensePlateVisible', label: 'License Plate Visible' },
                          { key: 'registrationInsuranceCard', label: 'Registration / Insurance Card' }
                        ].map((item, index) => (
                          <tr key={item.key} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} hover:bg-blue-50 transition-colors`}>
                            <td className="border-b border-slate-200 px-3 md:px-4 py-3 text-xs md:text-sm text-slate-700 font-medium whitespace-nowrap">
                              {item.label}
                            </td>
                            {['yes', 'no', 'needs service', 'na'].map((value) => (
                              <td key={value} className="border-b border-slate-200 px-2 md:px-3 py-3 text-center">
                                <label className="flex items-center justify-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={item.key}
                                    value={value}
                                    checked={formData[item.key] === value}
                                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                                    className="w-5 h-5 md:w-4 md:h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                    required
                                  />
                                </label>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-500 italic md:hidden flex items-center gap-1">
                    <span>←</span> Scroll horizontally to see all options <span>→</span>
                  </p>
                </section>

                {/* Trailer and Equipment - TABLE FORMAT */}
                <section className="space-y-4">
                  <SectionHeader icon={Wrench} title="Trailer and Equipment" />
                  
                  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <table className="w-full border-collapse min-w-[500px] rounded-xl overflow-hidden shadow-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                          <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-white">
                            Item
                          </th>
                          <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-semibold text-white w-14 md:w-20">
                            Yes
                          </th>
                          <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-semibold text-white w-14 md:w-20">
                            No
                          </th>
                          <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-semibold text-white w-20 md:w-24">
                            Needs Service
                          </th>
                          <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-semibold text-white w-14 md:w-20">
                            N/A
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: 'loadSecured', label: 'Load Secured' },
                          { key: 'trimmerRacksLocked', label: 'Trimmer Racks Locked' },
                          { key: 'safetyPinsInPlace', label: 'Safety Pins in Place' },
                          { key: 'tiresInflated', label: 'Tires Inflated' },
                          { key: 'spareTireAvailable', label: 'Spare Tire Available' },
                          { key: 'chemicalLabeledSecured', label: 'Chemical Labeled & Secured' }
                        ].map((item, index) => (
                          <tr key={item.key} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} hover:bg-blue-50 transition-colors`}>
                            <td className="border-b border-slate-200 px-3 md:px-4 py-3 text-xs md:text-sm text-slate-700 font-medium whitespace-nowrap">
                              {item.label}
                            </td>
                            {['yes', 'no', 'needs service', 'na'].map((value) => (
                              <td key={value} className="border-b border-slate-200 px-2 md:px-3 py-3 text-center">
                                <label className="flex items-center justify-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={item.key}
                                    value={value}
                                    checked={formData[item.key] === value}
                                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                                    className="w-5 h-5 md:w-4 md:h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                    required
                                  />
                                </label>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-500 italic md:hidden flex items-center gap-1">
                    <span>←</span> Scroll horizontally to see all options <span>→</span>
                  </p>
                </section>

                {/* Safety Equipment */}
                <section className="space-y-4">
                  <SectionHeader icon={Shield} title="Safety Equipment" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Safety Cones Available*
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {['yes', 'no'].map((value) => (
                          <label key={value} className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="fiveSafetyCones"
                              value={value}
                              checked={formData.fiveSafetyCones === value}
                              onChange={(e) => handleInputChange('fiveSafetyCones', e.target.value)}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                              required
                            />
                            <span className="ml-2 text-sm md:text-base text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        First Aid Kit / Fire Extinguisher *
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {['yes', 'no'].map((value) => (
                          <label key={value} className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="firstAidKitFireExtinguisher"
                              value={value}
                              checked={formData.firstAidKitFireExtinguisher === value}
                              onChange={(e) => handleInputChange('firstAidKitFireExtinguisher', e.target.value)}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                              required
                            />
                            <span className="ml-2 text-sm md:text-base text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Inspector Info and Additional Items */}
                <section className="space-y-4">
                  <SectionHeader icon={UserCheck} title="Inspector Information" />
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Inspected By *
                      </label>
                      <input
                        type="text"
                        value={formData.inspectedBy}
                        onChange={(e) => handleInputChange('inspectedBy', e.target.value)}
                        className={inputClasses}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Additional Items / Suggestions for Future Gate Checks
                      </label>
                      <textarea
                        value={formData.additionalItems}
                        onChange={(e) => handleInputChange('additionalItems', e.target.value)}
                        rows={4}
                        className={`${inputClasses} resize-none`}
                        placeholder="Enter any suggestions for future gate checks..."
                      />
                    </div>
                  </div>
                </section>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t-2 border-blue-500">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Submit Gate Check
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}