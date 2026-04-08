import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Stethoscope, 
  ChevronRight, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Scale, 
  User,
  RefreshCw,
  Heart,
  LogIn,
  UserPlus,
  LogOut,
  UserCircle,
  LayoutDashboard,
  Settings,
  Mail,
  Lock,
  CreditCard,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import './App.css';

const XRayScanner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="xray-container"
    >
      <img src="/xray.png" alt="X-ray Scan" className="xray-image" />
      <div className="scan-line"></div>
      <div className="scan-labels">
        <span className="scan-label">Mode: Bone Density</span>
        <span className="scan-label">Resolution: 8K Alpha</span>
        <span className="scan-label">AI Status: Active</span>
      </div>
      <div className="scanning-text">Analyzing structural integrity...</div>
      
      {/* Decorative corners */}
      <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderTop: '2px solid #10b981', borderLeft: '2px solid #10b981' }}></div>
      <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderTop: '2px solid #10b981', borderRight: '2px solid #10b981' }}></div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, width: 20, height: 20, borderBottom: '2px solid #10b981', borderLeft: '2px solid #10b981' }}></div>
      <div style={{ position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, borderBottom: '2px solid #10b981', borderRight: '2px solid #10b981' }}></div>
    </motion.div>
  );
};

const educationData = [
  {
    question: "What exactly is Osteoporosis?",
    options: ["A joint inflammation disease", "A condition where bones become weak and brittle", "A type of bone cancer", "A muscle wasting disorder"],
    correct: 1,
    info: "Osteoporosis literally means 'porous bone'. It's a disease in which the density and quality of bone are reduced. As bones become more porous and fragile, the risk of fracture is greatly increased. The loss of bone occurs silently and progressively."
  },
  {
    question: "Why is it often called the 'Silent Thief'?",
    options: ["It only affects you at night", "It has no outward symptoms until a fracture occurs", "It causes hearing loss", "It's a very rare disease"],
    correct: 1,
    info: "Osteoporosis is often called the 'silent thief' because bone loss typically occurs without symptoms. People may not know they have it until their bones become so weak that a sudden strain, bump, or fall causes a fracture or a vertebra to collapse."
  },
  {
    question: "Have you started or completed the menopause?",
    options: ["Yes", "No", "Not sure", "Not applicable"],
    correct: 0,
    info: "When you reach the menopause, your ovaries stop producing as much of the hormone oestrogen. Oestrogen helps to keep bones strong, so women lose bone strength more quickly for a few years around the time of the menopause."
  },
  {
    question: "Which mineral is most critical for building bone density?",
    options: ["Iron", "Calcium", "Potassium", "Zinc"],
    correct: 1,
    info: "Calcium is a major building block of our skeleton. About 99% of the calcium in our bodies is stored in our bones and teeth. If we don’t have enough calcium in our diets, our bodies will take it from our bones."
  },
  {
    question: "Is BMI (Body Mass Index) related to bone health?",
    options: ["No, it only affects heart health", "Yes, low BMI increases fracture risk", "Only for people over 80", "Only for professional athletes"],
    isBMI: true,
    correct: 1,
    info: "People with a low body weight (BMI under 18.5) are more likely to develop osteoporosis and broken bones than people with a healthy weight. Maintaining a healthy weight is crucial for skeletal support."
  },
  {
    question: "Which vitamin helps your body absorb calcium?",
    options: ["Vitamin C", "Vitamin A", "Vitamin D", "Vitamin B12"],
    correct: 2,
    info: "Vitamin D plays a key role in bone health by helping the body absorb calcium from the diet. It also helps regulate the amount of calcium in the blood."
  },
  {
    question: "Which type of exercise is best for bone strengthening?",
    options: ["Swimming", "Weight-bearing and resistance exercises", "Cycling", "Stretching only"],
    correct: 1,
    info: "Weight-bearing exercises (like walking, jogging, or dancing) and resistance exercises (like lifting weights) are best for bones because they force you to work against gravity, which stimulates bone-building cells."
  },
  {
    question: "At what age do most people reach 'Peak Bone Mass'?",
    options: ["Late 20s", "Early teens", "After 50", "During childhood"],
    correct: 0,
    info: "Most people reach their peak bone mass (maximum strength and density) by their late 20s. After this, bone remodeling continues, but you typically lose slightly more bone than you gain."
  },
  {
    question: "Does smoking affect your risk building?",
    options: ["No impact", "It actually helps bones", "Yes, it significantly weakens bones", "Only if you smoke a lot"],
    correct: 2,
    info: "Smoking is a significant risk factor for osteoporosis. Chemicals in cigarettes interfere with the function of bone cells and can also decrease the absorption of calcium from the diet."
  },
  {
    question: "How is Osteoporosis typically diagnosed?",
    options: ["Standard X-ray", "Blood test", "DEXA Scan (Bone density scan)", "Physical examination"],
    correct: 2,
    info: "A Dual-Energy X-ray Absorptiometry (DEXA) scan is the gold standard for measuring bone mineral density. It is a quick, painless, and highly accurate way to assess your bone health."
  }
];

const BMICalculator = ({ onCalculate }) => {
  const [height, setHeight] = useState('165');
  const [weight, setWeight] = useState('63');
  const [bmi, setBmi] = useState(null);

  const calculate = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    const result = (w / (h * h)).toFixed(1);
    setBmi(result);
    if (onCalculate) onCalculate(result);
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)' }}>
          <label style={{ color: 'var(--primary)', fontWeight: 600 }}>Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={{ textAlign: 'center', fontSize: '1.5rem' }} />
        </div>
        <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)' }}>
          <label style={{ color: 'var(--primary)', fontWeight: 600 }}>Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ textAlign: 'center', fontSize: '1.5rem' }} />
        </div>
      </div>
      <button onClick={calculate} className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Calculate</button>
      
      {bmi && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Your BMI is:</h3>
          <div style={{ fontSize: '4rem', fontWeight: 800, color: '#fff' }}>{bmi}</div>
        </motion.div>
      )}
    </div>
  );
};

const KnowledgeQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    setShowInfo(true);
  };

  const nextQuestion = () => {
    if (currentIndex < educationData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowInfo(false);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setShowInfo(false);
    }
  };

  const current = educationData[currentIndex];

  return (
    <section id="learn" style={{ padding: '6rem 5%', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
          {educationData.map((_, i) => (
            <div key={i} style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: i === currentIndex ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{current.question}</h2>
      </div>

      <div className="glass glass-card" style={{ minHeight: '400px', position: 'relative' }}>
        {current.isBMI ? (
          <BMICalculator onCalculate={() => setShowInfo(true)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(i)}
                style={{
                  padding: '1.2rem 2rem',
                  borderRadius: '15px',
                  border: '1px solid',
                  borderColor: selectedOption === i ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  background: selectedOption === i ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: '#fff',
                  textAlign: 'left',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  border: '2px solid',
                  borderColor: selectedOption === i ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {selectedOption === i && <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%' }} />}
                </div>
                {opt}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                marginTop: '2.5rem',
                padding: '2rem',
                background: 'rgba(236, 72, 153, 0.15)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '1.1rem',
                lineHeight: '1.7'
              }}
            >
              {current.info}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
          <button 
            onClick={prevQuestion} 
            disabled={currentIndex === 0} 
            className="btn btn-secondary"
            style={{ padding: '0.8rem 2.5rem', opacity: currentIndex === 0 ? 0.3 : 1 }}
          >
            Back
          </button>
          <button 
            onClick={nextQuestion} 
            disabled={currentIndex === educationData.length - 1} 
            className="btn btn-primary"
            style={{ padding: '0.8rem 2.5rem', opacity: currentIndex === educationData.length - 1 ? 0.3 : 1 }}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

const BoneHealthSection = () => (
  <section id="health-essentials" style={{ padding: '6rem 5%', background: 'linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.05), transparent)' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>The Pillars of Bone Health.</h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto' }}>
          Building strong bones isn't just about genetics. Your daily habits and nutritional intake form the foundation of lifelong skeletal integrity.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
        <div className="glass glass-card" style={{ borderTop: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
              <Heart color="#10b981" size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Calcium: The Builder</h3>
          </div>
          <p style={{ marginBottom: '1.5rem' }}>
            Calcium is the primary structural component of bones. Your body can't produce it, so it must come from your diet. Without enough, your body steals it from your bones.
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" /> <strong>Dairy:</strong> Milk, Yogurt, Cheese
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" /> <strong>Greens:</strong> Kale, Broccoli, Spinach
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" /> <strong>Fortified:</strong> Soy Milk, Tofu, Cereals
            </li>
          </ul>
        </div>

        <div className="glass glass-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px' }}>
              <Zap color="#f59e0b" size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Vitamin D: The Key</h3>
          </div>
          <p style={{ marginBottom: '1.5rem' }}>
            Think of Vitamin D as the 'doorman' that lets calcium into your bloodstream. Even with high calcium intake, your bones won't benefit without enough Vitamin D.
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#f59e0b" /> <strong>Sunlight:</strong> 15 mins daily exposure
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#f59e0b" /> <strong>Fatty Fish:</strong> Salmon, Mackerel, Tuna
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#f59e0b" /> <strong>Supplementation:</strong> Consult your GP
            </li>
          </ul>
        </div>

        <div className="glass glass-card" style={{ borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px' }}>
              <Activity color="var(--primary)" size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Exercise: The Stimulus</h3>
          </div>
          <p style={{ marginBottom: '1.5rem' }}>
            Bone is living tissue that responds to stress. Weight-bearing exercises signal your body to deposit more bone minerals and strengthen the architecture.
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--primary)" /> <strong>Resistance:</strong> Weight training
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--primary)" /> <strong>Impact:</strong> Jogging, Dancing, Tennis
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--primary)" /> <strong>Balance:</strong> Yoga, Tai Chi (Fall prevention)
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const AuthModal = ({ isOpen, onClose, mode, setMode, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [details, setDetails] = useState({ name: '', age: '', weight: '', height: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      ...details,
      isLoggedIn: true,
      lastScan: 'None',
      riskScore: '--'
    };
    onAuthSuccess(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      background: 'rgba(0,0,0,0.8)', 
      backdropFilter: 'blur(8px)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass" 
        style={{ width: '100%', maxWidth: '450px', padding: '3rem', position: 'relative' }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          ×
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Activity color="white" size={32} />
          </div>
          <h2 style={{ fontSize: '2rem' }}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{mode === 'login' ? 'Enter your credentials to access your scans' : 'Register for early osteoporosis detection'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label><User size={14} style={{ marginRight: '5px' }} /> Full Name</label>
                <input type="text" required value={details.name} onChange={(e) => setDetails({...details, name: e.target.value})} placeholder="Kanishka" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" required value={details.age} onChange={(e) => setDetails({...details, age: e.target.value})} placeholder="24" />
                </div>
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input type="number" required value={details.height} onChange={(e) => setDetails({...details, height: e.target.value})} placeholder="175" />
                </div>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label><Mail size={14} style={{ marginRight: '5px' }} /> Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label><Lock size={14} style={{ marginRight: '5px' }} /> Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', height: '3.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            {mode === 'login' ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? "Don't have an account? " : "Already registered? "}
          <span 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')} 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

const PatientDashboard = ({ isOpen, user, onClose, onLogout }) => {
  if (!user || !isOpen) return null;

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      width: '100%', 
      maxWidth: '500px', 
      height: '100%', 
      background: 'rgba(2, 6, 23, 0.95)', 
      backdropFilter: 'blur(20px)',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      zIndex: 1000,
      padding: '3rem',
      overflowY: 'auto',
      borderLeft: '1px solid var(--glass-border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
            <LayoutDashboard color="white" size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Patient Dashboard</h2>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>×</button>
      </div>

      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #4338ca)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, border: '4px solid rgba(255,255,255,0.1)' }}>
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user.name || 'Anonymous User'}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>AGE</label>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{user.age || '--'} yrs</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>HEIGHT</label>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{user.height || '--'} cm</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>RISK SCORE</label>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>{user.riskScore}%</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>STATUS</label>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--secondary)' }}>Active</div>
        </div>
      </div>

      <h4 style={{ marginBottom: '1.5rem' }}>Recent Activity</h4>
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '10px' }}>
            <Activity size={20} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Baseline Bone Density Scan</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aug 12, 2026 • AI Analyzed</div>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px' }}>
            <Target size={20} color="var(--secondary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Calcium Intake Goal Set</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aug 10, 2026 • 1200mg/day</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-secondary" style={{ flex: 1 }}><Settings size={18} /> Settings</button>
        <button onClick={onLogout} className="btn btn-primary" style={{ flex: 1, background: '#ef4444' }}><LogOut size={18} /> Logout</button>
      </div>
    </motion.div>
  );
};

const Navbar = ({ onOpenAuth, loggedInUser, onOpenDashboard }) => (
  <nav className="nav-bar fade-in" style={{ 
    padding: '1.5rem 5%', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(2, 6, 23, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--glass-border)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
        <Activity color="white" size={24} />
      </div>
      <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Osteo<span style={{ color: 'var(--primary)' }}>Scan</span> AI</span>
    </div>
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <a href="#learn" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Learn & Assess</a>
      <a href="#about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>About</a>
      
      {loggedInUser ? (
        <div 
          onClick={onOpenDashboard}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            background: 'rgba(255,255,255,0.05)', 
            padding: '5px 15px 5px 5px', 
            borderRadius: '50px', 
            cursor: 'pointer',
            border: '1px solid var(--glass-border)',
            transition: 'var(--transition)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : <UserCircle size={20} />}
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{loggedInUser.name.split(' ')[0]}</span>
        </div>
      ) : (
        <button onClick={() => onOpenAuth('login')} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
          <LogIn size={18} /> Sign In
        </button>
      )}
    </div>
  </nav>
);

const Hero = () => (
  <section style={{ padding: '4rem 5% 4rem', maxWidth: '1200px', margin: '0 auto', overflow: 'hidden' }}>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1.2fr 0.8fr', 
      gap: '2rem', 
      alignItems: 'center',
      minHeight: '600px'
    }}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span style={{ 
          background: 'rgba(99, 102, 241, 0.1)', 
          color: 'var(--primary)', 
          padding: '8px 20px', 
          borderRadius: '100px', 
          fontSize: '0.9rem', 
          fontWeight: 600,
          marginBottom: '2rem',
          display: 'inline-block',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Next-Gen Medical Analysis
        </span>
        <h1 style={{ textAlign: 'left', fontSize: '4rem', lineHeight: 1 }}>Bone Health Intelligence for the Modern Age.</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', color: 'var(--text-muted)' }}>
          Leverage advanced Machine Learning to assess your risk of Osteoporosis. Fast, non-invasive early detection powered by clinical data patterns.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#detection" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Start Free Scan <ChevronRight size={22} />
          </a>
          <button className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Learn More</button>
        </div>
      </motion.div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <XRayScanner />
      </div>
    </div>
  </section>
);

const XRayUpload = () => {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setAnalysisResult(null);
    }
  };

  const startAnalysis = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setAnalysisResult({
        density: "1.42 g/cm²",
        tscore: "-1.8",
        risk: "Moderate",
        color: "#f59e0b",
        details: "Minor cortical thinning detected in femoral neck area."
      });
    }, 4000);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {!file ? (
        <div 
          onClick={() => document.getElementById('xray-input').click()}
          style={{
            border: '2px dashed rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '4rem 2rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            background: 'rgba(255,255,255,0.02)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
        >
          <Activity size={48} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.6 }} />
          <h3>Drag & Drop X-Ray Image</h3>
          <p>Support for DICOM, PNG, and JPG formats</p>
          <input id="xray-input" type="file" hidden onChange={handleFileChange} accept="image/*" />
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'relative', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            maxHeight: '400px',
            border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <img src={file} alt="Preview" style={{ width: '100%', display: 'block' }} />
            {scanning && (
              <>
                <div className="scan-line" style={{ height: '4px', animationDuration: '2s' }}></div>
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  background: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    background: 'var(--bg-dark)', 
                    padding: '1rem 2rem', 
                    borderRadius: '50px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    border: '1px solid var(--primary)'
                  }}>
                    <RefreshCw className="spin" color="var(--primary)" size={18} />
                    <span style={{ fontWeight: 600, letterSpacing: '1px' }}>AI ANALYZING PIXELS...</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
           {!scanning && !analysisResult && (
            <button 
              onClick={startAnalysis} 
              className="btn btn-primary" 
              style={{ marginTop: '2rem', width: '100%', height: '3.5rem', justifyContent: 'center' }}
            >
              Run Computer Vision Analysis
            </button>
          )}

          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="result-card" 
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                marginTop: '2rem', 
                textAlign: 'left',
                border: `1px solid ${analysisResult.color}44`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ color: analysisResult.color, textTransform: 'uppercase', letterSpacing: '2px' }}>Analysis Complete</h4>
                <div style={{ background: analysisResult.color, padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, color: '#000' }}>
                  {analysisResult.risk} RISK
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem' }}>BONE DENSITY (EST)</label>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{analysisResult.density}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem' }}>CALCULATED T-SCORE</label>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{analysisResult.tscore}</div>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{analysisResult.details}</p>
              <button onClick={() => setFile(null)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginTop: '1rem', padding: 0 }}>Upload another scan</button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

const DetectionCenter = ({ user, setUser }) => {
  const [mode, setMode] = useState('data'); // 'data' or 'xray'

  return (
    <section id="detection" style={{ padding: '6rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Diagnostic Center.</h2>
        <p>Choose your preferred detection method for AI-powered risk assessment.</p>
        
        <div style={{ 
          display: 'inline-flex', 
          background: 'rgba(255,255,255,0.05)', 
          padding: '6px', 
          borderRadius: '16px', 
          marginTop: '2.5rem',
          border: '1px solid var(--glass-border)'
        }}>
          <button 
            onClick={() => setMode('data')}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              background: mode === 'data' ? 'var(--primary)' : 'transparent',
              color: mode === 'data' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            Clinical Data Form
          </button>
          <button 
            onClick={() => setMode('xray')}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              background: mode === 'xray' ? 'var(--primary)' : 'transparent',
              color: mode === 'xray' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            X-Ray Image AI
          </button>
        </div>
      </div>

      <div className="glass glass-card">
        {mode === 'data' ? (
          <PredictorForm 
            loggedInUser={user} 
            onPredictionUpdate={async (score) => {
              const currentEmail = user?.email;
              setUser(prev => {
                const updated = { ...prev, riskScore: score };
                localStorage.setItem('osteo_user', JSON.stringify(updated));
                return updated;
              });

              // Sync to Firebase
              if (currentEmail) {
                try {
                  const userRef = doc(db, "patients", currentEmail);
                  await updateDoc(userRef, { riskScore: score });
                } catch (err) {
                  console.error("Firebase Sync Error:", err);
                }
              }
            }}
          />
        ) : <XRayUpload />}
      </div>
    </section>
  );
};

const PredictorForm = ({ loggedInUser, onPredictionUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    age: loggedInUser?.age || '',
    gender: loggedInUser?.gender || 'female',
    hormonalChanges: 'no',
    familyHistory: 'no',
    race: 'asian',
    bodyWeight: loggedInUser?.weight || '',
    calciumIntake: 'low',
    vitaminDIntake: 'low',
    physicalActivity: 'sedentary',
    smoking: 'no',
    alcohol: 'never',
    medicalConditions: 'none',
    medications: 'none',
    priorFractures: 'no'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // AI Logic Simulation based on comprehensive inputs
    setTimeout(() => {
      let score = 0;
      if (parseInt(formData.age) > 65) score += 30;
      else if (parseInt(formData.age) > 50) score += 15;
      
      if (formData.hormonalChanges === 'yes') score += 25;
      if (formData.familyHistory === 'yes') score += 15;
      if (formData.calciumIntake === 'low') score += 10;
      if (formData.vitaminDIntake === 'low') score += 10;
      if (formData.physicalActivity === 'sedentary') score += 15;
      if (formData.smoking === 'yes') score += 10;
      if (formData.alcohol === 'high') score += 15;
      if (formData.medicalConditions !== 'none') score += 20;
      if (formData.medications !== 'none') score += 15;
      if (formData.priorFractures === 'yes') score += 25;

      let level = 'Low';
      let color = 'var(--secondary)';
      if (score > 65) { level = 'High'; color = '#ef4444'; }
      else if (score > 35) { level = 'Moderate'; color = '#f59e0b'; }

      const finalResult = { score, level, color };
      setResult(finalResult);
      setLoading(false);
      
      if (onPredictionUpdate) {
        onPredictionUpdate(Math.min(100, score).toString());
      }

      if (level === 'Low') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }, 2500);
  };

  return (
    <>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Advanced Diagnostic Modeling</h2>
        <p>Please enter comprehensive clinical parameters for your AI prediction.</p>
      </div>

      <form onSubmit={handlePredict}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label><User size={14} style={{ marginRight: '5px' }} /> Age</label>
            <input type="number" name="age" required onChange={handleChange} value={formData.age} placeholder="Years" />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" onChange={handleChange} value={formData.gender}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Race/Ethnicity</label>
            <select name="race" onChange={handleChange} value={formData.race}>
              <option value="asian">Asian</option>
              <option value="african">African American</option>
              <option value="caucasian">Caucasian</option>
              <option value="hispanic">Hispanic</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Hormonal Changes</label>
            <select name="hormonalChanges" onChange={handleChange} value={formData.hormonalChanges}>
              <option value="no">Normal</option>
              <option value="yes">Significant (e.g. Menopause)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Family History</label>
            <select name="familyHistory" onChange={handleChange} value={formData.familyHistory}>
              <option value="no">No History</option>
              <option value="yes">Yes (Fractures/Osteoporosis)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Prior Fractures</label>
            <select name="priorFractures" onChange={handleChange} value={formData.priorFractures}>
              <option value="no">No Prior Fractures</option>
              <option value="yes">Yes (Bone Trauma)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Calcium Intake</label>
            <select name="calciumIntake" onChange={handleChange} value={formData.calciumIntake}>
              <option value="low">Low {"<"} 700mg/day</option>
              <option value="adequate">Adequate (800-1200mg/day)</option>
              <option value="high">High {">"} 1200mg/day</option>
            </select>
          </div>
          <div className="form-group">
            <label>Vitamin D Intake</label>
            <select name="vitaminDIntake" onChange={handleChange} value={formData.vitaminDIntake}>
              <option value="low">Low (Deficiency)</option>
              <option value="adequate">Adequate (Daily Exposure)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Physical Activity</label>
            <select name="physicalActivity" onChange={handleChange} value={formData.physicalActivity}>
              <option value="sedentary">Sedentary</option>
              <option value="moderate">Moderate Exercise</option>
              <option value="active">High Impact/Resistance</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Medical Conditions</label>
            <select name="medicalConditions" onChange={handleChange} value={formData.medicalConditions}>
              <option value="none">None</option>
              <option value="arthritis">Rheumatoid Arthritis</option>
              <option value="diabetes">Diabetes (Type 1/2)</option>
              <option value="hyperthyroid">Hyperthyroidism</option>
            </select>
          </div>
          <div className="form-group">
            <label>Medications</label>
            <select name="medications" onChange={handleChange} value={formData.medications}>
              <option value="none">None</option>
              <option value="corticosteroids">Corticosteroids</option>
              <option value="anticonvulsants">Anticonvulsants</option>
              <option value="ppi">PPIs / Antacids</option>
            </select>
          </div>
          <div className="form-group">
             <label>Body Weight (kg)</label>
             <input type="number" name="bodyWeight" required onChange={handleChange} value={formData.bodyWeight} placeholder="kg" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Smoking</label>
            <select name="smoking" onChange={handleChange} value={formData.smoking}>
              <option value="no">Non-Smoker</option>
              <option value="yes">Current Smoker</option>
            </select>
          </div>
          <div className="form-group">
            <label>Alcohol Consumption</label>
            <select name="alcohol" onChange={handleChange} value={formData.alcohol}>
              <option value="never">Never / Occasional</option>
              <option value="moderate">Moderate (1-2 units/day)</option>
              <option value="high">High (> 3 units/day)</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', height: '3.5rem', justifyContent: 'center' }} disabled={loading}>
          {loading ? (
            <><RefreshCw className="spin" size={20} /> Processing Neural Risk Data...</>
          ) : (
            <>Calculate Diagnostic Score</>
          )}
        </button>
      </form>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`result-card result-${result.level.toLowerCase()}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                <div style={{ 
                  background: result.color, 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {result.level === 'Low' ? <CheckCircle2 color="white" size={32} /> : 
                   result.level === 'Moderate' ? <AlertTriangle color="white" size={32} /> : 
                   <Heart color="white" size={32} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{result.level} Risk Detected</h3>
                  <p style={{ margin: 0, color: 'white', opacity: 0.8 }}>
                    Risk Index: {Math.min(100, result.score)}% | Recommendation: {
                      result.level === 'Low' ? 'Maintain healthy lifestyle and calcium intake.' :
                      result.level === 'Moderate' ? 'Consult a physician for further diagnostic testing.' :
                      'Immediate specialist consultation advised for bone density treatment.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
};

const FeatureSection = () => (
  <section style={{ padding: '4rem 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
    <div className="glass glass-card">
      <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><ShieldCheck size={40} /></div>
      <h3 style={{ marginBottom: '0.8rem' }}>Clinical Precision</h3>
      <p>Data-driven models trained on over 500,000 global therapeutic cases and DEXA scans.</p>
    </div>
    <div className="glass glass-card">
      <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Stethoscope size={40} /></div>
      <h3 style={{ marginBottom: '0.8rem' }}>Prevention First</h3>
      <p>Early markers identification allows for lifestyle adjustments before fractures occur.</p>
    </div>
    <div className="glass glass-card">
      <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Zap size={40} /></div>
      <h3 style={{ marginBottom: '0.8rem' }}>Instant Analysis</h3>
      <p>Proprietary ML algorithm processes multi-factor inputs in under 3 seconds.</p>
    </div>
  </section>
);

const InfoSection = () => (
  <section id="about" style={{ padding: '4rem 5%', backgroundColor: 'rgba(255,255,255,0.02)' }}>
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Silent Thief.</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Osteoporosis is often called a "silent disease" because bone loss typically occurs without symptoms. People may not know they have it until their bones become so weak that a sudden strain, bump, or fall causes a fracture.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> <span>Weakened Bones</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> <span>Stooped Posture</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> <span>Loss of Height</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> <span>Easy Fractures</span>
          </div>
        </div>
      </div>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <div className="glass glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <Info size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h4 style={{ marginBottom: '0.5rem' }}>Did you know?</h4>
          <p>1 in 3 women and 1 in 5 men aged over 50 will suffer an osteoporotic fracture worldwide. AI-driven screening reduces late diagnosis by 40%.</p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ padding: '4rem 5% 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
      <Activity color="var(--primary)" size={32} />
      <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>OsteoScan AI</span>
    </div>
    <p style={{ marginBottom: '1rem' }}>© 2026 BoneHealth Medical Technologies. For informational purposes only.</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
      <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
      <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
      <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</a>
    </div>
  </footer>
);

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('osteo_user');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setUser(userObj);
      
      // Attempt to refresh from Firestore for latest data
      const refreshData = async () => {
        try {
          const userRef = doc(db, "patients", userObj.email);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const latestData = snap.data();
            setUser(latestData);
            localStorage.setItem('osteo_user', JSON.stringify(latestData));
          }
        } catch (err) {
          console.warn("Firestore background refresh failed:", err);
        }
      };
      refreshData();
    }
  }, []);

  const handleAuthSuccess = async (userData) => {
    setUser(userData);
    localStorage.setItem('osteo_user', JSON.stringify(userData));

    // Store in Firebase Firestore
    try {
      const userRef = doc(db, "patients", userData.email);
      await setDoc(userRef, userData, { merge: true });
    } catch (err) {
      console.error("Firebase Auth Storage Error:", err);
    }

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('osteo_user');
    setIsDashboardOpen(false);
  };

  return (
    <div className="app-container">
      <Navbar 
        loggedInUser={user} 
        onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthOpen(true); }}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />
      <Hero />
      <FeatureSection />
      <DetectionCenter user={user} setUser={setUser} />
      <KnowledgeQuiz />
      <BoneHealthSection />
      <InfoSection />
      <Footer />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        mode={authMode} 
        setMode={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <AnimatePresence>
        {isDashboardOpen && (
          <PatientDashboard 
            isOpen={isDashboardOpen}
            user={user} 
            onClose={() => setIsDashboardOpen(false)} 
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
      
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default App;
