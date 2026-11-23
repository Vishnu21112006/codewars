import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Info,
  CalendarCheck,
  Building2,
  ShieldCheck,
  Send,
  Zap,
  MapPin,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { useLabLink } from '../context/LabLinkContext';
import { equipmentApi, bookingApi } from '../api/client';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input, { Select } from '../components/Input';
import { LoadingState, ErrorState } from '../components/LoadingState';

export const EquipmentList = () => {
  const navigate = useNavigate();
  const {
    equipmentList: fallbackEquipment,
    createBooking,
    projects,
    currentUser,
    getAlternatives: getLocalAlternatives
  } = useLabLink();

  // State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('connecting'); // 'api_live' | 'supabase_live' | 'local_demo_mesh'

  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedItem, setSelectedItem] = useState(null);
  const [alternativesList, setAlternativesList] = useState([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [bookingModalItem, setBookingModalItem] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Booking Form State
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('2026-11-25');
  const [bookingSlot, setBookingSlot] = useState('02:00 PM - 05:00 PM');
  const [justification, setJustification] = useState('');
  const [recommendedSlots, setRecommendedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch Recommended Slots when booking modal item or date changes
  useEffect(() => {
    if (bookingModalItem && bookingDate) {
      setLoadingSlots(true);
      bookingApi.getRecommendedSlots(bookingModalItem.id, bookingDate)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setRecommendedSlots(res.data);
          }
        })
        .catch(() => {
          const avail = bookingModalItem.availableUnits ?? bookingModalItem.available_units ?? 1;
          const total = bookingModalItem.totalUnits ?? bookingModalItem.total_units ?? 1;
          setRecommendedSlots([
            { slot_window: '09:00 AM - 12:00 PM', start_hour: 9, end_hour: 12, congestion_level: 'low', available_units: avail, total_units: total, is_recommended: true, reasoning: 'Low congestion: Morning optimal bench session' },
            { slot_window: '12:00 PM - 03:00 PM', start_hour: 12, end_hour: 15, congestion_level: 'moderate', available_units: avail, total_units: total, is_recommended: false, reasoning: 'Moderate load: Midday lab transition' },
            { slot_window: '02:00 PM - 05:00 PM', start_hour: 14, end_hour: 17, congestion_level: 'moderate', available_units: avail, total_units: total, is_recommended: true, reasoning: 'Recommended: Core capstone development window' },
            { slot_window: '05:30 PM - 08:30 PM', start_hour: 17, end_hour: 20, congestion_level: 'low', available_units: avail, total_units: total, is_recommended: true, reasoning: 'Low congestion: Quiet evening evaluation window' },
          ]);
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [bookingModalItem, bookingDate]);

  const departments = [
    { code: 'ALL', name: 'All Departments' },
    { code: 'CSE', name: 'Computer Science (CSE)' },
    { code: 'ECE', name: 'Electronics (ECE)' },
    { code: 'MECH', name: 'Mechanical & Robotics' },
    { code: 'CIVIL', name: 'Civil & Infrastructure' },
  ];

  const categories = [
    'ALL',
    'Raspberry Pi Kit',
    'Arduino Kit',
    'GPU Workstation',
    'IoT Sensor',
    'Robotics Kit',
    '3D Printer',
    'Oscilloscope',
    'Development Board',
  ];

  // Fetch from backend API with automatic fallback to context
  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedDept !== 'ALL') params.department = selectedDept;
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await equipmentApi.getAll(params);
      if (res.data && res.data.items) {
        setItems(res.data.items);
        setDataSource(res.data.data_source || 'api_live');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.warn('Backend API unreachable or offline, using robust local demo data:', err.message);
      // Clean local demo data fallback
      let localFiltered = [...fallbackEquipment];

      if (selectedDept !== 'ALL') {
        localFiltered = localFiltered.filter(
          (item) => item.department.toUpperCase() === selectedDept.toUpperCase()
        );
      }

      if (selectedCategory !== 'ALL') {
        localFiltered = localFiltered.filter(
          (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        localFiltered = localFiltered.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.model.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.lab.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query))
        );
      }

      setItems(localFiltered);
      setDataSource('local_demo_mesh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [selectedDept, selectedCategory, searchTerm]);

  // Load alternatives when an item is selected
  const handleOpenDetails = async (item) => {
    setSelectedItem(item);
    setLoadingAlternatives(true);

    try {
      const res = await equipmentApi.getAlternatives(item.id);
      if (res.data && res.data.length > 0) {
        setAlternativesList(res.data);
      } else {
        setAlternativesList(getLocalAlternatives(item.id));
      }
    } catch {
      setAlternativesList(getLocalAlternatives(item.id));
    } finally {
      setLoadingAlternatives(false);
    }
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!bookingModalItem) return;

    const matchedProject = projects.find((p) => p.id === selectedProjectId);

    createBooking({
      equipmentId: bookingModalItem.id,
      equipmentName: bookingModalItem.name,
      department: bookingModalItem.department,
      lab: `${bookingModalItem.lab} (${bookingModalItem.room})`,
      projectId: selectedProjectId,
      projectName: matchedProject?.title || 'Capstone Independent Research',
      date: bookingDate,
      timeSlot: bookingSlot,
      justification: justification || 'Necessary hardware station verification for upcoming milestone.',
      requiresApproval: bookingModalItem.requiresApproval ?? bookingModalItem.requires_approval,
      facultyMentor: (bookingModalItem.inCharge || bookingModalItem.in_charge || 'Dr. Aris Thorne').split('(')[0].trim(),
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalItem(null);
      setJustification('');
      navigate('/my-reservations');
    }, 1500);
  };

  const handleResetFilters = () => {
    setSelectedDept('ALL');
    setSelectedCategory('ALL');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Specialized <span className="text-gradient">Equipment Discovery</span>
            </h1>
            <Badge
              variant={dataSource === 'supabase_live' ? 'emerald' : 'cyan'}
              size="sm"
              dot
            >
              {dataSource === 'supabase_live' ? 'Supabase Live' : 'Demo Mesh Active'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Search and reserve lab resources across CSE, ECE, Mechanical, and Civil departments.
          </p>
        </div>

        {/* Global Search Filter */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by equipment, model or lab location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 backdrop-blur-md"
            />
          </div>
          <Button
            variant="glass"
            size="sm"
            icon={RefreshCw}
            onClick={fetchEquipment}
            title="Refresh Catalog"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="space-y-3">
        {/* Department Tabs: CSE, ECE, Mechanical, Civil */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {departments.map((dept) => (
            <button
              key={dept.code}
              onClick={() => setSelectedDept(dept.code)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 ${
                selectedDept === dept.code
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Category Pills: Raspberry Pi, Arduino, GPU, IoT, Robotics, 3D Printer, Oscilloscope, Dev Board */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-[11px]">
          <span className="text-slate-500 font-semibold uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg border transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-medium'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* States: Loading, Error, Empty, and Success Grid */}
      {loading ? (
        <LoadingState message="Discovering campus laboratory equipment..." />
      ) : error ? (
        <ErrorState
          title="Equipment Mesh Offline"
          message={error}
          onRetry={fetchEquipment}
        />
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Matching Equipment Found</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              No hardware matches "{searchTerm}" in {selectedDept === 'ALL' ? 'any department' : selectedDept}.
              Try loosening your filters or resetting the catalog.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        /* Equipment Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isAvailable = (item.availableUnits ?? item.available_units ?? 0) > 0 && item.status === 'available';
            const availableCount = item.availableUnits ?? item.available_units ?? 0;
            const totalCount = item.totalUnits ?? item.total_units ?? 1;
            const specs = item.specifications || item.specs || {};

            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl overflow-hidden hover:border-slate-700 hover:bg-slate-900/70 hover:shadow-glow-blue/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image & Header Overlay */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image || item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge variant="cyan" size="sm">
                        {item.department}
                      </Badge>
                      <span className="text-[10px] font-mono bg-navy-950/80 backdrop-blur-md px-2 py-0.5 rounded-full text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={isAvailable ? 'emerald' : 'rose'}
                        size="sm"
                        dot
                      >
                        {isAvailable ? `${availableCount} / ${totalCount} Free` : 'Currently In Use'}
                      </Badge>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="font-mono text-cyan-300 font-semibold truncate">
                        Model: {item.model || item.model_number}
                      </span>
                      <span className="text-slate-400">{item.hourlyRate || item.hourly_rate || 'Free'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Laboratory Location */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span className="truncate">{item.lab}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Room Location: {item.room}</span>
                      </div>
                    </div>

                    {/* Key Specifications Grid */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        Specifications Summary
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {Object.entries(specs).slice(0, 2).map(([key, val]) => (
                          <div
                            key={key}
                            className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800 truncate"
                          >
                            <span className="text-slate-500 block text-[9px] truncate">{key}</span>
                            <span className="text-slate-200 font-medium truncate block">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 flex items-center gap-2">
                  <Button
                    variant="glass"
                    size="sm"
                    className="flex-1"
                    icon={Info}
                    onClick={() => handleOpenDetails(item)}
                  >
                    View Details
                  </Button>

                  {isAvailable ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      icon={CalendarCheck}
                      onClick={() => setBookingModalItem(item)}
                    >
                      Book Equipment
                    </Button>
                  ) : (
                    <Button
                      variant="glass"
                      size="sm"
                      className="flex-1 text-amber-400 border-amber-500/40 hover:bg-amber-950/30 text-xs"
                      icon={Sparkles}
                      onClick={() => handleOpenDetails(item)}
                    >
                      View Alternatives
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Specifications & Alternative Equipment Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.name}
          subtitle={`Department of ${selectedItem.department} • Room ${selectedItem.room}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={selectedItem.image || selectedItem.image_url}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                <div>
                  <Badge variant="cyan" size="sm">
                    {selectedItem.category}
                  </Badge>
                  <p className="text-xs font-mono text-slate-300 mt-1">
                    Model: {selectedItem.model || selectedItem.model_number}
                  </p>
                </div>
                <Badge
                  variant={
                    (selectedItem.availableUnits ?? selectedItem.available_units ?? 0) > 0 &&
                    selectedItem.status === 'available'
                      ? 'emerald'
                      : 'rose'
                  }
                  size="md"
                >
                  {(selectedItem.availableUnits ?? selectedItem.available_units ?? 0) > 0 &&
                  selectedItem.status === 'available'
                    ? `${selectedItem.availableUnits ?? selectedItem.available_units} of ${selectedItem.totalUnits ?? selectedItem.total_units} Units Free`
                    : 'Currently In Use'}
                </Badge>
              </div>
            </div>

            {/* Description */}
            {selectedItem.description && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {selectedItem.description}
              </p>
            )}

            {/* Full Specifications */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                Technical Specifications & Architecture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedItem.specifications || selectedItem.specs || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col"
                  >
                    <span className="text-slate-400 text-[11px]">{key}</span>
                    <span className="font-semibold text-white mt-0.5">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & In-charge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold uppercase">
                  Laboratory Facility
                </span>
                <p className="font-medium text-white">{selectedItem.lab}</p>
                <p className="text-slate-400 text-[11px]">Room Location: {selectedItem.room}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold uppercase">
                  Faculty In-Charge & Access
                </span>
                <p className="font-medium text-emerald-400">
                  {selectedItem.inCharge || selectedItem.in_charge || 'Dr. Aris Thorne'}
                </p>
                <p className="text-slate-400 text-[11px]">
                  Policy: {selectedItem.requiresApproval ?? selectedItem.requires_approval ? 'Requires Mentor Clearance' : 'Direct Self-Service'}
                </p>
              </div>
            </div>

            {/* Safety Protocol */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Safety Protocol & Handling Standards
              </h4>
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{selectedItem.safetyGuidelines || selectedItem.safety_guidelines}</span>
              </div>
            </div>

            {/* ALTERNATIVE EQUIPMENT RECOMMENDATION SECTION */}
            {((selectedItem.availableUnits ?? selectedItem.available_units ?? 0) === 0 ||
              selectedItem.status !== 'available' ||
              alternativesList.length > 0) && (
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Alternative Available Equipment in this Discipline
                    </h4>
                  </div>
                  <Badge variant="cyan" size="sm">
                    {alternativesList.length} Alternatives Ready
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alternativesList.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all text-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="violet" size="sm">
                            {alt.department}
                          </Badge>
                          <Badge variant="emerald" size="sm">
                            {alt.availableUnits ?? alt.available_units} Free
                          </Badge>
                        </div>
                        <h5 className="font-bold text-white text-xs mt-1 line-clamp-1">
                          {alt.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {alt.lab} ({alt.room})
                        </p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-cyan-400">
                          {alt.category}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-[11px] py-1 px-2.5"
                          icon={CalendarCheck}
                          onClick={() => {
                            setSelectedItem(null);
                            setBookingModalItem(alt);
                          }}
                        >
                          Reserve Alternative
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <Button variant="glass" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              {((selectedItem.availableUnits ?? selectedItem.available_units ?? 0) > 0 &&
                selectedItem.status === 'available') && (
                <Button
                  variant="primary"
                  icon={CalendarCheck}
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    setBookingModalItem(item);
                  }}
                >
                  Reserve This Equipment
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Book Equipment Modal */}
      {bookingModalItem && (
        <Modal
          isOpen={!!bookingModalItem}
          onClose={() => setBookingModalItem(null)}
          title={`Reserve: ${bookingModalItem.name}`}
          subtitle={`Department of ${bookingModalItem.department} • Room ${bookingModalItem.room}`}
        >
          {bookingSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Booking Request Dispatched!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your reservation has been recorded in the mesh and submitted into the faculty clearance queue. Redirecting to your passes...
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <Select
                label="Associate With Student Project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                options={projects.map((p) => ({
                  value: p.id,
                  label: `${p.title.slice(0, 50)}... (${p.priority.toUpperCase()})`,
                }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Target Date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
                <Select
                  label="Time Slot Window"
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  options={[
                    { value: '09:00 AM - 12:00 PM', label: '09:00 AM - 12:00 PM (Morning Slot)' },
                    { value: '12:00 PM - 03:00 PM', label: '12:00 PM - 03:00 PM (Midday Slot)' },
                    { value: '02:00 PM - 05:00 PM', label: '02:00 PM - 05:00 PM (Afternoon Slot)' },
                    { value: '05:30 PM - 08:30 PM', label: '05:30 PM - 08:30 PM (Evening Research)' },
                  ]}
                />
              </div>

              {/* Recommended Equipment Slots Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Recommended Equipment Slots
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {loadingSlots ? 'Computing capacity...' : 'Click slot to auto-fill'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedSlots.map((slot, idx) => {
                    const isSelected = bookingSlot === slot.slot_window;
                    return (
                      <div
                        key={idx}
                        onClick={() => setBookingSlot(slot.slot_window)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-950/60 to-violet-950/60 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                            {slot.slot_window}
                          </span>
                          {slot.is_recommended && (
                            <Badge variant="cyan" size="sm">
                              <Sparkles className="w-3 h-3 mr-0.5 inline" />
                              Best Fit
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="capitalize flex items-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                slot.congestion_level === 'low'
                                  ? 'bg-emerald-400'
                                  : slot.congestion_level === 'moderate'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                            />
                            {slot.congestion_level} load
                          </span>
                          <span className="font-mono text-slate-300">
                            {slot.available_units} / {slot.total_units} Free
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                          {slot.reasoning}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Milestone Justification & Experiment Description
                </label>
                <textarea
                  rows={3}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Describe the test, testbench or synthesis step you will perform on this unit..."
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-violet-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-violet-400" />
                <span>
                  <strong>AI Resource Fairness:</strong> Google OR-Tools constraint solver will verify scheduling bounds and ensure fair priority allocation.
                </span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <Button variant="glass" type="button" onClick={() => setBookingModalItem(null)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" icon={Send}>
                  Submit Reservation Request
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default EquipmentList;
