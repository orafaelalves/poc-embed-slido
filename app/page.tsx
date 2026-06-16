"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      newErrors.privacyConsent = "Você deve aceitar a Política de Privacidade para continuar";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <main className="min-h-screen flex" style={{ backgroundColor: "#e2d6d8" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex w-[45%] flex-col items-center justify-center"
        style={{
          backgroundImage: "url(/bg-lateral.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image
          src="/logo.png"
          alt="Fórum DII 2026 · Takeda"
          width={220}
          height={120}
          className="object-contain"
          priority
        />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* Mobile logo */}
        <div className="lg:hidden mb-6">
          <Image
            src="/logo.png"
            alt="Fórum DII 2026 · Takeda"
            width={160}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-7 shadow-lg">
            {!submitted ? (
              <>
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-gray-800">Fórum DII 2026</h2>
                  <p className="text-gray-500 text-xs mt-1">
                    Preencha seus dados para participar da sessão interativa
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  {/* Nome */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nome Completo <span className="text-purple-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex.: Dr. João Silva"
                      autoComplete="name"
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all
                        ${errors.name ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      E-mail <span className="text-purple-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="seu.email@exemplo.com"
                      autoComplete="email"
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all
                        ${errors.email ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* CRM */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      CRM <span className="text-purple-600">*</span>
                    </label>
                    <div className="flex gap-3">
                      <select
                        name="crmUf"
                        value={form.crmUf}
                        onChange={handleChange}
                        className={`bg-gray-50 border rounded-xl px-3 py-2.5 text-sm text-gray-900 w-24
                          focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all
                          ${errors.crm && !form.crmUf ? "border-red-400" : "border-gray-200"}`}
                      >
                        <option value="">UF</option>
                        {UFS.map((uf) => (
                          <option key={uf} value={uf}>{uf}</option>
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
                        className={`flex-1 bg-gray-50 border rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all
                          ${errors.crm && !form.crmNumber ? "border-red-400" : "border-gray-200"}`}
                      />
                    </div>
                    {errors.crm && <p className="text-red-500 text-xs mt-1">{errors.crm}</p>}
                  </div>

                  {/* Privacy consent */}
                  <label
                    className={`flex items-start gap-3 bg-gray-50 border rounded-xl px-3 py-2.5 cursor-pointer transition
                      ${errors.privacyConsent ? "border-red-400" : "border-gray-200"}`}
                  >
                    <input
                      type="checkbox"
                      name="privacyConsent"
                      checked={form.privacyConsent}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 accent-purple-600 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      Declaro que li e concordo com a{" "}
                      <a
                        href="https://www.takeda.com/pt-br/aviso-de-privacidade/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-600 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Política de Privacidade da Takeda
                      </a>{" "}
                      e os termos de uso deste evento.{" "}
                      <span className="text-purple-600">*</span>
                    </span>
                  </label>
                  {errors.privacyConsent && (
                    <p className="text-red-500 text-xs mt-1">{errors.privacyConsent}</p>
                  )}

                  {/* Comms consent */}
                  <label className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer transition">
                    <input
                      type="checkbox"
                      name="commsConsent"
                      checked={form.commsConsent}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 accent-purple-600 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      Autorizo a coleta e o processamento dos meus dados para
                      personalização de comunicações futuras nos meios de comunicação Takeda.{" "}
                      <a
                        href="https://www.takeda.com/pt-br/aviso-de-privacidade/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-600 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Saiba mais
                      </a>
                    </span>
                  </label>

                  <p className="text-xs text-gray-400">* Campos obrigatórios</p>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold
                        py-3 px-6 rounded-xl transition-all duration-200
                        hover:from-purple-500 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/30
                        active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Confirmando sua vaga...
                        </>
                      ) : (
                        <>
                          Acessar Evento
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Vaga confirmada!</h3>
                <p className="text-gray-500 text-sm">Redirecionando para o evento...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
