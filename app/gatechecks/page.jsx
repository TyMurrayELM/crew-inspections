'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from '../components/Header';
import { ClipboardCheck, FileText } from 'lucide-react';

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
      'PHX_SW_ENHAN_Team 1',
      'PHX_SW_ENHAN_Team 2',
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
      'PHX_OVERHEAD_Landscape Supervisor',
      'PHX_OVERHEAD_Irrigation Supervisor',
      'PHX_OVERHEAD_Safety',
      'PHX_OVERHEAD_Account Manager/BDM'
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get available crews - show all crews from all locations
  const getAvailableCrews = () => {
    const allCrews = [
      ...crewsByBranch['Las Vegas'],
      ...crewsByBranch['Phoenix - North'],
      ...crewsByBranch['Phoenix - Southeast'],
      ...crewsByBranch['Phoenix - Southwest'],
      ...crewsByBranch['Corporate']
    ];
    
    return allCrews.sort();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          {/* Header */}
          <Header
            title="Gate Check"
            subtitle="To ensure all vehicles, trailers, and crews leaving or returning to the yard are inspected for safety, compliance, and readiness"
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

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Basic Information */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date of Inspection *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select location...</option>
                    <option value="corporate">Corporate</option>
                    <option value="phx-north">Phoenix - North</option>
                    <option value="phx-southwest">Phoenix - Southwest</option>
                    <option value="phx-southeast">Phoenix - Southeast</option>
                    <option value="las-vegas">Las Vegas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Division *
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select division...</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Enhancement">Enhancement</option>
                    <option value="Construction">Construction</option>
                    <option value="Admin">Admin</option>
                    <option value="Operations">Operations</option>
                    <option value="Snow">Snow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Crew *
                  </label>
                  <select
                    value={formData.crewNumber}
                    onChange={(e) => handleInputChange('crewNumber', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Crew...</option>
                    {getAvailableCrews().map((crew) => (
                      <option key={crew} value={crew}>
                        {crew}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    value={formData.driverName}
                    onChange={(e) => handleInputChange('driverName', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </section>

            {/* PPE Check */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                PPE Verification
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Do all employees have their PPE? *
                </label>
                <div className="flex flex-wrap gap-4">
                  {['yes', 'no'].map((value) => (
                    <label key={value} className="flex items-center">
                      <input
                        type="radio"
                        name="allEmployeesHavePPE"
                        value={value}
                        checked={formData.allEmployeesHavePPE === value}
                        onChange={(e) => handleInputChange('allEmployeesHavePPE', e.target.value)}
                        className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-sm md:text-base text-slate-700 capitalize">
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Vehicle Condition - TABLE FORMAT */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Vehicle Condition *
              </h2>
              
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <table className="border-collapse border border-slate-300 min-w-[500px] table-auto">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">
                        Item
                      </th>
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-slate-700 w-14 md:w-20">
                        Yes
                      </th>
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-slate-700 w-14 md:w-20">
                        No
                      </th>
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-slate-700 w-20 md:w-24">
                        Needs Service
                      </th>
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-slate-700 w-14 md:w-20">
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
                      <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="border border-slate-300 px-2 md:px-3 py-3 text-xs md:text-sm text-slate-700 font-medium whitespace-nowrap">
                          {item.label}
                        </td>
                        {['yes', 'no', 'needs service', 'na'].map((value) => (
                          <td key={value} className="border border-slate-300 px-2 md:px-3 py-3 text-center">
                            <label className="flex items-center justify-center cursor-pointer">
                              <input
                                type="radio"
                                name={item.key}
                                value={value}
                                checked={formData[item.key] === value}
                                onChange={(e) => handleInputChange(item.key, e.target.value)}
                                className="w-5 h-5 md:w-4 md:h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
              <p className="text-xs text-slate-500 italic md:hidden">← Scroll horizontally to see all options →</p>
            </section>

            {/* Trailer and Equipment - TABLE FORMAT */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Trailer and Equipment *
              </h2>
              
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <table className="border-collapse border border-slate-300 min-w-[500px] table-auto">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">
                        Item
                      </th>
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-slate-700 w-14 md:w-20">
                        Yes
                      </th>
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-slate-700 w-14 md:w-20">
                        No
                      </th>
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-slate-700 w-20 md:w-24">
                        Needs Service
                      </th>
                      <th className="border border-slate-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-slate-700 w-14 md:w-20">
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
                      <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="border border-slate-300 px-2 md:px-3 py-3 text-xs md:text-sm text-slate-700 font-medium whitespace-nowrap">
                          {item.label}
                        </td>
                        {['yes', 'no', 'needs service', 'na'].map((value) => (
                          <td key={value} className="border border-slate-300 px-2 md:px-3 py-3 text-center">
                            <label className="flex items-center justify-center cursor-pointer">
                              <input
                                type="radio"
                                name={item.key}
                                value={value}
                                checked={formData[item.key] === value}
                                onChange={(e) => handleInputChange(item.key, e.target.value)}
                                className="w-5 h-5 md:w-4 md:h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
              <p className="text-xs text-slate-500 italic md:hidden">← Scroll horizontally to see all options →</p>
            </section>

            {/* Safety Equipment */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Safety Equipment
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    5 Safety Cones *
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['yes', 'no'].map((value) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="radio"
                          name="fiveSafetyCones"
                          value={value}
                          checked={formData.fiveSafetyCones === value}
                          onChange={(e) => handleInputChange('fiveSafetyCones', e.target.value)}
                          className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="text-sm md:text-base text-slate-700 capitalize">
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Aid Kit / Fire Extinguisher *
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['yes', 'no'].map((value) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="radio"
                          name="firstAidKitFireExtinguisher"
                          value={value}
                          checked={formData.firstAidKitFireExtinguisher === value}
                          onChange={(e) => handleInputChange('firstAidKitFireExtinguisher', e.target.value)}
                          className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="text-sm md:text-base text-slate-700 capitalize">
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
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Inspector Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Inspected By *
                </label>
                <input
                  type="text"
                  value={formData.inspectedBy}
                  onChange={(e) => handleInputChange('inspectedBy', e.target.value)}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Additional Items / Suggestions for Future Gate Checks
                </label>
                <textarea
                  value={formData.additionalItems}
                  onChange={(e) => handleInputChange('additionalItems', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter any suggestions for future gate checks..."
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 md:pt-6 border-t-2 border-blue-600">
              <button
                type="submit"
                className="w-full md:w-auto px-6 md:px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Submit Gate Check
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}