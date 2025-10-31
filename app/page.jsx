'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from './components/Header';
import { ClipboardList, FileText } from 'lucide-react';

export default function CrewInspectionChecklist() {
  // Language state
  const [language, setLanguage] = useState('en');

  // Translations
  const translations = {
    en: {
      title: "Crew Inspection Checklist",
      viewReports: "View Reports",
      
      // Inspection Information
      inspectionInfo: "Inspection Information",
      dateTime: "Date and Time of Inspection",
      inspectedBy: "Inspected By",
      crewBranch: "Crew Branch",
      crewObserved: "Crew Observed",
      selectBranchFirst: "Please select a branch first",
      selectCrew: "Select Crew",
      selectBranchFirstOption: "Select Branch First",
      department: "Department",
      
      // Safety Equipment
      safetyEquipment: "Safety Equipment",
      safetyConesQuestion: "Does the Crew have their Safety Cones out and properly placed?",
      yes: "Yes",
      no: "No",
      na: "N/A",
      
      // Ladder Observation
      ladderObservation: "Ladder Observation",
      item: "Item",
      laddersPlaced: "Are Ladders properly placed and secured?",
      ladderLabels: "Are ladder labels visible?",
      laddersUsed: "Are ladders being used correctly?",
      ladderNotes: "Notes on Ladder Use and Upkeep",
      notesPlaceholder: "Enter any additional notes...",
      
      // PPE
      ppeObservation: "PPE Crew Observation - Onsite",
      ppeQuestion: "Are All Crew Members observed wearing the following PPE?",
      ppeItem: "PPE Item",
      eyeProtection: "Eye Protection",
      hearingProtection: "Hearing Protection",
      handProtection: "Hand Protection",
      footProtection: "Foot Protection",
      headProtection: "Head Protection",
      ppeNotes: "Notes on PPE Crew Observation",
      
      // Tools and Equipment
      toolsEquipment: "Inspect Tools and Equipment",
      equipment: "Equipment",
      good: "Good Condition",
      bad: "Bad Condition",
      missing: "Missing",
      notWorking: "Not Working",
      needsWork: "Needs Work",
      mowers: "Mowers",
      blowers: "Blowers",
      hedgeTrimmer: "Hedge Trimmer",
      lineTrimmer: "Line Trimmer",
      gasTanks: "Gas Tanks",
      toolsNotes: "Notes on Tools and Equipment",
      
      // Vehicle Emergency Equipment
      vehicleEmergency: "Vehicle Emergency Equipment",
      needService: "Need Service",
      fireExtinguisher: "Fire Extinguisher",
      firstAidKit: "First Aid Kit",
      waterJug: "Water Jug",
      warningTriangle: "Warning Triangle (F650/F750)",
      emergencyNotes: "Notes on Emergency Equipment",
      
      // Vehicle Inspection
      vehicleInspection: "Vehicle Inspection",
      needsAttention: "Needs Attention",
      dashClean: "Is the Dash Clean",
      tireCondition: "Tire Condition",
      truckClean: "Truck Clean",
      tarpWorking: "Tarp Working",
      insideVehicle: "Inside Vehicle Condition",
      vehicleNotes: "Notes on Vehicle, Tool, or Equipment Inspection/Observation",
      
      // Trailer Inspection
      trailerInspection: "Trailer Inspection",
      goodCondition: "Good Condition",
      badCondition: "Bad Condition",
      need: "Need",
      trailerConnection: "Trailer Connection",
      trailerBrakeAway: "Trailer Brake Away",
      trailerChains: "Trailer Chains",
      trailerLockPin: "Trailer Lock Pin",
      trailerTires: "Trailer Tires",
      trailerSecured: "Trailer Secured",
      trailerCleanliness: "Trailer Cleanliness",
      spareTire: "Spare Tire",
      trailerNotes: "Notes on Trailer Inspection",
      
      // Chemical Storage
      chemicalStorage: "Chemical Storage",
      chemicalsQuestion: "Are chemicals being stored properly?",
      selectAllApply: "Select All That Apply:",
      
      // Additional Notes
      additionalNotes: "Additional Notes and Follow-Up",
      additionalNotesLabel: "Additional Notes or Issues",
      safetyIssueASAP: "Is there a safety Issue that needs to be looked at ASAP?",
      immediateSafetyQuestion: "Are there any Safety issues observed that require immediate attention? Please Explain.",
      safetyConcernsPlaceholder: "Describe any immediate safety concerns...",
      followUpDate: "Follow-Up Required Date",
      googlePhotosLink: "Google Photos Link",
      googlePhotosPlaceholder: "Paste Google Photos album link here...",
      
      // Submit
      submitInspection: "Submit Inspection",
      
      // Common
      required: "*"
    },
    es: {
      title: "Lista de Verificación de Inspección de Equipo",
      viewReports: "Ver Reportes",
      
      // Inspection Information
      inspectionInfo: "Información de Inspección",
      dateTime: "Fecha y Hora de Inspección",
      inspectedBy: "Inspeccionado Por",
      crewBranch: "Sucursal del Equipo",
      crewObserved: "Equipo Observado",
      selectBranchFirst: "Por favor seleccione una sucursal primero",
      selectCrew: "Seleccionar Equipo",
      selectBranchFirstOption: "Seleccione Sucursal Primero",
      department: "Departamento",
      
      // Safety Equipment
      safetyEquipment: "Equipo de Seguridad",
      safetyConesQuestion: "¿Tiene el equipo sus conos de seguridad afuera y colocados correctamente?",
      yes: "Sí",
      no: "No",
      na: "N/A",
      
      // Ladder Observation
      ladderObservation: "Observación de Escaleras",
      item: "Artículo",
      laddersPlaced: "¿Están las escaleras colocadas y aseguradas correctamente?",
      ladderLabels: "¿Son visibles las etiquetas de las escaleras?",
      laddersUsed: "¿Se usan las escaleras correctamente?",
      ladderNotes: "Notas sobre el Uso y Mantenimiento de Escaleras",
      notesPlaceholder: "Ingrese cualquier nota adicional...",
      
      // PPE
      ppeObservation: "Observación de EPP del Equipo - En Sitio",
      ppeQuestion: "¿Se observó que todos los miembros del equipo usan el siguiente EPP?",
      ppeItem: "Artículo de EPP",
      eyeProtection: "Protección Ocular",
      hearingProtection: "Protección Auditiva",
      handProtection: "Protección de Manos",
      footProtection: "Protección de Pies",
      headProtection: "Protección de Cabeza",
      ppeNotes: "Notas sobre Observación de EPP del Equipo",
      
      // Tools and Equipment
      toolsEquipment: "Inspeccionar Herramientas y Equipos",
      equipment: "Equipo",
      good: "Buena Condición",
      bad: "Mala Condición",
      missing: "Faltante",
      notWorking: "No Funciona",
      needsWork: "Necesita Trabajo",
      mowers: "Cortadoras",
      blowers: "Sopladoras",
      hedgeTrimmer: "Recortadora de Setos",
      lineTrimmer: "Recortadora de Línea",
      gasTanks: "Tanques de Gas",
      toolsNotes: "Notas sobre Herramientas y Equipos",
      
      // Vehicle Emergency Equipment
      vehicleEmergency: "Equipo de Emergencia del Vehículo",
      needService: "Necesita Servicio",
      fireExtinguisher: "Extintor de Incendios",
      firstAidKit: "Botiquín de Primeros Auxilios",
      waterJug: "Jarra de Agua",
      warningTriangle: "Triángulo de Advertencia (F650/F750)",
      emergencyNotes: "Notas sobre Equipo de Emergencia",
      
      // Vehicle Inspection
      vehicleInspection: "Inspección del Vehículo",
      needsAttention: "Necesita Atención",
      dashClean: "¿Está Limpio el Tablero",
      tireCondition: "Condición de Neumáticos",
      truckClean: "Camión Limpio",
      tarpWorking: "Lona Funciona",
      insideVehicle: "Condición Interior del Vehículo",
      vehicleNotes: "Notas sobre Inspección/Observación de Vehículo, Herramienta o Equipo",
      
      // Trailer Inspection
      trailerInspection: "Inspección del Remolque",
      goodCondition: "Buena Condición",
      badCondition: "Mala Condición",
      need: "Necesita",
      trailerConnection: "Conexión del Remolque",
      trailerBrakeAway: "Freno de Emergencia del Remolque",
      trailerChains: "Cadenas del Remolque",
      trailerLockPin: "Pasador de Bloqueo del Remolque",
      trailerTires: "Neumáticos del Remolque",
      trailerSecured: "Remolque Asegurado",
      trailerCleanliness: "Limpieza del Remolque",
      spareTire: "Neumático de Repuesto",
      trailerNotes: "Notas sobre Inspección del Remolque",
      
      // Chemical Storage
      chemicalStorage: "Almacenamiento de Químicos",
      chemicalsQuestion: "¿Se almacenan los químicos correctamente?",
      selectAllApply: "Seleccione Todos los que Apliquen:",
      
      // Additional Notes
      additionalNotes: "Notas Adicionales y Seguimiento",
      additionalNotesLabel: "Notas o Problemas Adicionales",
      safetyIssueASAP: "¿Hay un problema de seguridad que deba atenderse LO ANTES POSIBLE?",
      immediateSafetyQuestion: "¿Hay algún problema de seguridad observado que requiera atención inmediata? Por favor explique.",
      safetyConcernsPlaceholder: "Describa cualquier preocupación de seguridad inmediata...",
      followUpDate: "Fecha de Seguimiento Requerida",
      googlePhotosLink: "Enlace de Google Photos",
      googlePhotosPlaceholder: "Pegue el enlace del álbum de Google Photos aquí...",
      
      // Submit
      submitInspection: "Enviar Inspección",
      
      // Common
      required: "*"
    }
  };

  const t = translations[language];

  // Crew data organized by branch
  const crewsByBranch = {
    'las-vegas': [
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
    'phx-north': [
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
    'phx-southeast': [
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
      'PHX_SE_MAINT_Team 7',
      'PHX_SE_MAINT_Team 8',
      'PHX_SE_MAINT_Team 9',
      'PHX_SE_OH Support'
    ],
    'phx-southwest': [
      'PHX_SW_IRR_Tech 1',
      'PHX_SW_IRR_Tech 2',
      'PHX_SW_IRR_Tech 4',
      'PHX_SW_MAINT_Onsite Waterview',
      'PHX_SW_MAINT_Onsite_Anchor Center',
      'PHX_SW_MAINT_Team 1',
      'PHX_SW_MAINT_Team 2',
      'PHX_SW_MAINT_Team 3',
      'PHX_SW_MAINT_Team 4',
      'PHX_SW_MAINT_Team 5',
      'PHX_SW_MAINT_Team 6',
      'PHX_SW_MAINT_Team 7'
    ],
    'corporate': [
      'PHX_ARBOR_Supervisor',
      'PHX_ARBOR_Team 1',
      'PHX_ARBOR_Team 2 SouthWest',
      'PHX_ARBOR_Team 3 Stumps',
      'PHX_ARBOR_Team 4 SouthEast',
      'PHX_ARBOR_Team 5 SouthWest',
      'PHX_ARBOR_Team 6',
      'PHX_ENHAN_Field Supervisor',
      'PHX_ENHAN_Team 1',
      'PHX_ENHAN_Team 2',
      'PHX_ENHAN_Team 3',
      'PHX_OH_Risk and Fleet',
      'PHX_SPRAY_SE_Tech 1',
      'PHX_SPRAY_SW_Tech 2',
      'PHX_SPRAY_Tech 3',
      'PHX_SPRAY_Tech 4'
    ]
  };

  const [formData, setFormData] = useState({
    date: '',
    inspectedBy: '',
    crewBranch: '',
    crewObserved: '',
    department: '',
    safetyCones: '',
    
    // Ladder Observation
    laddersPlacedSecured: '',
    ladderLabelsVisible: '',
    laddersUsedCorrectly: '',
    ladderNotes: '',
    
    // PPE Observation
    ppeEyeProtection: '',
    ppeHearingProtection: '',
    ppeHandProtection: '',
    ppeFootProtection: '',
    ppeHeadProtection: '',
    ppeNotes: '',
    
    // Tools and Equipment
    mowersCondition: '',
    blowersCondition: '',
    hedgeTrimmerCondition: '',
    lineTrimmerCondition: '',
    gasTanksCondition: '',
    toolsEquipmentNotes: '',
    
    // Vehicle Emergency Equipment
    fireExtinguisherCondition: '',
    firstAidKitCondition: '',
    waterJugCondition: '',
    warningTriangleCondition: '',
    emergencyEquipmentNotes: '',
    
    // Vehicle Inspection
    dashClean: '',
    tireCondition: '',
    truckClean: '',
    tarpWorking: '',
    insideVehicleCondition: '',
    vehicleNotes: '',
    
    // Trailer Inspection
    trailerConnection: '',
    trailerBrakeAway: '',
    trailerChains: '',
    trailerLockPin: '',
    trailerTires: '',
    trailerSecured: '',
    trailerCleanliness: '',
    spareTire: '',
    trailerNotes: '',
    
    // Chemical Storage
    chemicalsStoredProperly: '',
    chemicalIssues: [],
    
    // Additional
    additionalNotes: '',
    immediateSafetyIssues: '',
    safetyIssueASAP: '',
    followUpDate: '',
    googlePhotosLink: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Clear crew observed if branch changes
      if (field === 'crewBranch') {
        updated.crewObserved = '';
      }
      
      // Clear chemical issues if user selects "Yes" for proper storage
      if (field === 'chemicalsStoredProperly' && value === 'yes') {
        updated.chemicalIssues = [];
      }
      
      // Clear immediate safety issues if user selects "No" for ASAP safety issue
      if (field === 'safetyIssueASAP' && value === 'no') {
        updated.immediateSafetyIssues = '';
      }
      
      return updated;
    });
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  // Get available crews based on selected branch
  const getAvailableCrews = () => {
    if (!formData.crewBranch) return [];
    
    const branchCrews = crewsByBranch[formData.crewBranch] || [];
    
    // Include corporate crews for all PHX branches
    if (formData.crewBranch.startsWith('phx-')) {
      return [...branchCrews, ...crewsByBranch['corporate']].sort();
    }
    
    return branchCrews.sort();
  };

  // Helper function to get cell background color
  const getCellBackgroundClass = (currentValue, cellValue) => {
    if (currentValue === cellValue) {
      if (cellValue === 'yes' || cellValue === 'good') {
        return 'bg-green-100';
      } else if (cellValue === 'no' || cellValue === 'bad' || cellValue === 'missing' || cellValue === 'not-working') {
        return 'bg-red-100';
      } else if (cellValue === 'needs-work' || cellValue === 'need-service') {
        return 'bg-yellow-100';
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('crew_inspections')
        .insert([
          {
            inspection_date: formData.date,
            inspected_by: formData.inspectedBy,
            crew_branch: formData.crewBranch,
            crew_observed: formData.crewObserved,
            department: formData.department,
            safety_cones: formData.safetyCones,
            ladders_placed_secured: formData.laddersPlacedSecured,
            ladder_labels_visible: formData.ladderLabelsVisible,
            ladders_used_correctly: formData.laddersUsedCorrectly,
            ladder_notes: formData.ladderNotes,
            ppe_eye_protection: formData.ppeEyeProtection,
            ppe_hearing_protection: formData.ppeHearingProtection,
            ppe_hand_protection: formData.ppeHandProtection,
            ppe_foot_protection: formData.ppeFootProtection,
            ppe_head_protection: formData.ppeHeadProtection,
            ppe_notes: formData.ppeNotes,
            mowers_condition: formData.mowersCondition,
            blowers_condition: formData.blowersCondition,
            hedge_trimmer_condition: formData.hedgeTrimmerCondition,
            line_trimmer_condition: formData.lineTrimmerCondition,
            gas_tanks_condition: formData.gasTanksCondition,
            tools_equipment_notes: formData.toolsEquipmentNotes,
            fire_extinguisher_condition: formData.fireExtinguisherCondition,
            first_aid_kit_condition: formData.firstAidKitCondition,
            water_jug_condition: formData.waterJugCondition,
            warning_triangle_condition: formData.warningTriangleCondition,
            emergency_equipment_notes: formData.emergencyEquipmentNotes,
            dash_clean: formData.dashClean,
            tire_condition: formData.tireCondition,
            truck_clean: formData.truckClean,
            tarp_working: formData.tarpWorking,
            inside_vehicle_condition: formData.insideVehicleCondition,
            vehicle_notes: formData.vehicleNotes,
            trailer_connection: formData.trailerConnection,
            trailer_brake_away: formData.trailerBrakeAway,
            trailer_chains: formData.trailerChains,
            trailer_lock_pin: formData.trailerLockPin,
            trailer_tires: formData.trailerTires,
            trailer_secured: formData.trailerSecured,
            trailer_cleanliness: formData.trailerCleanliness,
            spare_tire: formData.spareTire,
            trailer_notes: formData.trailerNotes,
            chemicals_stored_properly: formData.chemicalsStoredProperly,
            chemical_issues: formData.chemicalIssues,
            additional_notes: formData.additionalNotes,
            immediate_safety_issues: formData.immediateSafetyIssues,
            safety_issue_asap: formData.safetyIssueASAP,
            follow_up_date: formData.followUpDate || null,
            google_photos_link: formData.googlePhotosLink
          }
        ])
        .select();

      if (error) throw error;

      alert('✅ Inspection submitted successfully!');
      console.log('Saved data:', data);
      
      // Option 1: Redirect to reports page to see the submitted inspection
      // Uncomment the line below to automatically go to reports after submission:
      // window.location.href = '/reports';
      
      // Option 2: Reset form and stay on this page
      // Uncomment the line below if you want the form to clear after submission:
      // window.location.reload();
      
    } catch (error) {
      console.error('Error submitting inspection:', error);
      alert('❌ Error submitting inspection. Please try again.\n\n' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          {/* Header */}
          <Header
            title={t.title}
            icon={ClipboardList}
            showLanguageToggle={true}
            language={language}
            onLanguageChange={setLanguage}
            actions={[
              {
                label: t.viewReports,
                href: '/reports',
                icon: FileText,
                variant: 'primary',
                ariaLabel: 'View inspection reports',
              },
            ]}
          />

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Basic Information */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.inspectionInfo}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.dateTime} {t.required}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.inspectedBy} {t.required}
                  </label>
                  <input
                    type="text"
                    value={formData.inspectedBy}
                    onChange={(e) => handleInputChange('inspectedBy', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.crewBranch} {t.required}
                  </label>
                  <select
                    value={formData.crewBranch}
                    onChange={(e) => handleInputChange('crewBranch', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="phx-southwest">Phx - SouthWest</option>
                    <option value="phx-southeast">Phx - SouthEast</option>
                    <option value="phx-north">Phx - North</option>
                    <option value="las-vegas">Las Vegas</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.crewObserved} {t.required}
                  </label>
                  <select
                    value={formData.crewObserved}
                    onChange={(e) => handleInputChange('crewObserved', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!formData.crewBranch}
                  >
                    <option value="">
                      {formData.crewBranch ? t.selectCrew : t.selectBranchFirstOption}
                    </option>
                    {getAvailableCrews().map((crew) => (
                      <option key={crew} value={crew}>
                        {crew}
                      </option>
                    ))}
                  </select>
                  {!formData.crewBranch && (
                    <p className="mt-1 text-xs text-slate-500">
                      {t.selectBranchFirst}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.department} {t.required}
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
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
            </section>

            {/* Safety Cones */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.safetyEquipment}
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.safetyConesQuestion} {t.required}
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="safetyCones"
                      value="yes"
                      checked={formData.safetyCones === 'yes'}
                      onChange={(e) => handleInputChange('safetyCones', e.target.value)}
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm md:text-base text-slate-700">{t.yes}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="safetyCones"
                      value="no"
                      checked={formData.safetyCones === 'no'}
                      onChange={(e) => handleInputChange('safetyCones', e.target.value)}
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm md:text-base text-slate-700">{t.no}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="safetyCones"
                      value="na"
                      checked={formData.safetyCones === 'na'}
                      onChange={(e) => handleInputChange('safetyCones', e.target.value)}
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm md:text-base text-slate-700">{t.na}</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Ladder Observation */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.ladderObservation}
              </h2>
              
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                <table className="w-full border-collapse min-w-[600px] table-fixed">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-slate-700 w-[55%]">
                        {t.item}
                      </th>
                      <th className="border border-slate-300 px-3 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700 w-[22.5%]">
                        {t.yes}
                      </th>
                      <th className="border border-slate-300 px-3 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700 w-[22.5%]">
                        {t.no}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'laddersPlacedSecured', label: t.laddersPlaced },
                      { key: 'ladderLabelsVisible', label: t.ladderLabels },
                      { key: 'laddersUsedCorrectly', label: t.laddersUsed }
                    ].map(({ key, label }) => (
                      <tr key={key}>
                        <td className="border border-slate-300 px-3 md:px-4 py-2 text-xs md:text-sm text-slate-700 font-medium">
                          {label}
                        </td>
                        {['yes', 'no'].map((value) => (
                          <td key={value} className={`border border-slate-300 px-3 md:px-4 py-2 text-center ${getCellBackgroundClass(formData[key], value)}`}>
                            <input
                              type="radio"
                              name={key}
                              value={value}
                              checked={formData[key] === value}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              required
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.ladderNotes}
                </label>
                <textarea
                  value={formData.ladderNotes}
                  onChange={(e) => handleInputChange('ladderNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.notesPlaceholder}
                />
              </div>
            </section>

            {/* PPE Crew Observation */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.ppeObservation} {t.required}
              </h2>
              <p className="text-xs md:text-sm text-slate-600">
                {t.ppeQuestion}
              </p>
              
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                <table className="w-full border-collapse min-w-[600px] table-fixed">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-slate-700 w-[55%]">
                        {t.ppeItem}
                      </th>
                      <th className="border border-slate-300 px-3 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700 w-[22.5%]">
                        {t.yes}
                      </th>
                      <th className="border border-slate-300 px-3 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700 w-[22.5%]">
                        {t.no}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'ppeEyeProtection', label: t.eyeProtection },
                      { key: 'ppeHearingProtection', label: t.hearingProtection },
                      { key: 'ppeHandProtection', label: t.handProtection },
                      { key: 'ppeFootProtection', label: t.footProtection },
                      { key: 'ppeHeadProtection', label: t.headProtection }
                    ].map(({ key, label }) => (
                      <tr key={key}>
                        <td className="border border-slate-300 px-3 md:px-4 py-2 text-xs md:text-sm text-slate-700 font-medium">
                          {label}
                        </td>
                        {['yes', 'no'].map((value) => (
                          <td key={value} className={`border border-slate-300 px-3 md:px-4 py-2 text-center ${getCellBackgroundClass(formData[key], value)}`}>
                            <input
                              type="radio"
                              name={key}
                              value={value}
                              checked={formData[key] === value}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              required
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.ppeNotes}
                </label>
                <textarea
                  value={formData.ppeNotes}
                  onChange={(e) => handleInputChange('ppeNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.notesPlaceholder}
                />
              </div>
            </section>

            {/* Tools and Equipment */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.toolsEquipment}
              </h2>
              
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-slate-700">
                        {t.equipment}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.good}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.bad}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.missing}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.notWorking}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.needsWork}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'mowersCondition', label: t.mowers },
                      { key: 'blowersCondition', label: t.blowers },
                      { key: 'hedgeTrimmerCondition', label: t.hedgeTrimmer },
                      { key: 'lineTrimmerCondition', label: t.lineTrimmer },
                      { key: 'gasTanksCondition', label: t.gasTanks }
                    ].map(({ key, label }) => (
                      <tr key={key}>
                        <td className="border border-slate-300 px-2 md:px-4 py-2 text-xs md:text-sm text-slate-700 font-medium">
                          {label}
                        </td>
                        {['good', 'bad', 'missing', 'not-working', 'needs-work'].map((condition) => (
                          <td key={condition} className={`border border-slate-300 px-2 md:px-4 py-2 text-center ${getCellBackgroundClass(formData[key], condition)}`}>
                            <input
                              type="radio"
                              name={key}
                              value={condition}
                              checked={formData[key] === condition}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.toolsNotes}
                </label>
                <textarea
                  value={formData.toolsEquipmentNotes}
                  onChange={(e) => handleInputChange('toolsEquipmentNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.notesPlaceholder}
                />
              </div>
            </section>

            {/* Vehicle Emergency Equipment */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.vehicleEmergency}
              </h2>
              
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-slate-700">
                        {t.equipment}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.good}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.bad}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.missing}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.needService}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'fireExtinguisherCondition', label: t.fireExtinguisher },
                      { key: 'firstAidKitCondition', label: t.firstAidKit },
                      { key: 'waterJugCondition', label: t.waterJug },
                      { key: 'warningTriangleCondition', label: t.warningTriangle }
                    ].map(({ key, label }) => (
                      <tr key={key}>
                        <td className="border border-slate-300 px-2 md:px-4 py-2 text-xs md:text-sm text-slate-700 font-medium">
                          {label}
                        </td>
                        {['good', 'bad', 'missing', 'need-service'].map((condition) => (
                          <td key={condition} className={`border border-slate-300 px-2 md:px-4 py-2 text-center ${getCellBackgroundClass(formData[key], condition)}`}>
                            <input
                              type="radio"
                              name={key}
                              value={condition}
                              checked={formData[key] === condition}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.emergencyNotes}
                </label>
                <textarea
                  value={formData.emergencyEquipmentNotes}
                  onChange={(e) => handleInputChange('emergencyEquipmentNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.notesPlaceholder}
                />
              </div>
            </section>

            {/* Vehicle Inspection */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.vehicleInspection}
              </h2>
              
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-slate-700">
                        {t.item}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.yes}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.no}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.good}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.bad}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.needsWork}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.needsAttention}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'dashClean', label: t.dashClean },
                      { key: 'tireCondition', label: t.tireCondition },
                      { key: 'truckClean', label: t.truckClean },
                      { key: 'tarpWorking', label: t.tarpWorking },
                      { key: 'insideVehicleCondition', label: t.insideVehicle }
                    ].map(({ key, label }) => (
                      <tr key={key}>
                        <td className="border border-slate-300 px-2 md:px-4 py-2 text-xs md:text-sm text-slate-700 font-medium">
                          {label}
                        </td>
                        {['yes', 'no', 'good', 'bad', 'needs-work', 'needs-attention'].map((condition) => (
                          <td key={condition} className={`border border-slate-300 px-2 md:px-4 py-2 text-center ${getCellBackgroundClass(formData[key], condition)}`}>
                            <input
                              type="radio"
                              name={key}
                              value={condition}
                              checked={formData[key] === condition}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.vehicleNotes}
                </label>
                <textarea
                  value={formData.vehicleNotes}
                  onChange={(e) => handleInputChange('vehicleNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.notesPlaceholder}
                />
              </div>
            </section>

            {/* Trailer Inspection */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.trailerInspection}
              </h2>
              
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-slate-700">
                        {t.item}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.goodCondition}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.badCondition}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.needsWork}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.missing}
                      </th>
                      <th className="border border-slate-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm font-medium text-slate-700">
                        {t.need}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'trailerConnection', label: t.trailerConnection },
                      { key: 'trailerBrakeAway', label: t.trailerBrakeAway },
                      { key: 'trailerChains', label: t.trailerChains },
                      { key: 'trailerLockPin', label: t.trailerLockPin },
                      { key: 'trailerTires', label: t.trailerTires },
                      { key: 'trailerSecured', label: t.trailerSecured },
                      { key: 'trailerCleanliness', label: t.trailerCleanliness },
                      { key: 'spareTire', label: t.spareTire }
                    ].map(({ key, label }) => (
                      <tr key={key}>
                        <td className="border border-slate-300 px-2 md:px-4 py-2 text-xs md:text-sm text-slate-700 font-medium">
                          {label}
                        </td>
                        {['good', 'bad', 'needs-work', 'missing', 'need'].map((condition) => (
                          <td key={condition} className={`border border-slate-300 px-2 md:px-4 py-2 text-center ${getCellBackgroundClass(formData[key], condition)}`}>
                            <input
                              type="radio"
                              name={key}
                              value={condition}
                              checked={formData[key] === condition}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.trailerNotes}
                </label>
                <textarea
                  value={formData.trailerNotes}
                  onChange={(e) => handleInputChange('trailerNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.notesPlaceholder}
                />
              </div>
            </section>

            {/* Chemical Storage */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.chemicalStorage}
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.chemicalsQuestion} {t.required}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chemicalsStoredProperly"
                      value="yes"
                      checked={formData.chemicalsStoredProperly === 'yes'}
                      onChange={(e) => handleInputChange('chemicalsStoredProperly', e.target.value)}
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm md:text-base text-slate-700">{t.yes}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chemicalsStoredProperly"
                      value="no"
                      checked={formData.chemicalsStoredProperly === 'no'}
                      onChange={(e) => handleInputChange('chemicalsStoredProperly', e.target.value)}
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm md:text-base text-slate-700">{t.no}</span>
                  </label>
                </div>
              </div>

              {/* Conditionally show issues only when "No" is selected */}
              {formData.chemicalsStoredProperly === 'no' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.selectAllApply}
                  </label>
                  <div className="space-y-2">
                    {['Containers are not Labeled', 'Not Properly Stored', 'NA', 'Other'].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.chemicalIssues.includes(option)}
                          onChange={() => handleCheckboxChange('chemicalIssues', option)}
                          className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm md:text-base text-slate-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Additional Notes and Follow-Up */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b-2 border-blue-600 pb-2">
                {t.additionalNotes}
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.additionalNotesLabel}
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.notesPlaceholder}
                />
              </div>

              <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4 md:p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">⚠️</span>
                  <label className="block text-base md:text-lg font-semibold text-orange-900">
                    {t.safetyIssueASAP} {t.required}
                  </label>
                </div>
                <div className="flex flex-wrap gap-4 ml-0 md:ml-11">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="safetyIssueASAP"
                      value="yes"
                      checked={formData.safetyIssueASAP === 'yes'}
                      onChange={(e) => handleInputChange('safetyIssueASAP', e.target.value)}
                      className="mr-2 w-5 h-5 text-orange-600 focus:ring-orange-500"
                      required
                    />
                    <span className="text-sm md:text-base font-medium text-orange-900">{t.yes}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="safetyIssueASAP"
                      value="no"
                      checked={formData.safetyIssueASAP === 'no'}
                      onChange={(e) => handleInputChange('safetyIssueASAP', e.target.value)}
                      className="mr-2 w-5 h-5 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm md:text-base font-medium text-orange-900">{t.no}</span>
                  </label>
                </div>
              </div>

              {/* Conditionally show safety issues explanation only when "Yes" is selected */}
              {formData.safetyIssueASAP === 'yes' && (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 md:p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xl">🚨</span>
                    <label className="block text-sm md:text-base font-semibold text-red-900">
                      {t.immediateSafetyQuestion}
                    </label>
                  </div>
                  <textarea
                    value={formData.immediateSafetyIssues}
                    onChange={(e) => handleInputChange('immediateSafetyIssues', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-base border-2 border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                    placeholder={t.safetyConcernsPlaceholder}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.followUpDate}
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  📸 {t.googlePhotosLink}
                </label>
                <input
                  type="text"
                  value={formData.googlePhotosLink}
                  onChange={(e) => handleInputChange('googlePhotosLink', e.target.value)}
                  className="w-full px-3 py-2 text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.googlePhotosPlaceholder}
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 md:pt-6 border-t-2 border-blue-600">
              <button
                type="submit"
                className="w-full md:w-auto px-6 md:px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {t.submitInspection}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}