/**
 * SkillBridge Mock Database & Initial Seed Data
 * Uses LocalStorage for client-side persistence across pages
 */

const STORAGE_KEYS = {
  CURRENT_USER: 'sb_current_user',
  STUDENTS: 'sb_students',
  SKILLS: 'sb_skills',
  REQUESTS: 'sb_requests',
  CHATS: 'sb_chats',
  REVIEWS: 'sb_reviews',
  NOTIFICATIONS: 'sb_notifications',
  MANAGER_LOGGED_IN: 'sb_manager_auth'
};

// Seed Current Student (Alex Rivera)
const SEED_CURRENT_USER = {
  id: 'std_01',
  name: 'Alex Rivera',
  rollNo: 'CS2023-049',
  email: 'alex.rivera@campus.edu',
  department: 'Computer Science',
  year: '3rd Year',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  bio: 'Full-stack enthusiast building web apps. Happy to teach React, Tailwind, and Node.js. Looking to master UI/UX Figma and Python Machine Learning!',
  rating: 4.9,
  reviewsCount: 14,
  exchangesCompleted: 18,
  credits: 120,
  verified: true,
  availability: 'Weekdays 5PM - 8PM, Weekends',
  teachSkills: ['React.js', 'Node.js', 'Tailwind CSS', 'Git & GitHub'],
  learnSkills: ['UI/UX Design in Figma', 'Python Machine Learning', 'Data Structures & Algorithms']
};

// Seed Other College Students
const SEED_STUDENTS = [
  {
    id: 'std_02',
    name: 'Sarah Chen',
    rollNo: 'DS2023-112',
    email: 'sarah.chen@campus.edu',
    department: 'Data Science & AI',
    year: '4th Year',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    bio: 'Data science major passionate about deep learning, computer vision, and pandas. Love teaching Python and PyTorch!',
    rating: 5.0,
    reviewsCount: 22,
    exchangesCompleted: 26,
    credits: 190,
    verified: true,
    status: 'Active',
    availability: 'Tuesday & Thursday Evenings',
    teachSkills: ['Python Machine Learning', 'PyTorch', 'Data Visualization', 'SQL'],
    learnSkills: ['React.js', 'Next.js', 'Public Speaking']
  },
  {
    id: 'std_03',
    name: 'Marcus Vance',
    rollNo: 'DES2022-088',
    email: 'marcus.v@campus.edu',
    department: 'Design & Media',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    bio: 'Product Designer & Design System lead at Campus Tech Club. Figma ninja and micro-interaction nerd.',
    rating: 4.8,
    reviewsCount: 19,
    exchangesCompleted: 21,
    credits: 145,
    verified: true,
    status: 'Active',
    availability: 'Weekends 10AM - 4PM',
    teachSkills: ['UI/UX Design in Figma', 'Design Systems', 'Wireframing', 'User Research'],
    learnSkills: ['Frontend React', 'JavaScript Basics', '3D Blender']
  },
  {
    id: 'std_04',
    name: 'Priya Sharma',
    rollNo: 'ECE2024-032',
    email: 'priya.s@campus.edu',
    department: 'Electronics & Comm.',
    year: '2nd Year',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    bio: 'Robotics hobbyist and embedded systems tinkerer. Experienced with Arduino, Raspberry Pi, and C++.',
    rating: 4.7,
    reviewsCount: 9,
    exchangesCompleted: 11,
    credits: 80,
    verified: true,
    status: 'Active',
    availability: 'Mon, Wed, Fri 4PM - 6PM',
    teachSkills: ['Arduino & Microcontrollers', 'C++ Programming', 'Circuit Design'],
    learnSkills: ['Python Basics', 'Web Scraping', 'PCB Design in KiCad']
  },
  {
    id: 'std_05',
    name: 'Liam O’Connor',
    rollNo: 'BA2023-019',
    email: 'liam.oc@campus.edu',
    department: 'Business & Management',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    bio: 'Case competition winner and student entrepreneur. Can teach Financial Modeling, Excel Mastery, and Pitch Deck presentation.',
    rating: 4.9,
    reviewsCount: 15,
    exchangesCompleted: 16,
    credits: 110,
    verified: false,
    status: 'Active',
    availability: 'Flexible on Weekends',
    teachSkills: ['Financial Modeling', 'Advanced Excel & Macros', 'Pitch Deck Creation'],
    learnSkills: ['SQL for Business', 'Python Data Analysis']
  },
  {
    id: 'std_06',
    name: 'Aisha Al-Mansoor',
    rollNo: 'CS2022-105',
    email: 'aisha.m@campus.edu',
    department: 'Computer Science',
    year: '4th Year',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250',
    bio: 'Competitive programmer (Codeforces Candidate Master) and incoming software engineering intern. Let me help you ace DSA!',
    rating: 5.0,
    reviewsCount: 31,
    exchangesCompleted: 35,
    credits: 250,
    verified: true,
    status: 'Active',
    availability: 'Sunday mornings & Saturday evenings',
    teachSkills: ['Data Structures & Algorithms', 'Dynamic Programming', 'Competitive C++'],
    learnSkills: ['Docker & Kubernetes', 'System Design']
  },
  {
    id: 'std_07',
    name: 'Daniel Kim',
    rollNo: 'LANG2024-004',
    email: 'daniel.k@campus.edu',
    department: 'Linguistics & Arts',
    year: '2nd Year',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    bio: 'Bilingual native Korean and English speaker. Conducting conversational Korean practice sessions and JLPT N4 Japanese study groups.',
    rating: 4.8,
    reviewsCount: 12,
    exchangesCompleted: 14,
    credits: 95,
    verified: true,
    status: 'Active',
    availability: 'Evenings after 6PM',
    teachSkills: ['Conversational Korean', 'Japanese for Beginners', 'Essay Writing'],
    learnSkills: ['Video Editing Premiere Pro', 'Guitar Basics']
  },
  {
    id: 'std_08',
    name: 'Elena Rostova',
    rollNo: 'BIO2023-042',
    email: 'elena.r@campus.edu',
    department: 'Bioinformatics',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    bio: 'Exploring computational biology and statistical genetics with R. Enthusiastic about photography in free time!',
    rating: 4.6,
    reviewsCount: 7,
    exchangesCompleted: 8,
    credits: 60,
    verified: false,
    status: 'Flagged',
    availability: 'Friday Afternoons',
    teachSkills: ['R Programming & BioConductor', 'Photography Composition'],
    learnSkills: ['Linux Command Line', 'Python Scripting']
  }
];

// Seed Skills Directory
const SEED_SKILLS = [
  {
    id: 'sk_01',
    title: 'React.js & Modern Web Dev',
    category: 'Web Development',
    level: 'Intermediate',
    mentorId: 'std_01',
    mentorName: 'Alex Rivera',
    mentorDept: 'Computer Science',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    rating: 4.9,
    description: 'Learn functional React components, hooks (useState, useEffect, useMemo), state management, and connecting to REST APIs.',
    seekingSkill: 'UI/UX Design in Figma',
    hoursCompleted: 24,
    badge: 'Popular'
  },
  {
    id: 'sk_02',
    title: 'Python Machine Learning & PyTorch',
    category: 'AI & Data Science',
    level: 'Advanced',
    mentorId: 'std_02',
    mentorName: 'Sarah Chen',
    mentorDept: 'Data Science & AI',
    mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    rating: 5.0,
    description: 'Hands-on neural network training, CNNs, image classification, data preprocessing with pandas, and model deployment basics.',
    seekingSkill: 'React.js',
    hoursCompleted: 38,
    badge: 'Top Mentor'
  },
  {
    id: 'sk_03',
    title: 'UI/UX Design & Prototyping in Figma',
    category: 'Design & Media',
    level: 'Intermediate',
    mentorId: 'std_03',
    mentorName: 'Marcus Vance',
    mentorDept: 'Design & Media',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    rating: 4.8,
    description: 'Create interactive prototypes, auto-layout components, design systems, and learn accessibility best practices.',
    seekingSkill: 'Frontend Web Dev',
    hoursCompleted: 32,
    badge: 'Trending'
  },
  {
    id: 'sk_04',
    title: 'Data Structures & Algorithms Masterclass',
    category: 'Programming',
    level: 'Advanced',
    mentorId: 'std_06',
    mentorName: 'Aisha Al-Mansoor',
    mentorDept: 'Computer Science',
    mentorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250',
    rating: 5.0,
    description: 'Master binary trees, graphs, dynamic programming, backtracking, and prepare for tech internship coding rounds.',
    seekingSkill: 'System Design',
    hoursCompleted: 50,
    badge: 'Top Rated'
  },
  {
    id: 'sk_05',
    title: 'Arduino & IoT Prototyping',
    category: 'Hardware & Robotics',
    level: 'Beginner',
    mentorId: 'std_04',
    mentorName: 'Priya Sharma',
    mentorDept: 'Electronics & Comm.',
    mentorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    rating: 4.7,
    description: 'Understand microcontroller circuits, sensory inputs, servo motor control, and basic IoT data logging with Arduino.',
    seekingSkill: 'Python Scripting',
    hoursCompleted: 16,
    badge: 'Hands-on'
  },
  {
    id: 'sk_06',
    title: 'Financial Modeling & Advanced Excel',
    category: 'Business & Finance',
    level: 'Intermediate',
    mentorId: 'std_05',
    mentorName: 'Liam O’Connor',
    mentorDept: 'Business & Management',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    rating: 4.9,
    description: 'Build 3-statement financial models, DCF valuations, index-match, pivot tables, and automated workbook templates.',
    seekingSkill: 'SQL for Business',
    hoursCompleted: 22,
    badge: 'Career Skill'
  },
  {
    id: 'sk_07',
    title: 'Conversational Korean & Culture',
    category: 'Languages',
    level: 'Beginner',
    mentorId: 'std_07',
    mentorName: 'Daniel Kim',
    mentorDept: 'Linguistics & Arts',
    mentorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    rating: 4.8,
    description: 'Learn Hangul reading/writing, everyday conversational expressions, pronunciation coaching, and cultural etiquette.',
    seekingSkill: 'Video Editing',
    hoursCompleted: 18,
    badge: 'Beginner Friendly'
  },
  {
    id: 'sk_08',
    title: 'Node.js & Backend REST APIs',
    category: 'Web Development',
    level: 'Intermediate',
    mentorId: 'std_01',
    mentorName: 'Alex Rivera',
    mentorDept: 'Computer Science',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    rating: 4.9,
    description: 'Express.js backend development, JSON web tokens auth, RESTful route design, middleware, and database connectivity.',
    seekingSkill: 'Python Machine Learning',
    hoursCompleted: 19,
    badge: 'Popular'
  }
];

// Seed Learning Requests (Incoming & Outgoing for currentUser)
const SEED_REQUESTS = [
  {
    id: 'req_101',
    type: 'incoming', // Incoming to Alex
    senderId: 'std_03',
    senderName: 'Marcus Vance',
    senderDept: 'Design & Media',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    receiverId: 'std_01',
    requestedSkill: 'React.js & Modern Web Dev',
    offeredSkill: 'UI/UX Design in Figma',
    status: 'pending', // pending | accepted | rejected
    message: 'Hey Alex! Saw your profile. I am designing a web app and want to build the frontend myself using React. Can exchange 3 sessions of Figma design system coaching!',
    createdAt: '2 hours ago',
    proposedSchedule: 'Saturdays 2:00 PM'
  },
  {
    id: 'req_102',
    type: 'incoming',
    senderId: 'std_05',
    senderName: 'Liam O’Connor',
    senderDept: 'Business & Management',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    receiverId: 'std_01',
    requestedSkill: 'Node.js & Backend REST APIs',
    offeredSkill: 'Financial Modeling & Advanced Excel',
    status: 'accepted',
    message: 'Hi Alex! I would love to learn basic API construction for an analytics project. Let me teach you business modeling or valuation in return.',
    createdAt: '1 day ago',
    proposedSchedule: 'Weekdays after 6:00 PM'
  },
  {
    id: 'req_103',
    type: 'incoming',
    senderId: 'std_04',
    senderName: 'Priya Sharma',
    senderDept: 'Electronics & Comm.',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    receiverId: 'std_01',
    requestedSkill: 'React.js & Modern Web Dev',
    offeredSkill: 'Arduino & IoT Prototyping',
    status: 'rejected',
    message: 'Looking to make a web dashboard for my IoT weather station sensor feeds.',
    createdAt: '3 days ago',
    proposedSchedule: 'Thursday afternoons'
  },
  {
    id: 'req_104',
    type: 'outgoing', // Alex sent to Sarah
    senderId: 'std_01',
    receiverId: 'std_02',
    receiverName: 'Sarah Chen',
    receiverDept: 'Data Science & AI',
    receiverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    requestedSkill: 'Python Machine Learning & PyTorch',
    offeredSkill: 'React.js & Modern Web Dev',
    status: 'accepted',
    message: 'Hi Sarah! I am looking to integrate an ML image model into my React portfolio project. Would love to barter React mentoring for basic PyTorch walkthroughs.',
    createdAt: 'Yesterday',
    proposedSchedule: 'Tuesdays 5:00 PM'
  },
  {
    id: 'req_105',
    type: 'outgoing', // Alex sent to Aisha
    senderId: 'std_01',
    receiverId: 'std_06',
    receiverName: 'Aisha Al-Mansoor',
    receiverDept: 'Computer Science',
    receiverAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250',
    requestedSkill: 'Data Structures & Algorithms Masterclass',
    offeredSkill: 'Tailwind CSS & Web UI',
    status: 'pending',
    message: 'Hi Aisha, preparing for the upcoming campus hackathon and tech placement interviews. Hope to learn dynamic programming techniques from you!',
    createdAt: '4 hours ago',
    proposedSchedule: 'Sunday 11:00 AM'
  }
];

// Seed Chat Conversations
const SEED_CHATS = [
  {
    id: 'chat_01',
    contactId: 'std_02',
    contactName: 'Sarah Chen',
    contactDept: 'Data Science & AI',
    contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    isOnline: true,
    exchangeSkill: 'Python ML ⇄ React.js',
    lastMessage: 'Awesome! I pushed the PyTorch starter notebook to GitHub.',
    lastTime: '10:42 AM',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey Alex! Ready for our first skill exchange session this week?', time: '10:15 AM' },
      { id: 'm2', sender: 'me', text: 'Hey Sarah! Yes absolutely. I reviewed the dataset you sent over yesterday.', time: '10:20 AM' },
      { id: 'm3', sender: 'them', text: 'Great! We will cover convolutional layers and how to export weights to ONNX format.', time: '10:28 AM' },
      { id: 'm4', sender: 'me', text: 'Sounds perfect! And afterward I will guide you through setting up a fast Vite + React boilerplate for the web preview.', time: '10:35 AM' },
      { id: 'm5', sender: 'them', text: 'Awesome! I pushed the PyTorch starter notebook to GitHub.', time: '10:42 AM' }
    ]
  },
  {
    id: 'chat_02',
    contactId: 'std_03',
    contactName: 'Marcus Vance',
    contactDept: 'Design & Media',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    isOnline: true,
    exchangeSkill: 'UI/UX Design ⇄ React.js',
    lastMessage: 'Let me know if the Saturday 2 PM slot works for you!',
    lastTime: 'Yesterday',
    unreadCount: 2,
    messages: [
      { id: 'm201', sender: 'them', text: 'Hey Alex! Saw your profile on the exchange board.', time: 'Yesterday 3:10 PM' },
      { id: 'm202', sender: 'them', text: 'I submitted a request to barter Figma prototyping for React tutorials.', time: 'Yesterday 3:12 PM' },
      { id: 'm203', sender: 'them', text: 'Let me know if the Saturday 2 PM slot works for you!', time: 'Yesterday 3:15 PM' }
    ]
  },
  {
    id: 'chat_03',
    contactId: 'std_05',
    contactName: 'Liam O’Connor',
    contactDept: 'Business & Management',
    contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    isOnline: false,
    exchangeSkill: 'Excel Modeling ⇄ Node.js',
    lastMessage: 'Thanks for the API tutorial yesterday, it clarified express routes a lot.',
    lastTime: '2 days ago',
    unreadCount: 0,
    messages: [
      { id: 'm301', sender: 'me', text: 'Liam, here is the Postman collection we used in our session.', time: '2 days ago' },
      { id: 'm302', sender: 'them', text: 'Thanks for the API tutorial yesterday, it clarified express routes a lot.', time: '2 days ago' }
    ]
  }
];

// Seed Reviews
const SEED_REVIEWS = [
  {
    id: 'rev_01',
    studentId: 'std_01',
    reviewerName: 'Sarah Chen',
    reviewerDept: 'Data Science & AI',
    reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    skill: 'React.js & Hooks',
    comment: 'Alex is an exceptional peer mentor! He broke down React state and lifecycle hooks in a very digestible way. In exchange, he grasped PyTorch tensor operations super quickly. Highly recommended!',
    date: '3 days ago'
  },
  {
    id: 'rev_02',
    studentId: 'std_01',
    reviewerName: 'Liam O’Connor',
    reviewerDept: 'Business & Management',
    reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    skill: 'Node.js & REST APIs',
    comment: 'Punctual, friendly, and very patient with non-CS students. Helped me set up a functional backend endpoint within one session!',
    date: '1 week ago'
  },
  {
    id: 'rev_03',
    studentId: 'std_01',
    reviewerName: 'Daniel Kim',
    reviewerDept: 'Linguistics & Arts',
    reviewerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    rating: 4,
    skill: 'Git & GitHub Workflow',
    comment: 'Super helpful walkthrough on branching and resolving merge conflicts. Made contributing to group projects so much easier.',
    date: '2 weeks ago'
  }
];

// Seed Notifications
const SEED_NOTIFICATIONS = [
  {
    id: 'notif_01',
    type: 'request',
    title: 'New Skill Exchange Request',
    message: 'Marcus Vance sent you an exchange request for "React.js & Modern Web Dev".',
    time: '2 hours ago',
    read: false,
    link: 'requests.html'
  },
  {
    id: 'notif_02',
    type: 'message',
    title: 'New Message from Sarah Chen',
    message: 'Sarah Chen: "Awesome! I pushed the PyTorch starter notebook to GitHub."',
    time: '4 hours ago',
    read: false,
    link: 'chat.html'
  },
  {
    id: 'notif_03',
    type: 'success',
    title: 'Request Accepted',
    message: 'Sarah Chen accepted your exchange request for "Python Machine Learning".',
    time: 'Yesterday',
    read: true,
    link: 'requests.html'
  },
  {
    id: 'notif_04',
    type: 'badge',
    title: 'Achievement Unlocked: Top Peer Mentor',
    message: 'Congratulations! You received 10+ five-star peer exchange reviews this semester.',
    time: '3 days ago',
    read: true,
    link: 'profile.html'
  }
];

// Seed Manager Platform Stats
const SEED_MANAGER_STATS = {
  totalStudents: 348,
  activeExchanges: 46,
  completedExchanges: 412,
  skillsCount: 78,
  satisfactionRate: '98.4%',
  pendingVerifications: 5,
  flaggedReports: 1,
  recentExchanges: [
    { id: 'ex_1', mentor: 'Sarah Chen', learner: 'Alex Rivera', skills: 'Python ML ⇄ React.js', status: 'In Progress', date: 'Today' },
    { id: 'ex_2', mentor: 'Aisha Al-Mansoor', learner: 'Kevin Patel', skills: 'DSA ⇄ AWS Cloud', status: 'Completed', date: 'Yesterday' },
    { id: 'ex_3', mentor: 'Marcus Vance', learner: 'Elena Rostova', skills: 'Figma ⇄ Photography', status: 'In Progress', date: '2 days ago' },
    { id: 'ex_4', mentor: 'Liam O’Connor', learner: 'Priya Sharma', skills: 'Excel ⇄ Arduino', status: 'Completed', date: '3 days ago' },
    { id: 'ex_5', mentor: 'Daniel Kim', learner: 'Jordan Lee', skills: 'Korean ⇄ Video Editing', status: 'In Progress', date: '4 days ago' }
  ]
};

// Data Store Helper Functions
const SkillBridgeDB = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_CURRENT_USER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SKILLS)) {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(SEED_SKILLS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(SEED_CHATS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    }
  },

  getCurrentUser() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
  },

  updateCurrentUser(userData) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
  },

  getStudents() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS));
  },

  updateStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getSkills() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS));
  },

  addSkill(skill) {
    const skills = this.getSkills();
    skills.unshift(skill);
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    return skill;
  },

  getRequests() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS));
  },

  updateRequests(requests) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  },

  addRequest(req) {
    const requests = this.getRequests();
    requests.unshift(req);
    this.updateRequests(requests);
    return req;
  },

  getChats() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS));
  },

  updateChats(chats) {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  getReviews() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS));
  },

  addReview(review) {
    const reviews = this.getReviews();
    reviews.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return review;
  },

  getNotifications() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS));
  },

  updateNotifications(notifs) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  getManagerStats() {
    return SEED_MANAGER_STATS;
  },

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    this.init();
  }
};

// Run initialize immediately
SkillBridgeDB.init();
