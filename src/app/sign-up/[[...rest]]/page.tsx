import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/components/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        fallbackRedirectUrl="/"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#00FF41",
            colorBackground: "#000000",
            colorInputBackground: "#0A0A0A",
            colorInputText: "#F0F0F0",
            colorText: "#E8E8E8",
            colorTextSecondary: "#AAAAAA",
            colorDanger: "#FF3333",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            borderRadius: "0.5rem",
          },
          elements: {
            card: "bg-transparent shadow-none p-0",
            headerTitle: "text-[#00FF41] text-xl font-bold",
            headerSubtitle: "text-gray-400 text-xs font-mono",
            socialButtonsBlockButton:
              "border border-white/10 bg-white/5 hover:bg-white/10 text-gray-100 rounded-lg h-11 text-sm font-mono transition-all duration-200",
            socialButtonsBlockButtonArrow: "text-gray-400",
            socialButtonsProviderIcon: "opacity-80",
            dividerLine: "bg-white/10",
            dividerText: "text-gray-400 font-mono text-xs",
            formFieldLabel: "text-gray-300 font-mono text-xs mb-1.5",
            formFieldInput:
              "bg-[#0A0A0A] border border-white/10 text-gray-200 rounded-lg text-sm font-mono focus:border-[#00FF41]/50 focus:ring-1 focus:ring-[#00FF41]/20 transition-all",
            footerActionLink:
              "text-[#00FF41] font-mono text-xs hover:text-[#00FF41]/80 transition-colors",
            footerActionText: "text-gray-400 font-mono text-xs",
            formButtonPrimary:
              "bg-gradient-to-r from-[#00FF41] to-[#00CC33] hover:brightness-110 text-black font-bold rounded-lg h-11 text-sm font-mono shadow-lg shadow-[#00FF41]/20 transition-all duration-200",
            alert: "rounded-lg bg-red-950/30 border border-red-500/20",
            alertText: "text-red-400 font-mono text-xs",
          },
        }}
      />
    </AuthLayout>
  );
}
