'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FileText, Download, Plus, ClipboardCheck, Search, Filter, ChevronDown } from 'lucide-react';
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
  const [gateCheckSortField, setGateCheckSortField] = useState('inspection_date');
  const [gateCheckSortDirection, setGateCheckSortDirection] = useState('desc');

  // Reset filters when switching views
  useEffect(() => {
    setSearchTerm('');
    setFilterBranch('all');
    setFilterDepartment('all');
    setFilterInspector('all');
    setFilterCrew('all');
    setFilterSafetyAlert('all');
  }, [activeView]);

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

  // Helper function to check if a gate check has any "no" responses
  const hasNoResponses = (gateCheck) => {
    const fieldsToCheck = [
      gateCheck.all_employees_have_ppe,
      gateCheck.lights_working,
      gateCheck.mirrors_intact,
      gateCheck.license_plate_visible,
      gateCheck.registration_insurance_card,
      gateCheck.load_secured,
      gateCheck.trimmer_racks_locked,
      gateCheck.safety_pins_in_place,
      gateCheck.tires_inflated,
      gateCheck.spare_tire_available,
      gateCheck.chemical_labeled_secured,
      gateCheck.five_safety_cones,
      gateCheck.first_aid_kit_fire_extinguisher
    ];
    return fieldsToCheck.some(field => field?.toLowerCase() === 'no');
  };

  // Helper function to check if a gate check has any "needs service" responses
  const hasNeedsService = (gateCheck) => {
    const fieldsToCheck = [
      gateCheck.all_employees_have_ppe,
      gateCheck.lights_working,
      gateCheck.mirrors_intact,
      gateCheck.license_plate_visible,
      gateCheck.registration_insurance_card,
      gateCheck.load_secured,
      gateCheck.trimmer_racks_locked,
      gateCheck.safety_pins_in_place,
      gateCheck.tires_inflated,
      gateCheck.spare_tire_available,
      gateCheck.chemical_labeled_secured,
      gateCheck.five_safety_cones,
      gateCheck.first_aid_kit_fire_extinguisher
    ];
    return fieldsToCheck.some(field => {
      const val = field?.toLowerCase();
      return val === 'needs service' || val === 'needs-service' || val === 'need-service' || val === 'need service';
    });
  };

  // Gate Check Alert Icons Component
  const GateCheckAlerts = ({ gateCheck }) => {
    const hasNo = hasNoResponses(gateCheck);
    const hasService = hasNeedsService(gateCheck);
    
    if (!hasNo && !hasService) return null;
    
    return (
      <div className="flex items-center gap-1">
        {hasNo && (
          <span 
            className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full border border-red-200" 
            title="Has items marked 'No'"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
        )}
        {hasService && (
          <span 
            className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full border border-yellow-200" 
            title="Has items needing service"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
        )}
      </div>
    );
  };

  // Fixed formatDate function that handles date-only strings as local dates
  // This prevents the timezone shift that was causing dates to display a day behind
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Check if this is a date-only string (YYYY-MM-DD format)
    // These should be treated as local dates, not UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      // Create date using local timezone (months are 0-indexed)
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    // For full datetime strings, use standard parsing
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Normalize location values to standard format (handles both old and new data)
  const normalizeLocation = (loc) => {
    if (!loc) return loc;
    const map = {
      'Phoenix - North': 'phx-north',
      'Phoenix - Southwest': 'phx-southwest',
      'Phoenix - Southeast': 'phx-southeast',
      'Las Vegas': 'las-vegas',
      'Corporate': 'corporate'
    };
    return map[loc] || loc;
  };

  const getBranchDisplay = (branch) => {
    const branchMap = {
      'phx-southwest': 'Phx - Southwest',
      'phx-southeast': 'Phx - Southeast',
      'phx-north': 'Phx - North',
      'las-vegas': 'Las Vegas',
      'corporate': 'Corporate',
      // Support for old format
      'Phoenix - North': 'Phx - North',
      'Phoenix - Southwest': 'Phx - Southwest',
      'Phoenix - Southeast': 'Phx - Southeast',
      'Las Vegas': 'Las Vegas',
      'Corporate': 'Corporate'
    };
    return branchMap[branch] || branch;
  };

  const getBranchBadge = (branchValue) => {
    // Normalize the value first
    const normalized = normalizeLocation(branchValue) || branchValue;
    
    const branchConfig = {
      'phx-north': { text: 'PHX N', color: 'bg-green-100 text-green-800 border-green-300' },
      'phx-southwest': { text: 'PHX SW', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      'phx-southeast': { text: 'PHX SE', color: 'bg-red-100 text-red-800 border-red-300' },
      'las-vegas': { text: 'Las Vegas', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      'corporate': { text: 'Corporate', color: 'bg-gray-100 text-gray-800 border-gray-300' }
    };
    
    const config = branchConfig[normalized] || { text: branchValue || 'N/A', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    
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
      'Trimmers',
      'Chain Saws',
      'Pole Saws',
      'Hedge Trimmers',
      'Tools Maintained',
      'Tools Notes',
      'Vehicle Clean',
      'Decals Visible',
      'Walk Around Complete',
      'Fluids Topped',
      'Dash Lights Clear',
      'Vehicle Notes',
      'Trailer Walk Around',
      'Trailer Lights Working',
      'Trailer Safety Chains',
      'Trailer Ramp Secure',
      'Trailer Coupler Secure',
      'Trailer Notes',
      'Chemical Storage',
      'Containers Labeled',
      'Locked Storage',
      'Gas Cans Secure',
      'Fire Extinguisher',
      'First Aid Kit',
      'Eye Wash Accessible',
      'Emergency Plan Posted',
      'Chemical Notes',
      'Safety Issue ASAP',
      'Safety Issue Description',
      'Additional Notes',
      'Google Photos Link'
    ];

    // Convert inspections to CSV rows
    const rows = filteredInspections.map(inspection => [
      formatDate(inspection.inspection_date),
      inspection.inspected_by || '',
      getBranchDisplay(inspection.crew_branch) || '',
      inspection.crew_observed || '',
      getDepartmentDisplay(inspection.department) || '',
      inspection.safety_cones || '',
      inspection.ladders_placed_secured || '',
      inspection.ladder_labels_visible || '',
      inspection.ladders_used_correctly || '',
      inspection.ladder_notes || '',
      inspection.ppe_eye_protection || '',
      inspection.ppe_hearing_protection || '',
      inspection.ppe_hand_protection || '',
      inspection.ppe_foot_protection || '',
      inspection.ppe_head_protection || '',
      inspection.ppe_notes || '',
      inspection.mowers_condition || '',
      inspection.blowers_condition || '',
      inspection.trimmers_condition || '',
      inspection.chain_saws_condition || '',
      inspection.pole_saws_condition || '',
      inspection.hedge_trimmers_condition || '',
      inspection.tools_maintained || '',
      inspection.tools_notes || '',
      inspection.vehicle_clean_organized || '',
      inspection.decals_visible || '',
      inspection.walk_around_complete || '',
      inspection.fluids_topped || '',
      inspection.dash_lights_clear || '',
      inspection.vehicle_notes || '',
      inspection.trailer_walk_around || '',
      inspection.trailer_lights_working || '',
      inspection.trailer_safety_chains || '',
      inspection.trailer_ramp_secure || '',
      inspection.trailer_coupler_secure || '',
      inspection.trailer_notes || '',
      inspection.chemical_storage || '',
      inspection.containers_labeled || '',
      inspection.locked_storage || '',
      inspection.gas_cans_secure || '',
      inspection.fire_extinguisher || '',
      inspection.first_aid_kit || '',
      inspection.eye_wash_accessible || '',
      inspection.emergency_plan_posted || '',
      inspection.chemical_notes || '',
      inspection.safety_issue_asap || '',
      inspection.safety_issue_description || '',
      inspection.additional_notes || '',
      inspection.google_photos_link || ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `crew_inspections_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDepartmentDisplay = (dept) => {
    const deptMap = {
      // Lowercase versions (legacy)
      'arbor': 'Arbor',
      'enhancements': 'Enhancements',
      'irrigation': 'Irrigation',
      'maintenance': 'Maintenance',
      'maintenance-onsite': 'Maintenance Onsite',
      'overhead': 'Overhead',
      'spray-phc': 'Spray / PHC',
      'construction': 'Construction',
      'tree-care': 'Tree Care',
      'spray': 'Spray',
      'lighting': 'Lighting',
      'water-features': 'Water Features',
      'admin': 'Admin',
      // Capitalized versions (new format)
      'Arbor': 'Arbor',
      'Enhancements': 'Enhancements',
      'Irrigation': 'Irrigation',
      'Maintenance': 'Maintenance',
      'Maintenance Onsite': 'Maintenance Onsite',
      'Overhead': 'Overhead',
      'Spray / PHC': 'Spray / PHC',
      'Construction': 'Construction',
      'Tree Care': 'Tree Care',
      'Spray': 'Spray',
      'Lighting': 'Lighting',
      'Water Features': 'Water Features',
      'Admin': 'Admin'
    };
    return deptMap[dept] || dept;
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
      'needs-attention': 'bg-orange-100 text-orange-800',
      'needs service': 'bg-yellow-100 text-yellow-800',
      'na': 'bg-gray-100 text-gray-800',
      'need': 'bg-yellow-100 text-yellow-800'
    };
    
    const colorClass = badgeMap[value] || 'bg-gray-100 text-gray-800';
    const displayText = value ? value.replace(/-/g, ' ').toUpperCase() : 'N/A';
    
    return <span className={`px-2 py-1 text-xs font-semibold rounded ${colorClass}`}>{displayText}</span>;
  };

  const getSafetyBadge = (value) => {
    const colorClass = value === 'yes' 
      ? 'bg-red-100 text-red-800 border-red-300' 
      : 'bg-green-100 text-green-800 border-green-300';
    const displayText = value === 'yes' ? '⚠️ Alert' : '✓ OK';
    
    return <span className={`px-2 py-1 text-xs font-semibold rounded border ${colorClass}`}>{displayText}</span>;
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

  const handleGateCheckSort = (field) => {
    if (gateCheckSortField === field) {
      // Toggle direction if clicking the same field
      setGateCheckSortDirection(gateCheckSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setGateCheckSortField(field);
      setGateCheckSortDirection('asc');
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
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      inspection.inspected_by?.toLowerCase().includes(searchLower) ||
      inspection.department?.toLowerCase().includes(searchLower) ||
      inspection.crew_observed?.toLowerCase().includes(searchLower) ||
      inspection.crew_branch?.toLowerCase().includes(searchLower) ||
      getBranchDisplay(inspection.crew_branch)?.toLowerCase().includes(searchLower) ||
      getDepartmentDisplay(inspection.department)?.toLowerCase().includes(searchLower);
    
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

  // Filter gate-checks based on all filters (with normalized location matching)
  const filteredGateChecks = gateChecks.filter(gateCheck => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      gateCheck.inspected_by?.toLowerCase().includes(searchLower) ||
      gateCheck.division?.toLowerCase().includes(searchLower) ||
      gateCheck.crew_number?.toLowerCase().includes(searchLower) ||
      gateCheck.driver_name?.toLowerCase().includes(searchLower) ||
      gateCheck.location?.toLowerCase().includes(searchLower) ||
      getBranchDisplay(gateCheck.location)?.toLowerCase().includes(searchLower) ||
      getDepartmentDisplay(gateCheck.division)?.toLowerCase().includes(searchLower);
    
    // Normalize location for comparison (handles both old and new format)
    const normalizedGateCheckLocation = normalizeLocation(gateCheck.location);
    const matchesLocation = filterBranch === 'all' || normalizedGateCheckLocation === filterBranch;
    const matchesDivision = filterDepartment === 'all' || gateCheck.division === filterDepartment;
    const matchesInspector = filterInspector === 'all' || gateCheck.inspected_by === filterInspector;
    const matchesCrew = filterCrew === 'all' || gateCheck.crew_number === filterCrew;
    
    return matchesSearch && matchesLocation && matchesDivision && matchesInspector && matchesCrew;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (gateCheckSortField) {
      case 'inspection_date':
        aValue = new Date(a.inspection_date || 0);
        bValue = new Date(b.inspection_date || 0);
        break;
      case 'inspected_by':
        aValue = (a.inspected_by || '').toLowerCase();
        bValue = (b.inspected_by || '').toLowerCase();
        break;
      case 'location':
        aValue = getBranchDisplay(a.location || '').toLowerCase();
        bValue = getBranchDisplay(b.location || '').toLowerCase();
        break;
      case 'division':
        aValue = getDepartmentDisplay(a.division || '').toLowerCase();
        bValue = getDepartmentDisplay(b.division || '').toLowerCase();
        break;
      case 'crew_number':
        aValue = (a.crew_number || '').toLowerCase();
        bValue = (b.crew_number || '').toLowerCase();
        break;
      case 'driver_name':
        aValue = (a.driver_name || '').toLowerCase();
        bValue = (b.driver_name || '').toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return gateCheckSortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return gateCheckSortDirection === 'asc' ? 1 : -1;
    return 0;
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

  // Sort icon component (white icons for blue header)
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 inline-block ml-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 inline-block ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 inline-block ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Sort icon component for Gate-checks (white icons for blue header)
  const GateCheckSortIcon = ({ field }) => {
    if (gateCheckSortField !== field) {
      return (
        <svg className="w-4 h-4 inline-block ml-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (gateCheckSortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 inline-block ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 inline-block ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Details component
  const InspectionDetails = ({ inspection }) => (
    <div className="p-4 md:p-6 space-y-5 bg-gradient-to-br from-slate-50 to-blue-50/50 border-t border-slate-200">
      {/* Basic Info Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Branch</p>
              {getBranchBadge(inspection.crew_branch)}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Department</p>
              <p className="text-sm text-slate-800 font-medium">{getDepartmentDisplay(inspection.department)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Crew</p>
              <p className="text-sm text-slate-800 font-medium">{inspection.crew_observed}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Inspector</p>
              <p className="text-sm text-slate-800 font-medium">{inspection.inspected_by}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Safety Alert</p>
            {getSafetyBadge(inspection.safety_issue_asap)}
          </div>
        </div>
      </div>

      {/* Photos */}
      {inspection.google_photos_link && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              📸 Photos
            </h3>
          </div>
          <div className="p-4">
            <a 
              href={inspection.google_photos_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Photo Album
            </a>
          </div>
        </div>
      )}

      {/* Ladder Observation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2h3m7-7v8m0-8l3 3m-3-3l-3 3" />
            </svg>
            Ladder Observation
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Safety Cones</p>
              {getStatusBadge(inspection.safety_cones)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Placed & Secured</p>
              {getStatusBadge(inspection.ladders_placed_secured)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Labels Visible</p>
              {getStatusBadge(inspection.ladder_labels_visible)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Used Correctly</p>
              {getStatusBadge(inspection.ladders_used_correctly)}
            </div>
          </div>
          {inspection.ladder_notes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-1">📝 Notes:</p>
              <p className="text-sm text-amber-800">{inspection.ladder_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* PPE Compliance */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            PPE Compliance
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Eye Protection</p>
              {getStatusBadge(inspection.ppe_eye_protection)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Hearing Protection</p>
              {getStatusBadge(inspection.ppe_hearing_protection)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Hand Protection</p>
              {getStatusBadge(inspection.ppe_hand_protection)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Foot Protection</p>
              {getStatusBadge(inspection.ppe_foot_protection)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Head Protection</p>
              {getStatusBadge(inspection.ppe_head_protection)}
            </div>
          </div>
          {inspection.ppe_notes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-1">📝 Notes:</p>
              <p className="text-sm text-amber-800">{inspection.ppe_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tools & Equipment */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Tools & Equipment
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Mowers</p>
              {getStatusBadge(inspection.mowers_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Blowers</p>
              {getStatusBadge(inspection.blowers_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Edger</p>
              {getStatusBadge(inspection.edger_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Hedge Trimmer</p>
              {getStatusBadge(inspection.hedge_trimmer_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Line Trimmer</p>
              {getStatusBadge(inspection.line_trimmer_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Gas Tanks</p>
              {getStatusBadge(inspection.gas_tanks_condition)}
            </div>
          </div>
          {inspection.tools_equipment_notes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-1">📝 Notes:</p>
              <p className="text-sm text-amber-800">{inspection.tools_equipment_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Emergency Equipment */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Vehicle Emergency Equipment
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Fire Extinguisher</p>
              {getStatusBadge(inspection.fire_extinguisher_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">First Aid Kit</p>
              {getStatusBadge(inspection.first_aid_kit_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Water Jug</p>
              {getStatusBadge(inspection.water_jug_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Warning Triangle</p>
              {getStatusBadge(inspection.warning_triangle_condition)}
            </div>
          </div>
          {inspection.emergency_equipment_notes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-1">📝 Notes:</p>
              <p className="text-sm text-amber-800">{inspection.emergency_equipment_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Inspection */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Vehicle Inspection
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Dash Clean</p>
              {getStatusBadge(inspection.dash_clean)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Tire Condition</p>
              {getStatusBadge(inspection.tire_condition)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Truck Clean</p>
              {getStatusBadge(inspection.truck_clean)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Tarp Working</p>
              {getStatusBadge(inspection.tarp_working)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Inside Condition</p>
              {getStatusBadge(inspection.inside_vehicle_condition)}
            </div>
          </div>
          {inspection.vehicle_notes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-1">📝 Notes:</p>
              <p className="text-sm text-amber-800">{inspection.vehicle_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Inspection */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Trailer Inspection
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Connection</p>
              {getStatusBadge(inspection.trailer_connection)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Brake Away</p>
              {getStatusBadge(inspection.trailer_brake_away)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Chains</p>
              {getStatusBadge(inspection.trailer_chains)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Lock Pin</p>
              {getStatusBadge(inspection.trailer_lock_pin)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Tires</p>
              {getStatusBadge(inspection.trailer_tires)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Secured</p>
              {getStatusBadge(inspection.trailer_secured)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Cleanliness</p>
              {getStatusBadge(inspection.trailer_cleanliness)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Spare Tire</p>
              {getStatusBadge(inspection.spare_tire)}
            </div>
          </div>
          {inspection.trailer_notes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-1">📝 Notes:</p>
              <p className="text-sm text-amber-800">{inspection.trailer_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chemical Storage */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Chemical Storage
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Properly Stored</p>
              {getStatusBadge(inspection.chemicals_stored_properly)}
            </div>
            {inspection.chemical_issues && inspection.chemical_issues.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <p className="text-xs text-orange-600 font-semibold mb-2">Issues Found:</p>
                <div className="flex flex-wrap gap-1">
                  {inspection.chemical_issues.map((issue, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Notes & Safety Issues */}
      {(inspection.additional_notes || inspection.immediate_safety_issues || inspection.follow_up_date) && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Additional Information
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {inspection.additional_notes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 mb-1">📝 Additional Notes:</p>
                <p className="text-sm text-amber-800">{inspection.additional_notes}</p>
              </div>
            )}
            {inspection.immediate_safety_issues && (
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Immediate Safety Issues:</p>
                <p className="text-sm text-red-800 font-medium">{inspection.immediate_safety_issues}</p>
              </div>
            )}
            {inspection.follow_up_date && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-700 mb-1">📅 Follow-Up Date:</p>
                <p className="text-sm text-blue-800 font-medium">{formatDate(inspection.follow_up_date)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-400 break-all">
          Report ID: {inspection.id} • Created: {formatDateTime(inspection.created_at)}
        </p>
      </div>
    </div>
  );

  // Gate Check Details component
  const GateCheckDetails = ({ gateCheck }) => (
    <div className="p-4 md:p-6 space-y-5 bg-gradient-to-br from-slate-50 to-blue-50/50 border-t border-slate-200">
      {/* Basic Info Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Location</p>
              {getBranchBadge(gateCheck.location)}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Division</p>
              <p className="text-sm text-slate-800 font-medium">{getDepartmentDisplay(gateCheck.division)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Crew Number</p>
              <p className="text-sm text-slate-800 font-medium">{gateCheck.crew_number}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Driver</p>
              <p className="text-sm text-slate-800 font-medium">{gateCheck.driver_name}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Inspector</p>
              <p className="text-sm text-slate-800 font-medium">{gateCheck.inspected_by}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Email</p>
              <p className="text-sm text-slate-800 font-medium break-all">{gateCheck.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PPE Verification */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            PPE Verification
          </h3>
        </div>
        <div className="p-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">All Employees Have PPE</p>
            {getStatusBadge(gateCheck.all_employees_have_ppe)}
          </div>
        </div>
      </div>

      {/* Vehicle Condition */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Vehicle Condition
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Lights Working</p>
              {getStatusBadge(gateCheck.lights_working)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Mirrors Intact</p>
              {getStatusBadge(gateCheck.mirrors_intact)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">License Plate Visible</p>
              {getStatusBadge(gateCheck.license_plate_visible)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Registration/Insurance</p>
              {getStatusBadge(gateCheck.registration_insurance_card)}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer and Equipment */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Trailer and Equipment
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Load Secured</p>
              {getStatusBadge(gateCheck.load_secured)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Trimmer Racks Locked</p>
              {getStatusBadge(gateCheck.trimmer_racks_locked)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Safety Pins in Place</p>
              {getStatusBadge(gateCheck.safety_pins_in_place)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Tires Inflated</p>
              {getStatusBadge(gateCheck.tires_inflated)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Spare Tire Available</p>
              {getStatusBadge(gateCheck.spare_tire_available)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Chemical Labeled & Secured</p>
              {getStatusBadge(gateCheck.chemical_labeled_secured)}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Equipment */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Safety Equipment
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">5 Safety Cones</p>
              {getStatusBadge(gateCheck.five_safety_cones)}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">First Aid Kit / Fire Extinguisher</p>
              {getStatusBadge(gateCheck.first_aid_kit_fire_extinguisher)}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Items */}
      {gateCheck.additional_items && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Additional Suggestions
            </h3>
          </div>
          <div className="p-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">{gateCheck.additional_items}</p>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-400 break-all">
          Report ID: {gateCheck.id} • Created: {formatDateTime(gateCheck.created_at)}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-emerald-500 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Data</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={fetchInspections}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 md:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          title="Safety & Facilities Reports"
          icon={FileText}
        />

        {/* View Toggle and New Button Container - Modern Card */}
        <div className="relative mb-6 md:mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-70" />
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500" />
            <div className="p-4 md:p-6">
              {/* View Toggle - Modern Segmented Control */}
              <div className="flex justify-center mb-5">
                <div className="inline-flex rounded-xl bg-slate-100/80 p-1.5 border border-slate-200/50">
                  <button
                    onClick={() => setActiveView('inspections')}
                    className={`px-5 md:px-8 py-2.5 text-sm md:text-base font-semibold rounded-lg transition-all duration-200 ${
                      activeView === 'inspections'
                        ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Crew Inspections
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveView('gatechecks')}
                    className={`px-5 md:px-8 py-2.5 text-sm md:text-base font-semibold rounded-lg transition-all duration-200 ${
                      activeView === 'gatechecks'
                        ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      Gate-checks
                    </span>
                  </button>
                </div>
              </div>

              {/* New Button */}
              <div className="flex justify-center">
                <Link
                  href={activeView === 'inspections' ? '/inspection' : '/gatechecks'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  {activeView === 'inspections' ? 'New Inspection' : 'New Gate Check'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section - Modern Card */}
        <div className="relative mb-4 md:mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
            <div className="p-4 md:p-6">
              {activeView === 'inspections' ? (
                <>
                  {/* Inspection Filters */}
                  <div className="flex flex-col gap-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/25">
                          <Filter className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {filteredInspections.length} {filteredInspections.length === 1 ? 'report' : 'reports'}
                          </h3>
                          <p className="text-xs text-slate-500">Filter results below</p>
                        </div>
                      </div>
                      <button
                        onClick={exportToCSV}
                        disabled={filteredInspections.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Inspector, Department, or Crew..."
                        className="w-full pl-12 pr-4 py-3 text-sm md:text-base bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Filter Dropdowns Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                      <div className="relative">
                        <select
                          value={filterBranch}
                          onChange={(e) => setFilterBranch(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Branches</option>
                          <option value="phx-north">Phx - North</option>
                          <option value="phx-southwest">Phx - SouthWest</option>
                          <option value="phx-southeast">Phx - SouthEast</option>
                          <option value="las-vegas">Las Vegas</option>
                          <option value="corporate">Corporate</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Departments</option>
                          {uniqueDepartments.sort().map((dept) => (
                            <option key={dept} value={dept}>
                              {getDepartmentDisplay(dept)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select
                          value={filterCrew}
                          onChange={(e) => setFilterCrew(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Crews</option>
                          {uniqueCrews.sort().map((crew) => (
                            <option key={crew} value={crew}>
                              {crew}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select
                          value={filterInspector}
                          onChange={(e) => setFilterInspector(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Inspectors</option>
                          {uniqueInspectors.sort().map((inspector) => (
                            <option key={inspector} value={inspector}>
                              {inspector}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select
                          value={filterSafetyAlert}
                          onChange={(e) => setFilterSafetyAlert(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Safety Alerts</option>
                          <option value="yes">⚠️ Yes - Alert</option>
                          <option value="no">✓ No Alert</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Gate-Check Filters */}
                  <div className="flex flex-col gap-4">
                    {/* Header Row */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/25">
                        <Filter className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {filteredGateChecks.length} {filteredGateChecks.length === 1 ? 'gate check' : 'gate checks'}
                        </h3>
                        <p className="text-xs text-slate-500">Filter results below</p>
                      </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Inspector, Driver, Division, or Crew..."
                        className="w-full pl-12 pr-4 py-3 text-sm md:text-base bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Filter Dropdowns Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                      <div className="relative">
                        <select
                          value={filterBranch}
                          onChange={(e) => setFilterBranch(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Locations</option>
                          <option value="phx-north">Phx - North</option>
                          <option value="phx-southwest">Phx - SouthWest</option>
                          <option value="phx-southeast">Phx - SouthEast</option>
                          <option value="las-vegas">Las Vegas</option>
                          <option value="corporate">Corporate</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Divisions</option>
                          {uniqueGateCheckDivisions.sort().map((div) => (
                            <option key={div} value={div}>
                              {getDepartmentDisplay(div)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select
                          value={filterCrew}
                          onChange={(e) => setFilterCrew(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Crews</option>
                          {uniqueGateCheckCrews.sort().map((crew) => (
                            <option key={crew} value={crew}>
                              {crew}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select
                          value={filterInspector}
                          onChange={(e) => setFilterInspector(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="all">All Inspectors</option>
                          {uniqueGateCheckInspectors.sort().map((inspector) => (
                            <option key={inspector} value={inspector}>
                              {inspector}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Display Gate Checks */}
        {activeView === 'gatechecks' && (
          <>
            {/* No Results */}
            {filteredGateChecks.length === 0 ? (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/5 to-slate-500/5 rounded-2xl blur-xl" />
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardCheck className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-base md:text-lg mb-4">No gate checks found.</p>
                  <Link
                    href="/gatechecks"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Gate Check
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile Card View (shown on screens < 768px) */}
                <div className="md:hidden space-y-3">
                  {filteredGateChecks.map((gateCheck) => (
                    <div key={gateCheck.id} className={`rounded-xl shadow-lg border overflow-hidden ${
                      hasNoResponses(gateCheck) ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'
                    }`}>
                      <div
                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                          hasNoResponses(gateCheck) ? 'active:bg-red-100' : 'active:bg-slate-50'
                        }`}
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
                            <div className="ml-2 flex-shrink-0">
                              <GateCheckAlerts gateCheck={gateCheck} />
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
                <div className="hidden md:block bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                        <tr>
                          <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase w-12"></th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleGateCheckSort('inspection_date')}
                          >
                            Date <GateCheckSortIcon field="inspection_date" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleGateCheckSort('inspected_by')}
                          >
                            Inspector <GateCheckSortIcon field="inspected_by" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleGateCheckSort('location')}
                          >
                            Location <GateCheckSortIcon field="location" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleGateCheckSort('division')}
                          >
                            Division <GateCheckSortIcon field="division" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleGateCheckSort('crew_number')}
                          >
                            Crew # <GateCheckSortIcon field="crew_number" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleGateCheckSort('driver_name')}
                          >
                            Driver <GateCheckSortIcon field="driver_name" />
                          </th>
                          <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase">
                            Alerts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGateChecks.map((gateCheck, index) => [
                          <tr 
                            key={gateCheck.id}
                            className={`transition-colors cursor-pointer border-b border-slate-100 ${
                              hasNoResponses(gateCheck) 
                                ? 'bg-red-50 hover:bg-red-100' 
                                : `hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`
                            }`}
                            onClick={() => toggleGateCheck(gateCheck.id)}
                          >
                            <td className="px-4 py-3 text-center">
                              <button className="text-slate-600 hover:text-slate-800 transition-colors">
                                <ChevronIcon isExpanded={expandedGateCheckId === gateCheck.id} />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">{formatDate(gateCheck.inspection_date)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{gateCheck.inspected_by}</td>
                            <td className="px-4 py-3">{getBranchBadge(gateCheck.location)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{getDepartmentDisplay(gateCheck.division)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{gateCheck.crew_number}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{gateCheck.driver_name}</td>
                            <td className="px-4 py-3 text-center">
                              <GateCheckAlerts gateCheck={gateCheck} />
                            </td>
                          </tr>,
                          expandedGateCheckId === gateCheck.id && (
                            <tr key={`${gateCheck.id}-details`}>
                              <td colSpan="8" className="p-0">
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
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/5 to-slate-500/5 rounded-2xl blur-xl" />
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-base md:text-lg mb-4">No inspections found.</p>
                  <Link
                    href="/inspection"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Inspection
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile Card View (shown on screens < 768px) */}
                <div className="md:hidden space-y-3">
                  {filteredInspections.map((inspection) => (
                    <div key={inspection.id} className={`rounded-xl shadow-lg border overflow-hidden ${
                      inspection.safety_issue_asap === 'yes' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-white border-slate-100'
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
                <div className="hidden md:block bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                        <tr>
                          <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase w-12"></th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleSort('inspection_date')}
                          >
                            Date <SortIcon field="inspection_date" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleSort('inspected_by')}
                          >
                            Inspector <SortIcon field="inspected_by" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleSort('crew_branch')}
                          >
                            Branch <SortIcon field="crew_branch" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleSort('department')}
                          >
                            Department <SortIcon field="department" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleSort('crew_observed')}
                          >
                            Crew <SortIcon field="crew_observed" />
                          </th>
                          <th 
                            className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase cursor-pointer hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleSort('safety_issue_asap')}
                          >
                            Safety Alert <SortIcon field="safety_issue_asap" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInspections.map((inspection, index) => [
                          <tr 
                            key={inspection.id}
                            className={`transition-colors cursor-pointer border-b border-slate-100 ${
                              inspection.safety_issue_asap === 'yes' 
                                ? 'bg-red-50 hover:bg-red-100' 
                                : `hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-emerald-500 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <ReportsPageContent />
    </Suspense>
  );
}