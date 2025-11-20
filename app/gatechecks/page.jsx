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
  const [formData, setFormData] = useState({
    date: '',
    email: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('gate_checks')
        .insert([
          {
            inspection_date: formData.date,
            email: formData.email,
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
      
      // Uncomment to redirect to reports after submission:
      // window.location.href = '/reports';
      
      // Uncomment to clear form after submission:
      // window.location.reload();
      
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
                href: '/reports',
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
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="">Select Location</option>
                    <option value="phx-southwest">Phx - SouthWest</option>
                    <option value="phx-southeast">Phx - SouthEast</option>
                    <option value="phx-north">Phx - North</option>
                    <option value="las-vegas">Las Vegas</option>
                    <option value="corporate">Corporate</option>
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
                    <option value="">Select Division</option>
                    <option value="arbor">Arbor</option>
                    <option value="enhancements">Enhancements</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="maintenance-onsite">Maintenance Onsite</option>
                    <option value="overhead">Overhead</option>
                    <option value="spray-phc">Spray / PHC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Crew Number *
                  </label>
                  <input
                    type="text"
                    value={formData.crewNumber}
                    onChange={(e) => handleInputChange('crewNumber', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
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
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="allEmployeesHavePPE"
                      value="yes"
                      checked={formData.allEmployeesHavePPE === 'yes'}
                      onChange={(e) => handleInputChange('allEmployeesHavePPE', e.target.value)}
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm md:text-base text-slate-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="allEmployeesHavePPE"
                      value="no"
                      checked={formData.allEmployeesHavePPE === 'no'}
                      onChange={(e) => handleInputChange('allEmployeesHavePPE', e.target.value)}
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm md:text-base text-slate-700">No</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Vehicle Condition */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Vehicle Condition *
              </h2>
              
              <div className="space-y-4">
                {[
                  { key: 'lightsWorking', label: 'Lights Working' },
                  { key: 'mirrorsIntact', label: 'Mirrors Intact' },
                  { key: 'licensePlateVisible', label: 'License Plate Visible' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {label} *
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {['yes', 'no', 'needs-service'].map((value) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="radio"
                            name={key}
                            value={value}
                            checked={formData[key] === value}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                            required
                          />
                          <span className="text-sm md:text-base text-slate-700 capitalize">
                            {value === 'needs-service' ? 'Needs Service' : value.charAt(0).toUpperCase() + value.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Registration / Insurance Card *
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['yes', 'no'].map((value) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="radio"
                          name="registrationInsuranceCard"
                          value={value}
                          checked={formData.registrationInsuranceCard === value}
                          onChange={(e) => handleInputChange('registrationInsuranceCard', e.target.value)}
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

            {/* Trailer and Equipment */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Trailer and Equipment *
              </h2>
              
              <div className="space-y-4">
                {[
                  { key: 'loadSecured', label: 'Load Secured' },
                  { key: 'trimmerRacksLocked', label: 'Trimmer Racks Locked' },
                  { key: 'safetyPinsInPlace', label: 'Safety Pins in Place' },
                  { key: 'tiresInflated', label: 'Tires Inflated' },
                  { key: 'spareTireAvailable', label: 'Spare Tire Available' },
                  { key: 'chemicalLabeledSecured', label: 'Chemical Labeled and Secured' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {label} *
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {['yes', 'no', 'needs-service', 'na'].map((value) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="radio"
                            name={key}
                            value={value}
                            checked={formData[key] === value}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                            required
                          />
                          <span className="text-sm md:text-base text-slate-700 capitalize">
                            {value === 'needs-service' ? 'Needs Service' : value === 'na' ? 'N/A' : value.charAt(0).toUpperCase() + value.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Safety Equipment */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Safety Equipment
              </h2>
              
              <div className="space-y-4">
                {[
                  { key: 'fiveSafetyCones', label: '5 Safety Cones' },
                  { key: 'firstAidKitFireExtinguisher', label: 'First Aid Kit / Fire Extinguisher' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {label}
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {['yes', 'no'].map((value) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="radio"
                            name={key}
                            value={value}
                            checked={formData[key] === value}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm md:text-base text-slate-700 capitalize">
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inspector and Additional Items */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                Additional Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Inspected By: *
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
                  Are there any additional items you believe should be included in future gate check inspections?
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