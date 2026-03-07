'use client';

import { useState, useEffect } from "react";
import { Facebook, Linkedin, Twitter, Github, Instagram } from "lucide-react";
import { ProfileData } from "@/lib/markdown";

interface SidebarProps {
  data: ProfileData;
}

const brandIcons: Record<string, any> = {
  Facebook, Linkedin, Twitter, Github, Instagram
};

const materialIcons: Record<string, string> = {
  Smartphone: "smartphone",
  Mail: "mail",
  Shield: "verified_user",
  Cloud: "cloud",
  Server: "dns",
  Settings: "settings",
  Briefcase: "work",
  Users: "group",
  Cpu: "memory",
  Code: "code",
  Globe: "public",
  Phone: "smartphone",
  Award: "workspace_premium"
};

export default function Sidebar({ data }: SidebarProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-full lg:w-80 space-y-6 shrink-0">


      {/* in below this, too ai btw */}
      {/* Time & Location Widget */}
      {/* <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"> */}
      {/*     <div className="relative z-10"> */}
      {/*         <p className="text-sm font-medium text-white/80 uppercase tracking-wider mb-1">Local Time</p> */}
      {/*         <h2 className="text-4xl font-extrabold mb-4 tabular-nums">{time}</h2> */}
      {/*         <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm"> */}
      {/*             <MapPin className="w-3 h-3" /> */}
      {/*             <span className="text-xs font-semibold">{data.location}</span> */}
      {/*         </div> */}
      {/*     </div> */}
      {/* </div> */}
      {/**/}

      <div
        className="rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #FF6B35 0%, #F7931E 25%, #FFB347 45%, #FF8C69 65%, #C1440E 85%, #8B2500 100%)',
          boxShadow: '0 8px 32px rgba(199, 89, 0, 0.45), inset 0 1px 0 rgba(255,220,150,0.3)'
        }}
      >
        {/* Sun glow blur blob */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-10px',
          width: '120px', height: '120px',
          background: 'radial-gradient(circle, rgba(255,220,80,0.7) 0%, rgba(255,140,0,0.3) 50%, transparent 75%)',
          borderRadius: '50%',
          filter: 'blur(8px)'
        }} />

        {/* Ocean shimmer at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '35%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(30,80,120,0.35) 60%, rgba(10,50,90,0.55) 100%)',
        }} />

        {/* Horizon haze line */}
        <div style={{
          position: 'absolute', bottom: '35%', left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,200,100,0.4), transparent)'
        }} />

        {/* Grain texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
        }} />

        <div className="relative z-10">
          <p style={{
            fontSize: '0.75rem', fontWeight: 600,
            color: 'rgba(255,240,200,0.75)',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px'
          }}>Local Time</p>
          <h2 style={{
            fontSize: '2.5rem', fontWeight: 800,
            color: '#FFF5E0',
            textShadow: '0 2px 12px rgba(180,80,0,0.5)',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '16px'
          }}>{time}</h2>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            width: 'fit-content', padding: '4px 12px',
            borderRadius: '9999px',
            border: '1px solid rgba(255,220,150,0.25)'
          }}>
            <span className="material-symbols-outlined text-[12px] text-[#FFD580]">location_on</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FFE8B0' }}>{data.location}</span>
          </div>
        </div>
      </div>
      <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--card-border)]">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Connect</h3>
        <div className="space-y-3">
          {data.socials.map((social) => {
            return (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--card-hover)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  {brandIcons[social.icon] ? (
                    (() => { const BIcon = brandIcons[social.icon]; return <BIcon className="w-5 h-5" />; })()
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">{materialIcons[social.icon] || "public"}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[var(--text-primary)] text-sm">{social.platform}</p>
                  <p className="text-[var(--text-secondary)] text-xs">Connect</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>



      {/* Existing Skills Widget */}
      <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--card-border)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-[64px]">laptop_mac</span>
        </div>
        <h3 className="font-bold text-[var(--text-primary)] mb-4 relative z-10">Skills</h3>
        <div className="flex flex-wrap gap-2 relative z-10">
          {data.skills.map((skill) => (
            <span key={skill} className="px-3 py-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 text-xs font-semibold rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Existing Verifications Widget */}
      <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--card-border)]">
        <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          Verifications
          <span className="material-symbols-outlined text-blue-500 text-[18px]">verified</span>
        </h3>
        <ul className="space-y-4">
          {data.verifications.map((item) => {
            return (
              <li key={item.label} className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-[var(--card-hover)] transition-colors">
                <div className="flex items-center gap-3 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${item.verified ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                    <span className="material-symbols-outlined text-[16px]">{materialIcons[item.icon] || "verified_user"}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{item.label}</span>
                </div>
                {item.verified ? (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-green-200 dark:border-green-800/50">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                  </div>
                ) : (
                  item.action && (
                    <button className="px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all">
                      {item.action}
                    </button>
                  )
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Existing Proficiency Widget */}
      <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--card-border)]">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Proficiency</h3>
        <div className="flex flex-wrap gap-2">
          {data.proficiency.map((item, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-[var(--card-hover)] border border-[var(--card-border)] text-[var(--text-secondary)] text-xs font-semibold rounded-lg flex items-center gap-1">
              {item.label} <span className="text-blue-500">{item.value}</span>
            </span>
          ))}
        </div>
      </div>

    </aside >
  );
}
