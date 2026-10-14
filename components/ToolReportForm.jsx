"use client";

import { useState } from "react";
import CTAButton from "@/components/CTAButton";
import {
  PhoneInput,
  TextInput,
  isValidEmail,
  isValidUSPhone,
} from "@/components/SharedComponents";

const isEmpty = (v) => !v?.toString().trim();
const isNaValue = (v) =>
  /^(n\/?a|not yet assigned)$/i.test(v?.toString().trim());

const layerCardShadow =
  "rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px";
const cardLift =
  "hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]";
const referralInputClass =
  "placeholder:italic placeholder-[#FD7702]";

const FIELDS = [
  ["first", "First name", "text", ""],
  ["last", "Last name", "text", ""],
  ["email", "Email", "email", "e.g. name@firm.com"],
];

export default function ToolReportForm({
  lead,
  form,
  setForm,
  invalid = {},
  status = { type: "", text: "" },
  sending = false,
  thanks = "",
  resendMsg = "",
  onSubmit,
  onResend,
  phone,
  termsUrl = "/privacy",
  onCall,
  title = "Get your full report & action plan",
  description = "Your step-by-step action plan and full report are sent to your email. Use an email you can open right now.",
  submitLabel = "Email me my report & action plan",
  successTitle = "Need help fixing this?",
  successBody,
}) {
  const [started, setStarted] = useState({});
  const setField = (key, value) => {
    if (String(value ?? "").length > 0) {
      setStarted((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    }
    setForm({ ...form, [key]: value });
  };
  const live = (key) => started[key] || invalid[key];
  const emailErrorMsg =
    !isEmpty(form.email) && !isValidEmail(form.email)
      ? "Please enter a valid email address."
      : "";
  const phoneErrorMsg =
    !isEmpty(form.phone) && !isValidUSPhone(form.phone)
      ? "Please enter a valid 10-digit US phone number."
      : "";
  const attyErrorMsg =
    !isEmpty(form.atty) &&
    !isNaValue(form.atty) &&
    !isValidEmail(form.atty)
      ? "Please enter a valid email address."
      : "";
  const fieldError = {
    first: live("first") && isEmpty(form.first),
    last: live("last") && isEmpty(form.last),
    email: live("email") && (isEmpty(form.email) || !isValidEmail(form.email)),
    phone: live("phone") && (isEmpty(form.phone) || !isValidUSPhone(form.phone)),
    atty:
      live("atty") &&
      !isEmpty(form.atty) &&
      !isNaValue(form.atty) &&
      !isValidEmail(form.atty),
  };
  const handleCall =
    onCall ||
    (() => {
      window.location.href = `tel:${String(phone || "").replace(/\D/g, "")}`;
    });

  if (lead) {
    return (
      <div
        className={`rounded-2xl border-[3px] border-secondary bg-white p-6 text-center sm:p-8 ${cardLift}`}
        style={{ boxShadow: layerCardShadow }}
      >
        {thanks ? <p className="font-bold text-primary">{thanks}</p> : null}
        <p className="text-2xl font-bold tracking-[1px] text-secondary uppercase group-hover:text-primary">
          {successTitle}
        </p>
        {successBody ? (
          <h3 className="mt-2 text-2xl font-bold text-primary group-hover:text-secondary">
            {successBody}
          </h3>
        ) : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <CTAButton
            label={`Call ${phone}`}
            onClick={handleCall}
            icon="/arrow-right.png"
            className="h-12 px-5 lg:h-14"
            textClassName="text-[16px]"
            aria-label={`Call ${phone}`}
          />
          <button
            type="button"
            onClick={onResend}
            disabled={sending}
            className="text-[1.125rem] font-bold text-primary underline disabled:opacity-60"
          >
            {sending ? "Sending…" : "Done some steps? Send my updated report"}
          </button>
        </div>
        {resendMsg ? (
          <p className="mt-4 font-bold text-primary">{resendMsg}</p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`space-y-6 rounded-2xl border-[3px] border-secondary bg-white p-6 sm:p-8 ${cardLift}`}
      style={{ boxShadow: layerCardShadow }}
    >
      <p className="text-2xl font-bold tracking-[1px] text-secondary uppercase group-hover:text-primary">
        {title}
      </p>
      <h3 className="mt-2 text-2xl font-bold text-primary group-hover:text-secondary">
        {description}
      </h3>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.hp}
        onChange={(e) => setField("hp", e.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map(([k, label, type, ph]) => (
          <label
            key={k}
            className={`block ${k === "email" && fieldError.email && emailErrorMsg ? "mb-7" : ""}`}
          >
            <span className="mb-1 block text-[1.375rem] font-bold uppercase text-primary group-hover:text-secondary">
              {label} <span className="text-secondary">*</span>
            </span>
            <TextInput
              name={k}
              type={type}
              value={form[k]}
              onChange={(e) => setField(k, e.target.value)}
              placeholder={ph}
              inputClass={referralInputClass}
              width="full"
              error={!!fieldError[k]}
              errorMessage={k === "email" ? emailErrorMsg : ""}
            />
          </label>
        ))}
        <label className={`block ${fieldError.phone && phoneErrorMsg ? "mb-7" : ""}`}>
          <span className="mb-1 block text-[1.375rem] font-bold uppercase text-primary group-hover:text-secondary">
            Phone <span className="text-secondary">*</span>
          </span>
          <PhoneInput
            name="phone"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="(555) 234-5678"
            inputClass={referralInputClass}
            width="full"
            error={!!fieldError.phone}
            errorMessage={phoneErrorMsg}
          />
        </label>
        <label className={`block sm:col-span-2 ${fieldError.atty && attyErrorMsg ? "mb-7" : ""}`}>
          <span className="mb-1 block text-[1.375rem] font-bold uppercase text-primary group-hover:text-secondary">
            Also send a copy to my attorney (optional)
          </span>
          <TextInput
            name="atty"
            type="email"
            value={form.atty}
            onChange={(e) => setField("atty", e.target.value)}
            placeholder='e.g. attorney@firm.com (or "N/A")'
            inputClass={referralInputClass}
            width="full"
            error={!!fieldError.atty}
            errorMessage={attyErrorMsg}
          />
          <span className="mt-2 block text-base font-bold text-black">
            Your attorney gets the same report when you click the button below.
            Leave blank to skip.
          </span>
        </label>
      </div>
      <label
        className={`flex items-start gap-3 cursor-pointer text-[1.125rem] font-bold ${invalid.consent ? "text-[#e51b23]" : "text-black"}`}
      >
        <span className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setField("consent", e.target.checked)}
            className={`block h-8 w-8 appearance-none rounded border-[3.5px] bg-white focus:ring-2 focus:ring-[#FD7702] ${invalid.consent ? "border-[#e51b23]" : "border-[#FD7702]"}`}
          />
          {form.consent ? (
            <span className="pointer-events-none absolute top-0 left-1 flex h-full w-full items-center justify-center">
              <i className="fas fa-check text-5xl text-[#0097A7]"></i>
            </span>
          ) : null}
        </span>
        <span>
          I agree that 833PROBAID® may contact me about this report by phone,
          text, or email, and I agree to the{" "}
          <a
            href={termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline text-primary"
          >
            Website Terms of Use, Privacy Policy &amp; Disclosures
          </a>
          .
        </span>
      </label>
      <div className="flex justify-center">
        <CTAButton
          type="submit"
          label={sending ? "Sending…" : submitLabel}
          disabled={sending}
          icon="/arrow-right.png"
          className="h-12 px-5 lg:h-14"
          textClassName="text-[16px]"
          aria-label={submitLabel}
        />
      </div>
    </form>
  );
}
