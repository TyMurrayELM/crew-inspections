'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function InspectionReports() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedInspectionId, setExpandedInspectionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterInspector, setFilterInspector] = useState('all');
  const [filterCrew, setFilterCrew] = useState('all');
  const [filterSafetyAlert, setFilterSafetyAlert] = useState('all');

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crew_inspections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBranchDisplay = (branchValue) => {
    const branchMap = {
      'phx-southwest': 'PHX SW',
      'phx-southeast': 'PHX SE',
      'phx-north': 'PHX N',
      'las-vegas': 'Las Vegas',
      'corporate': 'Corporate'
    };
    return branchMap[branchValue] || branchValue;
  };

  const getBranchBadge = (branchValue) => {
    const branchConfig = {
      'phx-north': { text: 'PHX N', color: 'bg-green-100 text-green-800 border-green-300' },
      'phx-southwest': { text: 'PHX SW', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      'phx-southeast': { text: 'PHX SE', color: 'bg-red-100 text-red-800 border-red-300' },
      'las-vegas': { text: 'Las Vegas', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      'corporate': { text: 'Corporate', color: 'bg-gray-100 text-gray-800 border-gray-300' }
    };
    
    const config = branchConfig[branchValue] || { text: branchValue, color: 'bg-gray-100 text-gray-800 border-gray-300' };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const exportToCSV = () => {
    // Define CSV headers
    const headers = [
      'Inspection Date',
      'Inspector',
      'Branch',
      'Crew Observed',
      'Department',
      'Safety Cones',
      'Ladders Placed/Secured',
      'Ladder Labels Visible',
      'Ladders Used Correctly',
      'Ladder Notes',
      'PPE Eye Protection',
      'PPE Hearing Protection',
      'PPE Hand Protection',
      'PPE Foot Protection',
      'PPE Head Protection',
      'PPE Notes',
      'Mowers Condition',
      'Blowers Condition',
      'Hedge Trimmer Condition',
      'Line Trimmer Condition',
      'Gas Tanks Condition',
      'Tools/Equipment Notes',
      'Fire Extinguisher',
      'First Aid Kit',
      'Water Jug',
      'Warning Triangle',
      'Emergency Equipment Notes',
      'Dash Clean',
      'Tire Condition',
      'Truck Clean',
      'Tarp Working',
      'Inside Vehicle Condition',
      'Vehicle Notes',
      'Trailer Connection',
      'Trailer Brake Away',
      'Trailer Chains',
      'Trailer Lock Pin',
      'Trailer Tires',
      'Trailer Secured',
      'Trailer Cleanliness',
      'Spare Tire',
      'Trailer Notes',
      'Chemicals Stored Properly',
      'Chemical Issues',
      'Additional Notes',
      'Safety Issue ASAP',
      'Immediate Safety Issues',
      'Follow-Up Date',
      'Google Photos Link',
      'Report ID',
      'Created At'
    ];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(','),
      ...filteredInspections.map(inspection => {
        const row = [
          formatDateTime(inspection.inspection_date),
          inspection.inspected_by || '',
          getBranchDisplay(inspection.crew_branch),
          inspection.crew_observed || '',
          getDepartmentDisplay(inspection.department),
          inspection.safety_cones || '',
          inspection.ladders_placed_secured || '',
          inspection.ladder_labels_visible || '',
          inspection.ladders_used_correctly || '',
          `"${(inspection.ladder_notes || '').replace(/"/g, '""')}"`,
          inspection.ppe_eye_protection || '',
          inspection.ppe_hearing_protection || '',
          inspection.ppe_hand_protection || '',
          inspection.ppe_foot_protection || '',
          inspection.ppe_head_protection || '',
          `"${(inspection.ppe_notes || '').replace(/"/g, '""')}"`,
          inspection.mowers_condition || '',
          inspection.blowers_condition || '',
          inspection.hedge_trimmer_condition || '',
          inspection.line_trimmer_condition || '',
          inspection.gas_tanks_condition || '',
          `"${(inspection.tools_equipment_notes || '').replace(/"/g, '""')}"`,
          inspection.fire_extinguisher_condition || '',
          inspection.first_aid_kit_condition || '',
          inspection.water_jug_condition || '',
          inspection.warning_triangle_condition || '',
          `"${(inspection.emergency_equipment_notes || '').replace(/"/g, '""')}"`,
          inspection.dash_clean || '',
          inspection.tire_condition || '',
          inspection.truck_clean || '',
          inspection.tarp_working || '',
          inspection.inside_vehicle_condition || '',
          `"${(inspection.vehicle_notes || '').replace(/"/g, '""')}"`,
          inspection.trailer_connection || '',
          inspection.trailer_brake_away || '',
          inspection.trailer_chains || '',
          inspection.trailer_lock_pin || '',
          inspection.trailer_tires || '',
          inspection.trailer_secured || '',
          inspection.trailer_cleanliness || '',
          inspection.spare_tire || '',
          `"${(inspection.trailer_notes || '').replace(/"/g, '""')}"`,
          inspection.chemicals_stored_properly || '',
          `"${(inspection.chemical_issues || []).join('; ')}"`,
          `"${(inspection.additional_notes || '').replace(/"/g, '""')}"`,
          inspection.safety_issue_asap || '',
          `"${(inspection.immediate_safety_issues || '').replace(/"/g, '""')}"`,
          formatDate(inspection.follow_up_date),
          `"${(inspection.google_photos_link || '').replace(/"/g, '""')}"`,
          inspection.id || '',
          formatDateTime(inspection.created_at)
        ];
        return row.join(',');
      })
    ];

    // Create blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `inspection-reports-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDepartmentDisplay = (departmentValue) => {
    const departmentMap = {
      'arbor': 'Arbor',
      'enhancements': 'Enhancements',
      'irrigation': 'Irrigation',
      'maintenance': 'Maintenance',
      'maintenance-onsite': 'Maintenance Onsite',
      'overhead': 'Overhead',
      'spray-phc': 'Spray / PHC'
    };
    return departmentMap[departmentValue] || departmentValue;
  };

  const getSafetyBadge = (value) => {
    if (value === 'yes') {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-red-600 text-white">Yes</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded bg-green-600 text-white">No</span>;
  };

  const getStatusBadge = (value) => {
    const badgeMap = {
      'yes': 'bg-green-100 text-green-800',
      'no': 'bg-red-100 text-red-800',
      'good': 'bg-green-100 text-green-800',
      'bad': 'bg-red-100 text-red-800',
      'missing': 'bg-orange-100 text-orange-800',
      'needs-work': 'bg-yellow-100 text-yellow-800',
      'not-working': 'bg-red-100 text-red-800',
      'need-service': 'bg-yellow-100 text-yellow-800',
      'needs-attention': 'bg-orange-100 text-orange-800'
    };
    
    const colorClass = badgeMap[value] || 'bg-gray-100 text-gray-800';
    const displayText = value ? value.replace(/-/g, ' ').toUpperCase() : 'N/A';
    
    return <span className={`px-2 py-1 text-xs font-semibold rounded ${colorClass}`}>{displayText}</span>;
  };

  const toggleInspection = (inspectionId) => {
    setExpandedInspectionId(expandedInspectionId === inspectionId ? null : inspectionId);
  };

  // Get unique values for filter dropdowns
  const uniqueDepartments = [...new Set(inspections.map(i => i.department).filter(Boolean))];
  const uniqueInspectors = [...new Set(inspections.map(i => i.inspected_by).filter(Boolean))];
  const uniqueCrews = [...new Set(inspections.map(i => i.crew_observed).filter(Boolean))];

  // Filter inspections based on all filters
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = 
      inspection.inspected_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.crew_observed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = filterBranch === 'all' || inspection.crew_branch === filterBranch;
    const matchesDepartment = filterDepartment === 'all' || inspection.department === filterDepartment;
    const matchesInspector = filterInspector === 'all' || inspection.inspected_by === filterInspector;
    const matchesCrew = filterCrew === 'all' || inspection.crew_observed === filterCrew;
    const matchesSafetyAlert = filterSafetyAlert === 'all' || inspection.safety_issue_asap === filterSafetyAlert;
    
    return matchesSearch && matchesBranch && matchesDepartment && matchesInspector && matchesCrew && matchesSafetyAlert;
  });

  // Chevron icon component
  const ChevronIcon = ({ isExpanded }) => (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  // Details component
  const InspectionDetails = ({ inspection }) => (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 border-t border-slate-200">
      {/* Basic Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 bg-white rounded shadow-sm">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Branch</p>
          {getBranchBadge(inspection.crew_branch)}
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Department</p>
          <p className="text-xs md:text-sm text-slate-800 font-medium break-words">{getDepartmentDisplay(inspection.department)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Crew</p>
          <p className="text-xs md:text-sm text-slate-800 font-medium break-words">{inspection.crew_observed}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Inspector</p>
          <p className="text-xs md:text-sm text-slate-800 font-medium break-words">{inspection.inspected_by}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-white rounded shadow-sm">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Safety Alert</p>
          {getSafetyBadge(inspection.safety_issue_asap)}
        </div>
      </div>

      {/* Safety Equipment */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Safety Equipment</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Safety Cones</p>
            {getStatusBadge(inspection.safety_cones)}
          </div>
        </div>
      </div>

      {/* Ladder Observation */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Ladder Observation</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Properly Placed & Secured</p>
            {getStatusBadge(inspection.ladders_placed_secured)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Labels Visible</p>
            {getStatusBadge(inspection.ladder_labels_visible)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Used Correctly</p>
            {getStatusBadge(inspection.ladders_used_correctly)}
          </div>
        </div>
        {inspection.ladder_notes && (
          <div className="mt-3 p-3 bg-white rounded">
            <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Notes:</p>
            <p className="text-xs md:text-sm text-slate-700">{inspection.ladder_notes}</p>
          </div>
        )}
      </div>

      {/* PPE */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">PPE Observation</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Eye Protection</p>
            {getStatusBadge(inspection.ppe_eye_protection)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Hearing Protection</p>
            {getStatusBadge(inspection.ppe_hearing_protection)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Hand Protection</p>
            {getStatusBadge(inspection.ppe_hand_protection)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Foot Protection</p>
            {getStatusBadge(inspection.ppe_foot_protection)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Head Protection</p>
            {getStatusBadge(inspection.ppe_head_protection)}
          </div>
        </div>
        {inspection.ppe_notes && (
          <div className="mt-3 p-3 bg-white rounded">
            <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Notes:</p>
            <p className="text-xs md:text-sm text-slate-700">{inspection.ppe_notes}</p>
          </div>
        )}
      </div>

      {/* Tools & Equipment */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Tools & Equipment</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Mowers</p>
            {getStatusBadge(inspection.mowers_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Blowers</p>
            {getStatusBadge(inspection.blowers_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Hedge Trimmer</p>
            {getStatusBadge(inspection.hedge_trimmer_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Line Trimmer</p>
            {getStatusBadge(inspection.line_trimmer_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Gas Tanks</p>
            {getStatusBadge(inspection.gas_tanks_condition)}
          </div>
        </div>
      </div>

      {/* Vehicle Emergency Equipment */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Vehicle Emergency Equipment</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Fire Extinguisher</p>
            {getStatusBadge(inspection.fire_extinguisher_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">First Aid Kit</p>
            {getStatusBadge(inspection.first_aid_kit_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Water Jug</p>
            {getStatusBadge(inspection.water_jug_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Warning Triangle</p>
            {getStatusBadge(inspection.warning_triangle_condition)}
          </div>
        </div>
        {inspection.emergency_equipment_notes && (
          <div className="mt-3 p-3 bg-white rounded">
            <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Notes:</p>
            <p className="text-xs md:text-sm text-slate-700">{inspection.emergency_equipment_notes}</p>
          </div>
        )}
      </div>

      {/* Vehicle Inspection */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Vehicle Inspection</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Dash Clean</p>
            {getStatusBadge(inspection.dash_clean)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Tire Condition</p>
            {getStatusBadge(inspection.tire_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Truck Clean</p>
            {getStatusBadge(inspection.truck_clean)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Tarp Working</p>
            {getStatusBadge(inspection.tarp_working)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Inside Condition</p>
            {getStatusBadge(inspection.inside_vehicle_condition)}
          </div>
        </div>
        {inspection.vehicle_notes && (
          <div className="mt-3 p-3 bg-white rounded">
            <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Notes:</p>
            <p className="text-xs md:text-sm text-slate-700">{inspection.vehicle_notes}</p>
          </div>
        )}
      </div>

      {/* Trailer Inspection */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Trailer Inspection</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Connection</p>
            {getStatusBadge(inspection.trailer_connection)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Brake Away</p>
            {getStatusBadge(inspection.trailer_brake_away)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Chains</p>
            {getStatusBadge(inspection.trailer_chains)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Lock Pin</p>
            {getStatusBadge(inspection.trailer_lock_pin)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Tires</p>
            {getStatusBadge(inspection.trailer_tires)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Secured</p>
            {getStatusBadge(inspection.trailer_secured)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Cleanliness</p>
            {getStatusBadge(inspection.trailer_cleanliness)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Spare Tire</p>
            {getStatusBadge(inspection.spare_tire)}
          </div>
        </div>
        {inspection.trailer_notes && (
          <div className="mt-3 p-3 bg-white rounded">
            <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Notes:</p>
            <p className="text-xs md:text-sm text-slate-700">{inspection.trailer_notes}</p>
          </div>
        )}
      </div>

      {/* Chemical Storage */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Chemical Storage</h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Properly Stored</p>
            {getStatusBadge(inspection.chemicals_stored_properly)}
          </div>
          {inspection.chemical_issues && inspection.chemical_issues.length > 0 && (
            <div>
              <p className="text-xs md:text-sm text-slate-600 mb-1">Issues:</p>
              <div className="flex flex-wrap gap-1">
                {inspection.chemical_issues.map((issue, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Notes & Safety Issues */}
      {(inspection.additional_notes || inspection.immediate_safety_issues) && (
        <div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Additional Information</h3>
          {inspection.additional_notes && (
            <div className="mb-3 p-3 bg-white rounded">
              <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Additional Notes:</p>
              <p className="text-xs md:text-sm text-slate-700">{inspection.additional_notes}</p>
            </div>
          )}
          {inspection.immediate_safety_issues && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-xs md:text-sm text-red-600 font-medium mb-1">⚠️ Immediate Safety Issues:</p>
              <p className="text-xs md:text-sm text-red-800">{inspection.immediate_safety_issues}</p>
            </div>
          )}
          {inspection.follow_up_date && (
            <div className="mt-3 p-3 bg-blue-50 rounded">
              <p className="text-xs md:text-sm text-blue-600 font-medium mb-1">📅 Follow-Up Date:</p>
              <p className="text-xs md:text-sm text-blue-800">{formatDate(inspection.follow_up_date)}</p>
            </div>
          )}
          {inspection.google_photos_link && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded">
              <p className="text-xs md:text-sm text-purple-600 font-medium mb-2">📸 Google Photos:</p>
              <a 
                href={inspection.google_photos_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs md:text-sm text-blue-600 hover:text-blue-800 underline break-all"
              >
                {inspection.google_photos_link}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 break-all">
          Report ID: {inspection.id} • Created: {formatDateTime(inspection.created_at)}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading inspections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-bold mb-2">Error Loading Inspections</h2>
            <p className="text-slate-600">{error}</p>
            <button
              onClick={fetchInspections}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-4 md:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col gap-3 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Inspection Reports</h1>
                <p className="text-slate-600 mt-1 text-sm md:text-base">
                  {filteredInspections.length} {filteredInspections.length === 1 ? 'report' : 'reports'} found
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={exportToCSV}
                  disabled={filteredInspections.length === 0}
                  className="px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-center text-sm md:text-base"
                >
                  📥 Export to CSV
                </button>
                <Link
                  href="/"
                  className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors text-center text-sm md:text-base"
                >
                  + New Inspection
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Inspector, Department, or Crew..."
                className="w-full px-3 py-2 text-sm md:text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Branches</option>
                <option value="phx-southwest">Phx - SouthWest</option>
                <option value="phx-southeast">Phx - SouthEast</option>
                <option value="phx-north">Phx - North</option>
                <option value="las-vegas">Las Vegas</option>
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.sort().map((dept) => (
                  <option key={dept} value={dept}>
                    {getDepartmentDisplay(dept)}
                  </option>
                ))}
              </select>
              <select
                value={filterCrew}
                onChange={(e) => setFilterCrew(e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Crews</option>
                {uniqueCrews.sort().map((crew) => (
                  <option key={crew} value={crew}>
                    {crew}
                  </option>
                ))}
              </select>
              <select
                value={filterInspector}
                onChange={(e) => setFilterInspector(e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Inspectors</option>
                {uniqueInspectors.sort().map((inspector) => (
                  <option key={inspector} value={inspector}>
                    {inspector}
                  </option>
                ))}
              </select>
              <select
                value={filterSafetyAlert}
                onChange={(e) => setFilterSafetyAlert(e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Safety Alerts</option>
                <option value="yes">Yes - Safety Alert</option>
                <option value="no">No - No Alert</option>
              </select>
            </div>
          </div>
        </div>

        {/* No Results */}
        {filteredInspections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
            <p className="text-slate-500 text-base md:text-lg">No inspections found.</p>
            <Link
              href="/"
              className="mt-4 inline-block px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 text-sm md:text-base"
            >
              Create First Inspection
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Card View (shown on screens < 768px) */}
            <div className="md:hidden space-y-3">
              {filteredInspections.map((inspection) => (
                <div key={inspection.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div
                    className="p-4 flex items-center gap-3 cursor-pointer active:bg-slate-50 transition-colors"
                    onClick={() => toggleInspection(inspection.id)}
                  >
                    <button className="text-slate-600 flex-shrink-0">
                      <ChevronIcon isExpanded={expandedInspectionId === inspection.id} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{inspection.inspected_by}</p>
                          <p className="text-xs text-slate-600 mt-1">{formatDate(inspection.inspection_date)}</p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {getSafetyBadge(inspection.safety_issue_asap)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">Branch:</span>
                          {getBranchBadge(inspection.crew_branch)}
                        </div>
                        <div>
                          <span className="text-slate-500">Dept:</span>
                          <span className="text-slate-800 font-medium ml-1">{getDepartmentDisplay(inspection.department)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500">Crew:</span>
                          <span className="text-slate-800 font-medium ml-1">{inspection.crew_observed}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedInspectionId === inspection.id && (
                    <InspectionDetails inspection={inspection} />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View (shown on screens >= 768px) */}
            <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100 border-b-2 border-blue-600">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase w-12"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Inspector</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Branch</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Crew</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Safety Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInspections.map((inspection) => [
                    <tr 
                      key={inspection.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-200"
                      onClick={() => toggleInspection(inspection.id)}
                    >
                      <td className="px-4 py-3 text-center">
                        <button className="text-slate-600 hover:text-slate-800 transition-colors">
                          <ChevronIcon isExpanded={expandedInspectionId === inspection.id} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800 whitespace-nowrap">
                        {formatDate(inspection.inspection_date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">
                        {inspection.inspected_by}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800 whitespace-nowrap">
                        {getBranchBadge(inspection.crew_branch)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">
                        {getDepartmentDisplay(inspection.department)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">
                        {inspection.crew_observed}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getSafetyBadge(inspection.safety_issue_asap)}
                      </td>
                    </tr>,
                    expandedInspectionId === inspection.id && (
                      <tr key={`${inspection.id}-details`}>
                        <td colSpan="7" className="p-0">
                          <InspectionDetails inspection={inspection} />
                        </td>
                      </tr>
                    )
                  ])}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}