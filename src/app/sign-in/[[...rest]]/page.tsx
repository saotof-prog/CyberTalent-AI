import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/components/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#00FF41",
            colorBackground: "#000000",
            colorInputBackground: "#0A0A0A",
            colorInputText: "#E0E0E0",
            colorText: "#CCCCCC",
            colorTextSecondary: "#666666",
            colorNeutral: "#1A1A1A",
            colorDanger: "#FF3333",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            borderRadius: "0.5rem",
          },
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none p-0",
            headerTitle: "text-[#00FF41] font-bold text-xl tracking-tight drop-shadow-[0_0_12px_rgba(0,255,65,0.3)]",
            headerSubtitle: "text-gray-600 text-[11px] font-mono",
            socialButtonsBlockButton:
              "border border-[#00FF41]/15 bg-transparent hover:bg-[#00FF41]/5 text-gray-400 font-mono text-xs rounded-lg h-10 transition-all duration-200 hover:border-[#00FF41]/30 hover:shadow-[0_0_12px_rgba(0,255,65,0.08)]",
            socialButtonsBlockButtonText: "font-mono text-xs",
            dividerLine: "bg-[#00FF41]/8",
            dividerText: "text-gray-700 font-mono text-[10px]",
            formFieldLabel: "text-gray-500 font-mono text-xs",
            formFieldInput:
              "bg-[#0A0A0A] border border-[#00FF41]/12 text-gray-200 font-mono text-sm rounded-lg focus:border-[#00FF41]/40 focus:ring-0 focus:shadow-[0_0_16px_rgba(0,255,65,0.06)] transition-all duration-200",
            formFieldInputShowPasswordButton: "text-gray-600 hover:text-[#00FF41]",
            footerActionLink:
              "text-[#00FF41] font-mono text-xs hover:text-[#00FF41] hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.4)] transition-all duration-200",
            footerActionText: "text-gray-600 font-mono text-xs",
            formButtonPrimary:
              "bg-[#00FF41] hover:bg-[#00FF41] text-black font-bold font-mono text-xs rounded-lg h-10 transition-all duration-200 shadow-[0_0_20px_rgba(0,255,65,0.15)] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] hover:brightness-110",
            formFieldAction: "text-[#00FF41]/60 font-mono text-[10px] hover:text-[#00FF41] transition-colors",
            identityPreviewText: "text-gray-400 font-mono text-xs",
            identityPreviewEditButton: "text-[#00FF41] font-mono text-xs",
            formResendCodeLink: "text-[#00FF41] font-mono text-xs",
            alert: "rounded-lg bg-red-950/30 border border-[#FF3333]/20",
            alertText: "text-red-400 font-mono text-xs",
            alertIcon: "text-[#FF3333]",
            otpCodeFieldInput:
              "bg-[#0A0A0A] border border-[#00FF41]/15 text-[#00FF41] font-mono text-lg focus:border-[#00FF41]/40 focus:shadow-[0_0_16px_rgba(0,255,65,0.06)]",
          },
        }}
      />
    </AuthLayout>
  );
}
