/**
 * app.js
 * Logika perhitungan TDEE, pencarian makanan harian, dan state management (LocalStorage)
 * JavaScript Murni (Vanilla JS) - Terstruktur, Bersih, Penuh Komentar Penjelasan
 */

// ==========================================
// 1. DATABASE MAKANAN UMUM INDONESIA & SUPLEMEN
// ==========================================
const FOOD_DATABASE = [
  { id: 'f1', name: 'Nasi Putih', category: 'karbo', cal: 130, protein: 2.7, carbs: 28, fat: 0.3, portionUnit: 'porsi (100g)' },
  { id: 'f2', name: 'Dada Ayam Panggang', category: 'protein', cal: 165, protein: 31, carbs: 0, fat: 3.6, portionUnit: '100g' },
  { id: 'f3', name: 'Tempe Bacem / Goreng', category: 'protein', cal: 120, protein: 6, carbs: 8, fat: 8, portionUnit: 'potong (50g)' },
  { id: 'f4', name: 'Telur Rebus Halus', category: 'protein', cal: 78, protein: 6.3, carbs: 0.6, fat: 5.3, portionUnit: 'butir (50g)' },
  { id: 'f5', name: 'Whey Protein Isolate', category: 'suplemen', cal: 120, protein: 24, carbs: 3, fat: 1.5, portionUnit: 'scoop (30g)' },
  { id: 'f6', name: 'Mochi Kacang Hijau', category: 'camilan', cal: 80, protein: 1, carbs: 18, fat: 0.5, portionUnit: 'buah (30g)' },
  { id: 'f7', name: 'Tahu Goreng Gurih', category: 'protein', cal: 115, protein: 5, carbs: 3, fat: 9, portionUnit: 'potong (50g)' },
  { id: 'f8', name: 'Sate Ayam Madura (Tanpa Bumbu)', category: 'protein', cal: 225, protein: 18, carbs: 12, fat: 12, portionUnit: '5 tusuk (100g)' },
  { id: 'f9', name: 'Bakso Sapi Kuah Lengkap', category: 'campuran', cal: 350, protein: 15, carbs: 32, fat: 18, portionUnit: 'mangkok' },
  { id: 'f10', name: 'Pisang Raja Manis', category: 'buah', cal: 120, protein: 1.2, carbs: 31.8, fat: 0.2, portionUnit: 'buah (100g)' },
  { id: 'f11', name: 'Mie Instan Goreng', category: 'camilan', cal: 380, protein: 8, carbs: 54, fat: 14, portionUnit: 'bungkus (85g)' },
  { id: 'f12', name: 'Gado-Gado Campur Teur', category: 'sayur', cal: 318, protein: 10, carbs: 35, fat: 16, portionUnit: 'porsi' },
  { id: 'f13', name: 'Alpukat Mentega Segar', category: 'buah', cal: 240, protein: 3, carbs: 12, fat: 22, portionUnit: 'buah (150g)' },
  { id: 'f14', name: 'Susu Sapi UHT Full Cream', category: 'minuman', cal: 120, protein: 6, carbs: 10, fat: 6, portionUnit: 'gelas (200ml)' },
  { id: 'f15', name: 'Oatmeal Keju', category: 'karbo', cal: 150, protein: 5, carbs: 27, fat: 2.5, portionUnit: 'mangkuk (40g kering)' },
  { id: 'f16', name: 'Kopi Susu Gula Aren', category: 'minuman', cal: 180, protein: 2, carbs: 24, fat: 8, portionUnit: 'gelas (250ml)' },
  { id: 'f17', name: 'Susu Kedelai Manis', category: 'minuman', cal: 90, protein: 4.5, carbs: 11, fat: 3, portionUnit: 'gelas (200ml)' },
  { id: 'f18', name: 'Ikan Kembung Goreng', category: 'protein', cal: 198, protein: 21, carbs: 0, fat: 12, portionUnit: 'ekor (100g)' },
  { id: 'f19', name: 'Kerupuk Putih Kaleng', category: 'camilan', cal: 100, protein: 1, carbs: 14, fat: 5, portionUnit: 'buah (15g)' }
];

// ==========================================
// 1.5. DATABASE OLAHRAGA & AKTIVITAS FISIK UMUM
// ==========================================
const EXERCISE_DATABASE = [
  { id: 'ex1', name: 'Jalan Santai (Casual Walk)', category: 'olahraga', cal: 200, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 200 },
  { id: 'ex2', name: 'Jalan Cepat (Power Walking)', category: 'olahraga', cal: 350, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 350 },
  { id: 'ex3', name: 'Lari Santai (Jogging)', category: 'olahraga', cal: 500, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 500 },
  { id: 'ex4', name: 'Lari Cepat (Running)', category: 'olahraga', cal: 750, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 750 },
  { id: 'ex5', name: 'Bersepeda Santai (Cycling)', category: 'olahraga', cal: 300, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 300 },
  { id: 'ex6', name: 'Bersepeda Intensif', category: 'olahraga', cal: 550, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 550 },
  { id: 'ex7', name: 'Berenang Gaya Bebas', category: 'olahraga', cal: 600, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 600 },
  { id: 'ex8', name: 'Latihan Beban (Weight Training)', category: 'olahraga', cal: 400, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 400 },
  { id: 'ex9', name: 'Latihan HIIT / Kardio', category: 'olahraga', cal: 650, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 650 },
  { id: 'ex10', name: 'Yoga / Pilates', category: 'olahraga', cal: 250, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 250 },
  { id: 'ex11', name: 'Menari / Zumba', category: 'olahraga', cal: 450, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 450 },
  { id: 'ex12', name: 'Membersihkan Rumah (Sapu/Pengepel)', category: 'olahraga', cal: 180, protein: 0, carbs: 0, fat: 0, portionUnit: 'menit', burnHourly: 180 }
];

// ==========================================
// 2. STATE MANAGER & INITIAL VALUES
// ==========================================
const DEFAULT_TARGET = {
  gender: 'male',
  age: 25,
  weight: 70,
  height: 170,
  activity: 'moderate',
  goal: 'maintain',
  tdee: 2275,
  targetCalories: 2275,
  protein: 171,      // 30% dari kalori
  carbs: 228,        // 40% dari kalori
  fat: 76            // 30% dari kalori
};

// Global State
let currentTarget = loadTarget();
let dailyLogs = loadLogs();
let activeDate = getTodayDateString(); // YYYY-MM-DD
let activeMealCategory = 'sarapan';    // Default untuk drawer makanan
let selectedFoodFromDB = null;          // Menyimpan objek makanan yang dipilih dari db untuk porsi
let mixedPlate = [];                    // Menyimpan daftar makanan campuran pilihan user sebelum di-log sekaligus

// ==========================================
// 3. PERSISTENCE LAYER (LocalStorage)
// ==========================================
function loadTarget() {
  const saved = localStorage.getItem('porsisaku_target');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing target, reset ke default:", e);
    }
  }
  return { ...DEFAULT_TARGET };
}

function saveTarget(target) {
  currentTarget = target;
  localStorage.setItem('porsisaku_target', JSON.stringify(target));
}

function loadLogs() {
  const saved = localStorage.getItem('porsisaku_logs');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing logs, reset ke kosong:", e);
    }
  }
  return {};
}

function saveLogs(logs) {
  dailyLogs = logs;
  localStorage.setItem('porsisaku_logs', JSON.stringify(logs));
}

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateStringHuman(dateStr) {
  const today = getTodayDateString();
  
  // Format kemarin
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  
  // Format besok
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getHours() + 24);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  if (dateStr === today) return 'Hari Ini';
  if (dateStr === yesterdayStr) return 'Kemarin';
  if (dateStr === tomorrowStr) return 'Besok';
  
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

// ==========================================
// 4. CORE MATHEMATICAL FORMULAS (Mifflin-St Jeor)
// ==========================================
function calculateAndSaveTDEE(gender, age, weight, height, activity, goal) {
  // BMR Formula
  let bmr = 0;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  
  // Activity Multipliers
  let multiplier = 1.2;
  if (activity === 'sedentary') multiplier = 1.2;
  else if (activity === 'light') multiplier = 1.375;
  else if (activity === 'moderate') multiplier = 1.55;
  else if (activity === 'active') multiplier = 1.725;
  
  const tdee = Math.round(bmr * multiplier);
  
  // Goal modifier
  let targetCalories = tdee;
  if (goal === 'deficit') {
    targetCalories = tdee - 500;
    if (targetCalories < 1200) targetCalories = 1200; // Batas aman minimal gizi
  } else if (goal === 'surplus') {
    targetCalories = tdee + 500;
  }
  
  // Macronutrients (Protein 30%, Carbs 40%, Fat 30%)
  const proteinGrams = Math.round((targetCalories * 0.3) / 4);
  const carbsGrams = Math.round((targetCalories * 0.4) / 4);
  const fatGrams = Math.round((targetCalories * 0.3) / 9);
  
  const newTarget = {
    gender, age, weight, height, activity, goal,
    tdee,
    targetCalories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams
  };
  
  saveTarget(newTarget);
  renderDashboard();
  showNotification('Pengaturan profil gizi berhasil diperbarui!');
}

// ==========================================
// 5. DOM SELECTORS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initDOM();
  renderDashboard();
  renderDailyLogs();
  setupSettingsForm();
  initOnboardingSetup();
});

let dom = {};

function initDOM() {
  dom = {
    // Header & Date
    currentDateTxt: document.getElementById('current-date'),
    prevDateBtn: document.getElementById('prev-date-btn'),
    nextDateBtn: document.getElementById('next-date-btn'),
    
    // Summary Kcal Circle & Numbers
    targetCaloriesTxt: document.getElementById('target-calories-val'),
    consumedCaloriesTxt: document.getElementById('consumed-calories-val'),
    remainingCaloriesTxt: document.getElementById('remaining-calories-val'),
    caloriesCircleFill: document.getElementById('calories-circle-fill'),
    caloriesBarFill: document.getElementById('calories-bar-fill'),
    burnedCaloriesTxt: document.getElementById('burned-calories-val'),
    dailyStatusProject: document.getElementById('daily-status-project'),
    
    // Macronutrients UI
    carbsProgressPct: document.getElementById('carbs-percentage'),
    carbsProgressFill: document.getElementById('carbs-progress-fill'),
    carbsValTxt: document.getElementById('carbs-val'),
    
    proteinProgressPct: document.getElementById('protein-percentage'),
    proteinProgressFill: document.getElementById('protein-progress-fill'),
    proteinValTxt: document.getElementById('protein-val'),
    
    fatProgressPct: document.getElementById('fat-percentage'),
    fatProgressFill: document.getElementById('fat-progress-fill'),
    fatValTxt: document.getElementById('fat-val'),
    
    // TDEE Settings Form
    settingsSection: document.getElementById('settings-section'),
    settingsToggleBtn: document.getElementById('settings-toggle-btn'),
    settingsForm: document.getElementById('settings-form'),
    inputGender: document.getElementById('input-gender'),
    inputGenderBtns: document.querySelectorAll('#gender-gender-selectors .segment-btn'),
    inputAge: document.getElementById('input-age'),
    inputWeight: document.getElementById('input-weight'),
    inputHeight: document.getElementById('input-height'),
    inputActivity: document.getElementById('input-activity'),
    inputGoal: document.getElementById('input-goal'),
    inputGoalBtns: document.querySelectorAll('#goal-selectors .segment-btn'),
    
    // Food Log Meal Sections
    sarapanList: document.getElementById('sarapan-list'),
    sarapanCal: document.getElementById('sarapan-cal'),
    sarapanProtein: document.getElementById('sarapan-protein'),
    sarapanCarbs: document.getElementById('sarapan-carbs'),
    sarapanFat: document.getElementById('sarapan-fat'),

    makansiangList: document.getElementById('makansiang-list'),
    makansiangCal: document.getElementById('makansiang-cal'),
    makansiangProtein: document.getElementById('makansiang-protein'),
    makansiangCarbs: document.getElementById('makansiang-carbs'),
    makansiangFat: document.getElementById('makansiang-fat'),

    makanmalamList: document.getElementById('makanmalam-list'),
    makanmalamCal: document.getElementById('makanmalam-cal'),
    makanmalamProtein: document.getElementById('makanmalam-protein'),
    makanmalamCarbs: document.getElementById('makanmalam-carbs'),
    makanmalamFat: document.getElementById('makanmalam-fat'),

    camilanList: document.getElementById('camilan-list'),
    camilanCal: document.getElementById('camilan-cal'),
    camilanProtein: document.getElementById('camilan-protein'),
    camilanCarbs: document.getElementById('camilan-carbs'),
    camilanFat: document.getElementById('camilan-fat'),

    // Olahraga & Aktivitas Log Kategori
    olahragaList: document.getElementById('olahraga-list'),
    olahragaCal: document.getElementById('olahraga-cal'),
    addOlahragaBtn: document.getElementById('add-olahraga-btn'),

    // Water Tracker UI Elements
    waterCountText: document.getElementById('water-count-text'),
    waterCupsGrid: document.getElementById('water-cups-grid'),
    btnWaterMinus: document.getElementById('btn-water-minus'),
    btnWaterPlus: document.getElementById('btn-water-plus'),

    // Sering Dikonsumsi Badges
    frequentFoodsBox: document.getElementById('frequent-foods-box'),
    frequentFoodsBadges: document.getElementById('frequent-foods-badges'),
    
    // Quick Add Buttons of each meal
    addSarapanBtn: document.getElementById('add-sarapan-btn'),
    addMakanSiangBtn: document.getElementById('add-makansiang-btn'),
    addMakanMalamBtn: document.getElementById('add-makanmalam-btn'),
    addCamilanBtn: document.getElementById('add-camilan-btn'),
    
    // Floating Action Button
    floatingAddBtn: document.getElementById('floating-add-btn'),
    
    // Drawer Tambah Makanan
    drawerOverlay: document.getElementById('drawer-overlay'),
    closeDrawerBtn: document.getElementById('close-drawer-btn'),
    drawerTitle: document.getElementById('drawer-title'),
    
    // Live Search
    searchInput: document.getElementById('search-input'),
    dbTabs: document.querySelectorAll('.db-tab-btn'),
    searchResults: document.getElementById('search-results'),
    
    // Portion UI
    portionSelectorCard: document.getElementById('portion-selector-card'),
    selectedFoodLabel: document.getElementById('selected-food-label'),
    selectedFoodDetail: document.getElementById('selected-food-detail'),
    portionInput: document.getElementById('portion-input'),
    btnPortionMin: document.getElementById('btn-portion-min'),
    btnPortionPlus: document.getElementById('btn-portion-plus'),
    saveFoodLogBtn: document.getElementById('save-food-log-btn'),
    mealCategorySelect: document.getElementById('meal-category-select'),
    portionGramRow: document.getElementById('portion-gram-row'),
    portionGramInput: document.getElementById('portion-gram-input'),
    portionGramUnitLabel: document.getElementById('portion-gram-unit-label'),
    foodBaseGramInfo: document.getElementById('food-base-gram-info'),
    portionLivePreview: document.getElementById('portion-live-preview'),
    livePreviewTitle: document.getElementById('live-preview-title'),
    livePreviewCal: document.getElementById('live-preview-cal'),
    livePreviewSubtitle: document.getElementById('live-preview-subtitle'),
    livePreviewCarbs: document.getElementById('live-preview-carbs'),
    livePreviewProtein: document.getElementById('live-preview-protein'),
    livePreviewFat: document.getElementById('live-preview-fat'),
    portionStepperLabel: document.getElementById('portion-stepper-label'),
    
    // Custom Food Creator inside Drawer
    toggleCustomFormBtn: document.getElementById('toggle-custom-form-btn'),
    customFoodForm: document.getElementById('custom-food-form'),
    customNameInput: document.getElementById('custom-name'),
    customCalInput: document.getElementById('custom-cal'),
    customProteinInput: document.getElementById('custom-protein'),
    customCarbsInput: document.getElementById('custom-carbs'),
    customFatInput: document.getElementById('custom-fat'),
    saveCustomFoodBtn: document.getElementById('save-custom-food-btn'),
    
    // Mixed Plate (Piring Campuran) UI Elements
    mixedPlatePanel: document.getElementById('mixed-plate-panel'),
    mixedPlateCount: document.getElementById('mixed-plate-count'),
    clearMixedPlateBtn: document.getElementById('clear-mixed-plate-btn'),
    mixedPlateItems: document.getElementById('mixed-plate-items'),
    mixedPlateTotalCal: document.getElementById('mixed-plate-total-cal'),
    mixedPlateTotalCarbs: document.getElementById('mixed-plate-total-carbs'),
    mixedPlateTotalProtein: document.getElementById('mixed-plate-total-protein'),
    mixedPlateTotalFat: document.getElementById('mixed-plate-total-fat'),
    saveMixedPlateBtn: document.getElementById('save-mixed-plate-btn'),
    mixedPlateMealSelect: document.getElementById('mixed-plate-meal-select'),
    addToMixedPlateBtn: document.getElementById('add-to-mixed-plate-btn'),
    
    // Notification Toast
    notificationToast: document.getElementById('notification-toast')
  };

  // Setup Date Selector Click events
  dom.prevDateBtn.addEventListener('click', () => changeDays(-1));
  dom.nextDateBtn.addEventListener('click', () => changeDays(1));
  
  // Settings Accordion
  dom.settingsToggleBtn.addEventListener('click', () => {
    dom.settingsSection.classList.toggle('open');
  });
  
  // Floating action button triggers Sarapan by default
  dom.floatingAddBtn.addEventListener('click', () => {
    openFoodDrawer('sarapan');
  });
  
  // Quick add meals & activities
  dom.addSarapanBtn.addEventListener('click', () => openFoodDrawer('sarapan'));
  dom.addMakanSiangBtn.addEventListener('click', () => openFoodDrawer('makansiang'));
  dom.addMakanMalamBtn.addEventListener('click', () => openFoodDrawer('makanmalam'));
  dom.addCamilanBtn.addEventListener('click', () => openFoodDrawer('camilan'));
  dom.addOlahragaBtn.addEventListener('click', () => openFoodDrawer('olahraga'));
  
  // Water tracker clicks
  dom.btnWaterMinus.addEventListener('click', () => adjustWater(-1));
  dom.btnWaterPlus.addEventListener('click', () => adjustWater(1));
  
  // Close drawer
  dom.closeDrawerBtn.addEventListener('click', closeFoodDrawer);
  dom.drawerOverlay.addEventListener('click', (e) => {
    if (e.target === dom.drawerOverlay) closeFoodDrawer();
  });
  
  // Live Search Input Event
  dom.searchInput.addEventListener('input', (e) => {
    renderDatabaseSearch(e.target.value);
  });
  
  // Database Category Tabs in Drawer
  dom.dbTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dom.dbTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.category; 
      renderDatabaseSearch(dom.searchInput.value, category);
    });
  });
  
  // Steppers for portions
  dom.btnPortionMin.addEventListener('click', () => adjustPortion(-0.5));
  dom.btnPortionPlus.addEventListener('click', () => adjustPortion(0.5));
  
  // Event listener untuk input berat langsung (Gram/ml)
  if (dom.portionGramInput) {
    dom.portionGramInput.addEventListener('input', () => {
      updatePortionCalculatorAndPreview('gram_input');
    });
    dom.portionGramInput.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });
  }
  
  // Save food Log to Active Date List
  dom.saveFoodLogBtn.addEventListener('click', addSelectedFoodToLog);
  
  // Mixed Plate (Piring Campuran) Selectors Click actions
  if (dom.addToMixedPlateBtn) {
    dom.addToMixedPlateBtn.addEventListener('click', addFoodToMixedPlate);
  }
  if (dom.clearMixedPlateBtn) {
    dom.clearMixedPlateBtn.addEventListener('click', clearMixedPlate);
  }
  if (dom.saveMixedPlateBtn) {
    dom.saveMixedPlateBtn.addEventListener('click', saveMixedPlateToLog);
  }
  
  // Toggle Custom Food Form inside drawer
  dom.toggleCustomFormBtn.addEventListener('click', () => {
    dom.customFoodForm.classList.toggle('open');
    if (dom.customFoodForm.classList.contains('open')) {
      dom.customFoodForm.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Save custom food button
  dom.saveCustomFoodBtn.addEventListener('click', createAndAddCustomFood);
  
  // Set default initial date human label
  updateDateHeading();
}

// ==========================================
// 6. DATE CONTROLLER & NAVIGATION
// ==========================================
function updateDateHeading() {
  dom.currentDateTxt.textContent = formatDateStringHuman(activeDate);
}

function changeDays(count) {
  const current = new Date(activeDate);
  current.setDate(current.getDate() + count);
  
  const year = current.getFullYear();
  const month = String(current.getMonth() + 1).padStart(2, '0');
  const day = String(current.getDate()).padStart(2, '0');
  
  activeDate = `${year}-${month}-${day}`;
  updateDateHeading();
  renderDashboard();
  renderDailyLogs();
}

// ==========================================
// 7. CALORIE & MACRONUTRIENT RENDERING (UI Engine)
// ==========================================
function loadWater() {
  const saved = localStorage.getItem('porsisaku_water');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return {};
}

function saveWater(waterData) {
  localStorage.setItem('porsisaku_water', JSON.stringify(waterData));
}

function renderWater() {
  const waterData = loadWater();
  const currentGlasses = waterData[activeDate] || 0;
  const targetGlasses = 8;
  const currentMl = currentGlasses * 250;
  
  if (dom.waterCountText) {
    dom.waterCountText.textContent = `${currentGlasses} / ${targetGlasses} Gelas (${currentMl}ml)`;
  }
  
  if (dom.waterCupsGrid) {
    dom.waterCupsGrid.innerHTML = '';
    
    for (let i = 1; i <= targetGlasses; i++) {
      const drop = document.createElement('span');
      drop.style.fontSize = '1.35rem';
      drop.style.cursor = 'pointer';
      drop.style.transition = 'all var(--transition-fast)';
      drop.style.display = 'inline-block';
      
      if (i <= currentGlasses) {
        drop.textContent = '💧';
        drop.title = `Gelas ${i} (Selesai diminum)`;
        drop.style.filter = 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.5))';
      } else {
        drop.textContent = '🥛';
        drop.title = `Gelas ${i} (Kosong)`;
        drop.style.opacity = '0.35';
      }
      
      drop.addEventListener('click', () => {
        setWaterGlasses(i);
      });
      drop.addEventListener('mouseenter', () => {
        drop.style.transform = 'scale(1.2) translateY(-2px)';
      });
      drop.addEventListener('mouseleave', () => {
        drop.style.transform = 'scale(1) translateY(0)';
      });
      
      dom.waterCupsGrid.appendChild(drop);
    }
  }
}

function setWaterGlasses(count) {
  const waterData = loadWater();
  waterData[activeDate] = count;
  saveWater(waterData);
  renderWater();
  showNotification(`Hidrasi Harian: Anda mencatat minum ${count} Gelas (${count * 250}ml) air bersih! 💧`);
}

function adjustWater(diff) {
  const waterData = loadWater();
  let current = waterData[activeDate] || 0;
  current += diff;
  if (current < 0) current = 0;
  if (current > 16) current = 16;
  
  waterData[activeDate] = current;
  saveWater(waterData);
  renderWater();
  showNotification(diff > 0 ? 'Ditambahkan 1 gelas air segar (+250ml) 💧' : 'Dikurangi 1 gelas air harian (-250ml) 🥛');
}

function renderDashboard() {
  const currentLogs = dailyLogs[activeDate] || [];
  
  let totalCalFood = 0;
  let totalCalBurned = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  currentLogs.forEach(item => {
    if (item.category === 'olahraga') {
      totalCalBurned += item.totalCal;
    } else {
      totalCalFood += item.totalCal;
      totalProtein += item.totalProtein;
      totalCarbs += item.totalCarbs;
      totalFat += item.totalFat;
    }
  });
  
  totalCalFood = Math.round(totalCalFood);
  totalCalBurned = Math.round(totalCalBurned);
  totalProtein = Math.round(totalProtein);
  totalCarbs = Math.round(totalCarbs);
  totalFat = Math.round(totalFat);
  
  const targetCalValue = currentTarget.targetCalories;
  const remainingCalValue = targetCalValue - totalCalFood + totalCalBurned;
  
  if (dom.targetCaloriesTxt) dom.targetCaloriesTxt.textContent = targetCalValue.toLocaleString('id-ID');
  if (dom.consumedCaloriesTxt) dom.consumedCaloriesTxt.textContent = totalCalFood.toLocaleString('id-ID');
  if (dom.burnedCaloriesTxt) dom.burnedCaloriesTxt.textContent = totalCalBurned.toLocaleString('id-ID');
  if (dom.remainingCaloriesTxt) dom.remainingCaloriesTxt.textContent = remainingCalValue.toLocaleString('id-ID');
  
  if (dom.dailyStatusProject) {
    if (remainingCalValue < 0) {
      dom.dailyStatusProject.textContent = 'Surplus ⚠️';
      dom.dailyStatusProject.style.color = '#EF4444';
    } else if (remainingCalValue < 150) {
      dom.dailyStatusProject.textContent = 'Maksimal 🎯';
      dom.dailyStatusProject.style.color = '#F59E0B';
    } else {
      dom.dailyStatusProject.textContent = 'Seimbang ⚖️';
      dom.dailyStatusProject.style.color = 'var(--color-primary-dark)';
    }
  }
  
  const circumference = 326.7;
  let percentage = totalCalFood / (targetCalValue + totalCalBurned);
  if (percentage > 1) percentage = 1;
  if (percentage < 0) percentage = 0; 
  
  const offset = circumference - (percentage * circumference);
  if (dom.caloriesCircleFill) {
    dom.caloriesCircleFill.setAttribute('stroke-dashoffset', offset);
    if (remainingCalValue < 0) {
      dom.caloriesCircleFill.style.stroke = '#EF4444';
    } else {
      dom.caloriesCircleFill.style.stroke = 'var(--color-primary)';
    }
  }
  
  const hBarPercentage = Math.min((totalCalFood / (targetCalValue + totalCalBurned)) * 100, 100);
  if (dom.caloriesBarFill) {
    dom.caloriesBarFill.style.width = `${hBarPercentage}%`;
    if (remainingCalValue < 0) {
      dom.caloriesBarFill.style.backgroundColor = '#EF4444';
    } else {
      dom.caloriesBarFill.style.backgroundColor = 'var(--color-primary)';
    }
  }
  
  const carbPct = Math.round((totalCarbs / currentTarget.carbs) * 100) || 0;
  if (dom.carbsProgressPct) dom.carbsProgressPct.textContent = `${carbPct}%`;
  if (dom.carbsProgressFill) dom.carbsProgressFill.style.width = `${Math.min(carbPct, 100)}%`;
  if (dom.carbsValTxt) dom.carbsValTxt.textContent = `${totalCarbs}g / ${currentTarget.carbs}g`;
  if (carbPct > 100 && dom.carbsProgressPct) dom.carbsProgressPct.style.color = '#EF4444';
  
  const protPct = Math.round((totalProtein / currentTarget.protein) * 100) || 0;
  if (dom.proteinProgressPct) dom.proteinProgressPct.textContent = `${protPct}%`;
  if (dom.proteinProgressFill) dom.proteinProgressFill.style.width = `${Math.min(protPct, 100)}%`;
  if (dom.proteinValTxt) dom.proteinValTxt.textContent = `${totalProtein}g / ${currentTarget.protein}g`;
  
  const fatPct = Math.round((totalFat / currentTarget.fat) * 100) || 0;
  if (dom.fatProgressPct) dom.fatProgressPct.textContent = `${fatPct}%`;
  if (dom.fatProgressFill) dom.fatProgressFill.style.width = `${Math.min(fatPct, 100)}%`;
  if (dom.fatValTxt) dom.fatValTxt.textContent = `${totalFat}g / ${currentTarget.fat}g`;

  renderWater();
  renderFrequentFoods();
  updateUserGreetingPill();
}

// ==========================================
// 8. SETTINGS TDEE CALCULATION FORM UI
// ==========================================
function setupSettingsForm() {
  dom.inputAge.value = currentTarget.age;
  dom.inputWeight.value = currentTarget.weight;
  dom.inputHeight.value = currentTarget.height;
  dom.inputActivity.value = currentTarget.activity;
  
  dom.inputGender.value = currentTarget.gender;
  dom.inputGenderBtns.forEach(btn => {
    if (btn.dataset.value === currentTarget.gender) btn.classList.add('active');
    btn.addEventListener('click', () => {
      dom.inputGenderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      dom.inputGender.value = btn.dataset.value;
    });
  });
  
  dom.inputGoal.value = currentTarget.goal;
  dom.inputGoalBtns.forEach(btn => {
    if (btn.dataset.value === currentTarget.goal) btn.classList.add('active');
    btn.addEventListener('click', () => {
      dom.inputGoalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      dom.inputGoal.value = btn.dataset.value;
    });
  });
  
  dom.settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const gender = dom.inputGender.value;
    const age = parseInt(dom.inputAge.value) || 25;
    const weight = parseFloat(dom.inputWeight.value) || 70;
    const height = parseFloat(dom.inputHeight.value) || 170;
    const activity = dom.inputActivity.value;
    const goal = dom.inputGoal.value;
    
    calculateAndSaveTDEE(gender, age, weight, height, activity, goal);
    dom.settingsSection.classList.remove('open');
  });
}

// ==========================================
// 9. MEALS LOGGING ENGINE
// ==========================================
function renderDailyLogs() {
  const currentLogs = dailyLogs[activeDate] || [];
  
  const categories = {
    sarapan: { list: dom.sarapanList, cal: dom.sarapanCal, p: dom.sarapanProtein, c: dom.sarapanCarbs, f: dom.sarapanFat, data: [] },
    makansiang: { list: dom.makansiangList, cal: dom.makansiangCal, p: dom.makansiangProtein, c: dom.makansiangCarbs, f: dom.makansiangFat, data: [] },
    makanmalam: { list: dom.makanmalamList, cal: dom.makanmalamCal, p: dom.makanmalamProtein, c: dom.makanmalamCarbs, f: dom.makanmalamFat, data: [] },
    camilan: { list: dom.camilanList, cal: dom.camilanCal, p: dom.camilanProtein, c: dom.camilanCarbs, f: dom.camilanFat, data: [] },
    olahraga: { list: dom.olahragaList, cal: dom.olahragaCal, p: null, c: null, f: null, data: [] }
  };
  
  currentLogs.forEach(item => {
    if (categories[item.category]) {
      categories[item.category].data.push(item);
    }
  });
  
  Object.keys(categories).forEach(catKey => {
    const section = categories[catKey];
    if (!section.list) return; 
    section.list.innerHTML = '';
    
    let sumCal = 0;
    let sumP = 0;
    let sumC = 0;
    let sumF = 0;
    
    if (section.data.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-meal-text';
      emptyDiv.textContent = catKey === 'olahraga' ? 'Belum ada latihan fisik harian' : 'Belum ada makanan terdaftar';
      section.list.appendChild(emptyDiv);
    } else {
      section.data.forEach(item => {
        sumCal += item.totalCal;
        sumP += item.totalProtein;
        sumC += item.totalCarbs;
        sumF += item.totalFat;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'food-item';
        itemEl.id = `log-item-${item.id}`;
        
        if (catKey === 'olahraga') {
          itemEl.innerHTML = `
            <div class="food-item-info">
              <span class="food-item-name" style="color: var(--color-primary-dark); font-weight: 750;">🏃 ${item.name}</span>
              <span class="food-item-portion">${item.servings} menit • Latihan Fisik</span>
              <div class="food-item-macros" style="color: var(--color-primary); font-weight: 600;">
                <span>🔥 Membakar ~${Math.round(item.totalCal)} kkal</span>
              </div>
            </div>
            <div class="food-item-right">
              <span class="food-item-cal" style="color: var(--color-primary); font-weight: 750;">-${Math.round(item.totalCal)} kkal</span>
              <button class="delete-food-btn" aria-label="Hapus ${item.name}" onclick="deleteLogItem('${item.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          `;
        } else {
          const weightLabel = item.loggedWeight ? ` (${item.loggedWeight}${item.portionUnit.toLowerCase().includes('ml') ? 'ml' : 'g'})` : '';
          itemEl.innerHTML = `
            <div class="food-item-info">
              <span class="food-item-name">${item.name}</span>
              <span class="food-item-portion" style="font-weight: 500; font-family: var(--font-sans);">${item.servings} x ${item.portionUnit}${weightLabel}</span>
              <div class="food-item-macros">
                <span class="dot-carb">● Karbi ${Math.round(item.totalCarbs)}g</span>
                <span class="dot-prot">● Prot ${Math.round(item.totalProtein)}g</span>
                <span class="dot-fat">● Lemak ${Math.round(item.totalFat)}g</span>
              </div>
            </div>
            <div class="food-item-right">
              <span class="food-item-cal">${Math.round(item.totalCal)} kkal</span>
              <button class="delete-food-btn" aria-label="Hapus ${item.name}" onclick="deleteLogItem('${item.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          `;
        }
        
        section.list.appendChild(itemEl);
      });
    }
    
    if (catKey === 'olahraga') {
      if (section.cal) section.cal.textContent = `${Math.round(sumCal)} kkal Terbakar`;
    } else {
      if (section.cal) section.cal.textContent = `${Math.round(sumCal)} kkal`;
      if (section.p) section.p.textContent = `${Math.round(sumP)}g`;
      if (section.c) section.c.textContent = `${Math.round(sumC)}g`;
      if (section.f) section.f.textContent = `${Math.round(sumF)}g`;
    }
  });
}

window.deleteLogItem = function(id) {
  const currentLogs = dailyLogs[activeDate] || [];
  const updatedLogs = currentLogs.filter(item => item.id !== id);
  
  if (updatedLogs.length === 0) {
    delete dailyLogs[activeDate];
  } else {
    dailyLogs[activeDate] = updatedLogs;
  }
  
  saveLogs(dailyLogs);
  renderDashboard();
  renderDailyLogs();
  showNotification('Makanan berhasil dihapus dari daftar harian');
};

// ==========================================
// 10. FOOD LOG ADD DRAWER & LIVE SEARCH SYSTEM
// ==========================================
function trackFrequentUse(item, category) {
  let freq = localStorage.getItem('porsisaku_frequent');
  let data = [];
  if (freq) {
    try {
      data = JSON.parse(freq);
    } catch (e) {}
  }
  
  const existingIndex = data.findIndex(x => x.id === item.id);
  if (existingIndex !== -1) {
    data[existingIndex].count += 1;
    data[existingIndex].timestamp = Date.now();
  } else {
    data.push({
      id: item.id,
      name: item.name,
      category: category, 
      count: 1,
      targetFood: item,
      timestamp: Date.now()
    });
  }
  
  data.sort((a, b) => b.count - a.count || b.timestamp - a.timestamp);
  data = data.slice(0, 8);
  localStorage.setItem('porsisaku_frequent', JSON.stringify(data));
}

function renderFrequentFoods() {
  const freq = localStorage.getItem('porsisaku_frequent');
  let data = [];
  if (freq) {
    try {
      data = JSON.parse(freq);
    } catch (e) {}
  }
  
  if (!dom.frequentFoodsBox || !dom.frequentFoodsBadges) return;
  
  if (data.length === 0) {
    dom.frequentFoodsBox.style.display = 'none';
    return;
  }
  
  dom.frequentFoodsBox.style.display = 'block';
  dom.frequentFoodsBadges.innerHTML = '';
  
  data.forEach(item => {
    const badge = document.createElement('button');
    badge.type = 'button';
    badge.className = 'freq-badge';
    badge.style.border = '1px solid var(--color-primary-border)';
    badge.style.background = '#ffffff';
    badge.style.color = 'var(--color-primary-dark)';
    badge.style.fontSize = '0.68rem';
    badge.style.fontWeight = '800';
    badge.style.padding = '4px 10px';
    badge.style.borderRadius = '8px';
    badge.style.cursor = 'pointer';
    badge.style.transition = 'all var(--transition-fast)';
    
    const prefix = item.category === 'olahraga' ? '🏃 ' : '🍲 ';
    badge.textContent = `${prefix}${item.name}`;
    
    badge.addEventListener('click', () => {
      const realItem = item.targetFood;
      if (item.category === 'olahraga') {
        activeMealCategory = 'olahraga';
        dom.mealCategorySelect.value = 'olahraga';
      }
      selectFoodForLog(realItem);
    });
    
    dom.frequentFoodsBadges.appendChild(badge);
  });
}

function openFoodDrawer(category) {
  activeMealCategory = category;
  
  let categoryLabel = 'Sarapan';
  if (category === 'makansiang') categoryLabel = 'Makan Siang';
  if (category === 'makanmalam') categoryLabel = 'Makan Malam';
  if (category === 'camilan') categoryLabel = 'Camilan / Snack';
  if (category === 'olahraga') categoryLabel = 'Latihan & Aktivitas';
  
  if (dom.drawerTitle) {
    dom.drawerTitle.textContent = category === 'olahraga' ? 'Catat Kalori Olahraga harian' : `Tambah Makanan ke ${categoryLabel}`;
  }
  if (dom.mealCategorySelect) {
    dom.mealCategorySelect.value = category;
  }
  
  if (dom.searchInput) dom.searchInput.value = '';
  if (dom.portionSelectorCard) dom.portionSelectorCard.classList.remove('open');
  if (dom.customFoodForm) dom.customFoodForm.classList.remove('open');
  selectedFoodFromDB = null;
  
  dom.dbTabs.forEach(t => t.classList.remove('active'));
  dom.dbTabs[0].classList.add('active'); 
  
  if (dom.drawerOverlay) dom.drawerOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; 
  
  renderDatabaseSearch('', category === 'olahraga' ? 'olahraga' : 'semua');
}

function closeFoodDrawer() {
  if (dom.drawerOverlay) dom.drawerOverlay.classList.remove('open');
  document.body.style.overflow = ''; 
}

function renderDatabaseSearch(keyword = '', filterCategory = 'semua') {
  if (!dom.searchResults) return;
  dom.searchResults.innerHTML = '';
  
  const query = keyword.trim().toLowerCase();
  
  const useExerciseDB = (activeMealCategory === 'olahraga' || filterCategory === 'olahraga');
  const databaseToSearch = useExerciseDB ? EXERCISE_DATABASE : FOOD_DATABASE;
  
  const filtered = databaseToSearch.filter(f => {
    const matchesKeyword = f.name.toLowerCase().includes(query);
    const matchesCategory = useExerciseDB ? true : (filterCategory === 'semua' || f.category === filterCategory);
    return matchesKeyword && matchesCategory;
  });
  
  if (filtered.length === 0) {
    dom.searchResults.innerHTML = `<div class="empty-meal-text" style="grid-column: span 1;">Tidak ada hasil ${useExerciseDB ? 'olahraga' : 'makanan'} ditemukan</div>`;
    return;
  }
  
  filtered.forEach(food => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    if (selectedFoodFromDB && selectedFoodFromDB.id === food.id) {
      item.classList.add('selected');
    }
    
    if (useExerciseDB) {
      item.innerHTML = `
        <div class="search-result-header">
          <span class="search-result-name">🏃 ${food.name}</span>
          <span class="search-result-cal" style="color: var(--color-primary);">${food.burnHourly} kkal/jam</span>
        </div>
        <div class="search-result-serving">Satuan acuan: ${food.portionUnit} harian</div>
        <div style="font-size: 0.7rem; color: var(--color-primary-dark); font-weight: 700; margin-top: 4px;">
          Membakar kalori secara aktif berdasarkan durasi olahraga harian.
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="search-result-header">
          <span class="search-result-name">${food.name}</span>
          <span class="search-result-cal">${food.cal} kkal</span>
        </div>
        <div class="search-result-serving">Porsi acuan: ${food.portionUnit}</div>
        <div class="search-result-macros">
          <span class="dot-carb">● S Karbo ${food.carbs}g</span>
          <span class="dot-prot">● S Protein ${food.protein}g</span>
          <span class="dot-fat">● S Lemak ${food.fat}g</span>
        </div>
      `;
    }
    
    item.addEventListener('click', () => {
      document.querySelectorAll('.search-result-item').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');
      selectFoodForLog(food);
    });
    
    dom.searchResults.appendChild(item);
  });
}

function selectFoodForLog(food) {
  selectedFoodFromDB = food;
  const isExercise = food.category === 'olahraga';
  
  if (dom.selectedFoodLabel) {
    dom.selectedFoodLabel.textContent = isExercise ? `🏃 ${food.name}` : food.name;
  }
  
  if (dom.selectedFoodDetail) {
    if (isExercise) {
      dom.selectedFoodDetail.textContent = `Burn rate: ~${food.burnHourly} kkal per 60 menit aktivitas.`;
      if (dom.portionInput) dom.portionInput.textContent = '30';
    } else {
      dom.selectedFoodDetail.textContent = `1 porsi (${food.portionUnit}) = ${food.cal} kkal (P:${food.protein}g K:${food.carbs}g L:${food.fat}g)`;
      if (dom.portionInput) dom.portionInput.textContent = '1';
    }
  }
  
  updatePortionCalculatorAndPreview('init');
  
  if (dom.portionSelectorCard) {
    dom.portionSelectorCard.classList.add('open');
    dom.portionSelectorCard.scrollIntoView({ behavior: 'smooth' });
  }
}

function getBaseGrams(food) {
  if (!food) return 100;
  if (food.baseGrams) return food.baseGrams;
  
  const unit = food.portionUnit || '';
  const match = unit.match(/(\d+)\s*(g|ml)/i);
  if (match) {
    return parseFloat(match[1]);
  }
  
  if (unit.toLowerCase().includes('mangkok') || unit.toLowerCase().includes('mangkuk')) return 250;
  if (unit.toLowerCase().includes('porsi')) return 150;
  if (unit.toLowerCase().includes('gelas')) return 200;
  return 100; 
}

function updatePortionCalculatorAndPreview(source) {
  if (!selectedFoodFromDB) return;
  const isExercise = selectedFoodFromDB.category === 'olahraga';
  const baseGrams = getBaseGrams(selectedFoodFromDB);
  
  let servings = 1.0;
  let grams = baseGrams;
  
  if (isExercise) {
    if (dom.portionGramRow) dom.portionGramRow.style.display = 'none';
    if (dom.portionLivePreview) dom.portionLivePreview.style.display = 'none';
    if (dom.portionStepperLabel) dom.portionStepperLabel.textContent = 'Durasi Aktivitas (Menit)';
    return;
  }
  
  if (dom.portionGramRow) dom.portionGramRow.style.display = 'grid';
  if (dom.portionLivePreview) dom.portionLivePreview.style.display = 'block';
  if (dom.portionStepperLabel) dom.portionStepperLabel.textContent = 'Jumlah Porsi (Servings)';
  
  if (source === 'stepper') {
    servings = parseFloat(dom.portionInput.textContent) || 1.0;
    grams = (dom.portionGramInput && dom.portionGramInput.value !== "") ? parseFloat(dom.portionGramInput.value) : Math.round(servings * baseGrams);
    if (isNaN(grams)) grams = Math.round(servings * baseGrams);
  } else if (source === 'gram_input') {
    grams = parseFloat(dom.portionGramInput.value);
    if (isNaN(grams) || grams <= 0) {
      grams = 0;
      servings = 0;
    } else {
      servings = Math.round((grams / baseGrams) * 100) / 100; 
    }
    if (dom.portionInput) dom.portionInput.textContent = servings.toString();
  } else {
    servings = parseFloat(dom.portionInput.textContent) || 1.0;
    grams = Math.round(servings * baseGrams);
    if (dom.portionGramInput) dom.portionGramInput.value = grams;
  }
  
  const calculatedCal = Math.round(selectedFoodFromDB.cal * servings * 10) / 10;
  const calculatedProtein = Math.round(selectedFoodFromDB.protein * servings * 10) / 10;
  const calculatedCarbs = Math.round(selectedFoodFromDB.carbs * servings * 10) / 10;
  const calculatedFat = Math.round(selectedFoodFromDB.fat * servings * 10) / 10;
  
  if (dom.foodBaseGramInfo) {
    const unitText = selectedFoodFromDB.portionUnit.includes('ml') ? 'ml' : 'g';
    dom.foodBaseGramInfo.innerHTML = `Acuan porsi asli:<br><strong style="color: var(--color-primary-dark); font-weight: 800;">${baseGrams} ${unitText}</strong> per porsi standar.`;
  }
  if (dom.portionGramUnitLabel) {
    dom.portionGramUnitLabel.textContent = selectedFoodFromDB.portionUnit.includes('ml') ? 'ml' : 'gr';
  }
  if (dom.livePreviewCal) dom.livePreviewCal.textContent = `${calculatedCal.toLocaleString('id-ID')} kkal`;
  if (dom.livePreviewSubtitle) {
    const isMl = selectedFoodFromDB.portionUnit.includes('ml');
    dom.livePreviewSubtitle.textContent = `Berat aktif: ${grams} ${isMl ? 'ml' : 'g'} (Setara dengan ${servings}x porsi)`;
  }
  if (dom.livePreviewCarbs) dom.livePreviewCarbs.textContent = `${calculatedCarbs}g`;
  if (dom.livePreviewProtein) dom.livePreviewProtein.textContent = `${calculatedProtein}g`;
  if (dom.livePreviewFat) dom.livePreviewFat.textContent = `${calculatedFat}g`;
}

function adjustPortion(diff) {
  if (!dom.portionInput) return;
  const isExercise = (selectedFoodFromDB && selectedFoodFromDB.category === 'olahraga');
  
  if (isExercise) {
    const stepDiff = diff > 0 ? 10 : -10;
    let val = parseInt(dom.portionInput.textContent) || 30;
    val = val + stepDiff;
    if (val < 5) val = 5;
    if (val > 480) val = 480;
    dom.portionInput.textContent = val.toString();
  } else {
    let val = parseFloat(dom.portionInput.textContent) || 1.0;
    val = val + diff;
    if (val < 0.1) val = 0.1;
    if (val > 50) val = 50;
    dom.portionInput.textContent = (Math.round(val * 100) / 100).toString();
  }
  
  updatePortionCalculatorAndPreview('stepper');
}

function addSelectedFoodToLog() {
  if (!selectedFoodFromDB) return;
  
  const servings = parseFloat(dom.portionInput.textContent) || 1.0;
  const category = dom.mealCategorySelect.value || activeMealCategory;
  const isExercise = selectedFoodFromDB.category === 'olahraga';
  
  let totalCal, totalProtein, totalCarbs, totalFat;
  let loggedWeight = 0;
  
  if (isExercise) {
    totalCal = Math.round((selectedFoodFromDB.burnHourly * (servings / 60)) * 10) / 10;
    totalProtein = 0;
    totalCarbs = 0;
    totalFat = 0;
  } else {
    totalCal = Math.round(selectedFoodFromDB.cal * servings * 10) / 10;
    totalProtein = Math.round(selectedFoodFromDB.protein * servings * 10) / 10;
    totalCarbs = Math.round(selectedFoodFromDB.carbs * servings * 10) / 10;
    totalFat = Math.round(selectedFoodFromDB.fat * servings * 10) / 10;
    
    if (dom.portionGramInput && dom.portionGramInput.value !== "") {
      loggedWeight = parseFloat(dom.portionGramInput.value) || 0;
    } else {
      const baseGrams = getBaseGrams(selectedFoodFromDB);
      loggedWeight = Math.round(servings * baseGrams);
    }
  }
  
  const logItem = {
    id: 'l' + Date.now() + Math.random().toString(36).substring(2, 5),
    name: selectedFoodFromDB.name,
    category: isExercise ? 'olahraga' : category,
    servings: servings,
    portionUnit: isExercise ? 'menit' : selectedFoodFromDB.portionUnit,
    loggedWeight: loggedWeight,
    
    totalCal: totalCal,
    totalProtein: totalProtein,
    totalCarbs: totalCarbs,
    totalFat: totalFat
  };
  
  if (!dailyLogs[activeDate]) {
    dailyLogs[activeDate] = [];
  }
  
  dailyLogs[activeDate].push(logItem);
  saveLogs(dailyLogs);
  
  trackFrequentUse(selectedFoodFromDB, isExercise ? 'olahraga' : category);
  
  renderDashboard();
  renderDailyLogs();
  closeFoodDrawer();
  
  const labelText = isExercise ? `Berhasil mencatat latihan ${selectedFoodFromDB.name} selama ${servings} menit!` : `Berhasil menambahkan ${selectedFoodFromDB.name} ke ${getCategoryNameID(category)}!`;
  showNotification(labelText);
}

function getCategoryNameID(cat) {
  if (cat === 'sarapan') return 'Sarapan';
  if (cat === 'makansiang') return 'Makan Siang';
  if (cat === 'makanmalam') return 'Makan Malam';
  if (cat === 'olahraga') return 'Olahraga';
  return 'Camilan';
}

// ==========================================
// 11. CUSTOM FOOD CREATOR LOGIC (Dapur Kustom)
// ==========================================
function createAndAddCustomFood() {
  const name = dom.customNameInput.value.trim();
  const cal = parseFloat(dom.customCalInput.value);
  const protein = parseFloat(dom.customProteinInput.value) || 0;
  const carbs = parseFloat(dom.customCarbsInput.value) || 0;
  const fat = parseFloat(dom.customFatInput.value) || 0;
  
  if (!name) {
    showNotification('Silakan isi nama makanan kustom anda!', 'warning');
    return;
  }
  
  if (isNaN(cal) || cal < 0) {
    showNotification('Silakan isi kalori yang valid!', 'warning');
    return;
  }
  
  const customFood = {
    id: 'fcustom_' + Date.now(),
    name: `${name} (Kustom)`,
    category: 'campuran',
    cal: cal,
    protein: protein,
    carbs: carbs,
    fat: fat,
    portionUnit: 'porsi'
  };
  
  FOOD_DATABASE.unshift(customFood); 
  selectFoodForLog(customFood);
  
  dom.customNameInput.value = '';
  dom.customCalInput.value = '';
  dom.customProteinInput.value = '';
  dom.customCarbsInput.value = '';
  dom.customFatInput.value = '';
  
  dom.customFoodForm.classList.remove('open');
  showNotification('Makanan kustom berhasil dibuat dan dipilih!');
}

// ==========================================
// 12. FLOATING TOAST COHESIVE NOTIFICATIONS
// ==========================================
function showNotification(message, type = 'success') {
  dom.notificationToast.textContent = message;
  dom.notificationToast.style.display = 'block';
  
  if (type === 'success') {
    dom.notificationToast.style.backgroundColor = 'var(--color-primary)';
    dom.notificationToast.style.color = '#ffffff';
  } else {
    dom.notificationToast.style.backgroundColor = 'var(--color-fat)';
    dom.notificationToast.style.color = 'var(--color-text-main)';
  }
  
  dom.notificationToast.style.position = 'fixed';
  dom.notificationToast.style.bottom = '90px';
  dom.notificationToast.style.left = '50%';
  dom.notificationToast.style.transform = 'translateX(-50%)';
  dom.notificationToast.style.padding = '12px 24px';
  dom.notificationToast.style.borderRadius = '12px';
  dom.notificationToast.style.fontWeight = '750';
  dom.notificationToast.style.fontSize = '0.85rem';
  dom.notificationToast.style.boxShadow = 'var(--shadow-lg)';
  dom.notificationToast.style.zIndex = '1000';
  dom.notificationToast.style.textAlign = 'center';
  dom.notificationToast.style.width = '85%';
  dom.notificationToast.style.maxWidth = '480px';
  dom.notificationToast.style.animation = 'fadeInUpToast 0.2s ease-out';

  if (!document.getElementById('toast-animation-style')) {
    const style = document.createElement('style');
    style.id = 'toast-animation-style';
    style.innerHTML = `
      @keyframes fadeInUpToast {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
    `;
    document.head.appendChild(style);
  }

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }
  
  window.toastTimeout = setTimeout(() => {
    dom.notificationToast.style.display = 'none';
  }, 2300);
}

// ==========================================
// 13. INTERACTIVE MULTI-STEP ONBOARDING WIZARD
// ==========================================
let onboardingStepCurrent = 1;
const onboardingMaxSteps = 4;

function initOnboardingSetup() {
  const overlay = document.getElementById('onboarding-overlay');
  const prevBtn = document.getElementById('onboarding-prev-btn');
  const nextBtn = document.getElementById('onboarding-next-btn');
  
  if (prevBtn) prevBtn.addEventListener('click', handleOnboardingPrev);
  if (nextBtn) nextBtn.addEventListener('click', handleOnboardingNext);
  
  const genderBtns = document.querySelectorAll('#onboarding-gender-selectors .segment-btn');
  const genderInput = document.getElementById('onboarding-gender');
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (genderInput) genderInput.value = btn.dataset.value;
    });
  });
  
  const activityCards = document.querySelectorAll('.activity-card');
  const activityInput = document.getElementById('onboarding-activity');
  activityCards.forEach(card => {
    card.addEventListener('click', () => {
      activityCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      if (activityInput) activityInput.value = card.dataset.value;
    });
  });
  
  const goalBtns = document.querySelectorAll('#onboarding-goal-selectors .segment-btn');
  const goalInput = document.getElementById('onboarding-goal');
  goalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (goalInput) goalInput.value = btn.dataset.value;
      updateOnboardingTargetWeightWrapper();
    });
  });

  const weightInput = document.getElementById('onboarding-weight');
  if (weightInput) {
    weightInput.addEventListener('input', () => {
      updateOnboardingTargetWeightWrapper(true);
    });
  }

  const retriggerBtn = document.getElementById('btn-retrigger-onboarding');
  if (retriggerBtn) {
    retriggerBtn.addEventListener('click', () => {
      prefillOnboardingForm();
      onboardingStepCurrent = 1;
      updateOnboardingStepUI();
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
        overlay.scrollTop = 0;
      }
      document.body.style.overflow = 'hidden';
      updateOnboardingCloseButtonVisibility();
    });
  }
  
  const greetingPill = document.getElementById('user-greeting-pill');
  if (greetingPill) {
    greetingPill.addEventListener('click', () => {
      prefillOnboardingForm();
      onboardingStepCurrent = 1;
      updateOnboardingStepUI();
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
        overlay.scrollTop = 0;
      }
      document.body.style.overflow = 'hidden';
      updateOnboardingCloseButtonVisibility();
    });
  }

  const isOnboarded = localStorage.getItem('porsisaku_onboarded');
  if (isOnboarded !== 'true') {
    onboardingStepCurrent = 1;
    updateOnboardingStepUI();
    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      overlay.scrollTop = 0;
    }
    document.body.style.overflow = 'hidden';
    updateOnboardingCloseButtonVisibility();
  } else {
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  const closeBtn = document.getElementById('onboarding-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
      }
      document.body.style.overflow = '';
    });
  }

  updateUserGreetingPill();
}

function updateOnboardingCloseButtonVisibility() {
  const closeBtn = document.getElementById('onboarding-close-btn');
  if (closeBtn) {
    const isOnboarded = localStorage.getItem('porsisaku_onboarded') === 'true';
    closeBtn.style.display = isOnboarded ? 'flex' : 'none';
  }
}

function updateOnboardingTargetWeightWrapper(isWeightInputReact = false) {
  const goal = document.getElementById('onboarding-goal').value;
  const currentWeightVal = parseFloat(document.getElementById('onboarding-weight').value) || 70;
  const wrapper = document.getElementById('onboarding-target-weight-wrapper');
  const label = document.getElementById('onboarding-target-weight-label');
  const hint = document.getElementById('onboarding-route-hint');
  const targetWeightInput = document.getElementById('onboarding-target-weight');
  
  if (!wrapper || !label || !hint || !targetWeightInput) return;
  
  if (goal === 'maintain') {
    wrapper.style.display = 'none';
  } else {
    wrapper.style.display = 'block';
    hint.textContent = `Dari ${currentWeightVal} kg ke`;
    
    if (goal === 'deficit') {
      label.textContent = "Mau Turun ke Berapa kg?";
      if (!isWeightInputReact) {
        targetWeightInput.value = (currentWeightVal - 5).toFixed(1);
      }
    } else if (goal === 'surplus') {
      label.textContent = "Mau Naik ke Berapa kg?";
      if (!isWeightInputReact) {
        targetWeightInput.value = (currentWeightVal + 5).toFixed(1);
      }
    }
  }
}

function handleOnboardingPrev() {
  if (onboardingStepCurrent > 1) {
    onboardingStepCurrent--;
    updateOnboardingStepUI();
  }
}

function handleOnboardingNext() {
  const nextBtn = document.getElementById('onboarding-next-btn');
  
  if (onboardingStepCurrent === 1) {
    const nameVal = document.getElementById('onboarding-name').value.trim();
    if (!nameVal) {
      showNotification('Silakan masukkan nama panggilan Anda terlebih dahulu!', 'warning');
      return;
    }
    onboardingStepCurrent++;
    updateOnboardingStepUI();
  } 
  else if (onboardingStepCurrent === 2) {
    const ageVal = parseInt(document.getElementById('onboarding-age').value) || 0;
    const heightVal = parseFloat(document.getElementById('onboarding-height').value) || 0;
    const weightVal = parseFloat(document.getElementById('onboarding-weight').value) || 0;
    
    if (ageVal <= 0 || heightVal <= 0 || weightVal <= 0) {
      showNotification('Harap masukkan data fisik berupa usia, tinggi, dan berat yang valid!', 'warning');
      return;
    }
    
    onboardingStepCurrent++;
    updateOnboardingStepUI();
  } 
  else if (onboardingStepCurrent === 3) {
    const goal = document.getElementById('onboarding-goal').value;
    const weightVal = parseFloat(document.getElementById('onboarding-weight').value) || 70;
    
    if (goal !== 'maintain') {
      const targetWeightVal = parseFloat(document.getElementById('onboarding-target-weight').value) || 0;
      if (targetWeightVal <= 0) {
        showNotification('Harap masukkan angka target berat badan yang valid!', 'warning');
        return;
      }
      
      if (goal === 'deficit' && targetWeightVal >= weightVal) {
        showNotification(`Berat target harus lebih kecil dari berat saat ini (${weightVal} kg) untuk program defisit!`, 'warning');
        return;
      }
      
      if (goal === 'surplus' && targetWeightVal <= weightVal) {
        showNotification(`Berat target harus lebih besar dari berat saat ini (${weightVal} kg) untuk program surplus!`, 'warning');
        return;
      }
    }
    
    const nutrition = calculateOnboardingNutrition();
    renderCalculationInStep4(nutrition);
    
    onboardingStepCurrent++;
    updateOnboardingStepUI();
  } 
  else if (onboardingStepCurrent === 4) {
    const nutrition = calculateOnboardingNutrition();
    const nameVal = document.getElementById('onboarding-name').value.trim();
    saveOnboardingTargetToMain(nutrition, nameVal);
    
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        overlay.style.opacity = '1';
      }, 300);
    }
    
    document.body.style.overflow = ''; 
    showNotification(`Selamat datang ${nameVal}! Profil gizi standar medis Anda berhasil diaktifkan. ✨`);
  }
}

function updateOnboardingStepUI() {
  const prevBtn = document.getElementById('onboarding-prev-btn');
  const nextBtn = document.getElementById('onboarding-next-btn');
  
  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) overlay.scrollTop = 0;
  
  document.querySelectorAll('.onboarding-step').forEach((step, idx) => {
    step.classList.toggle('active', (idx + 1) === onboardingStepCurrent);
  });
  
  const pct = (onboardingStepCurrent / onboardingMaxSteps) * 100;
  const indicator = document.getElementById('onboarding-progress-indicator');
  if (indicator) indicator.style.width = `${pct}%`;
  
  if (prevBtn) {
    if (onboardingStepCurrent === 1) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }
  }
  
  if (nextBtn) {
    if (onboardingStepCurrent === onboardingMaxSteps) {
      nextBtn.innerHTML = `Mulai Jurnal Hidup Sehat! 🚀`;
      nextBtn.style.backgroundColor = 'var(--color-primary-dark)';
    } else {
      nextBtn.innerHTML = `Lanjut
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
      nextBtn.style.backgroundColor = 'var(--color-primary)';
    }
  }
}

function renderCalculationInStep4(nutrition) {
  document.getElementById('onboarding-calc-calories').textContent = nutrition.targetCalories.toLocaleString('id-ID');
  document.getElementById('onboarding-calc-bmr').textContent = `${nutrition.bmr.toLocaleString('id-ID')} kkal`;
  document.getElementById('onboarding-calc-tdee').textContent = `${nutrition.tdee.toLocaleString('id-ID')} kkal`;
  
  const targetInfoWrapper = document.getElementById('onboarding-calc-deficit-info');
  const targetText = document.getElementById('onboarding-calc-target-change');
  
  if (nutrition.goal === 'maintain') {
    if (targetInfoWrapper) {
      targetInfoWrapper.style.display = 'flex';
      if (targetText) {
        targetText.textContent = `Mempertahankan berat badan stabil Anda di ${nutrition.weight} kg`;
        targetText.style.color = 'var(--color-primary-dark)';
      }
    }
  } else {
    if (targetInfoWrapper) targetInfoWrapper.style.display = 'flex';
    if (targetText) {
      const diffWeight = Math.abs(nutrition.weight - nutrition.targetWeight);
      const estimatedWeeks = Math.ceil(diffWeight / 0.45) || 1;
      
      if (nutrition.goal === 'deficit') {
        targetText.innerHTML = `Turun dari ${nutrition.weight} kg ke ${nutrition.targetWeight} kg<br><small style="font-size: 0.72rem; color: var(--color-primary); font-weight: 800;">Estimasi tercapai dalam ~${estimatedWeeks} minggu dengan defisit sehat 500 kkal/hari.</small>`;
        targetText.style.color = 'var(--color-primary-dark)';
      } else {
        targetText.innerHTML = `Naik dari ${nutrition.weight} kg ke ${nutrition.targetWeight} kg<br><small style="font-size: 0.72rem; color: #D97706; font-weight: 800;">Estimasi tercapai dalam ~${estimatedWeeks} minggu dengan surplus sehat 500 kkal/hari.</small>`;
        targetText.style.color = '#B45309';
      }
    }
  }
  
  document.getElementById('onboarding-calc-carbs').textContent = `${nutrition.carbs}g`;
  document.getElementById('onboarding-calc-protein').textContent = `${nutrition.protein}g`;
  document.getElementById('onboarding-calc-fat').textContent = `${nutrition.fat}g`;
}

function saveOnboardingTargetToMain(nutritionData, name) {
  const newTarget = {
    name: name,
    gender: document.getElementById('onboarding-gender').value,
    age: parseInt(document.getElementById('onboarding-age').value) || 25,
    weight: parseFloat(document.getElementById('onboarding-weight').value) || 70,
    height: parseFloat(document.getElementById('onboarding-height').value) || 170,
    activity: document.getElementById('onboarding-activity').value,
    goal: nutritionData.goal,
    targetWeight: nutritionData.targetWeight,
    tdee: nutritionData.tdee,
    targetCalories: nutritionData.targetCalories,
    protein: nutritionData.protein,
    carbs: nutritionData.carbs,
    fat: nutritionData.fat
  };
  
  saveTarget(newTarget);
  localStorage.setItem('porsisaku_onboarded', 'true');
  
  if (dom.inputAge) dom.inputAge.value = newTarget.age;
  if (dom.inputWeight) dom.inputWeight.value = newTarget.weight;
  if (dom.inputHeight) dom.inputHeight.value = newTarget.height;
  if (dom.inputActivity) dom.inputActivity.value = newTarget.activity;
  
  if (dom.inputGender) {
    dom.inputGender.value = newTarget.gender;
    document.querySelectorAll('#gender-gender-selectors .segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === newTarget.gender);
    });
  }
  
  if (dom.inputGoal) {
    dom.inputGoal.value = newTarget.goal;
    document.querySelectorAll('#goal-selectors .segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === newTarget.goal);
    });
  }
  
  renderDashboard();
  updateUserGreetingPill();
}

function prefillOnboardingForm() {
  if (currentTarget && currentTarget.name) {
    document.getElementById('onboarding-name').value = currentTarget.name || '';
    
    const gender = currentTarget.gender || 'male';
    document.getElementById('onboarding-gender').value = gender;
    document.querySelectorAll('#onboarding-gender-selectors .segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === gender);
    });
    
    document.getElementById('onboarding-age').value = currentTarget.age || 25;
    document.getElementById('onboarding-height').value = currentTarget.height || 170;
    document.getElementById('onboarding-weight').value = currentTarget.weight || 70.0;
    
    const activity = currentTarget.activity || 'rarely';
    document.getElementById('onboarding-activity').value = activity;
    document.querySelectorAll('.activity-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.value === activity);
    });
    
    const goal = currentTarget.goal || 'maintain';
    document.getElementById('onboarding-goal').value = goal;
    document.querySelectorAll('#onboarding-goal-selectors .segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === goal);
    });
    
    const targetWeight = currentTarget.targetWeight || currentTarget.weight || 70.0;
    document.getElementById('onboarding-target-weight').value = targetWeight;
    
    updateOnboardingTargetWeightWrapper();
  }
}

function updateUserGreetingPill() {
  const pill = document.getElementById('user-greeting-pill');
  if (pill) {
    if (currentTarget && currentTarget.name) {
      pill.textContent = `Halo, ${currentTarget.name} 🌿`;
    } else {
      pill.textContent = `Target Gizi Aktif`;
    }
  }
}

function calculateOnboardingNutrition() {
  const gender = document.getElementById('onboarding-gender').value || 'male';
  const age = parseInt(document.getElementById('onboarding-age').value) || 25;
  const height = parseFloat(document.getElementById('onboarding-height').value) || 170;
  const weight = parseFloat(document.getElementById('onboarding-weight').value) || 70;
  const activity = document.getElementById('onboarding-activity').value || 'rarely';
  const goal = document.getElementById('onboarding-goal').value || 'maintain';
  const targetWeight = parseFloat(document.getElementById('onboarding-target-weight').value) || weight;

  let bmr = 0;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  bmr = Math.round(bmr);

  let multiplier = 1.2;
  if (activity === 'never') multiplier = 1.2;
  else if (activity === 'rarely') multiplier = 1.375;
  else if (activity === 'often') multiplier = 1.55;

  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  if (goal === 'deficit') {
    targetCalories = tdee - 500;
    if (targetCalories < 1200) targetCalories = 1200; 
  } else if (goal === 'surplus') {
    targetCalories = tdee + 500;
  }

  const protein = Math.round((targetCalories * 0.3) / 4);
  const carbs = Math.round((targetCalories * 0.4) / 4);
  const fat = Math.round((targetCalories * 0.3) / 9);

  return {
    goal,
    weight,
    targetWeight,
    bmr,
    tdee,
    targetCalories,
    protein,
    carbs,
    fat
  };
}

// =========================================================================
// 14. LOGIKA PENGATURAN PIRING CAMPURAN (MIXED PLATE) — BARU TAMBAHAN
// =========================================================================

function addFoodToMixedPlate() {
  if (!selectedFoodFromDB) {
    showNotification('Silakan pilih makanan terlebih dahulu!', 'warning');
    return;
  }
  
  const servings = parseFloat(dom.portionInput.textContent) || 1.0;
  const baseGrams = getBaseGrams(selectedFoodFromDB);
  const grams = (dom.portionGramInput && dom.portionGramInput.value !== "") ? parseFloat(dom.portionGramInput.value) : Math.round(servings * baseGrams);

  const calculatedCal = Math.round(selectedFoodFromDB.cal * servings * 10) / 10;
  const calculatedProtein = Math.round(selectedFoodFromDB.protein * servings * 10) / 10;
  const calculatedCarbs = Math.round(selectedFoodFromDB.carbs * servings * 10) / 10;
  const calculatedFat = Math.round(selectedFoodFromDB.fat * servings * 10) / 10;

  const plateItem = {
    id: 'mp_' + Date.now() + Math.random().toString(36).substring(2, 5),
    name: selectedFoodFromDB.name,
    servings: servings,
    grams: grams,
    portionUnit: selectedFoodFromDB.portionUnit,
    cal: calculatedCal,
    protein: calculatedProtein,
    carbs: calculatedCarbs,
    fat: calculatedFat
  };

  mixedPlate.push(plateItem);
  renderMixedPlateUI();
  showNotification(`Ditambahkan ke piring: ${selectedFoodFromDB.name}`);
}

function clearMixedPlate() {
  mixedPlate = [];
  renderMixedPlateUI();
  showNotification('Piring campuran dikosongkan.');
}

function renderMixedPlateUI() {
  if (!dom.mixedPlatePanel) return;

  if (mixedPlate.length === 0) {
    dom.mixedPlatePanel.style.display = 'none';
    if (dom.mixedPlateCount) dom.mixedPlateCount.textContent = '0';
    return;
  }

  dom.mixedPlatePanel.style.display = 'block';
  if (dom.mixedPlateCount) dom.mixedPlateCount.textContent = mixedPlate.length;
  if (dom.mixedPlateItems) dom.mixedPlateItems.innerHTML = '';

  let totalCal = 0, totalCarbs = 0, totalProtein = 0, totalFat = 0;

  mixedPlate.forEach((item, index) => {
    totalCal += item.cal;
    totalCarbs += item.carbs;
    totalProtein += item.protein;
    totalFat += item.fat;

    const li = document.createElement('div');
    // Memaksa lebar 100% dan menggunakan Flexbox
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.width = '100%'; 
    li.style.marginBottom = '12px';
    li.style.paddingBottom = '12px';
    li.style.borderBottom = '1px dashed #cbd5e1';

    // Memisahkan secara paksa sisi kiri (nama) dan sisi kanan (kalori + X)
    li.innerHTML = `
      <div style="flex: 1; text-align: left; padding-right: 15px;">
        <span style="font-size: 0.85rem; font-weight: 600;">🍳 ${item.name}</span> 
        <span style="color: #64748b; font-size: 0.75rem;">(${item.grams}g)</span>
      </div>
      
      <div style="display: flex; align-items: center; gap: 18px; flex-shrink: 0;">
        <span style="font-weight: 800; font-size: 0.85rem; color: var(--color-primary-dark);">${Math.round(item.cal)} kkal</span>
        <button type="button" style="background: none; border: none; color: #ef4444; font-size: 1.25rem; font-weight: bold; cursor: pointer; padding: 0 5px;" onclick="removeMixedPlateItem(${index})">✕</button>
      </div>
    `;
    
    if (dom.mixedPlateItems) dom.mixedPlateItems.appendChild(li);
  });

  if (dom.mixedPlateTotalCal) dom.mixedPlateTotalCal.textContent = Math.round(totalCal) + ' kkal';
  if (dom.mixedPlateTotalCarbs) dom.mixedPlateTotalCarbs.textContent = Math.round(totalCarbs) + 'g';
  if (dom.mixedPlateTotalProtein) dom.mixedPlateTotalProtein.textContent = Math.round(totalProtein) + 'g';
  if (dom.mixedPlateTotalFat) dom.mixedPlateTotalFat.textContent = Math.round(totalFat) + 'g';
}

window.removeMixedPlateItem = function(index) {
  mixedPlate.splice(index, 1);
  renderMixedPlateUI();
};

function saveMixedPlateToLog() {
  if (mixedPlate.length === 0) return;

  const category = dom.mixedPlateMealSelect ? dom.mixedPlateMealSelect.value : activeMealCategory;
  
  let combinedCal = 0, combinedProtein = 0, combinedCarbs = 0, combinedFat = 0;
  let foodNames = [];

  mixedPlate.forEach(item => {
    combinedCal += item.cal;
    combinedProtein += item.protein;
    combinedCarbs += item.carbs;
    combinedFat += item.fat;
    foodNames.push(item.name);
  });

  const logItem = {
    id: 'l_mixed_' + Date.now(),
    name: 'Menu Campuran (' + foodNames.join(', ') + ')',
    category: category,
    servings: 1,
    portionUnit: 'piring',
    loggedWeight: 0,
    totalCal: Math.round(combinedCal),
    totalProtein: Math.round(combinedProtein),
    totalCarbs: Math.round(combinedCarbs),
    totalFat: Math.round(combinedFat)
  };

  if (!dailyLogs[activeDate]) {
    dailyLogs[activeDate] = [];
  }

  dailyLogs[activeDate].push(logItem);
  saveLogs(dailyLogs);

  mixedPlate = [];
  renderMixedPlateUI();
  renderDashboard();
  renderDailyLogs();
  closeFoodDrawer();
  showNotification(`Berhasil memasukkan piring makanan campuran ke ${getCategoryNameID(category)}!`);
}