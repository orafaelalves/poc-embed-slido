"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveUser, getUser } from "@/lib/storage";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const SPEAKERS = [
  { initials: "AS", name: "Ana Silva", title: "CTO · Nubank", color: "from-pink-500 to-rose-600" },
  { initials: "RM", name: "Rafael Moura", title: "VP Engineering · iFood", color: "from-blue-500 to-cyan-600" },
  { initials: "JC", name: "Julia Costa", title: "AI Lead · Totvs", color: "from-amber-500 to-orange-600" },
  { initials: "PL", name: "Pedro Lima", title: "Founder · Creditas", color: "from-emerald-500 to-teal-600" },
];

const FEATURES = [
  {
    icon: "🤖",
    title: "IA na prática",
    desc: "Casos reais de implementação de LLMs em produtos brasileiros",
  },
  {
    icon: "🚀",
    title: "Startups & Scale-ups",
    desc: "Como times de engenharia crescem de 10 para 1000 devs",
  },
  {
    icon: "🔒",
    title: "Segurança e compliance",
    desc: "LGPD, privacidade e segurança no desenvolvimento moderno",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) router.replace("/evento");
  }, [router]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!form.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "E-mail inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    saveUser(form);
    setSubmitted(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/evento");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <main className="min-h-screen bg-hero-gradient text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-sm font-bold">
              TS
            </div>
            <span className="font-semibold text-sm">TechSummit Brasil</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span className="hidden sm:block">26 Jun 2025 · São Paulo, SP</span>
            <span className="tag-badge bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Gratuito
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Info */}
            <div className="animate-slide-up">
              <div className="flex items-center gap-2 mb-6">
                <span className="tag-badge bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ● AO VIVO · 26 Jun 2025
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                TechSummit
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Brasil 2025
                </span>
              </h1>

              <p className="text-xl text-white/70 leading-relaxed mb-8">
                O maior evento de tecnologia e inteligência artificial do Brasil.
                2 dias, +40 palestras, 3.000 participantes.
              </p>

              <div className="flex flex-wrap gap-4 mb-10 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Centro de Convenções Frei Caneca, SP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>26–27 de Junho de 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎟️</span>
                  <span>Entrada gratuita</span>
                </div>
              </div>

              {/* Speakers */}
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">
                  Palestrantes confirmados
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {SPEAKERS.map((s) => (
                    <div key={s.name} className="flex items-center gap-3 glass-card px-3 py-2.5">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}
                      >
                        {s.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{s.name}</p>
                        <p className="text-xs text-white/50 truncate">{s.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="animate-fade-in">
              <div className="glass-card p-8 shadow-2xl shadow-purple-900/30">
                {!submitted ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-1">
                        Garanta sua vaga
                      </h2>
                      <p className="text-white/50 text-sm">
                        Cadastro rápido e gratuito
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div>
                        <label className="label-text">
                          Nome completo <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="João da Silva"
                          className={`input-field ${errors.name ? "border-red-500/60 focus:ring-red-500/40" : ""}`}
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p className="error-text">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="label-text">
                          E-mail <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="joao@empresa.com.br"
                          className={`input-field ${errors.email ? "border-red-500/60 focus:ring-red-500/40" : ""}`}
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="error-text">{errors.email}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label-text">Telefone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="(11) 99999-0000"
                            className="input-field"
                            autoComplete="tel"
                          />
                        </div>
                        <div>
                          <label className="label-text">Empresa</label>
                          <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Sua empresa"
                            className="input-field"
                            autoComplete="organization"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label-text">Cargo</label>
                        <select
                          name="role"
                          value={form.role}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="" className="bg-slate-800">
                            Selecione seu cargo
                          </option>
                          <option value="Desenvolvedor(a)" className="bg-slate-800">
                            Desenvolvedor(a)
                          </option>
                          <option value="Tech Lead" className="bg-slate-800">
                            Tech Lead / Engenheiro(a) Sênior
                          </option>
                          <option value="CTO / VP Engineering" className="bg-slate-800">
                            CTO / VP Engineering
                          </option>
                          <option value="Product Manager" className="bg-slate-800">
                            Product Manager
                          </option>
                          <option value="Designer" className="bg-slate-800">
                            Designer
                          </option>
                          <option value="Estudante" className="bg-slate-800">
                            Estudante
                          </option>
                          <option value="Outro" className="bg-slate-800">
                            Outro
                          </option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              Confirmando sua vaga...
                            </>
                          ) : (
                            <>
                              Quero participar
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-center text-xs text-white/30 pt-1">
                        Seus dados ficam salvos apenas no seu navegador.
                        Sem spam, sem compartilhamento.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8 animate-slide-up">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Vaga confirmada!</h3>
                    <p className="text-white/50 text-sm">
                      Redirecionando para o evento...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why attend */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-white/30 mb-10 font-medium">
            Por que participar?
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5 text-center text-white/30 text-sm">
        TechSummit Brasil 2025 · Todos os direitos reservados ·{" "}
        <span className="text-white/20">POC Demo</span>
      </footer>
    </main>
  );
}
