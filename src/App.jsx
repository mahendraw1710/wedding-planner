import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  CheckCircle, 
  Circle, 
  Users, 
  DollarSign, 
  Plus, 
  Trash2, 
  Calendar, 
  PieChart,
  Edit3,
  X,
  Save,
  Wallet,
  TrendingUp,
  Target
} from 'lucide-react';

// --- Komponen Utilitas ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#E8F0E0] p-6 hover:shadow-md transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "" }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 text-sm justify-center";
  const variants = {
    primary: "bg-[#AECB94] hover:bg-[#9AB882] text-white shadow-sm hover:shadow-md",
    secondary: "bg-[#F4F9F0] hover:bg-[#E2EED9] text-[#6A8A50]",
    outline: "border border-[#AECB94] text-[#6A8A50] hover:bg-[#F4F9F0]",
    danger: "text-red-400 hover:bg-red-50 p-2 rounded-lg",
    icon: "p-2 rounded-full hover:bg-[#F4F9F0] text-[#829C66]",
    iconPrimary: "p-2 rounded-full bg-[#AECB94] hover:bg-[#9AB882] text-white shadow-sm",
    iconDanger: "p-2 rounded-full text-red-400 hover:bg-red-50"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const SectionHeader = ({ title, icon: Icon, subtitle }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-1">
      <div className="p-2 bg-[#E6F0DC] rounded-lg">
        <Icon className="w-5 h-5 text-[#6A8A50]" />
      </div>
      <h2 className="text-xl font-serif font-bold text-[#4A5D3B]">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-[#829C66] ml-11">{subtitle}</p>}
  </div>
);

// --- Komponen Utama Aplikasi ---

export default function App() {
  // State Navigasi Halaman
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'savings'

  // --- STATE DASHBOARD ---
  const [tasks, setTasks] = useState([
    { id: 1, text: "Booking Gedung Resepsi", completed: true },
    { id: 2, text: "Fitting Baju Pengantin", completed: false },
    { id: 3, text: "Meeting dengan Vendor Katering", completed: false },
    { id: 4, text: "Cetak Undangan", completed: false },
  ]);

  const [guests, setGuests] = useState([
    { id: 1, name: "Budi Santoso & Keluarga", pax: 2, status: "Hadir" },
    { id: 2, name: "Siti Aminah", pax: 1, status: "Pending" },
    { id: 3, name: "Keluarga Besar Paman Andi", pax: 4, status: "Hadir" },
  ]);

  const [budgetItems, setBudgetItems] = useState([
    { id: 1, category: "Venue", item: "Sewa Gedung", estimated: 15000000, actual: 15000000 },
    { id: 2, category: "Katering", item: "Buffet 300 Pax", estimated: 30000000, actual: 0 },
    { id: 3, category: "Dekorasi", item: "Pelaminan & Bunga", estimated: 8000000, actual: 8500000 },
  ]);

  // --- STATE TABUNGAN (NEW) ---
  const [savings, setSavings] = useState([
    { id: 1, date: "2024-01-25", source: "Gaji Bulanan", amount: 5000000, note: "Tabungan awal" },
    { id: 2, date: "2024-02-10", source: "Bonus Kantor", amount: 2500000, note: "Bonus project" },
  ]);
  
  const [newSaving, setNewSaving] = useState({ date: "", source: "", amount: "", note: "" });
  const [editingSavingId, setEditingSavingId] = useState(null);
  const [editSavingData, setEditSavingData] = useState({ date: "", source: "", amount: "", note: "" });

  // State Input Dashboard
  const [newTask, setNewTask] = useState("");
  const [newGuest, setNewGuest] = useState({ name: "", pax: 1 });
  const [newBudget, setNewBudget] = useState({ item: "", estimated: 0, actual: 0 });

  // State Editing Dashboard
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [editGuestData, setEditGuestData] = useState({ name: "", pax: 1 });
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [editBudgetData, setEditBudgetData] = useState({ item: "", estimated: 0, actual: 0 });

  // --- LOGIC & STATISTIK ---
  const stats = useMemo(() => {
    const totalBudget = budgetItems.reduce((acc, curr) => acc + Number(curr.estimated), 0);
    const usedBudget = budgetItems.reduce((acc, curr) => acc + Number(curr.actual), 0);
    const confirmedGuests = guests.filter(g => g.status === 'Hadir').reduce((acc, curr) => acc + curr.pax, 0);
    const completedTasks = tasks.filter(t => t.completed).length;
    const progress = Math.round((completedTasks / tasks.length) * 100) || 0;
    
    // Statistik Tabungan
    const totalSaved = savings.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const savingProgress = Math.round((totalSaved / totalBudget) * 100) || 0;
    const remainingTarget = Math.max(0, totalBudget - totalSaved);

    return { totalBudget, usedBudget, confirmedGuests, progress, totalSaved, savingProgress, remainingTarget };
  }, [budgetItems, guests, tasks, savings]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  // --- HANDLERS TABUNGAN ---
  const addSaving = () => {
    if (!newSaving.amount || !newSaving.source) return;
    setSavings([...savings, { 
      id: Date.now(), 
      date: newSaving.date || new Date().toISOString().split('T')[0],
      source: newSaving.source, 
      amount: parseInt(newSaving.amount),
      note: newSaving.note 
    }]);
    setNewSaving({ date: "", source: "", amount: "", note: "" });
  };

  const deleteSaving = (id) => {
    setSavings(savings.filter(s => s.id !== id));
  };

  const startEditSaving = (item) => {
    setEditingSavingId(item.id);
    setEditSavingData({ date: item.date, source: item.source, amount: item.amount, note: item.note });
  };

  const saveSavingEdit = () => {
    setSavings(savings.map(s => s.id === editingSavingId ? { 
      ...s, 
      date: editSavingData.date,
      source: editSavingData.source, 
      amount: parseInt(editSavingData.amount),
      note: editSavingData.note
    } : s));
    setEditingSavingId(null);
  };

  // --- HANDLERS DASHBOARD (Ringkas) ---
  const addTask = () => { if(newTask.trim()) { setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]); setNewTask(""); }};
  const toggleTask = (id) => { if(editingTaskId !== id) setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); };
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const saveTask = () => { setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, text: editTaskText } : t)); setEditingTaskId(null); };
  
  const addGuest = () => { if(newGuest.name.trim()) { setGuests([...guests, { id: Date.now(), name: newGuest.name, pax: parseInt(newGuest.pax), status: "Pending" }]); setNewGuest({ name: "", pax: 1 }); }};
  const deleteGuest = (id) => setGuests(guests.filter(g => g.id !== id));
  const toggleRSVP = (id) => { if(editingGuestId !== id) setGuests(guests.map(g => g.id === id ? { ...g, status: g.status === "Hadir" ? "Tidak Hadir" : g.status === "Tidak Hadir" ? "Pending" : "Hadir" } : g)); };
  const saveGuest = () => { setGuests(guests.map(g => g.id === editingGuestId ? { ...g, name: editGuestData.name, pax: parseInt(editGuestData.pax) } : g)); setEditingGuestId(null); };

  const addBudget = () => { if(newBudget.item.trim()) { setBudgetItems([...budgetItems, { id: Date.now(), category: "Lainnya", item: newBudget.item, estimated: Number(newBudget.estimated), actual: Number(newBudget.actual) }]); setNewBudget({ item: "", estimated: 0, actual: 0 }); }};
  const deleteBudget = (id) => setBudgetItems(budgetItems.filter(b => b.id !== id));
  const saveBudget = () => { setBudgetItems(budgetItems.map(b => b.id === editingBudgetId ? { ...b, item: editBudgetData.item, estimated: Number(editBudgetData.estimated), actual: Number(editBudgetData.actual) } : b)); setEditingBudgetId(null); };


  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A5D3B] font-sans selection:bg-[#D4E6C3]">
      
      {/* HEADER UTAMA */}
      <div className="bg-gradient-to-r from-[#F4F9F0] to-[#E6F0DC] pb-8 pt-8 px-6 shadow-sm border-b border-[#E8F0E0]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-white p-3 rounded-full shadow-md text-[#AECB94]">
               <Heart className="w-8 h-8 fill-current" />
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A5D3B] mb-2 tracking-wide">
            Our Wedding Planner
          </h1>
          <p className="text-[#829C66] font-medium text-lg italic mb-6">Menuju Hari Bahagia — 28 Desember 2025</p>

          {/* NAVIGASI TAB */}
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'dashboard' ? 'bg-[#AECB94] text-white shadow-md' : 'bg-white text-[#6A8A50] hover:bg-[#F4F9F0]'}`}
            >
              Dashboard & Rencana
            </button>
            <button 
              onClick={() => setActiveTab('savings')}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${activeTab === 'savings' ? 'bg-[#AECB94] text-white shadow-md' : 'bg-white text-[#6A8A50] hover:bg-[#F4F9F0]'}`}
            >
              <Wallet className="w-4 h-4" /> Tabungan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- HALAMAN DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <>
            {/* Statistik Ringkas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="flex items-center gap-4 bg-white">
                <div className="p-3 bg-lime-50 rounded-xl text-lime-600"><CheckCircle className="w-8 h-8" /></div>
                <div><p className="text-sm text-gray-500 font-medium">Progress</p><h3 className="text-2xl font-bold font-serif">{stats.progress}%</h3></div>
              </Card>
              <Card className="flex items-center gap-4 bg-white">
                <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600"><Users className="w-8 h-8" /></div>
                <div><p className="text-sm text-gray-500 font-medium">Tamu Hadir</p><h3 className="text-2xl font-bold font-serif">{stats.confirmedGuests}</h3></div>
              </Card>
              <Card className="flex items-center gap-4 bg-white">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><DollarSign className="w-8 h-8" /></div>
                <div><p className="text-sm text-gray-500 font-medium">Estimasi Biaya</p><h3 className="text-2xl font-bold font-serif">{formatRupiah(stats.totalBudget)}</h3></div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Kolom Kiri: To-Do & Guests */}
              <div className="lg:col-span-7 space-y-8">
                {/* To-Do List */}
                <Card>
                  <SectionHeader title="Daftar Tugas" icon={Calendar} subtitle={`${tasks.filter(t => t.completed).length} selesai`} />
                  <div className="flex gap-2 mb-6">
                    <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Tugas baru..." className="flex-1 px-4 py-2 rounded-xl bg-[#F8FAF6] border border-[#E0EAD0] focus:outline-none focus:ring-2 focus:ring-[#AECB94]" onKeyPress={(e) => e.key === 'Enter' && addTask()} />
                    <Button onClick={addTask}><Plus className="w-4 h-4" /> Tambah</Button>
                  </div>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${task.completed ? 'bg-[#F4F9F0] border-[#E0EAD0]' : 'bg-white border-gray-100'}`}>
                        {editingTaskId === task.id ? (
                          <div className="flex gap-2 w-full"><input value={editTaskText} onChange={(e) => setEditTaskText(e.target.value)} className="flex-1 px-2 border rounded" /><Button variant="iconPrimary" onClick={saveTask}><Save className="w-4 h-4" /></Button></div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleTask(task.id)}>{task.completed ? <CheckCircle className="w-5 h-5 text-[#829C66]" /> : <Circle className="w-5 h-5 text-gray-300" />}<span className={task.completed ? 'line-through text-gray-400' : ''}>{task.text}</span></div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100"><Button variant="icon" onClick={() => { setEditingTaskId(task.id); setEditTaskText(task.text); }}><Edit3 className="w-4 h-4" /></Button><Button variant="danger" onClick={() => deleteTask(task.id)}><Trash2 className="w-4 h-4" /></Button></div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Guest List */}
                <Card>
                  <SectionHeader title="Tamu Undangan" icon={Users} />
                  <div className="flex gap-2 mb-6 bg-[#F8FAF6] p-4 rounded-xl border border-[#E0EAD0]">
                    <input type="text" value={newGuest.name} onChange={(e) => setNewGuest({...newGuest, name: e.target.value})} placeholder="Nama Tamu" className="flex-1 px-4 py-2 rounded-lg bg-white border border-[#E0EAD0]" />
                    <input type="number" value={newGuest.pax} onChange={(e) => setNewGuest({...newGuest, pax: e.target.value})} placeholder="Jml" className="w-20 px-4 py-2 rounded-lg bg-white border border-[#E0EAD0]" />
                    <Button onClick={addGuest}>Undang</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="text-sm text-[#829C66] border-b"><th className="py-2">Nama</th><th className="center">Jml</th><th className="center">Status</th><th className="right">Aksi</th></tr></thead>
                      <tbody>
                        {guests.map((guest) => (
                          <tr key={guest.id} className="border-b last:border-0 hover:bg-[#F9FBF7] group">
                            {editingGuestId === guest.id ? (
                              <><td className="py-3"><input value={editGuestData.name} onChange={(e) => setEditGuestData({...editGuestData, name: e.target.value})} className="w-full border rounded px-2" /></td><td><input value={editGuestData.pax} onChange={(e) => setEditGuestData({...editGuestData, pax: e.target.value})} className="w-12 border rounded px-2" /></td><td colSpan="2" className="text-right"><Button variant="iconPrimary" onClick={saveGuest}><Save className="w-3 h-3" /></Button></td></>
                            ) : (
                              <><td className="py-3 font-medium">{guest.name}</td><td className="text-center">{guest.pax}</td><td className="text-center"><button onClick={() => toggleRSVP(guest.id)} className="px-2 py-1 rounded text-xs border">{guest.status}</button></td><td className="text-right flex justify-end gap-1 opacity-0 group-hover:opacity-100"><Button variant="icon" onClick={() => { setEditingGuestId(guest.id); setEditGuestData(guest); }}><Edit3 className="w-4 h-4" /></Button><Button variant="danger" onClick={() => deleteGuest(guest.id)}><Trash2 className="w-4 h-4" /></Button></td></>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Kolom Kanan: Budget */}
              <div className="lg:col-span-5">
                <Card className="bg-[#FDFBF7] border-[#AECB94] sticky top-8">
                  <SectionHeader title="Anggaran" icon={PieChart} />
                  <div className="bg-[#AECB94] rounded-xl p-4 mb-6 text-white"><h2 className="text-3xl font-serif font-bold">{formatRupiah(stats.usedBudget)}</h2><p className="text-xs text-lime-100">Aktual Terpakai</p></div>
                  <div className="space-y-2 mb-6 bg-white p-3 rounded-xl border border-[#E0EAD0]">
                     <input value={newBudget.item} onChange={(e) => setNewBudget({...newBudget, item: e.target.value})} placeholder="Item" className="w-full px-3 py-2 border rounded-lg mb-2" />
                     <div className="flex gap-2"><input type="number" value={newBudget.estimated} onChange={(e) => setNewBudget({...newBudget, estimated: e.target.value})} placeholder="Est" className="w-1/2 px-3 py-2 border rounded-lg" /><input type="number" value={newBudget.actual} onChange={(e) => setNewBudget({...newBudget, actual: e.target.value})} placeholder="Act" className="w-1/2 px-3 py-2 border rounded-lg" /></div>
                     <Button onClick={addBudget} className="w-full mt-2">Tambah</Button>
                  </div>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {budgetItems.map((item) => (
                      <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group">
                        {editingBudgetId === item.id ? (
                           <div className="space-y-2"><input value={editBudgetData.item} onChange={(e) => setEditBudgetData({...editBudgetData, item: e.target.value})} className="w-full border rounded px-2" /><div className="flex gap-2"><input type="number" value={editBudgetData.estimated} onChange={(e) => setEditBudgetData({...editBudgetData, estimated: e.target.value})} className="w-1/2 border rounded px-2" /><input type="number" value={editBudgetData.actual} onChange={(e) => setEditBudgetData({...editBudgetData, actual: e.target.value})} className="w-1/2 border rounded px-2" /></div><div className="flex justify-end gap-2"><Button variant="iconPrimary" onClick={saveBudget}><Save className="w-4 h-4" /></Button></div></div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-2"><div><h4 className="font-bold text-[#4A5D3B]">{item.item}</h4></div><div className="flex gap-1 opacity-0 group-hover:opacity-100 absolute top-2 right-2 bg-white/90 p-1 rounded"><Button variant="icon" onClick={() => { setEditingBudgetId(item.id); setEditBudgetData(item); }}><Edit3 className="w-4 h-4" /></Button><Button variant="danger" onClick={() => deleteBudget(item.id)}><Trash2 className="w-4 h-4" /></Button></div></div>
                            <div className="grid grid-cols-2 gap-4 text-sm mt-2 pt-2 border-t border-dashed"><div><p className="text-gray-400 text-xs">Estimasi</p><p className="font-medium">{formatRupiah(item.estimated)}</p></div><div className="text-right"><p className="text-gray-400 text-xs">Aktual</p><p className="font-bold">{formatRupiah(item.actual)}</p></div></div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* --- HALAMAN TABUNGAN --- */}
        {activeTab === 'savings' && (
          <div className="animate-fade-in-up">
            
            {/* Summary Tabungan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-[#AECB94] text-white border-none relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-lime-100 font-medium mb-1 flex items-center gap-2"><Wallet className="w-4 h-4"/> Total Terkumpul</p>
                  <h2 className="text-4xl font-serif font-bold mb-2">{formatRupiah(stats.totalSaved)}</h2>
                  <p className="text-sm text-lime-50 bg-white/20 inline-block px-2 py-1 rounded-lg">
                    {stats.savingProgress}% dari Target
                  </p>
                </div>
                <div className="absolute -right-6 -bottom-6 text-white/10"><Wallet className="w-32 h-32" /></div>
              </Card>

              <Card className="bg-white">
                <div className="flex items-center gap-3 mb-2 text-[#829C66]">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Target Anggaran (Dari Dashboard)</span>
                </div>
                <h3 className="text-2xl font-bold text-[#4A5D3B]">{formatRupiah(stats.totalBudget)}</h3>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                  <div className="bg-[#AECB94] h-2.5 rounded-full" style={{ width: `${Math.min(stats.savingProgress, 100)}%` }}></div>
                </div>
              </Card>

              <Card className="bg-white">
                 <div className="flex items-center gap-3 mb-2 text-red-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Kekurangan Dana</span>
                </div>
                <h3 className="text-2xl font-bold text-[#4A5D3B]">{formatRupiah(stats.remainingTarget)}</h3>
                <p className="text-sm text-gray-400 mt-2">Semangat! Kita pasti bisa.</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Input Tabungan */}
              <div className="lg:col-span-4">
                <Card className="sticky top-8">
                  <SectionHeader title="Setor Tabungan" icon={Plus} subtitle="Catat pemasukan dana" />
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4A5D3B] mb-1">Tanggal</label>
                      <input 
                        type="date" 
                        value={newSaving.date}
                        onChange={(e) => setNewSaving({...newSaving, date: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-[#F8FAF6] border border-[#E0EAD0] focus:ring-2 focus:ring-[#AECB94] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A5D3B] mb-1">Sumber Dana</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Gaji, Bonus, Hadiah"
                        value={newSaving.source}
                        onChange={(e) => setNewSaving({...newSaving, source: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-[#F8FAF6] border border-[#E0EAD0] focus:ring-2 focus:ring-[#AECB94] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A5D3B] mb-1">Jumlah (Rp)</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={newSaving.amount}
                        onChange={(e) => setNewSaving({...newSaving, amount: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-[#F8FAF6] border border-[#E0EAD0] focus:ring-2 focus:ring-[#AECB94] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A5D3B] mb-1">Catatan (Opsional)</label>
                      <textarea 
                        rows="2"
                        value={newSaving.note}
                        onChange={(e) => setNewSaving({...newSaving, note: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-[#F8FAF6] border border-[#E0EAD0] focus:ring-2 focus:ring-[#AECB94] focus:outline-none"
                      />
                    </div>
                    <Button onClick={addSaving} className="w-full justify-center mt-2">
                      Simpan Transaksi
                    </Button>
                  </div>
                </Card>
              </div>

              {/* List Riwayat Tabungan */}
              <div className="lg:col-span-8">
                <Card>
                  <SectionHeader title="Riwayat Tabungan" icon={Wallet} subtitle="Track record dana masuk" />
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-sm text-[#829C66] border-b border-[#E0EAD0]">
                          <th className="py-3 font-medium pl-2">Tanggal</th>
                          <th className="py-3 font-medium">Sumber</th>
                          <th className="py-3 font-medium">Catatan</th>
                          <th className="py-3 font-medium text-right">Jumlah</th>
                          <th className="py-3 font-medium text-right pr-2">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savings.length === 0 && (
                          <tr><td colSpan="5" className="text-center py-8 text-gray-400 italic">Belum ada data tabungan.</td></tr>
                        )}
                        {savings.sort((a,b) => new Date(b.date) - new Date(a.date)).map((item) => (
                          <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-[#F9FBF7] group">
                            {editingSavingId === item.id ? (
                              // EDIT MODE TABUNGAN
                              <>
                                <td className="py-3"><input type="date" value={editSavingData.date} onChange={(e) => setEditSavingData({...editSavingData, date: e.target.value})} className="w-full text-sm border rounded px-2 py-1" /></td>
                                <td className="py-3"><input type="text" value={editSavingData.source} onChange={(e) => setEditSavingData({...editSavingData, source: e.target.value})} className="w-full text-sm border rounded px-2 py-1" /></td>
                                <td className="py-3"><input type="text" value={editSavingData.note} onChange={(e) => setEditSavingData({...editSavingData, note: e.target.value})} className="w-full text-sm border rounded px-2 py-1" /></td>
                                <td className="py-3"><input type="number" value={editSavingData.amount} onChange={(e) => setEditSavingData({...editSavingData, amount: e.target.value})} className="w-full text-sm border rounded px-2 py-1 text-right" /></td>
                                <td className="py-3 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="iconPrimary" onClick={saveSavingEdit} className="p-1"><Save className="w-4 h-4"/></Button>
                                    <Button variant="iconDanger" onClick={() => setEditingSavingId(null)} className="p-1"><X className="w-4 h-4"/></Button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              // VIEW MODE TABUNGAN
                              <>
                                <td className="py-3 pl-2 text-gray-500 text-sm font-mono">{item.date}</td>
                                <td className="py-3 font-medium text-[#4A5D3B]">{item.source}</td>
                                <td className="py-3 text-sm text-gray-400 italic">{item.note || "-"}</td>
                                <td className="py-3 text-right font-bold text-[#6A8A50]">{formatRupiah(item.amount)}</td>
                                <td className="py-3 text-right pr-2">
                                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="icon" onClick={() => startEditSaving(item)} className="p-1"><Edit3 className="w-4 h-4"/></Button>
                                    <Button variant="danger" onClick={() => deleteSaving(item.id)} className="p-1"><Trash2 className="w-4 h-4"/></Button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
