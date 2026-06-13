"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveUser, saveUserToSupabase, getUser } from "@/lib/storage";

interface FormData {
  name: string;
  email: string;
  crmUf: string;
  crmNumber: string;
  privacyConsent: boolean;
  commsConsent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  crm?: string;
  privacyConsent?: string;
}

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];


export default function LandingPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    crmUf: "",
    crmNumber: "",
    privacyConsent: false,
    commsConsent: false,
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
    if (!form.name.trim()) newErrors.name = "Por favor, insira seu nome completo";
    if (!form.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Insira um e-mail válido";
    }
    if (!form.crmUf || !form.crmNumber.trim()) {
      newErrors.crm = "Selecione a UF e insira o número do CRM";
    } else if (!/^\d{4,7}$/.test(form.crmNumber.trim())) {
      newErrors.crm = "Número de CRM inválido";
    }
    if (!form.privacyConsent) {
      newErrors.privacyConsent =
        "Você deve aceitar a Política de Privacidade para continuar";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const userData = {
      name: form.name.trim(),
      email: form.email.trim(),
      crmUf: form.crmUf,
      crmNumber: form.crmNumber.trim(),
      privacyConsent: form.privacyConsent,
      commsConsent: form.commsConsent,
    };
    saveUser(userData);
    await saveUserToSupabase({
      ...userData,
      registeredAt: new Date().toISOString(),
    });
    setSubmitted(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/evento");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "crmUf" || name === "crmNumber") {
      setErrors((prev) => ({ ...prev, crm: undefined }));
    } else if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <main className="min-h-screen bg-hero-gradient text-white flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-sm font-bold">
              FD
            </div>
            <span className="font-semibold text-sm">Fórum DII 2026</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span className="tag-badge bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Takeda
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center px-4 sm:px-6 pt-16 pb-4">
        <div className="max-w-6xl mx-auto w-full py-4">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left: Info */}
            <div className="animate-slide-up hidden lg:block">
              <div className="flex items-center gap-2 mb-4">
                <span className="tag-badge bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ● Sessão Interativa
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-3">
                Fórum DII
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  2026
                </span>
              </h1>

              <p className="text-base text-white/70 leading-relaxed">
                Preencha seus dados para participar da sessão interativa.
              </p>
            </div>

            {/* Right: Form */}
            <div className="animate-fade-in">
              <div className="glass-card p-5 sm:p-6 shadow-2xl shadow-purple-900/30">
                {!submitted ? (
                  <>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold mb-0.5">
                        Fórum DII 2026
                      </h2>
                      <p className="text-white/50 text-xs">
                        Preencha seus dados para participar da sessão interativa
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                      <div>
                        <label className="label-text">
                          Nome Completo <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Ex.: Dr. João Silva"
                          autoComplete="name"
                          className={`input-field ${errors.name ? "border-red-500/60 focus:ring-red-500/40" : ""}`}
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
                          placeholder="seu.email@exemplo.com"
                          autoComplete="email"
                          className={`input-field ${errors.email ? "border-red-500/60 focus:ring-red-500/40" : ""}`}
                        />
                        {errors.email && (
                          <p className="error-text">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="label-text">
                          CRM <span className="text-purple-400">*</span>
                        </label>
                        <div className="flex gap-3">
                          <select
                            name="crmUf"
                            value={form.crmUf}
                            onChange={handleChange}
                            className={`input-field w-24 ${errors.crm && !form.crmUf ? "border-red-500/60 focus:ring-red-500/40" : ""}`}
                          >
                            <option value="" className="bg-slate-800">
                              UF
                            </option>
                            {UFS.map((uf) => (
                              <option key={uf} value={uf} className="bg-slate-800">
                                {uf}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            name="crmNumber"
                            value={form.crmNumber}
                            onChange={handleChange}
                            placeholder="1234567"
                            inputMode="numeric"
                            maxLength={7}
                            className={`input-field flex-1 ${errors.crm && !form.crmNumber ? "border-red-500/60 focus:ring-red-500/40" : ""}`}
                          />
                        </div>
                        {errors.crm && (
                          <p className="error-text">{errors.crm}</p>
                        )}
                      </div>

                      <div>
                        <label
                          className={`flex items-start gap-3 bg-white/5 border rounded-xl px-3 py-2.5 cursor-pointer transition
                            ${errors.privacyConsent ? "border-red-500/60" : "border-white/20"}`}
                        >
                          <input
                            type="checkbox"
                            name="privacyConsent"
                            checked={form.privacyConsent}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 accent-purple-600 flex-shrink-0"
                          />
                          <span className="text-xs text-white/70 leading-relaxed">
                            Declaro que li e concordo com a{" "}
                            <a
                              href="https://www.takeda.com/pt-br/aviso-de-privacidade/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-purple-300 underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Política de Privacidade da Takeda
                            </a>{" "}
                            e os termos de uso deste evento.{" "}
                            <span className="text-purple-400">*</span>
                          </span>
                        </label>
                        {errors.privacyConsent && (
                          <p className="error-text">{errors.privacyConsent}</p>
                        )}
                      </div>

                      <label className="flex items-start gap-3 bg-white/5 border border-white/20 rounded-xl px-3 py-2.5 cursor-pointer transition">
                        <input
                          type="checkbox"
                          name="commsConsent"
                          checked={form.commsConsent}
                          onChange={handleChange}
                          className="mt-0.5 w-4 h-4 accent-purple-600 flex-shrink-0"
                        />
                        <span className="text-xs text-white/70 leading-relaxed">
                          Autorizo a coleta e o processamento dos meus dados para
                          personalização de comunicações futuras nos meios de
                          comunicação Takeda.{" "}
                          <a
                            href="https://www.takeda.com/pt-br/aviso-de-privacidade/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-purple-300 underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Saiba mais
                          </a>
                        </span>
                      </label>

                      <p className="text-xs text-white/30">* Campos obrigatórios</p>

                      <div className="pt-0.5">
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
                              Acessar Evento
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

      <footer className="py-8 px-6 border-t border-white/5 text-center text-white/30 text-sm">
        Fórum DII 2026 · Takeda ·{" "}
        
      </footer>
    </main>
  );
}
