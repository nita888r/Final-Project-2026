'use client';

import { useState } from 'react';
import Link from 'next/link';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { loginAction, registerAction } from '@/app/actions/auth';

function Field({ id, label, ...props }) {
  return (
    <div className="ra-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} required {...props} />
    </div>
  );
}

export default function AuthPanel({ initialRegister = false }) {
  const [isRegister, setIsRegister] = useState(initialRegister);

  function toggleMode() {
    setIsRegister((current) => !current);
  }

  return (
    <section
      className={`aksara-auth-final ${
        isRegister ? 'aksara-register-active' : ''
      }`}
      aria-label="Autentikasi Ruang Aksara"
    >
      {/* FORM LOGIN */}
      <div className="ra-form ra-login" aria-hidden={isRegister}>
        <div className="ra-inner">
          <span className="ra-kicker">
            RUANG AKSARA / AKSES PUSTAKA
          </span>

          <h1>Selamat datang.</h1>

          <p className="ra-description">
            Masuk untuk melanjutkan perjalanan membaca Anda.
          </p>

          <fieldset disabled={isRegister}>
            <ActionForm
              action={loginAction}
              className="ra-fields"
            >
              <Field
                id="login-email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Alamat email"
              />

              <Field
                id="login-password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password Anda"
              />

              <SubmitButton className="ra-submit">
                Masuk
              </SubmitButton>
            </ActionForm>
          </fieldset>

          <div className="ra-guest-wrap">
            <Link
              href="/katalog"
              tabIndex={isRegister ? -1 : 0}
              className="ra-guest"
            >
              Continue as Guest
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* FORM REGISTER */}
      <div className="ra-form ra-register" aria-hidden={!isRegister}>
        <div className="ra-inner">
          <span className="ra-kicker">
            RUANG AKSARA / ANGGOTA BARU
          </span>

          <h1>Daftar Mahasiswa</h1>

          <p className="ra-description">
            Gunakan email kampus (.ac.id atau .edu).
            Akun Pegawai dibuat oleh Admin.
          </p>

          <fieldset disabled={!isRegister}>
            <ActionForm
              action={registerAction}
              className="ra-fields ra-register-fields"
            >
              <Field
                id="reg-name"
                label="Nama lengkap"
                name="nama_lengkap"
                autoComplete="name"
                placeholder="Nama lengkap"
              />

              <Field
                id="reg-email"
                label="Email kampus"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@student.univ.ac.id"
              />

              <Field
                id="reg-nim"
                label="NIM"
                name="nomor_identitas"
                maxLength={30}
                placeholder="Contoh: H071231001"
              />

              <Field
                id="reg-password"
                label="Password"
                name="password"
                type="password"
                minLength={6}
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
              />

              <Field
                id="reg-confirm"
                label="Konfirmasi password"
                name="konfirmasi"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi password"
              />

              <SubmitButton className="ra-submit">
                Buat akun
              </SubmitButton>
            </ActionForm>
          </fieldset>
        </div>
      </div>

      {/* SLIDING PANEL */}
      <div className="ra-overlay">
        <div
          className="ra-overlay-content"
          key={String(isRegister)}
        >
          <svg
            className="ra-book-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v17H5.5A2.5 2.5 0 0 0 3 22.5z" />
            <path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H13v17h5.5a2.5 2.5 0 0 1 2.5 2.5z" />
          </svg>

          <span className="ra-brand">
            RUANG AKSARA
          </span>

          <h2>
            {isRegister
              ? 'Kembali ke ruang baca.'
              : 'Mulai bab baru.'}
          </h2>

          <p>
            {isRegister
              ? 'Sudah memiliki akun? Masuk dan temukan kembali koleksi favorit Anda.'
              : 'Bergabunglah dan jelajahi dunia pengetahuan bersama kami.'}
          </p>

          <button
            type="button"
            className="ra-switch-button"
            onClick={toggleMode}
          >
            {isRegister ? 'Masuk' : 'Daftar sekarang'}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* STYLING DAN ANIMASI */}
      <style jsx global>{`
        .aksara-auth-final {
          --ra-green: #234232;
          --ra-green-dark: #1b3427;
          --ra-cream: #f6f1e6;
          --ra-ivory: #fdfbf7;
          --ra-gold: #d9b86c;
          --ra-gold-dark: #c9a24b;
          --ra-brown: #4a2f1d;
          --ra-muted: #756d61;

          position: relative;
          isolation: isolate;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) minmax(0, 1fr);

          max-width: 960px;
          min-height: 650px;
          margin: 24px auto;
          overflow: hidden;

          color: var(--ra-brown);
          background: var(--ra-ivory);
          border: 1px solid #e5dec9;
          border-radius: 24px;

          box-shadow:
            0 22px 60px rgba(35, 66, 50, 0.12);

          font-family:
            var(--font-dm), Arial, sans-serif;
        }

        .aksara-auth-final,
        .aksara-auth-final * {
          box-sizing: border-box;
        }

        /* POSISI FORM */

        .aksara-auth-final .ra-form {
          display: flex;
          min-width: 0;
          align-items: center;
          justify-content: center;
          padding: 38px;

          transition:
            opacity 0.35s ease,
            transform 0.55s ease,
            visibility 0s linear 0.35s;
        }

        .aksara-auth-final .ra-login {
          grid-column: 1;
          grid-row: 1;
        }

        .aksara-auth-final .ra-register {
          grid-column: 2;
          grid-row: 1;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateX(-22px);
        }

        .aksara-auth-final.aksara-register-active
        .ra-login {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateX(22px);
        }

        .aksara-auth-final.aksara-register-active
        .ra-register {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(0);
          transition-delay: 0s;
        }

        .aksara-auth-final .ra-inner {
          width: 100%;
          max-width: 350px;
        }

        /* TYPOGRAPHY */

        .aksara-auth-final .ra-kicker {
          display: inline-block;
          color: #80632c;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        .aksara-auth-final h1,
        .aksara-auth-final h2 {
          margin: 0;
          font-family:
            var(--font-playfair), Georgia, serif;

          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.025em;
        }

        .aksara-auth-final h1 {
          margin-top: 13px;
          margin-bottom: 10px;
          color: var(--ra-green);
          font-size: clamp(28px, 3vw, 38px);
        }

        .aksara-auth-final .ra-description {
          margin: 0 0 23px;
          color: var(--ra-muted);
          font-size: 13px;
          line-height: 1.65;
        }

        /* FORM INPUT */

        .aksara-auth-final fieldset {
          min-width: 0;
          margin: 0;
          padding: 0;
          border: 0;
        }

        .aksara-auth-final .ra-fields {
          display: grid;
          gap: 13px;
        }

        .aksara-auth-final .ra-field label {
          display: block;
          margin-bottom: 6px;
          color: var(--ra-brown);
          font-size: 12px;
          font-weight: 700;
        }

        .aksara-auth-final .ra-field input {
          display: block;
          width: 100%;
          min-height: 42px;
          padding: 10px 12px;

          color: #2b1b10;
          background: #f8f4eb;
          border: 1px solid #e5d9c1;
          border-radius: 9px;

          font: inherit;
          font-size: 13px;
          outline: none;

          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .aksara-auth-final
        .ra-field input::placeholder {
          color: #a49a8b;
        }

        .aksara-auth-final
        .ra-field input:focus {
          border-color: var(--ra-gold-dark);

          box-shadow:
            0 0 0 3px rgba(201, 162, 75, 0.16);
        }

        /* TOMBOL SUBMIT */

        .aksara-auth-final .ra-submit {
          width: 100%;
          min-height: 44px;
          margin-top: 5px;
          padding: 11px 16px;

          color: var(--ra-ivory);
          background: var(--ra-green);
          border: 1px solid var(--ra-green);
          border-radius: 9px;

          font-size: 13px;
          font-weight: 700;
          cursor: pointer;

          transition:
            background 0.2s,
            transform 0.2s;
        }

        .aksara-auth-final .ra-submit:hover {
          background: var(--ra-green-dark);
          transform: translateY(-1px);
        }

        .aksara-auth-final .ra-submit:disabled {
          opacity: 0.65;
          cursor: wait;
          transform: none;
        }

        /* CONTINUE AS GUEST */

        .aksara-auth-final .ra-guest-wrap {
          margin-top: 19px;
          text-align: center;
        }

        .aksara-auth-final .ra-guest {
          color: var(--ra-green);
          font-size: 12px;
          font-weight: 600;

          text-decoration: underline;
          text-decoration-color: var(--ra-gold-dark);
          text-underline-offset: 4px;
        }

        /* PANEL HIJAU */

        .aksara-auth-final .ra-overlay {
          position: absolute;
          z-index: 3;
          inset: 0 0 0 50%;

          display: grid;
          place-items: center;
          padding: 38px;

          color: var(--ra-ivory);
          text-align: center;

          background:
            radial-gradient(
              ellipse at 80% 10%,
              #456b53 0%,
              transparent 58%
            ),
            var(--ra-green);

          border:
            1px solid rgba(217, 184, 108, 0.55);

          border-radius: 22px;

          transition:
            transform 0.65s
            cubic-bezier(0.65, 0, 0.25, 1);
        }

        /* ANIMASI SLIDING */

        .aksara-auth-final.aksara-register-active
        .ra-overlay {
          transform: translateX(-100%);
        }

        .aksara-auth-final .ra-overlay-content {
          display: flex;
          width: 100%;
          max-width: 330px;
          flex-direction: column;
          align-items: center;

          animation:
            ra-auth-fade 0.5s ease both;
        }

        .aksara-auth-final .ra-book-icon {
          width: 52px;
          height: 52px;
          margin-bottom: 17px;
          color: var(--ra-gold);
        }

        .aksara-auth-final .ra-brand {
          color: var(--ra-gold);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.23em;
        }

        .aksara-auth-final .ra-overlay h2 {
          margin: 22px 0 12px;
          color: #fffaf0;
          font-size: clamp(28px, 3.6vw, 42px);
        }

        .aksara-auth-final .ra-overlay p {
          margin: 0 0 27px;
          color: #f5ecd9;
          font-size: 14px;
          line-height: 1.75;
        }

        /* TOMBOL PINDAH LOGIN / REGISTER */

        .aksara-auth-final
        .ra-overlay .ra-switch-button {
          display: inline-flex;
          min-width: 174px;
          min-height: 44px;

          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 11px 22px;

          color: #234232 !important;
          background-color: #d9b86c !important;

          border: 1px solid #d9b86c;
          border-radius: 9px;

          font-size: 13px;
          font-weight: 800;
          line-height: 1.2;

          cursor: pointer;
          opacity: 1;
          visibility: visible;

          transition:
            background-color 0.2s,
            color 0.2s,
            transform 0.2s;
        }

        .aksara-auth-final
        .ra-overlay .ra-switch-button:hover {
          color: #234232 !important;
          background-color: #f5ecd9 !important;
          transform: translateY(-1px);
        }

        .aksara-auth-final
        .ra-overlay .ra-switch-button:focus-visible {
          outline: 3px solid #fffaf0;
          outline-offset: 3px;
        }

        /* FADE ANIMATION */

        @keyframes ra-auth-fade {
          from {
            opacity: 0;
            transform: translateY(9px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE MOBILE */

        @media (max-width: 700px) {
          .aksara-auth-final {
            display: flex;
            min-height: 0;
            flex-direction: column;
            margin: 8px auto;
            border-radius: 18px;
          }

          .aksara-auth-final .ra-form {
            padding: 30px 23px;
            transition: none;
          }

          .aksara-auth-final:not(.aksara-register-active)
          .ra-register,

          .aksara-auth-final.aksara-register-active
          .ra-login {
            display: none;
          }

          .aksara-auth-final .ra-overlay {
            position: relative;
            inset: auto;
            min-height: 270px;
            padding: 30px 22px;
            border-radius: 16px;
            transform: none;
            transition: none;
          }

          .aksara-auth-final.aksara-register-active
          .ra-overlay {
            transform: none;
          }

          .aksara-auth-final .ra-book-icon {
            width: 38px;
            height: 38px;
            margin-bottom: 10px;
          }

          .aksara-auth-final .ra-overlay h2 {
            margin: 12px 0 9px;
            font-size: 29px;
          }

          .aksara-auth-final .ra-overlay p {
            margin-bottom: 17px;
            font-size: 13px;
          }
        }

        /* ACCESSIBILITY */

        @media (prefers-reduced-motion: reduce) {
          .aksara-auth-final .ra-form,
          .aksara-auth-final .ra-overlay,
          .aksara-auth-final .ra-submit,
          .aksara-auth-final .ra-switch-button {
            transition: none;
          }

          .aksara-auth-final .ra-overlay-content {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}