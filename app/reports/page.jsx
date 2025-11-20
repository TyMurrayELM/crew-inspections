'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FileText, Download, Plus, ClipboardCheck } from 'lucide-react';
import Header from '../components/Header';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function ReportsPageContent() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  
  const [activeView, setActiveView] = useState(viewParam === 'gatechecks' ? 'gatechecks' : 'inspections'); // 'inspections' or 'gatechecks'
  const [inspections, setInspections] = useState([]);
  const [gateChecks, setGateChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterInspector, setFilterInspector] = useState('all');
  const [filterCrew, setFilterCrew] = useState('all');
  const [filterSafetyAlert, setFilterSafetyAlert] = useState('all');
  const [expandedInspectionId, setExpandedInspectionId] = useState(null);
  const [expandedGateCheckId, setExpandedGateCheckId] = useState(null);
  const [sortField, setSortField] = useState('inspection_date');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    if (activeView === 'inspections') {
      fetchInspections();
    } else {
      fetchGateChecks();
    }
  }, [activeView]);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crew_inspections')
        .select('*')
        .order('inspection_date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGateChecks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gate_checks')
        .select('*')
        .order('inspection_date', { ascending: false });

      if (error) throw error;
      setGateChecks(data || []);
    } catch (error) {
      console.error('Error fetching gate checks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getBranchDisplay = (branch) => {
    const branchMap = {
      'phx-southwest': 'Phx - Southwest',
      'phx-southeast': 'Phx - Southeast',
      'phx-north': 'Phx - North',
      'las-vegas': 'Las Vegas',
      'corporate': 'Corporate'
    };
    return branchMap[branch] || branch;
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
    // Create CSV headers
    const headers = [
      'Inspection Date',
      'Inspected By',
      'Branch',
      'Crew Observed',
      'Department',
      'Safety Cones',
      'Ladders Placed & Secured',
      'Ladder Labels Visible',
      'Ladders Used Correctly',
      'Ladder Notes',
      'PPE - Eye Protection',
      'PPE - Hearing Protection',
      'PPE - Hand Protection',
      'PPE - Foot Protection',
      'PPE - Head Protection',
      'PPE Notes',
      'Mowers',
      'Blowers',
      'Edger',
      'Hedge Trimmer',
      'Line Trimmer',
      'Gas Tanks',
      'Tools & Equipment Notes',
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
          inspection.edger_condition || '',
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

  const toggleGateCheck = (gateCheckId) => {
    setExpandedGateCheckId(expandedGateCheckId === gateCheckId ? null : gateCheckId);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get unique values for filter dropdowns
  const uniqueDepartments = [...new Set(inspections.map(i => i.department).filter(Boolean))];
  const uniqueInspectors = [...new Set(inspections.map(i => i.inspected_by).filter(Boolean))];
  const uniqueCrews = [...new Set(inspections.map(i => i.crew_observed).filter(Boolean))];

  // Get unique values for gate-check filters
  const uniqueGateCheckLocations = [...new Set(gateChecks.map(g => g.location).filter(Boolean))];
  const uniqueGateCheckDivisions = [...new Set(gateChecks.map(g => g.division).filter(Boolean))];
  const uniqueGateCheckInspectors = [...new Set(gateChecks.map(g => g.inspected_by).filter(Boolean))];
  const uniqueGateCheckCrews = [...new Set(gateChecks.map(g => g.crew_number).filter(Boolean))];

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
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'inspection_date':
        aValue = new Date(a.inspection_date || 0);
        bValue = new Date(b.inspection_date || 0);
        break;
      case 'inspected_by':
        aValue = (a.inspected_by || '').toLowerCase();
        bValue = (b.inspected_by || '').toLowerCase();
        break;
      case 'crew_branch':
        aValue = getBranchDisplay(a.crew_branch || '').toLowerCase();
        bValue = getBranchDisplay(b.crew_branch || '').toLowerCase();
        break;
      case 'department':
        aValue = getDepartmentDisplay(a.department || '').toLowerCase();
        bValue = getDepartmentDisplay(b.department || '').toLowerCase();
        break;
      case 'crew_observed':
        aValue = (a.crew_observed || '').toLowerCase();
        bValue = (b.crew_observed || '').toLowerCase();
        break;
      case 'safety_issue_asap':
        aValue = a.safety_issue_asap === 'yes' ? 0 : 1;
        bValue = b.safety_issue_asap === 'yes' ? 0 : 1;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter gate-checks based on all filters
  const filteredGateChecks = gateChecks.filter(gateCheck => {
    const matchesSearch = 
      gateCheck.inspected_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateCheck.division?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateCheck.crew_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateCheck.driver_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = filterBranch === 'all' || gateCheck.location === filterBranch;
    const matchesDivision = filterDepartment === 'all' || gateCheck.division === filterDepartment;
    const matchesInspector = filterInspector === 'all' || gateCheck.inspected_by === filterInspector;
    const matchesCrew = filterCrew === 'all' || gateCheck.crew_number === filterCrew;
    
    return matchesSearch && matchesLocation && matchesDivision && matchesInspector && matchesCrew;
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

  // Sort icon component
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 inline-block ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 inline-block ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 inline-block ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

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

      {/* Photos */}
      {inspection.google_photos_link && (
        <div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Photos</h3>
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-xs md:text-sm text-green-700">
              <span className="font-medium">📸 Photo Album Link:</span>{' '}
              <a 
                href={inspection.google_photos_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {inspection.google_photos_link}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Ladder Observation */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Ladder Observation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Safety Cones</p>
            {getStatusBadge(inspection.safety_cones)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Placed & Secured</p>
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
          <div className="mt-3 p-3 bg-yellow-50 rounded">
            <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Notes:</p>
            <p className="text-xs md:text-sm text-slate-700">{inspection.ladder_notes}</p>
          </div>
        )}
      </div>

      {/* PPE Compliance */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">PPE Compliance</h3>
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
          <div className="mt-3 p-3 bg-yellow-50 rounded">
            <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Notes:</p>
            <p className="text-xs md:text-sm text-slate-700">{inspection.ppe_notes}</p>
          </div>
        )}
      </div>

      {/* Tools & Equipment */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Tools & Equipment</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Mowers</p>
            {getStatusBadge(inspection.mowers_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Blowers</p>
            {getStatusBadge(inspection.blowers_condition)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Edger</p>
            {getStatusBadge(inspection.edger_condition)}
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
        {inspection.tools_equipment_notes && (
          <div className="mt-3 p-3 bg-yellow-50 rounded">
            <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Notes:</p>
            <p className="text-xs md:text-sm text-slate-700">{inspection.tools_equipment_notes}</p>
          </div>
        )}
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
          <div className="mt-3 p-3 bg-yellow-50 rounded">
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
          <div className="mt-3 p-3 bg-yellow-50 rounded">
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
          <div className="mt-3 p-3 bg-yellow-50 rounded">
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
            <div className="mb-3 p-3 bg-yellow-50 rounded">
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

  // Gate Check Details component
  const GateCheckDetails = ({ gateCheck }) => (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 border-t border-slate-200">
      {/* Basic Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 bg-white rounded shadow-sm">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Location</p>
          {getBranchBadge(gateCheck.location)}
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Division</p>
          <p className="text-xs md:text-sm text-slate-800 font-medium break-words">{getDepartmentDisplay(gateCheck.division)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Crew Number</p>
          <p className="text-xs md:text-sm text-slate-800 font-medium break-words">{gateCheck.crew_number}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Driver</p>
          <p className="text-xs md:text-sm text-slate-800 font-medium break-words">{gateCheck.driver_name}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-white rounded shadow-sm">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Inspector</p>
          <p className="text-xs md:text-sm text-slate-800 font-medium break-words">{gateCheck.inspected_by}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Email</p>
          <p className="text-xs md:text-sm text-slate-800 font-medium break-words">{gateCheck.email}</p>
        </div>
      </div>

      {/* PPE Check */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">PPE Verification</h3>
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">All Employees Have PPE</p>
            {getStatusBadge(gateCheck.all_employees_have_ppe)}
          </div>
        </div>
      </div>

      {/* Vehicle Condition */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Vehicle Condition</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Lights Working</p>
            {getStatusBadge(gateCheck.lights_working)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Mirrors Intact</p>
            {getStatusBadge(gateCheck.mirrors_intact)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">License Plate Visible</p>
            {getStatusBadge(gateCheck.license_plate_visible)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Registration/Insurance Card</p>
            {getStatusBadge(gateCheck.registration_insurance_card)}
          </div>
        </div>
      </div>

      {/* Trailer and Equipment */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Trailer and Equipment</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Load Secured</p>
            {getStatusBadge(gateCheck.load_secured)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Trimmer Racks Locked</p>
            {getStatusBadge(gateCheck.trimmer_racks_locked)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Safety Pins in Place</p>
            {getStatusBadge(gateCheck.safety_pins_in_place)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Tires Inflated</p>
            {getStatusBadge(gateCheck.tires_inflated)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Spare Tire Available</p>
            {getStatusBadge(gateCheck.spare_tire_available)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">Chemical Labeled & Secured</p>
            {getStatusBadge(gateCheck.chemical_labeled_secured)}
          </div>
        </div>
      </div>

      {/* Safety Equipment */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Safety Equipment</h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">5 Safety Cones</p>
            {getStatusBadge(gateCheck.five_safety_cones)}
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-600 mb-1">First Aid Kit / Fire Extinguisher</p>
            {getStatusBadge(gateCheck.first_aid_kit_fire_extinguisher)}
          </div>
        </div>
      </div>

      {/* Additional Items */}
      {gateCheck.additional_items && (
        <div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-3 border-b-2 border-blue-600 pb-2">Additional Suggestions</h3>
          <div className="p-3 bg-yellow-50 rounded">
            <p className="text-xs md:text-sm text-slate-700">{gateCheck.additional_items}</p>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 break-all">
          Report ID: {gateCheck.id} • Created: {formatDateTime(gateCheck.created_at)}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
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
        {/* Header - No action buttons */}
        <Header
          title="Safety & Facilities Reports"
          icon={FileText}
        />

        {/* View Toggle and New Button Container */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          {/* View Toggle - iPhone-style segmented control */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-lg bg-slate-200 p-1">
              <button
                onClick={() => setActiveView('inspections')}
                className={`px-4 md:px-8 py-2 text-sm md:text-base font-medium rounded-md transition-all ${
                  activeView === 'inspections'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Crew Inspections
                </span>
              </button>
              <button
                onClick={() => setActiveView('gatechecks')}
                className={`px-4 md:px-8 py-2 text-sm md:text-base font-medium rounded-md transition-all ${
                  activeView === 'gatechecks'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Gate-checks
                </span>
              </button>
            </div>
          </div>

          {/* New Button - Changes based on active view */}
          <div className="flex justify-center">
            <Link
              href={activeView === 'inspections' ? '/' : '/gatechecks'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              {activeView === 'inspections' ? 'New Inspection' : 'New Gate Check'}
            </Link>
          </div>
        </div>

        {/* Filters Section - Separate Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-6 border-t-4 border-blue-600">{activeView === 'inspections' ? (
            <>
              {/* Inspection Filters */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {filteredInspections.length} {filteredInspections.length === 1 ? 'report' : 'reports'} found
                  </h3>
                  <button
                    onClick={exportToCSV}
                    disabled={filteredInspections.length === 0}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    <Download className="w-4 h-4" />
                    Export to CSV
                  </button>
                </div>
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
            </>
          ) : (
            <>
              {/* Gate-Check Filters */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {filteredGateChecks.length} {filteredGateChecks.length === 1 ? 'gate check' : 'gate checks'} found
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Inspector, Driver, Division, or Crew..."
                    className="w-full px-3 py-2 text-sm md:text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="w-full px-3 py-2 text-sm md:text-base border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Locations</option>
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
                    <option value="all">All Divisions</option>
                    {uniqueGateCheckDivisions.sort().map((div) => (
                      <option key={div} value={div}>
                        {getDepartmentDisplay(div)}
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
                    {uniqueGateCheckInspectors.sort().map((inspector) => (
                      <option key={inspector} value={inspector}>
                        {inspector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Display Gate Checks */}
        {activeView === 'gatechecks' && (
          <>
            {/* No Results */}
            {filteredGateChecks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
                <p className="text-slate-500 text-base md:text-lg">No gate checks found.</p>
                <Link
                  href="/gatechecks"
                  className="mt-4 inline-block px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 text-sm md:text-base"
                >
                  Create First Gate Check
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile Card View (shown on screens < 768px) */}
                <div className="md:hidden space-y-3">
                  {filteredGateChecks.map((gateCheck) => (
                    <div key={gateCheck.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div
                        className="p-4 flex items-center gap-3 cursor-pointer active:bg-slate-50 transition-colors"
                        onClick={() => toggleGateCheck(gateCheck.id)}
                      >
                        <button className="text-slate-600 flex-shrink-0">
                          <ChevronIcon isExpanded={expandedGateCheckId === gateCheck.id} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 text-sm truncate">{gateCheck.driver_name}</p>
                              <p className="text-xs text-slate-600 mt-1">{formatDate(gateCheck.inspection_date)}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getBranchBadge(gateCheck.location)}
                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded">{gateCheck.crew_number}</span>
                          </div>
                        </div>
                      </div>
                      {expandedGateCheckId === gateCheck.id && <GateCheckDetails gateCheck={gateCheck} />}
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (shown on screens >= 768px) */}
                <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-100 border-b-2 border-blue-600">
                        <tr>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase w-12"></th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Driver</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Division</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Crew #</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Inspector</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGateChecks.map((gateCheck) => [
                          <tr 
                            key={gateCheck.id}
                            className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-200"
                            onClick={() => toggleGateCheck(gateCheck.id)}
                          >
                            <td className="px-4 py-3 text-center">
                              <button className="text-slate-600 hover:text-slate-800 transition-colors">
                                <ChevronIcon isExpanded={expandedGateCheckId === gateCheck.id} />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">{formatDate(gateCheck.inspection_date)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{gateCheck.driver_name}</td>
                            <td className="px-4 py-3">{getBranchBadge(gateCheck.location)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{getDepartmentDisplay(gateCheck.division)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{gateCheck.crew_number}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{gateCheck.inspected_by}</td>
                          </tr>,
                          expandedGateCheckId === gateCheck.id && (
                            <tr key={`${gateCheck.id}-details`}>
                              <td colSpan="7" className="p-0">
                                <GateCheckDetails gateCheck={gateCheck} />
                              </td>
                            </tr>
                          )
                        ])}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Display Inspection Reports */}
        {activeView === 'inspections' && (
          <>
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
                    <div key={inspection.id} className={`rounded-lg shadow overflow-hidden ${
                      inspection.safety_issue_asap === 'yes' ? 'bg-red-50' : 'bg-white'
                    }`}>
                      <div
                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                          inspection.safety_issue_asap === 'yes' 
                            ? 'active:bg-red-100' 
                            : 'active:bg-slate-50'
                        }`}
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
                            <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                              {getSafetyBadge(inspection.safety_issue_asap)}
                              {inspection.google_photos_link && (
                                <span className="text-base" title="Photos available">📸</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getBranchBadge(inspection.crew_branch)}
                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded">{inspection.crew_observed}</span>
                          </div>
                        </div>
                      </div>
                      {expandedInspectionId === inspection.id && <InspectionDetails inspection={inspection} />}
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (shown on screens >= 768px) */}
                <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-100 border-b-2 border-blue-600">
                        <tr>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase w-12"></th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-200 transition-colors"
                            onClick={() => handleSort('inspection_date')}
                          >
                            Date <SortIcon field="inspection_date" />
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-200 transition-colors"
                            onClick={() => handleSort('inspected_by')}
                          >
                            Inspector <SortIcon field="inspected_by" />
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-200 transition-colors"
                            onClick={() => handleSort('crew_branch')}
                          >
                            Branch <SortIcon field="crew_branch" />
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-200 transition-colors"
                            onClick={() => handleSort('department')}
                          >
                            Department <SortIcon field="department" />
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-200 transition-colors"
                            onClick={() => handleSort('crew_observed')}
                          >
                            Crew <SortIcon field="crew_observed" />
                          </th>
                          <th 
                            className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-200 transition-colors"
                            onClick={() => handleSort('safety_issue_asap')}
                          >
                            Safety Alert <SortIcon field="safety_issue_asap" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInspections.map((inspection) => [
                          <tr 
                            key={inspection.id}
                            className={`transition-colors cursor-pointer border-b border-slate-200 ${
                              inspection.safety_issue_asap === 'yes' 
                                ? 'bg-red-50 hover:bg-red-100' 
                                : 'hover:bg-slate-50'
                            }`}
                            onClick={() => toggleInspection(inspection.id)}
                          >
                            <td className="px-4 py-3 text-center">
                              <button className="text-slate-600 hover:text-slate-800 transition-colors">
                                <ChevronIcon isExpanded={expandedInspectionId === inspection.id} />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">{formatDate(inspection.inspection_date)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{inspection.inspected_by}</td>
                            <td className="px-4 py-3">{getBranchBadge(inspection.crew_branch)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{getDepartmentDisplay(inspection.department)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{inspection.crew_observed}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {inspection.google_photos_link && (
                                  <span className="text-base" title="Photos available">📸</span>
                                )}
                                {getSafetyBadge(inspection.safety_issue_asap)}
                              </div>
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
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <ReportsPageContent />
    </Suspense>
  );
}