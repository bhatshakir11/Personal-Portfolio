import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code, Cpu, Shield, LineChart, Play, Terminal as TerminalIcon, Server } from 'lucide-react';
import { Tilt } from './Tilt';

export const Hero: React.FC = () => {
  // --- Typewriter Loop Hooks ---
  const roles = [
    "intelligent solutions for the web.",
    "multi-agent AI systems.",
    "efficient backend architectures.",
    "secure web applications."
  ];
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let active = true;
    let currentRoleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!active) return;
      
      const currentRole = roles[currentRoleIndex];
      
      if (!deleting) {
        setDisplayText(currentRole.substring(0, charIndex + 1));
        charIndex++;
        
        if (charIndex === currentRole.length) {
          deleting = true;
          timerId = setTimeout(tick, 2200); // pause at full text
        } else {
          timerId = setTimeout(tick, 70);
        }
      } else {
        setDisplayText(currentRole.substring(0, charIndex - 1));
        charIndex--;
        
        if (charIndex === 0) {
          deleting = false;
          currentRoleIndex = (currentRoleIndex + 1) % roles.length;
          timerId = setTimeout(tick, 300); // pause before typing next
        } else {
          timerId = setTimeout(tick, 35);
        }
      }
    };

    timerId = setTimeout(tick, 100);

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, []);


  // --- Interactive Terminal Console Tabs Hook ---
  const [activeTab, setActiveTab] = useState<'code' | 'monitor' | 'terminal'>('code');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "visitor@shakir-bhat:~$ ./run-agent.sh",
    "[INFO] Initializing ShakirBhatAgent v1.0.0...",
    "[SUCCESS] Connected to Gemini and NVIDIA NIM API gateways",
    "[INFO] Status: Ready. Click 'Run Agent' below."
  ]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const runAgentSimulation = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);

    const simulationSteps = [
      "[INFO] Spawning EmailAgent to filter inbox...",
      "[SUCCESS] EmailAgent: Found 2 high-priority messages. Summary created.",
      "[INFO] Spawning CalendarAgent for schedule alignment...",
      "[SUCCESS] CalendarAgent: Booked 'Client Demo' for tomorrow 10:00 AM.",
      "[INFO] Spawning NewsAgent to compile engineering updates...",
      "[INFO] NewsAgent: Summarizing articles on LLMs & Multi-Agent systems.",
      "[SUCCESS] Compilation complete. Dispatching summary to Telegram...",
      "[SUCCESS] Telegram message sent successfully! [Latency: 480ms]",
      "visitor@shakir-bhat:~$"
    ];

    let stepIndex = 0;
    const printNextLog = () => {
      if (stepIndex < simulationSteps.length) {
        const logLine = simulationSteps[stepIndex];
        setTerminalLogs((prev) => [...prev, logLine]);
        stepIndex++;
        setTimeout(printNextLog, 800);
      } else {
        setIsAgentRunning(false);
      }
    };

    setTerminalLogs((prev) => [...prev, "[ACTION] Initiating productivity workflow run..."]);
    setTimeout(printNextLog, 500);
  };


  // Scroll terminal logs to bottom
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [terminalLogs, activeTab]);

  // --- Simulated System Status Metrics ---
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 1.4, latency: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 8) + 8, // 8-15%
        ram: Number((Math.random() * 0.08 + 1.38).toFixed(2)), // 1.38-1.46 GB
        latency: Math.floor(Math.random() * 12) + 38 // 38-50ms
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge reveal-left active">
            <Code size={14} className="badge-icon" />
            <span>Computer Science & Engineering</span>
          </div>

          <h4 className="hero-intro reveal-left active" style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
            Hi, my name is
          </h4>
          <h1 className="hero-title reveal-left active shimmer-text" style={{ '--reveal-delay': '200ms' } as React.CSSProperties}>
            SHAKIR AHMAD BHAT
          </h1>
          <h2 className="hero-subtitle reveal-left active" style={{ '--reveal-delay': '300ms' } as React.CSSProperties}>
            I build <span className="shimmer-text">{displayText}</span>
            <span className="console-cursor"></span>
          </h2>
          <p className="hero-description reveal-left active" style={{ '--reveal-delay': '400ms' } as React.CSSProperties}>
            A software development and data analytics enthusiast specializing in creating efficient backend architectures, AI agent workflows, and secure, high-performance web applications.
          </p>

          <div className="hero-ctas reveal-left active" style={{ '--reveal-delay': '500ms' } as React.CSSProperties}>
            <button
              onClick={() => handleScrollTo('projects')}
              className="btn btn-primary btn-hero clickable"
            >
              Explore Projects <ArrowRight size={16} />
            </button>
            <button
              onClick={() => handleScrollTo('contact')}
              className="btn btn-secondary btn-hero clickable"
            >
              Get in Touch
            </button>
          </div>
        </div>

        <div className="hero-visual reveal-zoom active" style={{ '--reveal-delay': '300ms' } as React.CSSProperties}>
          {/* Orbital tracks */}
          <div className="visual-orbit orbit-1"></div>
          <div className="visual-orbit orbit-2"></div>

          {/* Interactive Developer Panel mockup */}
          <Tilt className="hero-glass-panel glass-card">
            <div className="panel-header">
              <div className="dot-red"></div>
              <div className="dot-yellow"></div>
              <div className="dot-green"></div>
              
              {/* Tab Header Controls */}
              <div className="console-tabs">
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`console-tab clickable ${activeTab === 'code' ? 'active' : ''}`}
                >
                  <Code size={12} style={{ marginRight: '4px' }} /> ai-agent.ts
                </button>
                <button 
                  onClick={() => setActiveTab('monitor')}
                  className={`console-tab clickable ${activeTab === 'monitor' ? 'active' : ''}`}
                >
                  <Server size={12} style={{ marginRight: '4px' }} /> status
                </button>
                <button 
                  onClick={() => setActiveTab('terminal')}
                  className={`console-tab clickable ${activeTab === 'terminal' ? 'active' : ''}`}
                >
                  <TerminalIcon size={12} style={{ marginRight: '4px' }} /> console.sh
                </button>
              </div>
            </div>

            <div className="panel-body">
              {/* Tab 1: Static / Styled Code Script */}
              {activeTab === 'code' && (
                <div style={{ textAlign: 'left' }}>
                  <div>
                    <span className="code-keyword">const</span> <span className="code-variable">engineer</span> = <span className="code-keyword">new</span> <span className="code-variable">AIAgent</span>(&#123;
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span className="code-property">name</span>: <span className="code-string">"Shakir Ahmad Bhat"</span>,
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span className="code-property">role</span>: <span className="code-string">"Intelligent Systems Engineer"</span>,
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span className="code-property">skills</span>: [
                  </div>
                  <div style={{ paddingLeft: '32px' }}>
                    <span className="code-string">"Multi-Agent AI"</span>,
                  </div>
                  <div style={{ paddingLeft: '32px' }}>
                    <span className="code-string">"Backend Systems"</span>,
                  </div>
                  <div style={{ paddingLeft: '32px' }}>
                    <span className="code-string">"Fullstack Dev"</span>
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    ],
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span className="code-property">status</span>: <span className="code-string">"Active & Innovating"</span>
                  </div>
                  <div>&#125;);</div>
                  <br />
                  <div>
                    <span className="code-keyword">await</span> <span className="code-variable">engineer</span>.<span className="code-property">solveRealWorldProblems</span>();
                  </div>
                </div>
              )}

              {/* Tab 2: System Monitor Status Metrics */}
              {activeTab === 'monitor' && (
                <div className="system-status-grid">
                  <div className="status-metric">
                    <div className="status-metric-circle">{metrics.cpu}%</div>
                    <span className="status-metric-title">Agent CPU Usage</span>
                  </div>
                  <div className="status-metric">
                    <div className="status-metric-circle pulse">{metrics.ram}GB</div>
                    <span className="status-metric-title">Memory Allocation</span>
                  </div>
                  <div className="status-metric">
                    <div className="status-metric-circle">4 / 4</div>
                    <span className="status-metric-title">Active Agents</span>
                  </div>
                  <div className="status-metric">
                    <div className="status-metric-circle">{metrics.latency}ms</div>
                    <span className="status-metric-title">API Response</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Interactive Terminal.sh Execution Logs */}
              {activeTab === 'terminal' && (
                <div>
                  <div className="console-terminal-body" ref={logsContainerRef}>
                    {terminalLogs.map((log, index) => (
                      <div 
                        key={index}
                        style={{
                          color: log.startsWith('[SUCCESS]') 
                            ? '#10b981' 
                            : log.startsWith('[INFO]') 
                            ? '#3b82f6' 
                            : log.startsWith('[ACTION]')
                            ? '#c084fc'
                            : '#e2e8f0'
                        }}
                      >
                        {log}
                      </div>
                    ))}
                    {isAgentRunning && (
                      <div className="console-input-line">
                        <span>[PROCESSING]</span> <span className="console-cursor"></span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={runAgentSimulation} 
                    className="console-action-btn clickable"
                    disabled={isAgentRunning}
                  >
                    <Play size={12} /> {isAgentRunning ? 'Running...' : 'Run Agent Script'}
                  </button>
                </div>
              )}
            </div>
          </Tilt>

          {/* Floating micro glass-cards */}
          <div className="floating-glass-card floating-card-1 clickable" onClick={() => handleScrollTo('skills')}>
            <Cpu size={18} className="micro-card-icon" />
            <span className="micro-card-text">Multi-Agent AI</span>
          </div>

          <div className="floating-glass-card floating-card-2 clickable" onClick={() => handleScrollTo('skills')}>
            <Shield size={18} className="micro-card-icon" />
            <span className="micro-card-text">Cyber Security</span>
          </div>

          <div className="floating-glass-card floating-card-3 clickable" onClick={() => handleScrollTo('skills')}>
            <LineChart size={18} className="micro-card-icon" />
            <span className="micro-card-text">Data Analytics</span>
          </div>
        </div>
      </div>

      <div className="scroll-indicator" onClick={() => handleScrollTo('about')}>
        <div className="mouse-wheel-wrap">
          <span className="mouse-wheel"></span>
        </div>
        <span className="scroll-text">Scroll Down</span>
      </div>
    </section>
  );
};
