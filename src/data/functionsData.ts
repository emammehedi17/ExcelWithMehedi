import { FunctionItem } from '../types';

export const CATEGORIES = [
  { id: 'all', label: 'সবগুলো (All)' },
  { id: 'math', label: 'গণিত (Math)' },
  { id: 'stat', label: 'পরিসংখ্যান (Stat)' },
  { id: 'logical', label: 'লজিক্যাল (Logical)' },
  { id: 'lookup', label: 'লুকআপ (Lookup)' },
  { id: 'financial', label: 'আর্থিক (Financial)' },
  { id: 'advanced', label: 'উন্নত (Advanced)' },
  { id: 'date', label: 'তারিখ ও সময় (Date)' },
  { id: 'lab', label: '🧪 প্র্যাকটিস ল্যাব (Labs)' },
];

export const functionsData: FunctionItem[] = [
  // 1. SUM & AVERAGE (Combined)
  {
    id: 'sum_average',
    badge: 'Math & Stat',
    category: 'math',
    name: 'SUM & AVERAGE Functions',
    title: '=SUM(...) / =AVERAGE(...)',
    desc: 'একই টেবিলে শিক্ষার্থীদের প্রতিটি বিষয়ের প্রাপ্ত নম্বরের মোট যোগফল (SUM) এবং গড় নম্বর (AVERAGE) পাশাপাশি কলামে স্বয়ংক্রিয়ভাবে নির্ণয়।',
    tokens: [
      { text: '=SUM(', class: 'c-fn' },
      { text: 'B2:E2', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=AVERAGE(', class: 'c-fn' },
      { text: 'B2:E2', class: 'c-p2' },
      { text: ')', class: 'c-fn' }
    ],
    params: [
      { name: 'SUM(B2:E2)', meaning: 'বাংলা, ইংরেজি, গণিত ও আইসিটি ৪টি বিষয়ের প্রাপ্ত নম্বরের মোট যোগফল।', class: 'c-p1' },
      { name: 'AVERAGE(B2:E2)', meaning: '৪টি বিষয়ের প্রাপ্ত নম্বরের গাণিতিক গড় (Average) মান নির্ণয়।', class: 'c-p2' },
      { name: 'B2:E2', meaning: 'যে সেলগুলোর উপর যোগ বা গড় হিসাব প্রযোজ্য হবে সেই সেল রেঞ্জ।', class: 'c-p3' }
    ],
    activeCell: 'F2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['130px', '85px', '85px', '85px', '85px', '135px', '135px'],
    headers: ['শিক্ষার্থী', 'বাংলা', 'ইংরেজি', 'গণিত', 'আইসিটি', 'মোট নম্বর (SUM)', 'গড় নম্বর (AVERAGE)'],
    rows: [
      ['রাহিম আহমেদ', 85, 78, 92, 88, '=SUM(B2:E2)', '=AVERAGE(B2:E2)'],
      ['সাদিয়া ইসলাম', 90, 84, 88, 95, '=SUM(B3:E3)', '=AVERAGE(B3:E3)'],
      ['তানভীর হাসান', 65, 70, 72, 68, '=SUM(B4:E4)', '=AVERAGE(B4:E4)'],
      ['নুসরাত জাহান', 78, 82, 80, 85, '=SUM(B5:E5)', '=AVERAGE(B5:E5)'],
      ['মাহমুদুল হাসান', 92, 88, 95, 90, '=SUM(B6:E6)', '=AVERAGE(B6:E6)'],
      ['ফারহানা হক', 55, 60, 58, 62, '=SUM(B7:E7)', '=AVERAGE(B7:E7)'],
      ['আরিফুর রহমান', 80, 75, 85, 78, '=SUM(B8:E8)', '=AVERAGE(B8:E8)'],
      ['মেহেরিন সুলতানা', 88, 91, 84, 89, '=SUM(B9:E9)', '=AVERAGE(B9:E9)'],
      ['জাহিদ করিম', 72, 68, 75, 70, '=SUM(B10:E10)', '=AVERAGE(B10:E10)'],
      ['তাসনিম আক্তার', 95, 92, 98, 94, '=SUM(B11:E11)', '=AVERAGE(B11:E11)']
    ]
  },

  // 2. MIN & MAX (Combined)
  {
    id: 'min_max',
    badge: 'Stat',
    category: 'stat',
    name: 'MIN & MAX Functions',
    title: '=MIN(...) / =MAX(...)',
    desc: 'একই টেবিলে বিভিন্ন সপ্তাহের সেলস পারফরম্যান্সের সর্বনিম্ন বিক্রি (MIN) এবং সর্বোচ্চ বিক্রি (MAX) পাশাপাশি আলাদা কলামে প্রদর্শন।',
    tokens: [
      { text: '=MIN(', class: 'c-fn' },
      { text: 'B2:E2', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=MAX(', class: 'c-fn' },
      { text: 'B2:E2', class: 'c-p2' },
      { text: ')', class: 'c-fn' }
    ],
    params: [
      { name: 'MIN(B2:E2)', meaning: 'সপ্তাহ ১ থেকে সপ্তাহ ৪-এর মধ্যে সর্বনিম্ন বিক্রয় পরিমাণ বের করে।', class: 'c-p1' },
      { name: 'MAX(B2:E2)', meaning: 'চারটি সপ্তাহের মধ্যে সর্বোচ্চ বিক্রয় পরিমাণ খুঁজে বের করে।', class: 'c-p2' },
      { name: 'B2:E2', meaning: '৪ সপ্তাহের বিক্রয় পরিসংখ্যান নির্দেশক সেল রেঞ্জ।', class: 'c-p3' }
    ],
    activeCell: 'F2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['130px', '90px', '90px', '90px', '90px', '140px', '140px'],
    headers: ['বিক্রেতা', 'সপ্তাহ ১', 'সপ্তাহ ২', 'সপ্তাহ ৩', 'সপ্তাহ ৪', 'সর্বনিম্ন বিক্রয় (MIN)', 'সর্বোচ্চ বিক্রয় (MAX)'],
    rows: [
      ['করিম অ্যান্ড কোং', 450, 320, 680, 510, '=MIN(B2:E2)', '=MAX(B2:E2)'],
      ['রহমান ট্রেডার্স', 280, 410, 390, 310, '=MIN(B3:E3)', '=MAX(B3:E3)'],
      ['আলম এন্টারপ্রাইজ', 720, 650, 800, 780, '=MIN(B4:E4)', '=MAX(B4:E4)'],
      ['মেসার্স হক', 190, 230, 210, 180, '=MIN(B5:E5)', '=MAX(B5:E5)'],
      ['খান ব্রাদার্স', 550, 490, 620, 580, '=MIN(B6:E6)', '=MAX(B6:E6)'],
      ['সিটি ডিস্ট্রিবিউশন', 310, 340, 290, 380, '=MIN(B7:E7)', '=MAX(B7:E7)'],
      ['গ্রিন সাপ্লাইয়ার্স', 600, 710, 650, 690, '=MIN(B8:E8)', '=MAX(B8:E8)'],
      ['পদ্মা স্টোর', 420, 380, 460, 440, '=MIN(B9:E9)', '=MAX(B9:E9)'],
      ['মেঘনা এজেন্সি', 250, 290, 270, 310, '=MIN(B10:E10)', '=MAX(B10:E10)'],
      ['যমুনা কর্পোরেশন', 830, 790, 910, 870, '=MIN(B11:E11)', '=MAX(B11:E11)']
    ]
  },

  // 3. COUNT & COUNTA (Combined)
  {
    id: 'count_counta',
    badge: 'Stat',
    category: 'stat',
    name: 'COUNT & COUNTA Functions',
    title: '=COUNT(...) / =COUNTA(...)',
    desc: 'একই টেবিলে পার্থক্য যাচাই: COUNT শুধুমাত্র সংখ্যাযুক্ত (numeric) সেল গণনা করে, আর COUNTA সংখ্যা ও টেক্সটসহ যেকোনো অ-খালি সেল গণনা করে।',
    tokens: [
      { text: '=COUNT(', class: 'c-fn' },
      { text: 'B2:E2', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=COUNTA(', class: 'c-fn' },
      { text: 'B2:E2', class: 'c-p2' },
      { text: ')', class: 'c-fn' }
    ],
    params: [
      { name: 'COUNT(B2:E2)', meaning: 'রেঞ্জের মধ্যে শুধুমাত্র সংখ্যাযুক্ত সেলগুলো গণনা করে (টেক্সট উপেক্ষা করে)।', class: 'c-p1' },
      { name: 'COUNTA(B2:E2)', meaning: 'খালি নয় এমন সকল সেল (সংখ্যা ও টেক্সট মন্তব্য উভয়ই) গণনা করে।', class: 'c-p2' },
      { name: 'B2:E2', meaning: 'প্রার্থীর টেস্ট স্কোর ও স্ট্যাটাস তথ্য ধারণকারী সেল রেঞ্জ।', class: 'c-p3' }
    ],
    activeCell: 'F2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['130px', '85px', '85px', '110px', '110px', '145px', '150px'],
    headers: ['প্রার্থী / আবেদনকারী', 'মক টেস্ট ১', 'মক টেস্ট ২', 'ডকুমেন্ট স্ট্যাটাস', 'মৌখিক ফিডব্যাক', 'স্কোর গণনা (COUNT)', 'মোট এন্ট্রি (COUNTA)'],
    rows: [
      ['আহমেদ হাসান', 85, 78, 'Complete', 'Pass', '=COUNT(B2:E2)', '=COUNTA(B2:E2)'],
      ['সালমা চৌধুরী', 92, '', 'Pending', 'Good', '=COUNT(B3:E3)', '=COUNTA(B3:E3)'],
      ['ইমরান হোসেন', '', 65, 'Complete', 'Wait', '=COUNT(B4:E4)', '=COUNTA(B4:E4)'],
      ['নাসরিন আক্তার', 74, 80, '', 'Pass', '=COUNT(B5:E5)', '=COUNTA(B5:E5)'],
      ['তারেক রহমান', 88, 91, 'Complete', 'Excellent', '=COUNT(B6:E6)', '=COUNTA(B6:E6)'],
      ['ফারজানা ববি', '', '', 'Pending', 'Absent', '=COUNT(B7:E7)', '=COUNTA(B7:E7)'],
      ['শামীম রেজা', 60, 72, 'Complete', 'Average', '=COUNT(B8:E8)', '=COUNTA(B8:E8)'],
      ['রুমানা পারভীন', 95, '', 'Complete', 'Pass', '=COUNT(B9:E9)', '=COUNTA(B9:E9)'],
      ['কামরুল ইসলাম', 70, 75, '', 'Good', '=COUNT(B10:E10)', '=COUNTA(B10:E10)'],
      ['আয়েশা সিদ্দিকা', 82, 88, 'Complete', 'Top', '=COUNT(B11:E11)', '=COUNTA(B11:E11)']
    ]
  },

  // 4. COUNTIF & SUMIF (Combined)
  {
    id: 'countif_sumif',
    badge: 'Math & Stat',
    category: 'math',
    name: 'COUNTIF & SUMIF Functions',
    title: '=COUNTIF(range, criteria) / =SUMIF(range, criteria)',
    desc: 'একই টেবিলে শর্ত সাপেক্ষে গণনা (COUNTIF) এবং শর্ত সাপেক্ষে যোগফল (SUMIF)। প্রতিটি শাখার ৫০০ বা তদূর্ধ্ব অর্ডারের সংখ্যা ও তাদের মোট বিক্রয় হিসাব।',
    tokens: [
      { text: '=COUNTIF(', class: 'c-fn' },
      { text: 'B2:E2', class: 'c-p1' },
      { text: ', ">=500")', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=SUMIF(', class: 'c-fn' },
      { text: 'B2:E2', class: 'c-p1' },
      { text: ', ">=500")', class: 'c-p3' }
    ],
    params: [
      { name: 'COUNTIF(B2:E2, ">=500")', meaning: '৪টি অর্ডারের মধ্যে কতটি অর্ডারের মূল্য ৫০০ বা তার বেশি তা গণনা করে।', class: 'c-p2' },
      { name: 'SUMIF(B2:E2, ">=500")', meaning: 'শুধুমাত্র ৫০০ বা তার বেশি মূল্যের বড় অর্ডারগুলোর মোট যোগফল নির্ণয় করে।', class: 'c-p3' },
      { name: 'B2:E2', meaning: 'শাখার প্রতিটি অর্ডারের মূল্যের সেল রেঞ্জ।', class: 'c-p1' }
    ],
    activeCell: 'F2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['130px', '90px', '90px', '90px', '90px', '150px', '150px'],
    headers: ['শাখা / রিজিয়ন', 'অর্ডার ১', 'অর্ডার ২', 'অর্ডার ৩', 'অর্ডার ৪', 'বড় অর্ডার সংখ্যা (COUNTIF)', 'বড় অর্ডারের মোট (SUMIF)'],
    rows: [
      ['মতিঝিল শাখা', 650, 320, 800, 450, '=COUNTIF(B2:E2, ">=500")', '=SUMIF(B2:E2, ">=500")'],
      ['গুলশান শাখা', 400, 950, 720, 610, '=COUNTIF(B3:E3, ">=500")', '=SUMIF(B3:E3, ">=500")'],
      ['ধানমন্ডি শাখা', 300, 450, 280, 520, '=COUNTIF(B4:E4, ">=500")', '=SUMIF(B4:E4, ">=500")'],
      ['উত্তরা শাখা', 750, 820, 690, 540, '=COUNTIF(B5:E5, ">=500")', '=SUMIF(B5:E5, ">=500")'],
      ['মিরপুর শাখা', 200, 350, 480, 390, '=COUNTIF(B6:E6, ">=500")', '=SUMIF(B6:E6, ">=500")'],
      ['চট্টগ্রাম শাখা', 850, 410, 600, 750, '=COUNTIF(B7:E7, ">=500")', '=SUMIF(B7:E7, ">=500")'],
      ['সিলেট শাখা', 510, 490, 530, 480, '=COUNTIF(B8:E8, ">=500")', '=SUMIF(B8:E8, ">=500")'],
      ['রাজশাহী শাখা', 320, 290, 650, 420, '=COUNTIF(B9:E9, ">=500")', '=SUMIF(B9:E9, ">=500")'],
      ['খুলনা শাখা', 600, 700, 850, 920, '=COUNTIF(B10:E10, ">=500")', '=SUMIF(B10:E10, ">=500")'],
      ['বরিশাল শাখা', 450, 550, 380, 620, '=COUNTIF(B11:E11, ">=500")', '=SUMIF(B11:E11, ">=500")']
    ]
  },

  // 5. LAB 1: FULL SALARY SHEET
  {
    id: 'lab1',
    badge: 'Practice Lab',
    category: 'lab',
    name: 'ল্যাব ১: সম্পূর্ণ স্যালারি শিট (Salary Sheet)',
    title: 'Comprehensive Corporate Payroll & Salary Sheet',
    desc: 'বাস্তবধর্মী করপোরেট পে-রোল: Basic Salary-র ভিত্তিতে House Rent (50%), Medical (10%), PF কর্তন (8%), Gross এবং Net Salary নির্ণয়।',
    tokens: [
      { text: '=C2*0.5', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=C2*0.1', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=C2+D2+E2', class: 'c-p3' },
      { text: ' | ', class: 'c-fn' },
      { text: '=G2-F2', class: 'c-p4' }
    ],
    params: [
      { name: 'House Rent (50%)', meaning: 'মূল বেতনের ৫০% বাড়িভাড়া ভাতা (=C2*0.5)।', class: 'c-p1' },
      { name: 'Medical (10%)', meaning: 'মূল বেতনের ১০% চিকিৎসা ভাতা (=C2*0.1)।', class: 'c-p2' },
      { name: 'Gross Salary', meaning: 'মূল বেতন + বাড়িভাড়া + চিকিৎসা ভাতার যোগফল (=C2+D2+E2)।', class: 'c-p3' },
      { name: 'Net Pay', meaning: 'Gross থেকে প্রভিডেন্ট ফান্ড কর্তন বাদে প্রকৃত প্রদেয় বেতন (=G2-F2)।', class: 'c-p4' }
    ],
    activeCell: 'G2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    colWidths: ['90px', '130px', '100px', '120px', '110px', '95px', '110px', '110px'],
    headers: ['Emp_ID', 'Name', 'Basic', 'HouseRent(50%)', 'Medical(10%)', 'PF(8%)', 'Gross', 'Net Pay'],
    rows: [
      ['EMP-101', 'আহমেদ করিম', 45000, '=C2*0.5', '=C2*0.1', '=C2*0.08', '=C2+D2+E2', '=G2-F2'],
      ['EMP-102', 'সাদিয়া ইসলাম', 52000, '=C3*0.5', '=C3*0.1', '=C3*0.08', '=C3+D3+E3', '=G3-F3'],
      ['EMP-103', 'তানভীর আহমেদ', 38000, '=C4*0.5', '=C4*0.1', '=C4*0.08', '=C4+D4+E4', '=G4-F4'],
      ['EMP-104', 'নুসরাত জাহান', 41000, '=C5*0.5', '=C5*0.1', '=C5*0.08', '=C5+D5+E5', '=G5-F5'],
      ['EMP-105', 'মাহমুদুর রহমান', 60000, '=C6*0.5', '=C6*0.1', '=C6*0.08', '=C6+D6+E6', '=G6-F6'],
      ['EMP-106', 'ফারহানা ইসলাম', 35000, '=C7*0.5', '=C7*0.1', '=C7*0.08', '=C7+D7+E7', '=G7-F7'],
      ['EMP-107', 'আরিফ জামান', 48000, '=C8*0.5', '=C8*0.1', '=C8*0.08', '=C8+D8+E8', '=G8-F8'],
      ['EMP-108', 'মেহের নিগার', 55000, '=C9*0.5', '=C9*0.1', '=C9*0.08', '=C9+D9+E9', '=G9-F9'],
      ['EMP-109', 'কামাল উদ্দিন', 32000, '=C10*0.5', '=C10*0.1', '=C10*0.08', '=C10+D10+E10', '=G10-F10'],
      ['EMP-110', 'জেরিন তাসনিম', 58000, '=C11*0.5', '=C11*0.1', '=C11*0.08', '=C11+D11+E11', '=G11-F11']
    ]
  },

  // 6. IF, NESTED IF & IFS (Combined)
  {
    id: 'if_nested_ifs',
    badge: 'Logical',
    category: 'logical',
    name: 'IF, Nested IF & IFS Functions',
    title: '=IF(...) / =IF(..., IF(...)) / =IFS(...)',
    desc: 'একই টেবিলে বেসিক IF দিয়ে পাস/ফেল, Nested IF দিয়ে গ্রেড (A, B, C, F), এবং আধুনিক IFS দিয়ে পারফরম্যান্স রেটিং নির্ধারণের পূর্ণাঙ্গ সমন্বয়।',
    tokens: [
      { text: '=IF(E2>=40, "Pass", "Fail")', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=IF(E2>=80, "A", IF(E2>=70, "B", IF(E2>=60, "C", "F")))', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=IFS(E2>=80, "Outstanding", E2>=70, "Very Good", E2>=60, "Good", TRUE, "Needs Help")', class: 'c-p3' }
    ],
    params: [
      { name: 'ফলাফল (IF)', meaning: 'গড় নম্বর ৪০ বা তার বেশি হলে "Pass", অন্যথায় "Fail" রিটার্ন করে।', class: 'c-p1' },
      { name: 'লেটার গ্রেড (Nested IF)', meaning: '৮০+ হলে A, ৭০+ হলে B, ৬০+ হলে C, এবং ৬০ এর নিচে হলে F গ্রেড।', class: 'c-p2' },
      { name: 'রেটিং (IFS)', meaning: 'একই লাইনে একাধিক শর্ত পরীক্ষা করে তাৎক্ষণিক টেক্সট ফিডব্যাক প্রদর্শন।', class: 'c-p3' }
    ],
    activeCell: 'F2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    colWidths: ['120px', '75px', '75px', '75px', '90px', '110px', '135px', '145px'],
    headers: ['শিক্ষার্থী', 'বাংলা', 'ইংরেজি', 'গণিত', 'গড় নম্বর', 'ফলাফল (IF)', 'গ্রেড (Nested IF)', 'রেটিং (IFS)'],
    rows: [
      ['রাকিবুল হাসান', 85, 78, 92, '=AVERAGE(B2:D2)', '=IF(E2>=40, "Pass", "Fail")', '=IF(E2>=80, "A", IF(E2>=70, "B", IF(E2>=60, "C", "F")))', '=IFS(E2>=80, "Outstanding", E2>=70, "Very Good", E2>=60, "Good", TRUE, "Needs Help")'],
      ['সানজিদা আহমেদ', 90, 84, 88, '=AVERAGE(B3:D3)', '=IF(E3>=40, "Pass", "Fail")', '=IF(E3>=80, "A", IF(E3>=70, "B", IF(E3>=60, "C", "F")))', '=IFS(E3>=80, "Outstanding", E3>=70, "Very Good", E3>=60, "Good", TRUE, "Needs Help")'],
      ['তানিম ইকবাল', 65, 70, 72, '=AVERAGE(B4:D4)', '=IF(E4>=40, "Pass", "Fail")', '=IF(E4>=80, "A", IF(E4>=70, "B", IF(E4>=60, "C", "F")))', '=IFS(E4>=80, "Outstanding", E4>=70, "Very Good", E4>=60, "Good", TRUE, "Needs Help")'],
      ['মুমতাহিনা হক', 78, 82, 80, '=AVERAGE(B5:D5)', '=IF(E5>=40, "Pass", "Fail")', '=IF(E5>=80, "A", IF(E5>=70, "B", IF(E5>=60, "C", "F")))', '=IFS(E5>=80, "Outstanding", E5>=70, "Very Good", E5>=60, "Good", TRUE, "Needs Help")'],
      ['নাজমুল সাকিব', 35, 42, 38, '=AVERAGE(B6:D6)', '=IF(E6>=40, "Pass", "Fail")', '=IF(E6>=80, "A", IF(E6>=70, "B", IF(E6>=60, "C", "F")))', '=IFS(E6>=80, "Outstanding", E6>=70, "Very Good", E6>=60, "Good", TRUE, "Needs Help")'],
      ['সুমাইয়া ফারহানা', 58, 62, 60, '=AVERAGE(B7:D7)', '=IF(E7>=40, "Pass", "Fail")', '=IF(E7>=80, "A", IF(E7>=70, "B", IF(E7>=60, "C", "F")))', '=IFS(E7>=80, "Outstanding", E7>=70, "Very Good", E7>=60, "Good", TRUE, "Needs Help")'],
      ['ফাহিম মোর্শেদ', 74, 76, 75, '=AVERAGE(B8:D8)', '=IF(E8>=40, "Pass", "Fail")', '=IF(E8>=80, "A", IF(E8>=70, "B", IF(E8>=60, "C", "F")))', '=IFS(E8>=80, "Outstanding", E8>=70, "Very Good", E8>=60, "Good", TRUE, "Needs Help")'],
      ['তাসফিয়া ইসলাম', 88, 92, 86, '=AVERAGE(B9:D9)', '=IF(E9>=40, "Pass", "Fail")', '=IF(E9>=80, "A", IF(E9>=70, "B", IF(E9>=60, "C", "F")))', '=IFS(E9>=80, "Outstanding", E9>=70, "Very Good", E9>=60, "Good", TRUE, "Needs Help")'],
      ['আব্দুল্লাহ আলিম', 62, 68, 65, '=AVERAGE(B10:D10)', '=IF(E10>=40, "Pass", "Fail")', '=IF(E10>=80, "A", IF(E10>=70, "B", IF(E10>=60, "C", "F")))', '=IFS(E10>=80, "Outstanding", E10>=70, "Very Good", E10>=60, "Good", TRUE, "Needs Help")'],
      ['রুবাইয়া খানম', 92, 95, 94, '=AVERAGE(B11:D11)', '=IF(E11>=40, "Pass", "Fail")', '=IF(E11>=80, "A", IF(E11>=70, "B", IF(E11>=60, "C", "F")))', '=IFS(E11>=80, "Outstanding", E11>=70, "Very Good", E11>=60, "Good", TRUE, "Needs Help")']
    ]
  },

  // 7. AND & OR (Combined)
  {
    id: 'and_or',
    badge: 'Logical',
    category: 'logical',
    name: 'AND & OR Logical Functions',
    title: '=AND(...) / =OR(...) / =IF(AND(...))',
    desc: 'লজিক্যাল গেট যাচাই: AND ফাংশনে সকল শর্ত সত্য হতে হয়, আর OR ফাংশনে যেকোনো একটি শর্ত সত্য হলেই TRUE রিটার্ন করে। একই টেবিলে নিয়োগ যাচাই।',
    tokens: [
      { text: '=AND(B2>=50, C2>=50, D2>=50)', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=OR(B2>=80, C2>=80, D2>=80)', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=IF(AND(B2>=50, C2>=50, D2>=50), "Selected", "Rejected")', class: 'c-p3' }
    ],
    params: [
      { name: 'সকল বিষয়ে পাস? (AND)', meaning: 'লিখিত, মৌখিক ও প্র্যাকটিক্যাল তিনটিতেই ৫০ বা তদূর্ধ্ব পেলে TRUE।', class: 'c-p1' },
      { name: 'একটি বিষয়ে ৮০+? (OR)', meaning: 'যেকোনো একটি ধাপে ৮০ বা তার বেশি (ডিস্টিংশন) পেলেই TRUE।', class: 'c-p2' },
      { name: 'চূড়ান্ত নিয়োগ (IF+AND)', meaning: 'সকল শর্ত পূরণকারী প্রার্থীদের "Selected", অন্যথায় "Rejected"।', class: 'c-p3' }
    ],
    activeCell: 'E2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['130px', '95px', '85px', '95px', '145px', '145px', '135px'],
    headers: ['প্রার্থী', 'লিখিত (>=৫০)', 'ভাইভা (>=৫০)', 'প্র্যাকটিক্যাল', 'সকল বিষয়ে পাস? (AND)', 'একটি বিষয়ে ৮০+? (OR)', 'চূড়ান্ত নিয়োগ'],
    rows: [
      ['আব্দুল মান্নান', 75, 65, 82, '=AND(B2>=50, C2>=50, D2>=50)', '=OR(B2>=80, C2>=80, D2>=80)', '=IF(AND(B2>=50, C2>=50, D2>=50), "Selected", "Rejected")'],
      ['শারমিন সুলতানা', 85, 45, 90, '=AND(B3>=50, C3>=50, D3>=50)', '=OR(B3>=80, C3>=80, D3>=80)', '=IF(AND(B3>=50, C3>=50, D3>=50), "Selected", "Rejected")'],
      ['কামরুল ইসলাম', 60, 55, 58, '=AND(B4>=50, C4>=50, D4>=50)', '=OR(B4>=80, C4>=80, D4>=80)', '=IF(AND(B4>=50, C4>=50, D4>=50), "Selected", "Rejected")'],
      ['রুবাইয়া খানম', 90, 85, 88, '=AND(B5>=50, C5>=50, D5>=50)', '=OR(B5>=80, C5>=80, D5>=80)', '=IF(AND(B5>=50, C5>=50, D5>=50), "Selected", "Rejected")'],
      ['তৌফিক এলাহী', 45, 70, 65, '=AND(B6>=50, C6>=50, D6>=50)', '=OR(B6>=80, C6>=80, D6>=80)', '=IF(AND(B6>=50, C6>=50, D6>=50), "Selected", "Rejected")'],
      ['সামিরা হক', 82, 78, 85, '=AND(B7>=50, C7>=50, D7>=50)', '=OR(B7>=80, C7>=80, D7>=80)', '=IF(AND(B7>=50, C7>=50, D7>=50), "Selected", "Rejected")'],
      ['মাহফুজুর রহমান', 68, 62, 48, '=AND(B8>=50, C8>=50, D8>=50)', '=OR(B8>=80, C8>=80, D8>=80)', '=IF(AND(B8>=50, C8>=50, D8>=50), "Selected", "Rejected")'],
      ['নাদিয়া আফরিন', 95, 88, 92, '=AND(B9>=50, C9>=50, D9>=50)', '=OR(B9>=80, C9>=80, D9>=80)', '=IF(AND(B9>=50, C9>=50, D9>=50), "Selected", "Rejected")'],
      ['হাসিবুল হাসান', 52, 58, 60, '=AND(B10>=50, C10>=50, D10>=50)', '=OR(B10>=80, C10>=80, D10>=80)', '=IF(AND(B10>=50, C10>=50, D10>=50), "Selected", "Rejected")'],
      ['জেরিন তাসনিম', 88, 82, 84, '=AND(B11>=50, C11>=50, D11>=50)', '=OR(B11>=80, C11>=80, D11>=80)', '=IF(AND(B11>=50, C11>=50, D11>=50), "Selected", "Rejected")']
    ]
  },

  // 8. PRACTICE LAB: BANK LOAN SUITE (Home, Consumer, Car Loan Combined)
  {
    id: 'practice-loans',
    badge: 'Practice Lab',
    category: 'lab',
    name: 'ল্যাব: ব্যাংক লোন যোগ্যতা ও সুদের হার শিট',
    title: 'Bank Loan Eligibility & Interest Rate Suite (Home, Consumer & Car Loan)',
    desc: 'ব্যাংকিং প্র্যাকটিস ল্যাব: একই টেবিলে হোম লোন যোগ্যতা (IF+OR), কনজিউমার লোনে সুদের হার নির্ধারণ (IF+OR), এবং কার লোন অনুমোদন (IF+AND+OR) যাচাই।',
    tokens: [
      { text: '=IF(OR(B2>=40000, C2>=25), "Eligible", "Not Eligible")', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=IF(OR(D2="T", B2>50000), "10%", "15%")', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=IF(OR(AND(C2>=30, B2>50000), D2="T"), "Eligible", "Not Eligible")', class: 'c-p3' }
    ],
    params: [
      { name: 'হোম লোন (IF+OR)', meaning: 'বেতন ৪০,০০০ বা তার বেশি অথবা বয়স ২৫ বা তার বেশি হলে হোম লোনে Eligible।', class: 'c-p1' },
      { name: 'কনজিউমার সুদ (IF+OR)', meaning: 'ব্যাংক কর্মকর্তা (T) অথবা বেতন ৫০,০০০-এর বেশি হলে ১০% স্পেশাল রেট, নতুবা ১৫%।', class: 'c-p2' },
      { name: 'কার লোন (IF+AND+OR)', meaning: 'বয়স ৩০+ ও বেতন ৫০,০০০+ হলে অথবা ব্যাংকার হলে কার লোন অনুমোদন।', class: 'c-p3' }
    ],
    activeCell: 'E2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['130px', '110px', '90px', '110px', '150px', '145px', '150px'],
    headers: ['আবেদনকারী', 'মাসিক বেতন (Tk)', 'বয়স (Years)', 'ব্যাংক কর্মী? (T/F)', 'হোম লোন (IF+OR)', 'কনজিউমার সুদ (IF+OR)', 'কার লোন (IF+AND+OR)'],
    rows: [
      ['আনিসুর রহমান', 45000, 28, 'F', '=IF(OR(B2>=40000, C2>=25), "Eligible", "Not Eligible")', '=IF(OR(D2="T", B2>50000), "10%", "15%")', '=IF(OR(AND(C2>=30, B2>50000), D2="T"), "Eligible", "Not Eligible")'],
      ['নাসরিন সুলতানা', 35000, 24, 'T', '=IF(OR(B3>=40000, C3>=25), "Eligible", "Not Eligible")', '=IF(OR(D3="T", B3>50000), "10%", "15%")', '=IF(OR(AND(C3>=30, B3>50000), D3="T"), "Eligible", "Not Eligible")'],
      ['সোহেল রানা', 65000, 34, 'F', '=IF(OR(B4>=40000, C4>=25), "Eligible", "Not Eligible")', '=IF(OR(D4="T", B4>50000), "10%", "15%")', '=IF(OR(AND(C4>=30, B4>50000), D4="T"), "Eligible", "Not Eligible")'],
      ['মাকসুদা আক্তার', 28000, 22, 'F', '=IF(OR(B5>=40000, C5>=25), "Eligible", "Not Eligible")', '=IF(OR(D5="T", B5>50000), "10%", "15%")', '=IF(OR(AND(C5>=30, B5>50000), D5="T"), "Eligible", "Not Eligible")'],
      ['তারেক মাহমুদ', 55000, 31, 'T', '=IF(OR(B6>=40000, C6>=25), "Eligible", "Not Eligible")', '=IF(OR(D6="T", B6>50000), "10%", "15%")', '=IF(OR(AND(C6>=30, B6>50000), D6="T"), "Eligible", "Not Eligible")'],
      ['ফারহানা আলম', 42000, 26, 'F', '=IF(OR(B7>=40000, C7>=25), "Eligible", "Not Eligible")', '=IF(OR(D7="T", B7>50000), "10%", "15%")', '=IF(OR(AND(C7>=30, B7>50000), D7="T"), "Eligible", "Not Eligible")'],
      ['জহিরুল হক', 38000, 29, 'F', '=IF(OR(B8>=40000, C8>=25), "Eligible", "Not Eligible")', '=IF(OR(D8="T", B8>50000), "10%", "15%")', '=IF(OR(AND(C8>=30, B8>50000), D8="T"), "Eligible", "Not Eligible")'],
      ['শায়লা পারভীন', 75000, 38, 'F', '=IF(OR(B9>=40000, C9>=25), "Eligible", "Not Eligible")', '=IF(OR(D9="T", B9>50000), "10%", "15%")', '=IF(OR(AND(C9>=30, B9>50000), D9="T"), "Eligible", "Not Eligible")'],
      ['কামরুল হাসান', 30000, 23, 'T', '=IF(OR(B10>=40000, C10>=25), "Eligible", "Not Eligible")', '=IF(OR(D10="T", B10>50000), "10%", "15%")', '=IF(OR(AND(C10>=30, B10>50000), D10="T"), "Eligible", "Not Eligible")'],
      ['আফসানা আহমেদ', 52000, 32, 'F', '=IF(OR(B11>=40000, C11>=25), "Eligible", "Not Eligible")', '=IF(OR(D11="T", B11>50000), "10%", "15%")', '=IF(OR(AND(C11>=30, B11>50000), D11="T"), "Eligible", "Not Eligible")']
    ]
  },

  // 9. PRACTICE LAB: HR PAYROLL, OVERTIME & TAX (Combined)
  {
    id: 'practice-payroll-tax',
    badge: 'Practice Lab',
    category: 'lab',
    name: 'ল্যাব: এইচআর পে-রোল, ওভারটাইম ও ইনকাম ট্যাক্স',
    title: 'HR Payroll, Overtime Allowance & NBR Income Tax Sheet',
    desc: 'প্র্যাকটিস ল্যাব: পদবী অনুযায়ী বাড়িভাড়া (IF/OR), বেতন স্ল্যাব অনুযায়ী ওভারটাইম রেট (Nested IF), এবং বার্ষিক মোট আয়ের ওপর এনবিআর ইনকাম ট্যাক্স স্ল্যাব হিসাব।',
    tokens: [
      { text: '=IF(OR(B2="CEO", B2="Manager"), C2*0.35, C2*0.4)', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=IF(C2<20000, 250, IF(C2<30000, 275, 290))*D2', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=IF(F2*12<=350000, "0%", IF(F2*12<=450000, "5%", IF(F2*12<=750000, "10%", "15%")))', class: 'c-p3' }
    ],
    params: [
      { name: 'বাড়িভাড়া (IF/OR)', meaning: 'CEO বা Manager হলে ৩৫%, অন্যান্য সকল পদের জন্য ৪০% বাড়িভাড়া।', class: 'c-p1' },
      { name: 'ওভারটাইম (Nested IF)', meaning: 'বেতন <২০হাজার হলে ২৫০/ঘণ্টা, <৩০হাজার হলে ২৭৫/ঘণ্টা, অন্যথায় ২৯০/ঘণ্টা।', class: 'c-p2' },
      { name: 'ট্যাক্স রেট (NBR)', meaning: 'বার্ষিক আয় ৩.৫ লাখ পর্যন্ত ০%, ৪.৫ লাখ পর্যন্ত ৫%, ৭.৫ লাখ পর্যন্ত ১০%, উপরে ১৫%।', class: 'c-p3' }
    ],
    activeCell: 'E2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['130px', '110px', '100px', '95px', '140px', '115px', '145px'],
    headers: ['কর্মকর্তা', 'পদবী', 'মূল বেতন', 'ওভারটাইম ঘণ্টা', 'ওভারটাইম ভাতা (IF Tiers)', 'মাসিক মোট আয়', 'এনবিআর ট্যাক্স রেট'],
    rows: [
      ['রফিকুল আলম', 'CEO', 65000, 10, '=IF(C2<20000, 250, IF(C2<30000, 275, 290))*D2', '=C2+IF(OR(B2="CEO", B2="Manager"), C2*0.35, C2*0.4)+E2', '=IF(F2*12<=350000, "0%", IF(F2*12<=450000, "5%", IF(F2*12<=750000, "10%", "15%")))'],
      ['নাজনীন আক্তার', 'Manager', 42000, 15, '=IF(C3<20000, 250, IF(C3<30000, 275, 290))*D3', '=C3+IF(OR(B3="CEO", B3="Manager"), C3*0.35, C3*0.4)+E3', '=IF(F3*12<=350000, "0%", IF(F3*12<=450000, "5%", IF(F3*12<=750000, "10%", "15%")))'],
      ['বাপ্পি সাহা', 'Officer', 26000, 20, '=IF(C4<20000, 250, IF(C4<30000, 275, 290))*D4', '=C4+IF(OR(B4="CEO", B4="Manager"), C4*0.35, C4*0.4)+E4', '=IF(F4*12<=350000, "0%", IF(F4*12<=450000, "5%", IF(F4*12<=750000, "10%", "15%")))'],
      ['রাহেলা বেগম', 'Assistant', 18000, 12, '=IF(C5<20000, 250, IF(C5<30000, 275, 290))*D5', '=C5+IF(OR(B5="CEO", B5="Manager"), C5*0.35, C5*0.4)+E5', '=IF(F5*12<=350000, "0%", IF(F5*12<=450000, "5%", IF(F5*12<=750000, "10%", "15%")))'],
      ['শাহীন রেজা', 'Officer', 28000, 18, '=IF(C6<20000, 250, IF(C6<30000, 275, 290))*D6', '=C6+IF(OR(B6="CEO", B6="Manager"), C6*0.35, C6*0.4)+E6', '=IF(F6*12<=350000, "0%", IF(F6*12<=450000, "5%", IF(F6*12<=750000, "10%", "15%")))'],
      ['ফারুক হোসেন', 'Manager', 48000, 8, '=IF(C7<20000, 250, IF(C7<30000, 275, 290))*D7', '=C7+IF(OR(B7="CEO", B7="Manager"), C7*0.35, C7*0.4)+E7', '=IF(F7*12<=350000, "0%", IF(F7*12<=450000, "5%", IF(F7*12<=750000, "10%", "15%")))'],
      ['সাবরিনা চৌধুরী', 'Staff', 16000, 25, '=IF(C8<20000, 250, IF(C8<30000, 275, 290))*D8', '=C8+IF(OR(B8="CEO", B8="Manager"), C8*0.35, C8*0.4)+E8', '=IF(F8*12<=350000, "0%", IF(F8*12<=450000, "5%", IF(F8*12<=750000, "10%", "15%")))'],
      ['তানজিম আহমেদ', 'Officer', 25000, 14, '=IF(C9<20000, 250, IF(C9<30000, 275, 290))*D9', '=C9+IF(OR(B9="CEO", B9="Manager"), C9*0.35, C9*0.4)+E9', '=IF(F9*12<=350000, "0%", IF(F9*12<=450000, "5%", IF(F9*12<=750000, "10%", "15%")))'],
      ['মাহমুদা আক্তার', 'Executive', 32000, 16, '=IF(C10<20000, 250, IF(C10<30000, 275, 290))*D10', '=C10+IF(OR(B10="CEO", B10="Manager"), C10*0.35, C10*0.4)+E10', '=IF(F10*12<=350000, "0%", IF(F10*12<=450000, "5%", IF(F10*12<=750000, "10%", "15%")))'],
      ['শওকত ওসমান', 'Officer', 27000, 22, '=IF(C11<20000, 250, IF(C11<30000, 275, 290))*D11', '=C11+IF(OR(B11="CEO", B11="Manager"), C11*0.35, C11*0.4)+E11', '=IF(F11*12<=350000, "0%", IF(F11*12<=450000, "5%", IF(F11*12<=750000, "10%", "15%")))']
    ]
  },

  // 10. VLOOKUP & XLOOKUP (Grade Point Determination)
  {
    id: 'vlookup_xlookup',
    badge: 'Lookup',
    category: 'lookup',
    name: 'VLOOKUP ও XLOOKUP দিয়ে গ্রেড পয়েন্ট নির্ণয়',
    title: '=VLOOKUP(F2, $J$2:$L$8, 2, TRUE) / =XLOOKUP(F2, $J$2:$J$8, $K$2:$K$8, 0, -1)',
    desc: 'একই শিটে আলাদা গ্রেডিং রেফারেন্স টেবিল (J2:L8) থেকে ৩/৪ বিষয়ের গড় প্রাপ্ত নম্বরের ওপর ভিত্তি করে VLOOKUP-এর Approximate Match (TRUE) এবং আধুনিক XLOOKUP (Match Mode -1) দিয়ে স্বয়ংক্রিয় গ্রেড পয়েন্ট ও লেটার গ্রেড নির্ণয়।',
    tokens: [
      { text: '=VLOOKUP(', class: 'c-fn' },
      { text: 'F2, $J$2:$L$8, 2, TRUE', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=XLOOKUP(', class: 'c-fn' },
      { text: 'F2, $J$2:$J$8, $K$2:$K$8, 0, -1', class: 'c-p2' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=XLOOKUP(', class: 'c-fn' },
      { text: 'F2, $J$2:$J$8, $L$2:$L$8, "F", -1', class: 'c-p3' },
      { text: ')', class: 'c-fn' }
    ],
    params: [
      { name: 'গড় নম্বর (=AVERAGE)', meaning: 'শিক্ষার্থীর ৪টি বিষয়ের প্রাপ্ত নম্বরের গড় হিসাব (=AVERAGE(B2:E2))।', class: 'c-p1' },
      { name: 'VLOOKUP (গ্রেড পয়েন্ট)', meaning: 'গ্রেডিং টেবিলের ($J$2:$L$8) ১ম কলামে রেঞ্জ মিলিয়ে ২য় কলাম থেকে গ্রেড পয়েন্ট আনে (TRUE = Approximate Match)।', class: 'c-p2' },
      { name: 'XLOOKUP (গ্রেড পয়েন্ট ও লেটার)', meaning: 'নম্বর রেঞ্জ ($J$2:$J$8) থেকে Match Mode -1 (Exact or next smaller) দিয়ে সরাসরি GP বা লেটার গ্রেড আনে।', class: 'c-p3' }
    ],
    activeCell: 'G2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    colWidths: ['130px', '75px', '75px', '75px', '75px', '95px', '165px', '165px', '150px', '105px', '115px', '95px'],
    headers: ['শিক্ষার্থী', 'বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'গড় নম্বর', 'গ্রেড পয়েন্ট (VLOOKUP)', 'গ্রেড পয়েন্ট (XLOOKUP)', 'লেটার গ্রেড (XLOOKUP)', 'সর্বনিম্ন নম্বর', 'গ্রেড পয়েন্ট (GP)', 'লেটার গ্রেড'],
    rows: [
      ['রাকিবুল হাসান', 85, 88, 92, 87, '=AVERAGE(B2:E2)', '=VLOOKUP(F2, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F2, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F2, $J$2:$J$8, $L$2:$L$8, "F", -1)', 0, 0, 'F'],
      ['সানজিদা আহমেদ', 72, 75, 78, 71, '=AVERAGE(B3:E3)', '=VLOOKUP(F3, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F3, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F3, $J$2:$J$8, $L$2:$L$8, "F", -1)', 33, 1, 'D'],
      ['তানিম ইকবাল', 62, 65, 68, 61, '=AVERAGE(B4:E4)', '=VLOOKUP(F4, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F4, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F4, $J$2:$J$8, $L$2:$L$8, "F", -1)', 40, 2, 'C'],
      ['মুমতাহিনা হক', 54, 52, 58, 56, '=AVERAGE(B5:E5)', '=VLOOKUP(F5, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F5, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F5, $J$2:$J$8, $L$2:$L$8, "F", -1)', 50, 3, 'B'],
      ['নাজমুল সাকিব', 42, 45, 48, 41, '=AVERAGE(B6:E6)', '=VLOOKUP(F6, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F6, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F6, $J$2:$J$8, $L$2:$L$8, "F", -1)', 60, 3.5, 'A-'],
      ['সুমাইয়া ফারহানা', 35, 38, 36, 39, '=AVERAGE(B7:E7)', '=VLOOKUP(F7, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F7, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F7, $J$2:$J$8, $L$2:$L$8, "F", -1)', 70, 4, 'A'],
      ['ফাহিম মোর্শেদ', 28, 30, 25, 29, '=AVERAGE(B8:E8)', '=VLOOKUP(F8, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F8, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F8, $J$2:$J$8, $L$2:$L$8, "F", -1)', 80, 5, 'A+'],
      ['তাসফিয়া ইসলাম', 95, 90, 94, 93, '=AVERAGE(B9:E9)', '=VLOOKUP(F9, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F9, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F9, $J$2:$J$8, $L$2:$L$8, "F", -1)', '', '', ''],
      ['আব্দুল্লাহ আলিম', 78, 82, 70, 74, '=AVERAGE(B10:E10)', '=VLOOKUP(F10, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F10, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F10, $J$2:$J$8, $L$2:$L$8, "F", -1)', '', '', ''],
      ['রুবাইয়া খানম', 65, 60, 62, 69, '=AVERAGE(B11:E11)', '=VLOOKUP(F11, $J$2:$L$8, 2, TRUE)', '=XLOOKUP(F11, $J$2:$J$8, $K$2:$K$8, 0, -1)', '=XLOOKUP(F11, $J$2:$J$8, $L$2:$L$8, "F", -1)', '', '', '']
    ]
  },

  // 11. LAB 4: INVENTORY MASTER LOOKUP SYSTEM
  {
    id: 'lab4',
    badge: 'Practice Lab',
    category: 'lab',
    name: 'ল্যাব ৪: ইনভেন্টরি মাস্টার লুকআপ সিস্টেম',
    title: 'Comprehensive Inventory Master Price Lookup & Billing Lab',
    desc: 'বাস্তবধর্মী ইনভেন্টরি ম্যানেজমেন্ট: Master Product Catalog থেকে VLOOKUP ও XLOOKUP দিয়ে স্বয়ংক্রিয় পণ্যের নাম, ইউনিট মূল্য ফেচ এবং ইনভয়েস বিল জেনারেশন।',
    tokens: [
      { text: '=VLOOKUP(B2, $G$2:$I$6, 2, FALSE)', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=XLOOKUP(B2, $G$2:$G$6, $I$2:$I$6)', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=C2*E2', class: 'c-p3' }
    ],
    params: [
      { name: 'Item_Name', meaning: 'মাস্টার তালিকা থেকে আইটেমের নাম স্বয়ংক্রিয় ফেচ।', class: 'c-p1' },
      { name: 'Unit_Price', meaning: 'মাস্টার তালিকা থেকে বর্তমান পণ্যের ইউনিট দর নির্ধারণ।', class: 'c-p2' },
      { name: 'Total_Cost', meaning: 'অর্ডারকৃত মোট কোয়ান্টিটি ও ইউনিট দরের গুণফল (=Qty * Unit_Price)।', class: 'c-p3' }
    ],
    activeCell: 'D2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    colWidths: ['85px', '80px', '65px', '125px', '95px', '100px', '95px', '115px', '95px'],
    headers: ['Order_ID', 'Code', 'Qty', 'Item_Name', 'Unit_Price', 'Total_Cost', 'Master_Code', 'Master_Item', 'Master_Price'],
    rows: [
      ['ORD-101', 'P-101', 5, '=VLOOKUP(B2, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B2, $G$2:$G$6, $I$2:$I$6)', '=C2*E2', 'P-101', 'কীবোর্ড', 850],
      ['ORD-102', 'P-103', 2, '=VLOOKUP(B3, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B3, $G$2:$G$6, $I$2:$I$6)', '=C3*E3', 'P-102', 'মাউস', 450],
      ['ORD-103', 'P-102', 8, '=VLOOKUP(B4, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B4, $G$2:$G$6, $I$2:$I$6)', '=C4*E4', 'P-103', 'মনিটর', 12500],
      ['ORD-104', 'P-105', 4, '=VLOOKUP(B5, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B5, $G$2:$G$6, $I$2:$I$6)', '=C5*E5', 'P-104', 'হেডফোন', 1200],
      ['ORD-105', 'P-104', 3, '=VLOOKUP(B6, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B6, $G$2:$G$6, $I$2:$I$6)', '=C6*E6', 'P-105', 'ওয়েবক্যাম', 2800],
      ['ORD-106', 'P-101', 10, '=VLOOKUP(B7, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B7, $G$2:$G$6, $I$2:$I$6)', '=C7*E7', '', '', ''],
      ['ORD-107', 'P-103', 1, '=VLOOKUP(B8, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B8, $G$2:$G$6, $I$2:$I$6)', '=C8*E8', '', '', ''],
      ['ORD-108', 'P-102', 6, '=VLOOKUP(B9, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B9, $G$2:$G$6, $I$2:$I$6)', '=C9*E9', '', '', ''],
      ['ORD-109', 'P-104', 5, '=VLOOKUP(B10, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B10, $G$2:$G$6, $I$2:$I$6)', '=C10*E10', '', '', ''],
      ['ORD-110', 'P-105', 2, '=VLOOKUP(B11, $G$2:$I$6, 2, FALSE)', '=XLOOKUP(B11, $G$2:$G$6, $I$2:$I$6)', '=C11*E11', '', '', '']
    ]
  },

  // 12. PMT & PV (Combined)
  {
    id: 'pmt_pv',
    badge: 'Financial',
    category: 'financial',
    name: 'PMT & PV Financial Functions',
    title: '=PMT(rate, nper, pv) / =PV(rate, nper, pmt)',
    desc: 'ঋণের মাসিক কিস্তি (PMT) এবং ভবিষ্যৎ নিয়মিত কিস্তির বর্তমান আর্থিক মূল্য (PV) নির্ণয়। একই টেবিলে ঋণের কিস্তি ও তার প্রেজেন্ট ভ্যালু রিভার্স ভেরিফিকেশন।',
    tokens: [
      { text: '=PMT(', class: 'c-fn' },
      { text: 'B2/12, C2*12, -D2', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=PV(', class: 'c-fn' },
      { text: 'B2/12, C2*12, -E2', class: 'c-p2' },
      { text: ')', class: 'c-fn' }
    ],
    params: [
      { name: 'PMT (মাসিক কিস্তি)', meaning: 'বার্ষিক সুদের হার ও মেয়াদের ভিত্তিতে ঋণের মাসিক কিস্তির পরিমাণ।', class: 'c-p1' },
      { name: 'PV (বর্তমান মূল্য)', meaning: 'পরিশোধিত মাসিক কিস্তিকে বর্তমান আর্থিক মূল্যে রূপান্তর (যা ঋণের আসলের সমান)।', class: 'c-p2' },
      { name: 'B2/12 ও C2*12', meaning: 'মাসিক সুদের হার (B2/12) এবং মোট কিস্তির সংখ্যা (C2*12)।', class: 'c-p3' }
    ],
    activeCell: 'E2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F'],
    colWidths: ['180px', '110px', '100px', '135px', '145px', '155px'],
    headers: ['ঋণের খাত (Loan Purpose)', 'বার্ষিক সুদ (Rate)', 'মেয়াদ (Years)', 'ঋণের আসল (Tk)', 'মাসিক কিস্তি (PMT Tk)', 'বর্তমান মূল্য যাচাই (PV Tk)'],
    rows: [
      ['হাউজিং লোন (Home Loan)', 0.09, 15, 3000000, '=PMT(B2/12, C2*12, -D2)', '=PV(B2/12, C2*12, -E2)'],
      ['অটোমোবাইল লোন (Car Loan)', 0.11, 5, 1200000, '=PMT(B3/12, C3*12, -D3)', '=PV(B3/12, C3*12, -E3)'],
      ['শিক্ষা ঋণ (Education Loan)', 0.08, 7, 600000, '=PMT(B4/12, C4*12, -D4)', '=PV(B4/12, C4*12, -E4)'],
      ['পার্সোনাল লোন (Personal Loan)', 0.12, 3, 300000, '=PMT(B5/12, C5*12, -D5)', '=PV(B5/12, C5*12, -E5)'],
      ['এসএমই বিজনেস লোন (SME)', 0.10, 5, 2000000, '=PMT(B6/12, C6*12, -D6)', '=PV(B6/12, C6*12, -E6)'],
      ['কৃষি ও খামার ঋণ (Agri Loan)', 0.06, 3, 500000, '=PMT(B7/12, C7*12, -D7)', '=PV(B7/12, C7*12, -E7)'],
      ['বাণিজ্যিক স্পেস লোন', 0.115, 10, 4500000, '=PMT(B8/12, C8*12, -D8)', '=PV(B8/12, C8*12, -E8)'],
      ['মেডিকেল ইমার্জেন্সি লোন', 0.095, 2, 250000, '=PMT(B9/12, C9*12, -D9)', '=PV(B9/12, C9*12, -E9)']
    ]
  },

  // 13. FV & RATE (Combined)
  {
    id: 'fv_rate',
    badge: 'Financial',
    category: 'financial',
    name: 'FV & RATE Financial Functions',
    title: '=FV(rate, nper, pmt, [pv]) / =RATE(nper, pmt, pv, [fv])',
    desc: 'সঞ্চয়ের ভবিষ্যৎ মোট মূল্য (Future Value - FV) এবং যেকোনো স্কিমে নিয়মিত জমার ওপর ভিত্তি করে আসল বার্ষিক সুদের হার (Annual RATE) পাশাপাশি কলামে হিসাব।',
    tokens: [
      { text: '=FV(', class: 'c-fn' },
      { text: 'B2/12, C2*12, -D2, -E2', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=RATE(', class: 'c-fn' },
      { text: 'C2*12, -D2, -E2, F2', class: 'c-p2' },
      { text: ')*12*100 & "%"', class: 'c-fn' }
    ],
    params: [
      { name: 'FV (ভবিষ্যৎ প্রাপ্তি)', meaning: 'নির্দিষ্ট মেয়াদে মাসিক সঞ্চয় ও প্রাথমিক জমার ওপর সুদে-আসলে মোট প্রাপ্তি।', class: 'c-p1' },
      { name: 'RATE (সুদের হার যাচাই)', meaning: 'মেয়াদান্তে প্রাপ্ত টাকা থেকে স্কিমটির প্রকৃত বার্ষিক সুদের হার প্রতিপাদন।', class: 'c-p2' },
      { name: 'D2 ও E2', meaning: 'যথাক্রমে নিয়মিত মাসিক কিস্তি (PMT) এবং প্রাথমিক ওপেনিং ব্যালেন্স (PV)।', class: 'c-p3' }
    ],
    activeCell: 'F2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['180px', '110px', '100px', '125px', '130px', '155px', '150px'],
    headers: ['স্কিমের বিবরণ (Plan)', 'বার্ষিক সুদ (Rate)', 'মেয়াদ (Years)', 'মাসিক জমা (PMT)', 'প্রাথমিক জমা (PV)', 'মেয়াদান্তে মোট প্রাপ্তি (FV)', 'যাচাইকৃত সুদ (RATE)'],
    rows: [
      ['ডিপিএস সঞ্চয় স্কিম ১', 0.08, 5, 2500, 0, '=FV(B2/12, C2*12, -D2, -E2)', '=RATE(C2*12, -D2, -E2, F2)*12*100 & "%"'],
      ['ডিপিএস সঞ্চয় স্কিম ২', 0.085, 10, 5000, 0, '=FV(B3/12, C3*12, -D3, -E3)', '=RATE(C3*12, -D3, -E3, F3)*12*100 & "%"'],
      ['প্রিমিয়াম রিটায়ারমেন্ট ফান্ড', 0.09, 15, 8000, 50000, '=FV(B4/12, C4*12, -D4, -E4)', '=RATE(C4*12, -D4, -E4, F4)*12*100 & "%"'],
      ['শিশু শিক্ষা সেভিংস প্ল্যান', 0.075, 7, 3000, 20000, '=FV(B5/12, C5*12, -D5, -E5)', '=RATE(C5*12, -D5, -E5, F5)*12*100 & "%"'],
      ['গোল্ডেন ফিউচার স্কিম', 0.10, 12, 10000, 100000, '=FV(B6/12, C6*12, -D6, -E6)', '=RATE(C6*12, -D6, -E6, F6)*12*100 & "%"'],
      ['শর্ট টার্ম গ্রোথ ফান্ড', 0.07, 3, 4000, 10000, '=FV(B7/12, C7*12, -D7, -E7)', '=RATE(C7*12, -D7, -E7, F7)*12*100 & "%"'],
      ['বিশেষ দ্বিগুণ বৃদ্ধি স্কিম', 0.095, 8, 6000, 30000, '=FV(B8/12, C8*12, -D8, -E8)', '=RATE(C8*12, -D8, -E8, F8)*12*100 & "%"'],
      ['পেনশনার্স সেভিংস বন্ড', 0.105, 5, 0, 500000, '=FV(B9/12, C9*12, -D9, -E9)', '=RATE(C9*12, -D9, -E9, F9)*12*100 & "%"']
    ]
  },

  // 14. PRACTICE LAB: FINANCIAL BANKING ANALYSIS (Question 1: AB Bank, Savings, Education Loan Combined)
  {
    id: 'practice-financial-q1',
    badge: 'Practice Lab',
    category: 'lab',
    name: 'ল্যাব: ব্যাংকিং আর্থিক বিশ্লেষণ (প্রশ্ন ১: এবি ব্যাংক, সেভিংস ও লোন)',
    title: 'Banking Financial Problem Set 1 (RATE, FV & PMT - Q1a, 1b, 1c)',
    desc: 'প্রশ্ন ১ সমাধান: (ক) এবি ব্যাংক মিলিয়নেয়ার স্কিমের বার্ষিক সুদের হার ও ৫ বছরের রিটার্ন, (খ) ১০% সুদে সঞ্চয়ী অ্যাকাউন্টে ১০ বছরের মোট রিটার্ন, (গ) সিটি ব্যাংকে ৪,২৫,০০০ টাকা শিক্ষা ঋণের মাসিক কিস্তি।',
    tokens: [
      { text: '=RATE(C2*12, -D2, -E2, F2)*12*100 & "%"', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=FV(B4/12, C4*12, -D4, -E4)', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=PMT(B5/12, C5*12, -E5)', class: 'c-p3' }
    ],
    params: [
      { name: 'প্রশ্ন ১(ক) এবি ব্যাংক', meaning: '১২ বছরে ১০ লাখ পেতে মাসিক ৩,৪০০ জমার সুদের হার ১০.৬৯%; এবং ৫ বছরে জমাকৃত রিটার্ন ২,৭১,৬৭৫.২৬ টাকা।', class: 'c-p1' },
      { name: 'প্রশ্ন ১(খ) সেভিংস রিটার্ন', meaning: 'প্রাথমিক ১ লাখ ও মাসিক ১০,০০০ জমার ১০ বছর পর মোট প্রাপ্তি ২৩,৭৭,৭৪৫.৬৪ টাকা।', class: 'c-p2' },
      { name: 'প্রশ্ন ১(গ) এডুকেশন লোন', meaning: 'সিটি ব্যাংকের ১১% সুদে ১০ বছর মেয়াদী ৪.২৫ লাখ টাকা শিক্ষা ঋণের মাসিক কিস্তি ৫,৮৫৪.৩৮ টাকা।', class: 'c-p3' }
    ],
    activeCell: 'G2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['230px', '110px', '95px', '125px', '135px', '145px', '175px'],
    headers: ['ব্যাংকিং প্র্যাকটিস প্রবলেম', 'বার্ষিক সুদ (Rate)', 'মেয়াদ (Yrs)', 'মাসিক লেনদেন (PMT)', 'আসল/প্রাথমিক জমা (PV)', 'লক্ষ্যমাত্রা (FV)', 'ফলাফল (RATE / FV / PMT)'],
    rows: [
      ['১(ক) এবি ব্যাংক মিলিয়নেয়ার সুদের হার', '', 12, 3400, 0, 1000000, '=RATE(C2*12, -D2, -E2, F2)*12*100 & "%"'],
      ['১(ক) এবি ব্যাংক ৫ বছর পর রিটার্ন', 0.1069, 5, 3400, 0, '', '=FV(B3/12, C3*12, -D3, -E3)'],
      ['১(খ) সেভিংস অ্যাকাউন্টে ১০ বছরের রিটার্ন', 0.10, 10, 10000, 100000, '', '=FV(B4/12, C4*12, -D4, -E4)'],
      ['১(গ) সিটি ব্যাংক এডুকেশন লোন ইএমআই', 0.11, 10, '', 425000, 0, '=PMT(B5/12, C5*12, -E5)'],
      ['১(গ) এডুকেশন লোনে ১০ বছরে মোট পরিশোধ', 0.11, 10, '', 425000, 0, '=PMT(B5/12, C5*12, -E5)*120']
    ]
  },

  // 15. PRACTICE LAB: DPS & INVESTMENT COMPARISON (Question 2: Comparison Suite)
  {
    id: 'practice-financial-q2',
    badge: 'Practice Lab',
    category: 'lab',
    name: 'ল্যাব: ডিপিএস ও ইনভেস্টমেন্ট স্কিম তুলনা (প্রশ্ন ২: সুদের হার ও রিটার্ন)',
    title: 'Financial Problem Set 2 (Compare DPS & Investment Offers - RATE & FV)',
    desc: 'প্রশ্ন ২ সমাধান: (ক) মাসিক ২০০০ টাকা বনাম সাপ্তাহিক ৩৭৫ টাকার দুটি ডিপিএস স্কিমের সুদের হারের তুলনা, (খ) মাসিক ১২০০ টাকা বনাম সাপ্তাহিক ২৫০ টাকার দুটি ইনভেস্টমেন্ট স্কিমের ১২ বছর পর মোট রিটার্নের তুলনা ও সিদ্ধান্ত।',
    tokens: [
      { text: '=RATE(E2*12, -D2, -B2, F2)*12*100 & "%"', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=RATE(E3*52, -D3, -B3, F3)*52*100 & "%"', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=FV(C4/12, E4*12, -D4, -B4)', class: 'c-p3' },
      { text: ' | ', class: 'c-fn' },
      { text: '=FV(C5/52, E5*52, -D5, -B5)', class: 'c-p4' }
    ],
    params: [
      { name: 'প্রশ্ন ২(ক) সিদ্ধান্ত', meaning: 'স্কিম ২ (সাপ্তাহিক) ৫৪.৩৬% সুদের হার দিচ্ছে যা স্কিম ১ (৭.৪৫%) এর চেয়ে অনেক বেশি লাভজনক!', class: 'c-p2' },
      { name: 'প্রশ্ন ২(খ) সিদ্ধান্ত', meaning: 'স্কিম ২ (সাপ্তাহিক) ৪,৫৪,৬৭৪.৫৮ টাকা রিটার্ন দেয় যা স্কিম ১ (৩,৪৯,৮৮৩.৮৬ টাকা) এর চেয়ে ১,০৪,৭৯০ টাকা বেশি!', class: 'c-p4' },
      { name: 'ফ্রিকোয়েন্সি হ্যান্ডলিং', meaning: 'মাসিকের ক্ষেত্রে nper=Years*12, সাপ্তাহিক জমার ক্ষেত্রে nper=Years*52।', class: 'c-p1' }
    ],
    activeCell: 'G2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    colWidths: ['210px', '115px', '105px', '110px', '95px', '135px', '155px', '160px'],
    headers: ['প্রস্তাবিত স্কিম ও অফার', 'প্রাথমিক জমা (PV)', 'সুদের হার (Rate)', 'নিয়মিত কিস্তি', 'মেয়াদ (Yrs)', 'মেয়াদান্তে লক্ষ্য (FV)', 'হিসাবকৃত মান (RATE/FV)', 'সিদ্ধান্ত ও তুলনামূলক রায়'],
    rows: [
      ['২(ক) স্কিম ১: মাসিক ডিপিএস', 15000, '', 2000, 12, 500000, '=RATE(E2*12, -D2, -B2, F2)*12*100 & "%"', 'সুদের হার ৭.৪৫%'],
      ['২(ক) স্কিম ২: সাপ্তাহিক ডিপিএস', 0, '', 375, 5, 500000, '=RATE(E3*52, -D3, -B3, F3)*52*100 & "%"', 'বিজয়ী: ৫৪.৩৬% সুদ (অধিক লাভজনক)'],
      ['২(খ) স্কিম ১: মাসিক ইনভেস্টমেন্ট', 0, 0.1075, 1200, 12, '', '=FV(C4/12, E4*12, -D4, -B4)', '১২ বছরে ৩,৪৯,৮৮৩.৮৬ টাকা রিটার্ন'],
      ['২(খ) স্কিম ২: সাপ্তাহিক ইনভেস্টমেন্ট', 30000, 0.115, 250, 12, '', '=FV(C5/52, E5*52, -D5, -B5)', 'বিজয়ী: ৪,৫৪,৬৭৪.৫৮ টাকা (১.০৪ লাখ বেশি)']
    ]
  },

  // 16. SUMIFS & COUNTIFS (Combined)
  {
    id: 'sumifs_countifs',
    badge: 'Advanced',
    category: 'advanced',
    name: 'SUMIFS & COUNTIFS Functions',
    title: '=SUMIFS(...) / =COUNTIFS(...)',
    desc: 'একাধিক শর্ত সাপেক্ষে যোগ (SUMIFS) এবং একাধিক শর্ত সাপেক্ষে গণনা (COUNTIFS)। একই টেবিলে নির্দিষ্ট অঞ্চল ও নির্দিষ্ট ক্যাটাগরির বিক্রয় সমষ্টি ও মোট অর্ডার সংখ্যা নির্ণয়।',
    tokens: [
      { text: '=SUMIFS(', class: 'c-fn' },
      { text: 'E$2:E$11, B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট"', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=COUNTIFS(', class: 'c-fn' },
      { text: 'B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট"', class: 'c-p2' },
      { text: ')', class: 'c-fn' }
    ],
    params: [
      { name: 'SUMIFS (ঢাকা-গ্যাজেট বিক্রয়)', meaning: 'ঢাকা অঞ্চলে "গ্যাজেট" ক্যাটাগরির পণ্যের মোট বিক্রয় যোগফল নির্ণয় করে।', class: 'c-p1' },
      { name: 'COUNTIFS (ঢাকা-গ্যাজেট অর্ডার)', meaning: 'ঢাকা অঞ্চলে "গ্যাজেট" বিক্রির মোট অর্ডারের সংখ্যা গণনা করে।', class: 'c-p2' },
      { name: 'B$2:B$11 ও C$2:C$11', meaning: 'যথাক্রমে রিজিয়ন এবং ক্যাটাগরি ফিল্টার করার সেল রেঞ্জ।', class: 'c-p3' }
    ],
    activeCell: 'F2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    colWidths: ['130px', '95px', '105px', '90px', '110px', '165px', '165px'],
    headers: ['বিক্রেতা', 'অঞ্চল', 'ক্যাটাগরি', 'পরিমাণ', 'বিক্রয় (Tk)', 'ঢাকা-গ্যাজেট মোট বিক্রয় (SUMIFS)', 'ঢাকা-গ্যাজেট অর্ডার সংখ্যা (COUNTIFS)'],
    rows: [
      ['তানভীর আহমেদ', 'ঢাকা', 'গ্যাজেট', 4, 18500, '=SUMIFS(E$2:E$11, B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট")', '=COUNTIFS(B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট")'],
      ['নাসরিন সুলতানা', 'চট্টগ্রাম', 'কম্পিউটার', 2, 85000, '=SUMIFS(E$2:E$11, B$2:B$11, "চট্টগ্রাম", C$2:C$11, "কম্পিউটার")', '=COUNTIFS(B$2:B$11, "চট্টগ্রাম", C$2:C$11, "কম্পিউটার")'],
      ['সোহেল রানা', 'ঢাকা', 'গ্যাজেট', 6, 24000, '=SUMIFS(E$2:E$11, B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট")', '=COUNTIFS(B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট")'],
      ['মাকসুদা আক্তার', 'রাজশাহী', 'মোবাইল', 3, 45000, '=SUMIFS(E$2:E$11, B$2:B$11, "রাজশাহী", C$2:C$11, "মোবাইল")', '=COUNTIFS(B$2:B$11, "রাজশাহী", C$2:C$11, "মোবাইল")'],
      ['তারেক মাহমুদ', 'ঢাকা', 'কম্পিউটার', 1, 48000, '=SUMIFS(E$2:E$11, B$2:B$11, "ঢাকা", C$2:C$11, "কম্পিউটার")', '=COUNTIFS(B$2:B$11, "ঢাকা", C$2:C$11, "কম্পিউটার")'],
      ['ফারহানা আলম', 'চট্টগ্রাম', 'গ্যাজেট', 5, 21000, '=SUMIFS(E$2:E$11, B$2:B$11, "চট্টগ্রাম", C$2:C$11, "গ্যাজেট")', '=COUNTIFS(B$2:B$11, "চট্টগ্রাম", C$2:C$11, "গ্যাজেট")'],
      ['জহিরুল হক', 'ঢাকা', 'গ্যাজেট', 3, 15000, '=SUMIFS(E$2:E$11, B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট")', '=COUNTIFS(B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট")'],
      ['শায়লা পারভীন', 'সিলেট', 'মোবাইল', 4, 60000, '=SUMIFS(E$2:E$11, B$2:B$11, "সিলেট", C$2:C$11, "মোবাইল")', '=COUNTIFS(B$2:B$11, "সিলেট", C$2:C$11, "মোবাইল")'],
      ['কামরুল হাসান', 'ঢাকা', 'মোবাইল', 2, 32000, '=SUMIFS(E$2:E$11, B$2:B$11, "ঢাকা", C$2:C$11, "মোবাইল")', '=COUNTIFS(B$2:B$11, "ঢাকা", C$2:C$11, "মোবাইল")'],
      ['আফসানা আহমেদ', 'ঢাকা', 'গ্যাজেট', 8, 36000, '=SUMIFS(E$2:E$11, B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট")', '=COUNTIFS(B$2:B$11, "ঢাকা", C$2:C$11, "গ্যাজেট")']
    ]
  },

  // 17. AVERAGEIF & AVERAGEIFS (Combined)
  {
    id: 'averageif_averageifs',
    badge: 'Advanced',
    category: 'advanced',
    name: 'AVERAGEIF & AVERAGEIFS Functions',
    title: '=AVERAGEIF(...) / =AVERAGEIFS(...)',
    desc: 'একক শর্তে গড় (AVERAGEIF) এবং একাধিক শর্তে গড় (AVERAGEIFS)। একই টেবিলে আইটি বিভাগের কর্মীদের গড় বেতন এবং আইটি বিভাগে ৩+ বছর অভিজ্ঞদের গড় বেতন নির্ণয়।',
    tokens: [
      { text: '=AVERAGEIF(', class: 'c-fn' },
      { text: 'B$2:B$11, "আইটি", D$2:D$11', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=AVERAGEIFS(', class: 'c-fn' },
      { text: 'D$2:D$11, B$2:B$11, "আইটি", C$2:C$11, ">=3"', class: 'c-p2' },
      { text: ')', class: 'c-fn' }
    ],
    params: [
      { name: 'আইটি গড় বেতন (AVERAGEIF)', meaning: 'শুধুমাত্র "আইটি" ডিপার্টমেন্টের কর্মকর্তাদের বেতনের গড় মান।', class: 'c-p1' },
      { name: 'অভিজ্ঞদের গড় (AVERAGEIFS)', meaning: 'আইটি ডিপার্টমেন্ট এবং অভিজ্ঞতা ৩ বা তার বেশি বছরের কর্মকর্তাদের গড় বেতন।', class: 'c-p2' },
      { name: 'D$2:D$11', meaning: 'গড় হিসাব করার জন্য বেতনের সেল রেঞ্জ।', class: 'c-p3' }
    ],
    activeCell: 'E2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F'],
    colWidths: ['130px', '110px', '110px', '115px', '160px', '170px'],
    headers: ['কর্মকর্তা', 'বিভাগ (Dept)', 'অভিজ্ঞতা (Yrs)', 'মূল বেতন (Tk)', 'আইটি গড় বেতন (AVERAGEIF)', 'আইটি ৩+ বছর গড় (AVERAGEIFS)'],
    rows: [
      ['মাহবুবুর রহমান', 'আইটি', 4, 55000, '=AVERAGEIF(B$2:B$11, "আইটি", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "আইটি", C$2:C$11, ">=3")'],
      ['সানজিদা সুলতানা', 'এইচআর', 3, 42000, '=AVERAGEIF(B$2:B$11, "এইচআর", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "এইচআর", C$2:C$11, ">=3")'],
      ['নাজমুল হক', 'আইটি', 2, 38000, '=AVERAGEIF(B$2:B$11, "আইটি", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "আইটি", C$2:C$11, ">=3")'],
      ['নুসরাত জাহান', 'মার্কেটিং', 5, 48000, '=AVERAGEIF(B$2:B$11, "মার্কেটিং", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "মার্কেটিং", C$2:C$11, ">=3")'],
      ['আরিফুল ইসলাম', 'আইটি', 6, 75000, '=AVERAGEIF(B$2:B$11, "আইটি", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "আইটি", C$2:C$11, ">=3")'],
      ['ফারহানা ইসলাম', 'এইচআর', 1, 32000, '=AVERAGEIF(B$2:B$11, "এইচআর", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "এইচআর", C$2:C$11, ">=3")'],
      ['তানভীর হাসান', 'মার্কেটিং', 2, 35000, '=AVERAGEIF(B$2:B$11, "মার্কেটিং", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "মার্কেটিং", C$2:C$11, ">=3")'],
      ['শামীমা আক্তার', 'আইটি', 3, 50000, '=AVERAGEIF(B$2:B$11, "আইটি", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "আইটি", C$2:C$11, ">=3")'],
      ['কামরুল ইসলাম', 'এইচআর', 4, 45000, '=AVERAGEIF(B$2:B$11, "এইচআর", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "এইচআর", C$2:C$11, ">=3")'],
      ['আয়েশা সিদ্দিকা', 'আইটি', 5, 68000, '=AVERAGEIF(B$2:B$11, "আইটি", D$2:D$11)', '=AVERAGEIFS(D$2:D$11, B$2:B$11, "আইটি", C$2:C$11, ">=3")']
    ]
  },

  // 18. IFERROR
  {
    id: 'iferror',
    badge: 'Advanced',
    category: 'advanced',
    name: 'IFERROR Function',
    title: '=IFERROR(value, value_if_error)',
    desc: 'সূত্র গণনায় কোনো এরর (যেমন #DIV/0!, #N/A, #VALUE!) দেখা দিলে তা ঢেকে দিয়ে বিকল্প সুন্দর বার্তা বা শূন্য প্রদর্শন করে। একই টেবিলে স্বাভাবিক ভাগের সাথে তুলনা।',
    tokens: [
      { text: '=IFERROR(', class: 'c-fn' },
      { text: 'B2/C2', class: 'c-p1' },
      { text: ', "মেম্বার শূন্য")', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=B2/C2', class: 'c-p3' }
    ],
    params: [
      { name: 'মূল হিসাব (B2/C2)', meaning: 'মোট বাজেটকে টিম মেম্বার সংখ্যা দিয়ে ভাগ করে মাথাপিছু বাজেট।', class: 'c-p1' },
      { name: 'value_if_error', meaning: 'মেম্বার ০ থাকার কারণে #DIV/0! এরর আসলে তার বদলে "মেম্বার শূন্য" লেখা দেখাবে।', class: 'c-p2' },
      { name: 'স্বাভাবিক ভাগ (Error সহ)', meaning: 'IFERROR ছাড়া সরাসরি ভাগ করলে কীভাবে স্ক্রিনে লাল এরর ফুটে ওঠে তা প্রদর্শন।', class: 'c-p3' }
    ],
    activeCell: 'E2',
    cols: ['A', 'B', 'C', 'D', 'E'],
    colWidths: ['160px', '125px', '110px', '135px', '165px'],
    headers: ['প্রকল্পের নাম', 'মোট বাজেট (Tk)', 'টিম মেম্বার', 'স্বাভাবিক ভাগ (Error সহ)', 'ত্রুটিমুক্ত বাজেট (IFERROR)'],
    rows: [
      ['ওয়েবসাইট রিডিজাইন', 150000, 5, '=B2/C2', '=IFERROR(B2/C2, "মেম্বার শূন্য")'],
      ['মোবাইল অ্যাপ ডেভেলপমেন্ট', 280000, 0, '=B3/C3', '=IFERROR(B3/C3, "মেম্বার শূন্য")'],
      ['ডিজিটাল মার্কেটিং ক্যাম্পেইন', 80000, 4, '=B4/C4', '=IFERROR(B4/C4, "মেম্বার শূন্য")'],
      ['ডাটাবেস মাইগ্রেশন', 120000, 3, '=B5/C5', '=IFERROR(B5/C5, "মেম্বার শূন্য")'],
      ['এআই রিসার্চ প্রজেক্ট', 250000, 0, '=B6/C6', '=IFERROR(B6/C6, "মেম্বার শূন্য")'],
      ['সিকিউরিটি অডিট', 90000, 2, '=B7/C7', '=IFERROR(B7/C7, "মেম্বার শূন্য")'],
      ['সার্ভার আপগ্রেড', 180000, 6, '=B8/C8', '=IFERROR(B8/C8, "মেম্বার শূন্য")'],
      ['কাস্টমার সাপোর্ট পোর্টাল', 75000, 0, '=B9/C9', '=IFERROR(B9/C9, "মেম্বার শূন্য")'],
      ['ই-কমার্স অপ্টিমাইজেশন', 110000, 4, '=B10/C10', '=IFERROR(B10/C10, "মেম্বার শূন্য")'],
      ['ক্লাউড ব্যাকআপ সিস্টেম', 65000, 2, '=B11/C11', '=IFERROR(B11/C11, "মেম্বার শূন্য")']
    ]
  },

  // 19. DATE, TODAY, NOW & YMD (Combined)
  {
    id: 'date_time_suite',
    badge: 'Date & Time',
    category: 'date',
    name: 'DATE, TODAY, NOW & YMD Functions',
    title: '=DATE(y,m,d) / =TODAY() / =NOW() / =YEAR() / =MONTH() / =DAY()',
    desc: 'তারিখ ও সময়ের যাবতীয় মৌলিক ফাংশনের সমন্বিত টেবিল: স্বয়ংক্রিয় আজকের তারিখ (TODAY), লাইভ সময় (NOW), সাল-মাস-দিন দিয়ে তারিখ গঠন (DATE), এবং তারিখ থেকে বছর, মাস ও দিন নিষ্কাশন।',
    tokens: [
      { text: '=DATE(B2, C2, D2)', class: 'c-p1' },
      { text: ' | ', class: 'c-fn' },
      { text: '=TODAY()', class: 'c-p2' },
      { text: ' | ', class: 'c-fn' },
      { text: '=YEAR(E2)', class: 'c-p3' },
      { text: ' | ', class: 'c-fn' },
      { text: '=MONTH(E2)', class: 'c-p4' },
      { text: ' | ', class: 'c-fn' },
      { text: '=DAY(E2)', class: 'c-p1' }
    ],
    params: [
      { name: 'DATE(y, m, d)', meaning: 'পৃথক বছর, মাস ও দিনকে একত্র করে স্ট্যান্ডার্ড এক্সেল তারিখে রূপান্তর।', class: 'c-p1' },
      { name: 'TODAY()', meaning: 'সিস্টেমের বর্তমান আজকের তারিখ স্বয়ংক্রিয়ভাবে প্রদান করে।', class: 'c-p2' },
      { name: 'YEAR / MONTH / DAY', meaning: 'গঠিত তারিখ থেকে যথাক্রমে বছর, মাস ও দিনের সংখ্যা আলাদা করে।', class: 'c-p3' }
    ],
    activeCell: 'E2',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    colWidths: ['130px', '70px', '70px', '70px', '125px', '125px', '85px', '85px', '85px'],
    headers: ['নথি / কর্মী', 'Year', 'Month', 'Day', 'গঠিত তারিখ (DATE)', 'আজকের তারিখ (TODAY)', 'সাল (YEAR)', 'মাস (MONTH)', 'দিন (DAY)'],
    rows: [
      ['কর্মী জয়েনিং ১', 2021, 3, 15, '=DATE(B2, C2, D2)', '=TODAY()', '=YEAR(E2)', '=MONTH(E2)', '=DAY(E2)'],
      ['কর্মী জয়েনিং ২', 2019, 7, 1, '=DATE(B3, C3, D3)', '=TODAY()', '=YEAR(E3)', '=MONTH(E3)', '=DAY(E3)'],
      ['কর্মী জয়েনিং ৩', 2022, 11, 20, '=DATE(B4, C4, D4)', '=TODAY()', '=YEAR(E4)', '=MONTH(E4)', '=DAY(E4)'],
      ['কর্মী জয়েনিং ৪', 2018, 5, 10, '=DATE(B5, C5, D5)', '=TODAY()', '=YEAR(E5)', '=MONTH(E5)', '=DAY(E5)'],
      ['কর্মী জয়েনিং ৫', 2020, 9, 25, '=DATE(B6, C6, D6)', '=TODAY()', '=YEAR(E6)', '=MONTH(E6)', '=DAY(E6)'],
      ['কর্মী জয়েনিং ৬', 2023, 1, 5, '=DATE(B7, C7, D7)', '=TODAY()', '=YEAR(E7)', '=MONTH(E7)', '=DAY(E7)'],
      ['কর্মী জয়েনিং ৭', 2017, 12, 18, '=DATE(B8, C8, D8)', '=TODAY()', '=YEAR(E8)', '=MONTH(E8)', '=DAY(E8)'],
      ['কর্মী জয়েনিং ৮', 2021, 8, 30, '=DATE(B9, C9, D9)', '=TODAY()', '=YEAR(E9)', '=MONTH(E9)', '=DAY(E9)'],
      ['কর্মী জয়েনিং ৯', 2020, 4, 12, '=DATE(B10, C10, D10)', '=TODAY()', '=YEAR(E10)', '=MONTH(E10)', '=DAY(E10)'],
      ['কর্মী জয়েনিং ১০', 2022, 6, 22, '=DATE(B11, C11, D11)', '=TODAY()', '=YEAR(E11)', '=MONTH(E11)', '=DAY(E11)']
    ]
  },

  // 20. DATEDIF & NETWORKDAYS (Combined)
  {
    id: 'datedif',
    badge: 'Date & Time',
    category: 'date',
    name: 'DATEDIF & NETWORKDAYS Functions',
    title: '=DATEDIF(start, end, "Y") / =NETWORKDAYS(start, end)',
    desc: 'দুটি তারিখের মধ্যবর্তী ব্যবধান ও কর্মদিবস নির্ণয়: DATEDIF দিয়ে পূর্ণ বছর/চাকরির বয়স এবং NETWORKDAYS দিয়ে সাপ্তাহিক ছুটি (শুক্রবার ও শনিবার) বাদ দিয়ে প্রকৃত কর্মদিবস হিসাব।',
    tokens: [
      { text: '=DATEDIF(', class: 'c-fn' },
      { text: 'B2, C2, "Y"', class: 'c-p1' },
      { text: ')', class: 'c-fn' },
      { text: ' | ', class: 'c-fn' },
      { text: '=NETWORKDAYS(', class: 'c-fn' },
      { text: 'B2, C2', class: 'c-p2' },
      { text: ')', class: 'c-fn' }
    ],
    params: [
      { name: 'DATEDIF(B2, C2, "Y")', meaning: 'শুরু ও শেষ তারিখের মধ্যকার ব্যবধান পূর্ণ বছরে হিসাব করে।', class: 'c-p1' },
      { name: 'NETWORKDAYS(B2, C2)', meaning: 'শুক্রবার ও শনিবার সাপ্তাহিক ছুটি বাদ দিয়ে প্রকৃত কর্মদিবস গণনা করে।', class: 'c-p2' },
      { name: 'B2 ও C2', meaning: 'প্রকল্প বা চাকুরির আরম্ভ এবং সমাপ্তির তারিখ নির্দেশক সেল।', class: 'c-p3' }
    ],
    activeCell: 'D2',
    cols: ['A', 'B', 'C', 'D', 'E'],
    colWidths: ['180px', '120px', '120px', '150px', '165px'],
    headers: ['প্রকল্প বা চুক্তি', 'শুরুর তারিখ', 'সমাপ্তির তারিখ', 'মেয়াদ (বছর - DATEDIF)', 'প্রকৃত কর্মদিবস (NETWORKDAYS)'],
    rows: [
      ['মেট্রোরেল ফেজ-১ কনস্ট্রাকশন', '2016-01-01', '2022-12-31', '=DATEDIF(B2, C2, "Y")', '=NETWORKDAYS(B2, C2)'],
      ['পদ্মা সেতু রেল সংযোগ', '2018-05-15', '2023-10-31', '=DATEDIF(B3, C3, "Y")', '=NETWORKDAYS(B3, C3)'],
      ['বঙ্গবন্ধু টানেল প্রজেক্ট', '2017-08-01', '2023-09-30', '=DATEDIF(B4, C4, "Y")', '=NETWORKDAYS(B4, C4)'],
      ['স্মার্ট সিটি ডিজিটাল রূপান্তর', '2020-03-01', '2024-02-28', '=DATEDIF(B5, C5, "Y")', '=NETWORKDAYS(B5, C5)'],
      ['হযরত শাহজালাল টার্মিনাল ৩', '2019-11-01', '2024-06-30', '=DATEDIF(B6, C6, "Y")', '=NETWORKDAYS(B6, C6)'],
      ['রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র', '2015-06-01', '2024-12-31', '=DATEDIF(B7, C7, "Y")', '=NETWORKDAYS(B7, C7)'],
      ['ঢাকা-কক্সবাজার রেলওয়ে লাইন', '2018-03-01', '2023-11-30', '=DATEDIF(B8, C8, "Y")', '=NETWORKDAYS(B8, C8)'],
      ['সাইবার সিকিউরিটি কোর প্রজেক্ট', '2021-01-15', '2023-12-15', '=DATEDIF(B9, C9, "Y")', '=NETWORKDAYS(B9, C9)']
    ]
  }
];
