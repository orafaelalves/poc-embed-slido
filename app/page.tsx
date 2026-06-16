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
  const [showInfoModal, setShowInfoModal] = useState(false);

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

  const inputClass = (hasError?: boolean) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
     focus:outline-none transition-all ${hasError ? "border-red-400" : "border-gray-200"}`;

  return (
    <main className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: "#e2d6d8" }}>

      {/* Mobile / tablet portrait — header */}
      <header
        className="lg:hidden flex items-center justify-center py-6"
        style={{
          backgroundImage: "url(/bg-lateral.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image
          src="/logo.png"
          alt="Fórum DII 2026 · Takeda"
          width={130}
          height={65}
          className="object-contain"
          priority
        />
      </header>

      {/* Desktop — left panel */}
      <div
        className="hidden lg:flex w-[38%] flex-col items-center justify-center"
        style={{
          backgroundImage: "url(/bg-lateral.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image
          src="/logo.png"
          alt="Fórum DII 2026 · Takeda"
          width={280}
          height={150}
          className="object-contain"
          priority
        />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 lg:py-10">
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
                      Nome Completo <span style={{ color: "#732762" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex.: Dr. João Silva"
                      autoComplete="name"
                      className={inputClass(!!errors.name)}
                      style={errors.name ? {} : undefined}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      E-mail <span style={{ color: "#732762" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="seu.email@exemplo.com"
                      autoComplete="email"
                      className={inputClass(!!errors.email)}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* CRM */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      CRM <span style={{ color: "#732762" }}>*</span>
                    </label>
                    <div className="flex gap-3">
                      <select
                        name="crmUf"
                        value={form.crmUf}
                        onChange={handleChange}
                        className={`bg-gray-50 border rounded-xl px-3 py-2.5 text-sm text-gray-900 w-24
                          focus:outline-none transition-all
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
                          focus:outline-none transition-all
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
                      className="mt-0.5 w-4 h-4 flex-shrink-0"
                      style={{ accentColor: "#732762" }}
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      Declaro que li e concordo com a{" "}
                      <a
                        href="https://www.takeda.com/pt-br/aviso-de-privacidade/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline"
                        style={{ color: "#732762" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Política de Privacidade da Takeda
                      </a>{" "}
                      e os termos de uso deste evento.{" "}
                      <span style={{ color: "#732762" }}>*</span>
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
                      className="mt-0.5 w-4 h-4 flex-shrink-0"
                      style={{ accentColor: "#732762" }}
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      Autorizo a coleta e o processamento dos meus dados para
                      personalização de comunicações futuras nos meios de comunicação Takeda.{" "}
                      <button
                        type="button"
                        className="font-semibold underline"
                        style={{ color: "#732762" }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowInfoModal(true); }}
                      >
                        Saiba mais
                      </button>
                    </span>
                  </label>

                  <p className="text-xs text-gray-400">* Campos obrigatórios</p>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                        active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(to right, #732762, #5a1d4d)" }}
                      onMouseEnter={(e) => {
                        if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(to right, #8f3578, #732762)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(to right, #732762, #5a1d4d)";
                      }}
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

      {/* Modal — Saiba mais sobre uso de dados */}
      {showInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-5"
          style={{ backgroundColor: "rgba(30,18,51,0.80)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-white w-full lg:max-w-xl rounded-t-2xl lg:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            style={{ maxHeight: "85dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #732762, #5a1d4d)" }}
            >
              <h2 className="text-white font-bold text-base">Uso dos Dados para Comunicação</h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-white w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-5 py-5 text-sm leading-relaxed text-gray-700 space-y-4">
              <div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#5a1d4d" }}>Quais dados serão utilizados?</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li><strong>Nome completo</strong></li>
                  <li><strong>Endereço de e-mail</strong></li>
                  <li><strong>CRM e UF de registro</strong></li>
                  <li><strong>Dados de interação</strong> (participação em sessões e respostas)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#5a1d4d" }}>Como seus dados serão utilizados?</h3>
                <p className="text-gray-600 mb-2">Ao consentir, seus dados poderão ser utilizados para:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li><strong>Personalização de comunicações</strong> — envio de conteúdos relevantes à sua área de atuação</li>
                  <li><strong>Convites para eventos futuros</strong> — fóruns, webinários e encontros científicos alinhados ao seu perfil profissional</li>
                  <li><strong>Recomendações de conteúdo</strong> — materiais, estudos e atualizações sobre terapias e áreas de interesse</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#5a1d4d" }}>Base legal e seus direitos</h3>
                <p className="text-gray-600">O processamento é realizado em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>, com base no seu consentimento livre e informado.</p>
              </div>

              <div
                className="rounded-lg px-4 py-3 text-sm text-gray-700"
                style={{ backgroundColor: "rgba(115,39,98,0.06)", borderLeft: "3px solid #732762" }}
              >
                <strong>Revogação:</strong> Você pode <strong>revogar este consentimento a qualquer momento</strong>, sem prejuízo à sua participação no evento, entrando em contato com a equipe organizadora ou através dos canais de comunicação da Takeda.
              </div>

              <p className="text-gray-500 text-xs">Este consentimento é <strong>opcional</strong> e não impede o acesso ao evento caso não seja concedido.</p>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 text-center">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-10 py-3 text-white font-bold rounded-xl transition-all"
                style={{ background: "linear-gradient(to right, #732762, #5a1d4d)" }}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
