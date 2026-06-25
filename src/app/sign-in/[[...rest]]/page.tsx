import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/components/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#00c896",
            colorBackground: "#080c14",
            colorInputBackground: "#0f1720",
            colorInputText: "#e2e8f0",
            colorText: "#cbd5e1",
            colorTextSecondary: "#64748b",
            colorNeutral: "#334155",
            colorDanger: "#ef4444",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            borderRadius: "0.75rem",
          },
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none p-0",
            headerTitle: "text-[#00c896] font-bold text-xl tracking-tight",
            headerSubtitle: "text-gray-500 text-xs font-mono",
            socialButtonsBlockButton:
              "border border-[#00c896]/20 bg-transparent hover:bg-[#00c896]/5 text-gray-300 font-mono text-xs rounded-lg h-10 transition",
            socialButtonsBlockButtonText: "font-mono text-xs",
            dividerLine: "bg-[#00c896]/10",
            dividerText: "text-gray-600 font-mono text-[10px]",
            formFieldLabel: "text-gray-400 font-mono text-xs",
            formFieldInput:
              "bg-[#0f1720] border border-[#00c896]/15 text-gray-200 font-mono text-sm rounded-lg focus:border-[#00c896]/40 focus:ring-[#00c896]/20 transition",
            formFieldInputShowPasswordButton: "text-gray-500",
            footerActionLink: "text-[#00c896] font-mono text-xs hover:text-[#00ff9d] transition",
            footerActionText: "text-gray-500 font-mono text-xs",
            formButtonPrimary:
              "bg-[#00c896] hover:bg-[#00ff9d] text-black font-bold font-mono text-xs rounded-lg h-10 transition shadow-lg shadow-[#00c896]/15",
            formFieldAction: "text-[#00c896]/70 font-mono text-[10px] hover:text-[#00c896] transition",
            identityPreviewText: "text-gray-400 font-mono text-xs",
            identityPreviewEditButton: "text-[#00c896] font-mono text-xs",
            formResendCodeLink: "text-[#00c896] font-mono text-xs",
            alert: "rounded-lg bg-red-900/20 border border-red-500/20",
            alertText: "text-red-400 font-mono text-xs",
            otpCodeFieldInput: "bg-[#0f1720] border border-[#00c896]/15 text-[#00c896] font-mono text-lg focus:border-[#00c896]/40",
          },
        }}
      />
    </AuthLayout>
  );
}
